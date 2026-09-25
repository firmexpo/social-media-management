/**
 * Firm Expo — Social Media Campaign Management Dashboard
 * Meta Graph API & System Type Definitions
 */

export type Platform = 'facebook' | 'instagram';

export type PostFormat = 
  | 'instagram_feed' 
  | 'instagram_reel' 
  | 'instagram_story' 
  | 'facebook_post' 
  | 'facebook_story'
  | 'facebook_reel';

export type CampaignStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'publishing' 
  | 'published' 
  | 'paused' 
  | 'failed' 
  | 'archived';

export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

export type CampaignObjective = 
  | 'brand_awareness'
  | 'event_promotion'
  | 'product_launch'
  | 'lead_generation'
  | 'website_traffic'
  | 'community_engagement'
  | 'company_announcement';

export type UserRole = 'owner' | 'admin' | 'campaign_manager' | 'content_creator' | 'analyst';

export interface FirmExpoEvent {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  expectedAttendees: number;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  role: UserRole;
  plan: 'Enterprise Exhibition' | 'Pro Brand' | 'Starter';
}

export interface SocialAccount {
  id: string;
  platform: Platform;
  externalId: string;
  name: string;
  username: string;
  avatarUrl: string;
  accountType: 'page' | 'business' | 'creator';
  followersCount: number;
  likesCount?: number;
  isConnected: boolean;
  tokenExpiresAt: string;
  lastSyncedAt: string;
  permissions: string[];
  status: 'active' | 'token_expiring' | 'token_expired' | 'permissions_missing';
  errorDetails?: string;
}

export interface PostMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  aspectRatio: '1:1' | '4:5' | '4:3' | '16:9' | '9:16';
  fileSizeMb: number;
  altText?: string;
  thumbnailUrl?: string;
  dimensions?: { width: number; height: number };
}

export interface PostItem {
  id: string;
  campaignId: string;
  campaignName: string;
  socialAccountId: string;
  platform: Platform;
  format: PostFormat;
  caption: string;
  firstComment?: string;
  media: PostMedia[];
  scheduledAt: string;
  publishedAt?: string;
  status: PostStatus;
  externalPostId?: string;
  permalink?: string;
  failureReason?: string;
  retryCount?: number;
  metrics?: {
    reach: number;
    impressions: number;
    engagement: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    clicks: number;
  };
}

export interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  objective: CampaignObjective;
  firmExpoEventId?: string;
  firmExpoEventName?: string;
  targetPlatforms: Platform[];
  accountIds: string[];
  status: CampaignStatus;
  startDate: string;
  endDate?: string;
  createdBy: {
    id: string;
    name: string;
    avatar: string;
  };
  lastUpdated: string;
  postCount: number;
  posts?: PostItem[];
  budget?: {
    currency: string;
    total: number;
    spent: number;
  };
  totalReach?: number;
  totalImpressions?: number;
  engagementRate?: number;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  aspectRatio: string;
  fileSizeBytes: number;
  dimensions: string;
  tags: string[];
  uploadedAt: string;
  usageCount: number;
}

export interface InboxConversation {
  id: string;
  socialAccountId: string;
  platform: Platform;
  type: 'instagram_dm' | 'messenger' | 'post_comment';
  sender: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    isVerified?: boolean;
  };
  contactName?: string;
  contactUsername?: string;
  contactAvatar?: string;
  lastMessageSnippet: string;
  lastMessageAt: string;
  unreadCount: number;
  isResolved: boolean;
  assignedTo?: {
    name: string;
    avatar: string;
  };
  sentiment: 'positive' | 'neutral' | 'inquiry' | 'concern';
  postContext?: {
    postId: string;
    postCaption: string;
    postMediaUrl: string;
  };
  messages: Array<{
    id: string;
    senderId: string;
    senderType: 'customer' | 'agent' | 'bot';
    text: string;
    timestamp: string;
    attachments?: string[];
  }>;
  internalNotes?: string[];
}

export interface BusinessDiscoveryResult {
  username: string;
  name: string;
  biography: string;
  profilePictureUrl: string;
  followersCount: number;
  mediaCount: number;
  website?: string;
  queriedAt: string;
  recentMedia: Array<{
    id: string;
    caption: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    mediaUrl: string;
    likeCount: number;
    commentsCount: number;
    timestamp: string;
    permalink: string;
  }>;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  status: 'active' | 'invited';
  joinedDate: string;
  campaignsAssigned: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    email: string;
  };
  action: string;
  targetType: 'campaign' | 'account' | 'post' | 'approval' | 'settings';
  targetName: string;
  details: string;
}

export interface MetricOverview {
  totalCampaigns: number;
  activeCampaigns: number;
  scheduledPosts: number;
  publishedPosts: number;
  totalReach: number;
  totalImpressions: number;
  engagementRate: number;
  totalInteractions: number;
  reachChange: number;
  impressionsChange: number;
  engagementChange: number;
  interactionsChange: number;
}

