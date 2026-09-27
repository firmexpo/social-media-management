/**
 * Firm Expo — Facebook Messenger Platform Client (Meta Graph API v22.0)
 * Handles Messenger Send API, Message Tags, and One-Time Notifications.
 */

export interface FacebookSendPayload {
  recipient: {
    id: string; // PSID (Page-Scoped User ID)
  };
  messaging_type: 'RESPONSE' | 'MESSAGE_TAG' | 'NON_PROMOTIONAL_SUBSCRIPTION';
  tag?: 'CONFIRMED_EVENT_UPDATE' | 'POST_PURCHASE_UPDATE' | 'ACCOUNT_UPDATE';
  message: {
    text: string;
    quick_replies?: Array<{
      content_type: 'text';
      title: string;
      payload: string;
    }>;
  };
}

export interface FacebookSendResponse {
  recipient_id: string;
  message_id: string;
}

export class FacebookMessagingClient {
  private static BASE_URL = 'https://graph.facebook.com/v22.0';

  /**
   * Send a Facebook Messenger message via Send API
   */
  public static async sendMessage(
    pageAccessToken: string,
    pageScopedUserId: string,
    text: string,
    messageTag?: 'CONFIRMED_EVENT_UPDATE' | 'POST_PURCHASE_UPDATE' | 'ACCOUNT_UPDATE',
    isDemo: boolean = false
  ): Promise<{ success: boolean; data?: FacebookSendResponse; error?: string; errorCode?: number }> {
    if (isDemo) {
      await new Promise(r => setTimeout(r, 350));
      return {
        success: true,
        data: {
          recipient_id: pageScopedUserId,
          message_id: `m_fb_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`
        }
      };
    }

    // Try backend proxy endpoint first to bypass browser CORS constraints
    try {
      const proxyRes = await fetch('/api/meta/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'facebook',
          recipientId: pageScopedUserId,
          text,
          pageAccessToken,
          isDemo: false
        })
      });

      if (proxyRes.ok) {
        const body = await proxyRes.json();
        return {
          success: true,
          data: {
            recipient_id: body.recipientId || pageScopedUserId,
            message_id: body.messageId
          }
        };
      } else {
        const errJson = await proxyRes.json().catch(() => null);
        if (errJson && errJson.error) {
          return {
            success: false,
            error: errJson.error,
            errorCode: errJson.errorCode
          };
        }
      }
    } catch {
      // Fallback to direct client fetch
    }

    try {
      const payload: FacebookSendPayload = {
        recipient: { id: pageScopedUserId },
        messaging_type: messageTag ? 'MESSAGE_TAG' : 'RESPONSE',
        tag: messageTag,
        message: { text }
      };

      const response = await fetch(`${this.BASE_URL}/me/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pageAccessToken}`
        },
        body: JSON.stringify(payload)
      });

      const body = await response.json();

      if (!response.ok) {
        const error = body.error;
        let translated = error?.message || 'Meta Messenger API request failed';
        if (error?.code === 10) {
          translated = '(#10) Out of window: 24h standard messaging window has closed without an approved message tag.';
        }
        return {
          success: false,
          error: translated,
          errorCode: error?.code
        };
      }

      return {
        success: true,
        data: body as FacebookSendResponse
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network exception communicating with Meta Messenger API.'
      };
    }
  }
}
