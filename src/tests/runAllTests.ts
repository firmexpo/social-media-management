/**
 * Test Runner for Firm Expo DM Campaign Engine
 */

import { runEligibilityTests } from './eligibility.test';
import { runTemplateRendererTests } from './template-renderer.test';
import { runOptOutTests } from './opt-out.test';

console.log('--- Running Firm Expo DM Campaign Test Suite ---');
try {
  runEligibilityTests();
  runTemplateRendererTests();
  runOptOutTests();
  console.log('✅ ALL TEST SUITES PASSED SUCCESSFULLY');
} catch (err) {
  console.error('❌ Test failure:', err);
  process.exit(1);
}
