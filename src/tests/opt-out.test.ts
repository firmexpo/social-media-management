/**
 * Unit Tests for Opt-out & Suppression Manager
 */

import { OptOutManager } from '../lib/messaging/opt-out';

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`);
}

export function runOptOutTests() {
  // Test 1: Keyword detection
  assert(OptOutManager.isOptOutRequest('STOP') === true, 'STOP should trigger opt-out');
  assert(OptOutManager.isOptOutRequest('unsubscribe now please') === true, 'Unsubscribe keyword should trigger');
  assert(OptOutManager.isOptOutRequest('Hello, I want to attend the booth') === false, 'Normal message should not trigger');

  // Test 2: Record creation
  const record = OptOutManager.createRecord('instagram', 'igsid_999', 'Alex Rivera', 'user_keyword_stop');
  assert(record.platform === 'instagram', 'Platform should match');
  assert(record.recipientIdentifier === 'igsid_999', 'Identifier should match');
  assert(record.reason === 'user_keyword_stop', 'Reason should match');

  console.log('All Opt-Out tests passed successfully.');
  return true;
}
