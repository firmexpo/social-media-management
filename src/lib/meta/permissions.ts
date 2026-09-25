/**
 * Meta Graph API Permissions Registry & Compliance Matrix
 * Reference: Meta Graph API v22.0
 */

export interface MetaPermissionDef {
  scope: string;
  name: string;
  category: 'Facebook Page' | 'Instagram Professional' | 'Meta Messaging' | 'Insights';
  description: string;
  justification: string;
  requiresAppReview: boolean;
  businessVerificationRequired: boolean;
}

export const META_PERMISSIONS: MetaPermissionDef[] = [
  {
    scope: 'pages_show_list',
    name: 'Show List of Pages',
    category: 'Facebook Page',
    description: 'Allows reading the list of Facebook Pages managed by the authenticated business user.',
    justification: 'Required so the user can select which Firm Expo exhibition or client Page to link.',
    requiresAppReview: false,
    businessVerificationRequired: false,
  },
  {
    scope: 'pages_read_engagement',
    name: 'Read Page Engagement',
    category: 'Facebook Page',
    description: 'Enables accessing Page metadata, followers count, and engagement telemetry.',
    justification: 'Required to display real-time reach, engagement rates, and fan analytics.',
    requiresAppReview: true,
    businessVerificationRequired: true,
  },
  {
    scope: 'pages_manage_posts',
    name: 'Manage Page Posts',
    category: 'Facebook Page',
    description: 'Allows creating, editing, and deleting posts, videos, and stories on authorized Pages.',
    justification: 'Required for automated scheduling and direct publishing to Facebook Pages.',
    requiresAppReview: true,
    businessVerificationRequired: true,
  },
  {
    scope: 'instagram_basic',
    name: 'Instagram Basic Display & Info',
    category: 'Instagram Professional',
    description: 'Reads Instagram Business/Creator profile information, follower counts, and media URLs.',
    justification: 'Displays connected Instagram account stats, avatars, and linked professional identity.',
    requiresAppReview: true,
    businessVerificationRequired: true,
  },
  {
    scope: 'instagram_content_publish',
    name: 'Instagram Content Publishing',
    category: 'Instagram Professional',
    description: 'Allows uploading media containers and publishing photos, Reels, and carousels.',
    justification: 'Core requirement to publish Firm Expo campaign imagery, Reels, and carousels automatically.',
    requiresAppReview: true,
    businessVerificationRequired: true,
  },
  {
    scope: 'instagram_manage_comments',
    name: 'Instagram Manage Comments',
    category: 'Instagram Professional',
    description: 'Reads and replies to comments on published Instagram posts.',
    justification: 'Powers the shared Social Inbox for customer inquiry resolution and first-comment hashtags.',
    requiresAppReview: true,
    businessVerificationRequired: true,
  },
  {
    scope: 'instagram_manage_messages',
    name: 'Instagram Direct Messages',
    category: 'Meta Messaging',
    description: 'Accesses direct messaging threads for customer service and inbound attendee inquiries.',
    justification: 'Allows event organizers to answer attendee questions directly from the dashboard.',
    requiresAppReview: true,
    businessVerificationRequired: true,
  },
  {
    scope: 'read_insights',
    name: 'Read Insights & Telemetry',
    category: 'Insights',
    description: 'Accesses granular organic performance metrics for posts, reels, and stories.',
    justification: 'Populates the Analytics tab with reach, impressions, saves, and video retention curves.',
    requiresAppReview: true,
    businessVerificationRequired: true,
  },
];

export const REQUIRED_OAUTH_SCOPES = META_PERMISSIONS.map(p => p.scope);
