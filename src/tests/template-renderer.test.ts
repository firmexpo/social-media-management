/**
 * Unit Tests for Template Renderer & Sanitizer
 */

import { TemplateRenderer } from '../lib/messaging/template-renderer';

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`);
}

export function runTemplateRendererTests() {
  const template = 'Hi {{firstName}}, thank you for contacting {{companyName}} about {{eventName}}! Your pass: {{registrationLink}}';
  
  // Test 1: Full variable replacement
  const res1 = TemplateRenderer.render(template, {
    firstName: 'Marcus',
    companyName: 'Firm Expo Global',
    eventName: 'Fintech Summit',
    registrationLink: 'https://firmexpo.com/pass/123'
  });

  assert(res1.isValid === true, 'Template with all variables should be valid');
  assert(res1.renderedText.includes('Hi Marcus'), 'FirstName should be replaced');
  assert(res1.renderedText.includes('Fintech Summit'), 'EventName should be replaced');

  // Test 2: Fallback replacement
  const res2 = TemplateRenderer.render(template, {
    firstName: 'Sara'
  });

  assert(res2.isValid === true, 'Template should apply default fallbacks');
  assert(res2.renderedText.includes('Hi Sara'), 'Sara should be present');
  assert(res2.renderedText.includes('Firm Expo 2026'), 'Fallback event should be used');

  // Test 3: Extract variables
  const extracted = TemplateRenderer.extractVariables(template);
  assert(extracted.length === 4, 'Should extract exactly 4 variables');
  assert(extracted.includes('firstName'), 'Extracted should include firstName');

  console.log('All Template Renderer tests passed successfully.');
  return true;
}
