/**
 * Retry and Backoff Policy for Meta Graph API calls
 */

export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 4,
  initialDelayMs: 2000,
  maxDelayMs: 60000,
  backoffFactor: 2,
};

export class RetryManager {
  /**
   * Calculates next retry delay with jitter
   */
  public static calculateDelay(attempt: number, config = DEFAULT_RETRY_CONFIG): number {
    const delay = Math.min(
      config.initialDelayMs * Math.pow(config.backoffFactor, attempt - 1),
      config.maxDelayMs
    );
    // Add 10% random jitter to avoid thundering herd
    const jitter = delay * (0.9 + Math.random() * 0.2);
    return Math.round(jitter);
  }

  /**
   * Determines if a Meta error code is transient and eligible for automatic retry
   */
  public static isTransientError(errorCode?: string, errorMessage?: string): boolean {
    if (!errorCode && !errorMessage) return false;
    
    // Codes: 1, 2 (Temporary API error), 4 (Rate limit - wait and retry), 17 (User request limit)
    // Non-transient: 190 (Token expired), 10 (Permission denied), 100 (Bad parameter)
    if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_ASPECT_RATIO') {
      return false;
    }
    
    if (errorMessage?.includes('temporarily unavailable') || errorMessage?.includes('rate limit') || errorMessage?.includes('transient')) {
      return true;
    }

    return false;
  }
}
