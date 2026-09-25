/**
 * Instagram Graph API Client Adapter (v22.0)
 * Implements two-step Container & Publishing protocol for Feed Photos, Reels, and Carousels
 * Includes Business Discovery API for permitted public account research
 */

export interface IgContainerResponse {
  id: string; // creation_id
}

export interface IgPublishResponse {
  id: string; // instagram post id
}

export interface IgContainerStatus {
  id: string;
  status_code: 'EXPIRED' | 'ERROR' | 'FINISHED' | 'IN_PROGRESS';
  status?: string;
}

export class InstagramGraphClient {
  private static readonly GRAPH_API_VERSION = 'v22.0';
  private static readonly BASE_URL = 'https://graph.facebook.com';

  /**
   * Step 1A: Creates an Instagram Single Image Container
   */
  public static async createImageContainer(
    igUserId: string,
    accessToken: string,
    imageUrl: string,
    caption: string
  ): Promise<IgContainerResponse> {
    const url = `${this.BASE_URL}/${this.GRAPH_API_VERSION}/${igUserId}/media`;
    const params = new URLSearchParams({
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken,
    });

    const res = await fetch(url, { method: 'POST', body: params });
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`IG Container Creation Failed (${data.error?.code}): ${data.error?.message}`);
    }

    return data as IgContainerResponse;
  }

  /**
   * Step 1B: Creates an Instagram Reel Video Container
   */
  public static async createReelContainer(
    igUserId: string,
    accessToken: string,
    videoUrl: string,
    caption: string,
    shareToFeed: boolean = true
  ): Promise<IgContainerResponse> {
    const url = `${this.BASE_URL}/${this.GRAPH_API_VERSION}/${igUserId}/media`;
    const params = new URLSearchParams({
      media_type: 'REELS',
      video_url: videoUrl,
      caption: caption,
      share_to_feed: shareToFeed ? 'true' : 'false',
      access_token: accessToken,
    });

    const res = await fetch(url, { method: 'POST', body: params });
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`IG Reel Container Creation Failed (${data.error?.code}): ${data.error?.message}`);
    }

    return data as IgContainerResponse;
  }

  /**
   * Checks container processing status before publishing
   */
  public static async checkContainerStatus(
    creationId: string,
    accessToken: string
  ): Promise<IgContainerStatus> {
    const url = new URL(`${this.BASE_URL}/${this.GRAPH_API_VERSION}/${creationId}`);
    url.searchParams.append('fields', 'id,status_code,status');
    url.searchParams.append('access_token', accessToken);

    const res = await fetch(url.toString());
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`Failed to check container status: ${data.error?.message}`);
    }

    return data as IgContainerStatus;
  }

  /**
   * Step 2: Publishes the verified Container
   */
  public static async publishMedia(
    igUserId: string,
    accessToken: string,
    creationId: string
  ): Promise<IgPublishResponse> {
    const url = `${this.BASE_URL}/${this.GRAPH_API_VERSION}/${igUserId}/media_publish`;
    const params = new URLSearchParams({
      creation_id: creationId,
      access_token: accessToken,
    });

    const res = await fetch(url, { method: 'POST', body: params });
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`IG Media Publish Failed (${data.error?.code}): ${data.error?.message}`);
    }

    return data as IgPublishResponse;
  }

  /**
   * Replies to an Instagram Comment
   */
  public static async replyToComment(
    commentId: string,
    accessToken: string,
    message: string
  ) {
    const url = `${this.BASE_URL}/${this.GRAPH_API_VERSION}/${commentId}/replies`;
    const params = new URLSearchParams({
      message: message,
      access_token: accessToken,
    });

    const res = await fetch(url, { method: 'POST', body: params });
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`Failed to reply to comment: ${data.error?.message}`);
    }

    return data;
  }

  /**
   * Instagram Business Discovery API
   * Permitted endpoint for public business/creator research
   */
  public static async queryBusinessDiscovery(
    igUserId: string,
    accessToken: string,
    targetUsername: string
  ) {
    const fields = `business_discovery.username(${targetUsername}){name,username,biography,profile_picture_url,followers_count,media_count,website,media{id,caption,media_type,media_url,like_count,comments_count,timestamp,permalink}}`;
    const url = new URL(`${this.BASE_URL}/${this.GRAPH_API_VERSION}/${igUserId}`);
    url.searchParams.append('fields', fields);
    url.searchParams.append('access_token', accessToken);

    const res = await fetch(url.toString());
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`Business Discovery Error: ${data.error?.message || 'Account not found or not an eligible professional account'}`);
    }

    return data.business_discovery;
  }
}
