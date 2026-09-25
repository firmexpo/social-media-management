/**
 * Firm Expo — Message Dispatcher
 * Coordinates pre-flight re-validation, idempotency guards, and platform API dispatch.
 */

import { ScheduledMessageItem, EligibleContact, OptOutRecord } from '../../types';
import { MessagingEligibilityService } from './eligibility';
import { InstagramMessagingClient } from '../meta/instagram-messaging';
import { FacebookMessagingClient } from '../meta/facebook-messaging';

export interface DispatchResult {
  messageId: string;
  success: boolean;
  status: 'dispatched' | 'cancelled' | 'failed';
  error?: string;
  dispatchedAt?: string;
}

export class MessageDispatcher {
  /**
   * Dispatches a single scheduled message with pre-send eligibility check
   */
  public static async dispatch(
    item: ScheduledMessageItem,
    contact: EligibleContact | undefined,
    suppressionList: OptOutRecord[],
    accessToken: string,
    isDemo: boolean = true
  ): Promise<DispatchResult> {
    const now = new Date().toISOString();

    // 1. If contact missing or suppressed
    if (!contact) {
      return {
        messageId: item.id,
        success: false,
        status: 'failed',
        error: 'Target recipient contact record was deleted or not found.'
      };
    }

    // 2. Pre-Send Eligibility Re-Verification (CRITICAL Meta Rule)
    const eligibility = MessagingEligibilityService.evaluateContact(contact, suppressionList);

    if (!eligibility.isEligible) {
      return {
        messageId: item.id,
        success: false,
        status: 'cancelled',
        error: `Pre-send eligibility re-check failed: ${eligibility.reason}`
      };
    }

    // 3. Dispatch to Official Platform API
    if (item.platform === 'instagram') {
      const res = await InstagramMessagingClient.sendMessage(
        accessToken,
        item.recipientIdentifier,
        item.renderedBody,
        isDemo
      );

      if (!res.success) {
        return {
          messageId: item.id,
          success: false,
          status: 'failed',
          error: res.error || 'Instagram Send API rejected message'
        };
      }

      return {
        messageId: item.id,
        success: true,
        status: 'dispatched',
        dispatchedAt: now
      };
    } else {
      const res = await FacebookMessagingClient.sendMessage(
        accessToken,
        item.recipientIdentifier,
        item.renderedBody,
        undefined,
        isDemo
      );

      if (!res.success) {
        return {
          messageId: item.id,
          success: false,
          status: 'failed',
          error: res.error || 'Facebook Messenger Send API rejected message'
        };
      }

      return {
        messageId: item.id,
        success: true,
        status: 'dispatched',
        dispatchedAt: now
      };
    }
  }
}
