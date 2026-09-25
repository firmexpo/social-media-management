/**
 * Firm Expo — Message Template Renderer & Variable Sanitizer
 * Safe variable interpolation and platform-specific format validation.
 */

export interface RenderResult {
  renderedText: string;
  usedVariables: Record<string, string>;
  missingVariables: string[];
  charCount: number;
  isValid: boolean;
  warnings: string[];
}

export class TemplateRenderer {
  // Common safe variables allowed in Firm Expo DM campaigns
  public static ALLOWED_VARIABLES = [
    'firstName',
    'lastName',
    'fullName',
    'companyName',
    'eventName',
    'eventDate',
    'eventVenue',
    'registrationLink',
    'supportEmail',
    'boothNumber'
  ];

  /**
   * Replaces {{variableName}} with sanitized values, applying fallbacks if missing
   */
  public static render(
    templateText: string,
    context: Record<string, string | undefined>,
    fallbacks: Record<string, string> = {
      firstName: 'there',
      companyName: 'your organization',
      eventName: 'Firm Expo 2026',
      registrationLink: 'https://firmexpo.com/register'
    }
  ): RenderResult {
    const missingVariables: string[] = [];
    const usedVariables: Record<string, string> = {};
    const warnings: string[] = [];

    // Match all {{variable}} patterns
    const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

    const renderedText = templateText.replace(regex, (match, varName) => {
      const val = context[varName];
      if (val !== undefined && val.trim() !== '') {
        usedVariables[varName] = val;
        return val.trim();
      }

      // Check fallback
      if (fallbacks[varName] !== undefined) {
        usedVariables[varName] = fallbacks[varName];
        warnings.push(`Variable '{{${varName}}}' used fallback '${fallbacks[varName]}'`);
        return fallbacks[varName];
      }

      missingVariables.push(varName);
      return `[${varName}]`;
    });

    const charCount = renderedText.length;

    // Platform limits check (Instagram DMs have ~1000 char comfortable limits; Meta max 1000-2000)
    if (charCount > 1000) {
      warnings.push(`Message length (${charCount} chars) is long for direct messaging. Consider keeping under 600 characters for optimal readability on mobile devices.`);
    }

    // Safety checks against deceptive text
    const lower = renderedText.toLowerCase();
    if (lower.includes('urgent! account suspended') || lower.includes('claim $10,000 cash now')) {
      warnings.push('Deceptive or artificial urgency content detected. Violates Meta Community Standards.');
    }

    const isValid = missingVariables.length === 0 && charCount <= 2000;

    return {
      renderedText,
      usedVariables,
      missingVariables,
      charCount,
      isValid,
      warnings
    };
  }

  /**
   * Extract all variable placeholders from a template string
   */
  public static extractVariables(templateText: string): string[] {
    const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
    const vars = new Set<string>();
    let match;
    while ((match = regex.exec(templateText)) !== null) {
      vars.add(match[1]);
    }
    return Array.from(vars);
  }
}
