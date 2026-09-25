/**
 * Meta OAuth & Token Security Adapter
 * Production-ready server-side OAuth handling for Facebook Login & Instagram Graph API
 */

export interface MetaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface MetaTokenDebugInfo {
  app_id: string;
  type: string;
  application: string;
  data_access_expires_at: number;
  expires_at: number;
  is_valid: boolean;
  issued_at: number;
  scopes: string[];
  user_id: string;
}

export class MetaAuthService {
  private static readonly GRAPH_API_VERSION = 'v22.0';
  private static readonly BASE_URL = 'https://graph.facebook.com';

  /**
   * Generates secure OAuth authorization URL with CSRF state token
   */
  public static generateAuthUrl(clientId: string, redirectUri: string, state: string, scopes: string[]): string {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state,
      response_type: 'code',
      scope: scopes.join(','),
      auth_type: 'rerequest',
    });

    return `https://www.facebook.com/${this.GRAPH_API_VERSION}/dialog/oauth?${params.toString()}`;
  }

  /**
   * Exchanges authorization code for a short-lived User Access Token
   */
  public static async exchangeCodeForToken(
    code: string,
    redirectUri: string,
    appId: string,
    appSecret: string
  ): Promise<MetaTokenResponse> {
    const url = new URL(`${this.BASE_URL}/${this.GRAPH_API_VERSION}/oauth/access_token`);
    url.searchParams.append('client_id', appId);
    url.searchParams.append('client_secret', appSecret);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('code', code);

    const response = await fetch(url.toString(), { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(`Meta OAuth Exchange Failed: ${data.error?.message || response.statusText}`);
    }

    return data as MetaTokenResponse;
  }

  /**
   * Exchanges a short-lived token (1–2 hours) for a 60-day Long-Lived Token
   */
  public static async getLongLivedUserToken(
    shortLivedToken: string,
    appId: string,
    appSecret: string
  ): Promise<MetaTokenResponse> {
    const url = new URL(`${this.BASE_URL}/${this.GRAPH_API_VERSION}/oauth/access_token`);
    url.searchParams.append('grant_type', 'fb_exchange_token');
    url.searchParams.append('client_id', appId);
    url.searchParams.append('client_secret', appSecret);
    url.searchParams.append('fb_exchange_token', shortLivedToken);

    const response = await fetch(url.toString(), { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(`Long-Lived Token Exchange Failed: ${data.error?.message || response.statusText}`);
    }

    return data as MetaTokenResponse;
  }

  /**
   * Inspects and validates token validity and scope expiration
   */
  public static async inspectToken(
    inputToken: string,
    appId: string,
    appSecret: string
  ): Promise<MetaTokenDebugInfo> {
    const appAccessToken = `${appId}|${appSecret}`;
    const url = new URL(`${this.BASE_URL}/${this.GRAPH_API_VERSION}/debug_token`);
    url.searchParams.append('input_token', inputToken);
    url.searchParams.append('access_token', appAccessToken);

    const response = await fetch(url.toString(), { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(`Token Inspection Failed: ${data.error?.message || response.statusText}`);
    }

    return data.data as MetaTokenDebugInfo;
  }
}
