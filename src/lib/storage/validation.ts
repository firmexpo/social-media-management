/**
 * Media Format and Specification Validator for Meta Graph API
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class MediaValidator {
  /**
   * Validates Instagram Feed Image specifications
   * Allowed aspect ratios: 1:1 (square), 4:5 (vertical), 1.91:1 (horizontal)
   * Max file size: 8 MB
   * Format: JPEG, PNG
   */
  public static validateInstagramImage(width?: number, height?: number, sizeMb: number = 0): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (sizeMb > 8) {
      errors.push(`Image file size (${sizeMb.toFixed(1)} MB) exceeds Instagram maximum limit of 8 MB.`);
    }

    if (width && height) {
      const ratio = width / height;
      const isSquare = Math.abs(ratio - 1.0) < 0.05;
      const isPortrait = Math.abs(ratio - 0.8) < 0.05; // 4:5
      const isLandscape = Math.abs(ratio - 1.91) < 0.05;

      if (!isSquare && !isPortrait && !isLandscape) {
        warnings.push(`Aspect ratio (${ratio.toFixed(2)}) is outside recommended standards (1:1, 4:5, 1.91:1). Instagram may auto-crop.`);
      }

      if (width < 320) {
        errors.push(`Width (${width}px) is below Instagram minimum resolution of 320px.`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates Instagram Reels specifications
   * Recommended aspect ratio: 9:16
   * Format: MP4, MOV
   * Max size: 100 MB via Graph API
   */
  public static validateInstagramReel(durationSec: number, sizeMb: number = 0): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (durationSec < 3) {
      errors.push('Reel duration must be at least 3 seconds.');
    }
    if (durationSec > 900) { // 15 minutes max for graph api reels
      errors.push('Reel duration exceeds maximum permitted limit of 15 minutes.');
    }
    if (sizeMb > 100) {
      errors.push(`Video size (${sizeMb.toFixed(1)} MB) exceeds 100 MB limit.`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates caption lengths
   */
  public static validateCaption(caption: string, platform: 'instagram' | 'facebook'): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (platform === 'instagram') {
      if (caption.length > 2200) {
        errors.push(`Caption exceeds Instagram limit of 2,200 characters (current: ${caption.length}).`);
      }
      const hashtags = (caption.match(/#[a-zA-Z0-9_]+/g) || []).length;
      if (hashtags > 30) {
        errors.push(`Too many hashtags (${hashtags}). Instagram allows a maximum of 30 hashtags per post.`);
      }
    } else {
      if (caption.length > 63206) {
        errors.push('Caption exceeds Facebook limit of 63,206 characters.');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
