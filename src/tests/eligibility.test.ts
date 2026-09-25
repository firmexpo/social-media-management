/**
 * Unit Tests for Messaging Eligibility Service
 */

import { MessagingEligibilityService } from '../lib/messaging/eligibility';
import { EligibleContact, OptOutRecord } from '../types';

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`);
}

export function runEligibilityTests() {
  const now = new Date();

  const recentContact: EligibleContact = {
    id: 'ct-1',
    platform: 'instagram',
    platformRecipientId: 'igsid_123',
    socialAccountId: 'acc-1',
    socialAccountName: 'Firm Expo Instagram',
    displayName: 'Elena Rostova',
    username: 'elena_tech',
    conversationId: 'conv-1',
    firstInteractionAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    lastInteractionAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    windowExpiresAt: new Date(now.getTime() + 22 * 60 * 60 * 1000).toISOString(),
    eligibilityStatus: 'eligible',
    optInSource: 'user_initiated_dm',
    optInTimestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    isOptedOut: false,
    tags: ['VIP Attendee'],
    internalNotes: []
  };

  const expiredContact: EligibleContact = {
    ...recentContact,
    id: 'ct-2',
    platformRecipientId: 'igsid_456',
    lastInteractionAt: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
    windowExpiresAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
  };

  const suppressionList: OptOutRecord[] = [];

  // Test 1: Recent interaction within 24h is eligible
  const res1 = MessagingEligibilityService.evaluateContact(recentContact, suppressionList);
  assert(res1.isEligible === true, 'Recent contact should be eligible within 24 hours');
  assert(res1.status === 'eligible', 'Status should be eligible');

  // Test 2: Expired 24h interaction is blocked on Instagram
  const res2 = MessagingEligibilityService.evaluateContact(expiredContact, suppressionList);
  assert(res2.isEligible === false, 'Expired contact should NOT be eligible');
  assert(res2.status === 'window_expired', 'Status should be window_expired');

  // Test 3: Opted-out contact is strictly blocked even within 24h
  const optedOutList: OptOutRecord[] = [
    {
      id: 'opt-1',
      platform: 'instagram',
      recipientIdentifier: 'igsid_123',
      displayName: 'Elena Rostova',
      reason: 'user_keyword_stop',
      optedOutAt: new Date().toISOString(),
      recordedBy: 'User STOP',
      campaignsSuppressedCount: 1
    }
  ];
  const res3 = MessagingEligibilityService.evaluateContact(recentContact, optedOutList);
  assert(res3.isEligible === false, 'Opted out recipient must be blocked');
  assert(res3.status === 'opted_out', 'Status should be opted_out');

  console.log('All Eligibility tests passed successfully.');
  return true;
}
