/**
 * Meta Facebook Graph API Client Adapter (v22.0)
 * Handles Page token acquisition, photo/video/text publishing, and Page insights
 */

export interface FacebookPageAccount {
  id: string;
  name: string;
  access_token: string;
  category: string;
  tasks: string[];
  picture?: {
    data: {
      url: string;
    };
  };
  instagram_business_account?: {
    id: string;
    username?: string;
  };
}

export interface FacebookPublishResult {
  id: string;
  post_id?: string;
}

export class FacebookGraphClient {
  private static readonly GRAPH_API_VERSION = 'v22.0';
  private static readonly BASE_URL = 'https://graph.facebook.com';

  /**
   * Retrieves all authorized Facebook Pages for the given User Access Token
   */
  public static async getManagedPages(userAccessToken: string): Promise<FacebookPageAccount[]> {
    const url = new URL(`${this.BASE_URL}/${this.GRAPH_API_VERSION}/me/accounts`);
    url.searchParams.append('fields', 'id,name,access_token,category,tasks,picture{url},instagram_business_account{id,username}');
    url.searchParams.append('access_token', userAccessToken);

    const res = await fetch(url.toString());
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`Failed to fetch Facebook Pages: ${data.error?.message || res.statusText}`);
    }

    return (data.data || []) as FacebookPageAccount[];
  }

  /**
   * Publishes a photo post to a Facebook Page
   */
  public static async publishPagePhoto(
    pageId: string,
    pageAccessToken: string,
    photoUrl: string,
    message: string
  ): Promise<FacebookPublishResult> {
    const url = `${this.BASE_URL}/${this.GRAPH_API_VERSION}/${pageId}/photos`;
    const body = new URLSearchParams({
      url: photoUrl,
      message: message,
      access_token: pageAccessToken,
    });

    const res = await fetch(url, {
      method: 'POST',
      body: body,
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(`Facebook Page Photo Publish Error (${data.error?.code}): ${data.error?.message}`);
    }

    return data as FacebookPublishResult;
  }

  /**
   * Publishes a text or link post to a Facebook Page feed
   */
  public static async publishPageFeed(
    pageId: string,
    pageAccessToken: string,
    message: string,
    link?: string
  ): Promise<FacebookPublishResult> {
    const url = `${this.BASE_URL}/${this.GRAPH_API_VERSION}/${pageId}/feed`;
    const params = new URLSearchParams({
      message: message,
      access_token: pageAccessToken,
    });

    if (link) {
      params.append('link', link);
    }

    const res = await fetch(url, {
      method: 'POST',
      body: params,
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(`Facebook Feed Post Error (${data.error?.code}): ${data.error?.message}`);
    }

    return data as FacebookPublishResult;
  }

  /**
   * Retrieves Page Post Insights
   */
  public static async getPostInsights(postId: string, pageAccessToken: string) {
    const url = new URL(`${this.BASE_URL}/${this.GRAPH_API_VERSION}/${postId}/insights`);
    url.searchParams.append('metric', 'post_impressions,post_impressions_unique,post_engaged_users,post_reactions_by_type_total');
    url.searchParams.append('access_token', pageAccessToken);

    const res = await fetch(url.toString());
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`Fetch FB Post Insights Error: ${data.error?.message}`);
    }

    return data.data;
  }
}