// ==========================================
// DM Campaign Management Module Types
// ==========================================

export type DMCampaignObjective =
  | 'event_registration'
  | 'expo_announcement'
  | 'existing_customer_update'
  | 'customer_support_followup'
  | 'optin_lead_followup'
  | 'business_collaboration'
  | 'company_announcement';

export type DMCampaignStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'scheduled'
  | 'running'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type EligibilityStatus =
  | 'eligible'
  | 'window_expired'
  | 'opted_out'
  | 'missing_consent'
  | 'unsupported_platform';

export type OptInSource =
  | 'user_initiated_dm'
  | 'story_reply'
  | 'event_registration_optin'
  | 'qr_code_expo_optin'
  | 'customer_support';

export interface DMCampaign {
  id: string;
  name: string;
  description: string;
  objective: DMCampaignObjective;
  firmExpoEventId?: string;
  firmExpoEventName?: string;
  platform: Platform;
  accountId: string;
  accountName: string;
  audienceSegmentId: string;
  audienceSegmentName: string;
  templateId?: string;
  messageBody: string;
  variables: Record<string, string>;
  status: DMCampaignStatus;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  approvedBy?: {
    id: string;
    name: string;
    approvedAt: string;
  };
  stats: {
    totalTargeted: number;
    eligibleCount: number;
    excludedCount: number;
    sentCount: number;
    deliveredCount: number;
    replyCount: number;
    optOutCount: number;
    failedCount: number;
  };
  complianceSummary: {
    is24HourWindowEnforced: boolean;
    optOutSuppressionPassed: boolean;
    consentVerified: boolean;
    policyCheckPassed: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EligibleContact {
  id: string;
  platform: Platform;
  platformRecipientId: string;
  socialAccountId: string;
  socialAccountName: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  conversationId: string;
  firstInteractionAt: string;
  lastInteractionAt: string;
  windowExpiresAt: string;
  eligibilityStatus: EligibilityStatus;
  ineligibilityReason?: string;
  optInSource: OptInSource;
  optInTimestamp: string;
  isOptedOut: boolean;
  tags: string[];
  internalNotes: string[];
  assignedTeamMember?: string;
}

export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  platform: Platform | 'all';
  filters: {
    tags: string[];
    onlyWithin24Hours: boolean;
    optInSources: OptInSource[];
    assignedTo?: string;
  };
  totalContacts?: number;
  totalContactsCount: number;
  eligibleContactsCount: number;
  lastCalculatedAt: string;
  createdAt: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  platform: Platform | 'both';
  purpose: DMCampaignObjective;
  category: 
    | 'Event Invitation' 
    | 'Registration Confirmation' 
    | 'Expo Update' 
    | 'Support Response' 
    | 'Opt-in Lead Follow-up' 
    | 'Collaboration' 
    | 'Post-event Thank You';
  body: string;
  supportedVariables: string[];
  approvalStatus: 'draft' | 'approved' | 'rejected';
  createdBy: string;
  updatedAt: string;
}

export interface ScheduledMessageItem {
  id: string;
  campaignId: string;
  campaignName: string;
  contactId: string;
  recipientName: string;
  recipientIdentifier: string;
  platform: Platform;
  renderedBody: string;
  scheduledFor: string;
  status: 'pending' | 'dispatched' | 'cancelled' | 'failed';
  eligibilityRechecked: boolean;
  eligibilityPassed: boolean;
  failureReason?: string;
  dispatchedAt?: string;
  idempotencyKey: string;
}

export interface OptOutRecord {
  id: string;
  platform: Platform;
  recipientIdentifier: string;
  displayName: string;
  reason: 'user_keyword_stop' | 'support_request' | 'privacy_deletion' | 'manual_suppression';
  optedOutAt: string;
  recordedBy: string;
  campaignsSuppressedCount: number;
}

export interface ComplianceAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  targetType: 'contact' | 'campaign' | 'template' | 'opt_out' | 'webhook';
  targetId: string;
  status: 'passed' | 'warning' | 'blocked';
  policyRule: string;
  details: string;
}

export interface PublicAccountResearchItem {
  id: string;
  username: string;
  displayName: string;
  biography: string;
  website?: string;
  followersCount: number;
  mediaCount: number;
  industry: string;
  collaborationOpportunity: string;
  outreachStatus: 'uncontacted' | 'lead_identified' | 'contacted' | 'in_dialogue' | 'partnered' | 'declined';
  internalNotes: string[];
  researchedAt: string;
  recentMedia: Array<{
    id: string;
    caption: string;
    mediaUrl: string;
    likeCount: number;
    commentsCount: number;
    timestamp: string;
    permalink: string;
  }>;
}

export interface DMOverviewMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  draftCampaigns: number;
  scheduledCampaigns: number;
  completedCampaigns: number;
  eligibleContacts: number;
  messagesSent: number;
  messagesDelivered: number;
  repliesReceived: number;
  failedMessages: number;
  responseRate: number;
  optOutRate: number;
}

