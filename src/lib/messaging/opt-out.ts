/**
 * Firm Expo — Opt-Out & Suppression Manager
 * Enforces immediate suppression of opted-out recipients across all marketing & DM outreach.
 */

import { OptOutRecord, Platform } from '../../types';

export class OptOutManager {
  private static OPT_OUT_KEYWORDS = [
    'stop',
    'unsubscribe',
    'opt out',
    'optout',
    'cancel',
    'quit',
    'leave me alone',
    'do not message'
  ];

  /**
   * Evaluates if incoming text message from a user is a suppression request
   */
  public static isOptOutRequest(text: string): boolean {
    const clean = text.trim().toLowerCase();
    return this.OPT_OUT_KEYWORDS.some(kw => clean === kw || clean.startsWith(kw + ' '));
  }

  /**
   * Creates a new suppression record from keyword or user request
   */
  public static createRecord(
    platform: Platform,
    recipientIdentifier: string,
    displayName: string,
    reason: OptOutRecord['reason'] = 'user_keyword_stop',
    recordedBy: string = 'System Webhook / Automation'
  ): OptOutRecord {
    return {
      id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      platform,
      recipientIdentifier,
      displayName,
      reason,
      optedOutAt: new Date().toISOString(),
      recordedBy,
      campaignsSuppressedCount: 0
    };
  }

  /**
   * Check if a recipient is in the suppression list
   */
  public static isSuppressed(
    suppressionList: OptOutRecord[],
    platform: Platform,
    recipientIdentifier: string
  ): boolean {
    return suppressionList.some(
      record => record.platform === platform && record.recipientIdentifier === recipientIdentifier
    );
  }
}
