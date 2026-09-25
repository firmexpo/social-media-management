/**
 * Firm Expo — Messaging Eligibility & Policy Enforcement Engine
 * Implements Meta Graph API v22.0 official messaging rules for Instagram & Facebook Messenger.
 */

import { EligibleContact, Platform, OptOutRecord } from '../../types';

export interface EligibilityCheckResult {
  isEligible: boolean;
  status: 'eligible' | 'window_expired' | 'opted_out' | 'missing_consent' | 'unsupported_platform';
  reason: string;
  evaluatedAt: string;
  windowRemainingHours?: number;
  policyReference: string;
}

export class MessagingEligibilityService {
  private static STANDARD_WINDOW_HOURS = 24;

  /**
   * Evaluates if a contact is legally and technically eligible to receive an outbound DM.
   * Under Meta's Platform Policy:
   * 1. Instagram: Businesses can ONLY message users who have initiated a conversation within the last 24 hours.
   * 2. Facebook Messenger: Standard messaging is restricted to 24 hours since the user's last message.
   * 3. Opt-out: Suppressed recipients can NEVER receive automated or campaign DMs.
   */
  public static evaluateContact(
    contact: EligibleContact,
    suppressionList: OptOutRecord[],
    options?: { messageTag?: string; bypassWindowWithOTN?: boolean }
  ): EligibilityCheckResult {
    const now = new Date();
    const evaluatedAt = now.toISOString();

    // 1. Check Opt-Out Suppression List (Highest priority)
    const isSuppressed = contact.isOptedOut || suppressionList.some(
      entry => entry.platform === contact.platform && entry.recipientIdentifier === contact.platformRecipientId
    );

    if (isSuppressed) {
      return {
        isEligible: false,
        status: 'opted_out',
        reason: 'Recipient has opted out or is on the active global suppression list.',
        evaluatedAt,
        policyReference: 'Meta Commercial Terms & Regional Opt-out Regulations'
      };
    }

    // 2. Validate Platform
    if (contact.platform !== 'instagram' && contact.platform !== 'facebook') {
      return {
        isEligible: false,
        status: 'unsupported_platform',
        reason: `Unsupported messaging platform: ${contact.platform}`,
        evaluatedAt,
        policyReference: 'Meta Graph API v22.0 Platform Support'
      };
    }

    // 3. Evaluate 24-Hour Messaging Window
    const lastInteraction = new Date(contact.lastInteractionAt);
    const hoursSinceInteraction = (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60);

    if (hoursSinceInteraction < 0) {
      // Future timestamp anomaly
      return {
        isEligible: false,
        status: 'missing_consent',
        reason: 'Invalid future interaction timestamp detected on contact profile.',
        evaluatedAt,
        policyReference: 'Data Integrity & Timestamp Audit'
      };
    }

    const windowRemainingHours = Math.max(0, Math.round((this.STANDARD_WINDOW_HOURS - hoursSinceInteraction) * 10) / 10);

    // If within standard 24-hour window
    if (hoursSinceInteraction <= this.STANDARD_WINDOW_HOURS) {
      return {
        isEligible: true,
        status: 'eligible',
        reason: `Within standard 24-hour customer service window (${windowRemainingHours}h remaining). User-initiated session active.`,
        evaluatedAt,
        windowRemainingHours,
        policyReference: 'Meta Standard Messaging Window (24h Policy)'
      };
    }

    // Outside standard 24-hour window
    // Check if an authorized message tag or One-Time Notification (OTN) token is provided (Facebook Messenger only)
    if (contact.platform === 'facebook' && options?.messageTag) {
      const allowedTags = ['CONFIRMED_EVENT_UPDATE', 'POST_PURCHASE_UPDATE', 'ACCOUNT_UPDATE'];
      if (allowedTags.includes(options.messageTag)) {
        return {
          isEligible: true,
          status: 'eligible',
          reason: `Permitted under Facebook Message Tag: ${options.messageTag} for registered exhibition attendees.`,
          evaluatedAt,
          policyReference: 'Facebook Messenger Platform Message Tags Policy'
        };
      }
    }

    // Instagram has NO message tags for promotional or custom outreach outside 24h
    return {
      isEligible: false,
      status: 'window_expired',
      reason: `24-hour window expired (${Math.round(hoursSinceInteraction)} hours since last user message). Business cannot initiate unsolicited outreach under Instagram Messaging API policy.`,
      evaluatedAt,
      windowRemainingHours: 0,
      policyReference: 'Instagram Messaging API: 24-Hour Response Window Constraint'
    };
  }

  /**
   * Pre-flight batch filter for audience selection in campaign wizard
   */
  public static filterEligibleAudience(
    contacts: EligibleContact[],
    suppressionList: OptOutRecord[]
  ): {
    eligible: EligibleContact[];
    excluded: Array<{ contact: EligibleContact; result: EligibilityCheckResult }>;
  } {
    const eligible: EligibleContact[] = [];
    const excluded: Array<{ contact: EligibleContact; result: EligibilityCheckResult }> = [];

    for (const contact of contacts) {
      const result = this.evaluateContact(contact, suppressionList);
      if (result.isEligible) {
        eligible.push(contact);
      } else {
        excluded.push({ contact, result });
      }
    }

    return { eligible, excluded };
  }
}
