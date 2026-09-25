/**
 * Firm Expo — Messaging Retry Policy & Error Classifier
 * Distinguishes transient network errors from permanent policy/permission rejections.
 */

export type ErrorClassification = 'transient' | 'permanent_policy' | 'permanent_auth' | 'rate_limited';

export interface RetryEvaluation {
  shouldRetry: boolean;
  classification: ErrorClassification;
  backoffMs: number;
  reason: string;
}

export class MessagingRetryPolicy {
  private static MAX_TRANSIENT_RETRIES = 3;
  private static BASE_BACKOFF_MS = 1000;

  /**
   * Evaluates if a failed message dispatch attempt should be retried
   */
  public static evaluate(
    errorCode: number | undefined,
    errorMessage: string,
    currentRetryCount: number
  ): RetryEvaluation {
    const msg = errorMessage.toLowerCase();

    // Permanent Policy Violations (Never retry)
    if (
      errorCode === 10 || 
      msg.includes('outside the allowed window') || 
      msg.includes('opted out') ||
      msg.includes('suppressed') ||
      msg.includes('user not found')
    ) {
      return {
        shouldRetry: false,
        classification: 'permanent_policy',
        backoffMs: 0,
        reason: 'Permanent Meta policy or opt-out restriction. Retrying is prohibited by Meta terms.'
      };
    }

    // Permanent Auth Violations (Never retry without human re-auth)
    if (
      errorCode === 190 || 
      errorCode === 230 || 
      msg.includes('invalid oauth access token') || 
      msg.includes('permissions missing')
    ) {
      return {
        shouldRetry: false,
        classification: 'permanent_auth',
        backoffMs: 0,
        reason: 'Permanent OAuth authorization failure. Account must be reauthorized by admin.'
      };
    }

    // Rate Limiting (Retry with exponential backoff)
    if (errorCode === 4 || errorCode === 17 || errorCode === 32 || errorCode === 613 || msg.includes('rate limit')) {
      if (currentRetryCount >= this.MAX_TRANSIENT_RETRIES) {
        return {
          shouldRetry: false,
          classification: 'rate_limited',
          backoffMs: 0,
          reason: 'Max rate-limit retry attempts exceeded.'
        };
      }
      return {
        shouldRetry: true,
        classification: 'rate_limited',
        backoffMs: Math.pow(2, currentRetryCount) * 5000,
        reason: 'Temporary Meta API rate limit hit. Pausing before retry.'
      };
    }

    // Transient Network Errors (5xx, timeouts)
    if (currentRetryCount < this.MAX_TRANSIENT_RETRIES) {
      return {
        shouldRetry: true,
        classification: 'transient',
        backoffMs: Math.pow(2, currentRetryCount) * this.BASE_BACKOFF_MS,
        reason: 'Transient network failure. Retrying with exponential backoff.'
      };
    }

    return {
      shouldRetry: false,
      classification: 'transient',
      backoffMs: 0,
      reason: `Maximum transient retry attempts (${this.MAX_TRANSIENT_RETRIES}) reached.`
    };
  }
}
