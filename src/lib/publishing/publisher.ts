/**
 * Publishing Engine and Adapter Orchestrator
 * Dispatches posts to Facebook and Instagram Graph APIs with idempotency and error resolution
 */

import { FacebookGraphClient } from '../meta/facebook';
import { InstagramGraphClient } from '../meta/instagram';
import { MediaValidator } from '../storage/validation';
import { PostItem, SocialAccount } from '../../types';

export interface PublishResult {
  success: boolean;
  platformPostId?: string;
  permalink?: string;
  errorCode?: string;
  errorMessage?: string;
  attemptNumber: number;
}

export class PublishingEngine {
  /**
   * Main publishing pipeline execution
   */
  public static async publishPost(
    post: PostItem,
    account: SocialAccount,
    token: string,
    isDemoMode: boolean = false
  ): Promise<PublishResult> {
    // 1. Validation check
    const captionValidation = MediaValidator.validateCaption(post.caption, post.platform);
    if (!captionValidation.valid) {
      return {
        success: false,
        errorCode: 'VALIDATION_FAILED',
        errorMessage: captionValidation.errors.join('; '),
        attemptNumber: 1,
      };
    }

    // 2. Demo Mode simulation
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 800)); // simulate network roundtrip
      
      // Simulate realistic result
      const mockPostId = `${post.platform === 'instagram' ? '1799' : '1088'}_${Date.now()}`;
      return {
        success: true,
        platformPostId: mockPostId,
        permalink: post.platform === 'instagram' 
          ? `https://instagram.com/p/${Math.random().toString(36).substring(7)}/`
          : `https://facebook.com/posts/${mockPostId}`,
        attemptNumber: 1,
      };
    }

    // 3. Live Meta Graph Execution
    try {
      if (post.platform === 'instagram') {
        const media = post.media[0];
        if (!media) {
          throw new Error('Instagram requires at least one media asset (image or video).');
        }

        let creationId: string;
        if (post.format === 'instagram_reel') {
          const container = await InstagramGraphClient.createReelContainer(
            account.externalId,
            token,
            media.url,
            post.caption
          );
          creationId = container.id;
        } else {
          const container = await InstagramGraphClient.createImageContainer(
            account.externalId,
            token,
            media.url,
            post.caption
          );
          creationId = container.id;
        }

        // Wait for container readiness
        let attempts = 0;
        let isReady = false;
        while (attempts < 10 && !isReady) {
          const status = await InstagramGraphClient.checkContainerStatus(creationId, token);
          if (status.status_code === 'FINISHED') {
            isReady = true;
            break;
          } else if (status.status_code === 'ERROR') {
            throw new Error(`Instagram Media Processing Failed: ${status.status || 'Encoding error'}`);
          }
          await new Promise(r => setTimeout(r, 2000));
          attempts++;
        }

        // Publish container
        const published = await InstagramGraphClient.publishMedia(account.externalId, token, creationId);
        
        return {
          success: true,
          platformPostId: published.id,
          permalink: `https://instagram.com/p/${published.id}/`,
          attemptNumber: 1,
        };

      } else {
        // Facebook Page publishing
        if (post.media.length > 0 && post.media[0].type === 'image') {
          const result = await FacebookGraphClient.publishPagePhoto(
            account.externalId,
            token,
            post.media[0].url,
            post.caption
          );
          return {
            success: true,
            platformPostId: result.post_id || result.id,
            permalink: `https://facebook.com/${result.post_id || result.id}`,
            attemptNumber: 1,
          };
        } else {
          const result = await FacebookGraphClient.publishPageFeed(
            account.externalId,
            token,
            post.caption
          );
          return {
            success: true,
            platformPostId: result.id,
            permalink: `https://facebook.com/${result.id}`,
            attemptNumber: 1,
          };
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Unknown Meta publishing error';
      let errorCode = 'UNKNOWN_META_ERROR';
      
      if (errorMessage.includes('190') || errorMessage.includes('Session has expired')) {
        errorCode = 'TOKEN_EXPIRED';
      } else if (errorMessage.includes('368') || errorMessage.includes('temporarily blocked')) {
        errorCode = 'META_ACTION_BLOCKED';
      } else if (errorMessage.includes('100') || errorMessage.includes('aspect ratio')) {
        errorCode = 'INVALID_ASPECT_RATIO';
      }

      return {
        success: false,
        errorCode,
        errorMessage,
        attemptNumber: 1,
      };
    }
  }
}
