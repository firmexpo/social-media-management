/**
 * Firm Expo — DM Campaign Management Seed & Mock Data
 * Realistic enterprise demonstration data with strict 24-hour eligibility states.
 */

import { 
  DMCampaign, 
  EligibleContact, 
  AudienceSegment, 
  MessageTemplate, 
  ScheduledMessageItem, 
  OptOutRecord, 
  ComplianceAuditEntry, 
  PublicAccountResearchItem,
  DMOverviewMetrics 
} from '../types';

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
const hoursFromNow = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

export const INITIAL_ELIGIBLE_CONTACTS: EligibleContact[] = [
  {
    id: 'cnt-1',
    platform: 'instagram',
    platformRecipientId: 'igsid_902831201',
    socialAccountId: 'acc-1',
    socialAccountName: 'Firm Expo Official IG',
    displayName: 'Sophia Sterling',
    username: 'sophia_architect',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    conversationId: 'conv-101',
    firstInteractionAt: daysAgo(5),
    lastInteractionAt: hoursAgo(3), // 3 hours ago -> ELIGIBLE (21h remaining)
    windowExpiresAt: hoursFromNow(21),
    eligibilityStatus: 'eligible',
    optInSource: 'user_initiated_dm',
    optInTimestamp: daysAgo(5),
    isOptedOut: false,
    tags: ['Architecture Pavilion', 'VIP Buyer', 'Keynote Attendee'],
    internalNotes: ['Inquired about VIP badge pickup for Architecture & Urban Expo 2026.'],
    assignedTeamMember: 'Sarah Chen'
  },
  {
    id: 'cnt-2',
    platform: 'instagram',
    platformRecipientId: 'igsid_771920381',
    socialAccountId: 'acc-1',
    socialAccountName: 'Firm Expo Official IG',
    displayName: 'Kenji Takahashi',
    username: 'kenji_robotics',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    conversationId: 'conv-102',
    firstInteractionAt: daysAgo(12),
    lastInteractionAt: hoursAgo(8), // 8 hours ago -> ELIGIBLE (16h remaining)
    windowExpiresAt: hoursFromNow(16),
    eligibilityStatus: 'eligible',
    optInSource: 'story_reply',
    optInTimestamp: daysAgo(12),
    isOptedOut: false,
    tags: ['Robotics Expo', 'Exhibitor Lead', 'Tokyo Tech'],
    internalNotes: ['Replied to IG Story regarding booth space in Hall 3.'],
    assignedTeamMember: 'Marcus Vance'
  },
  {
    id: 'cnt-3',
    platform: 'facebook',
    platformRecipientId: 'psid_4401928310',
    socialAccountId: 'acc-2',
    socialAccountName: 'Firm Expo Global Page',
    displayName: 'Amara Diallo',
    username: 'amara.diallo.biz',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    conversationId: 'conv-103',
    firstInteractionAt: daysAgo(2),
    lastInteractionAt: hoursAgo(1), // 1 hour ago -> ELIGIBLE (23h remaining)
    windowExpiresAt: hoursFromNow(23),
    eligibilityStatus: 'eligible',
    optInSource: 'event_registration_optin',
    optInTimestamp: daysAgo(2),
    isOptedOut: false,
    tags: ['Sustainable Energy', 'Speaker', 'CleanTech'],
    internalNotes: ['Submitted speaking abstract via FB Messenger Lead Gen.'],
    assignedTeamMember: 'Elena Rostova'
  },
  {
    id: 'cnt-4',
    platform: 'instagram',
    platformRecipientId: 'igsid_119284712',
    socialAccountId: 'acc-1',
    socialAccountName: 'Firm Expo Official IG',
    displayName: 'David Miller',
    username: 'dmiller_ventures',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    conversationId: 'conv-104',
    firstInteractionAt: daysAgo(20),
    lastInteractionAt: hoursAgo(42), // 42 hours ago -> EXPIRED
    windowExpiresAt: hoursAgo(18),
    eligibilityStatus: 'window_expired',
    ineligibilityReason: '24-hour response window elapsed (last message 42 hours ago). Meta policy blocks cold outbound DM initiation.',
    optInSource: 'user_initiated_dm',
    optInTimestamp: daysAgo(20),
    isOptedOut: false,
    tags: ['Venture Capitalist', 'Angel Investor'],
    internalNotes: ['Asked about investor breakfast last week. Window now closed.'],
    assignedTeamMember: 'Sarah Chen'
  },
  {
    id: 'cnt-5',
    platform: 'instagram',
    platformRecipientId: 'igsid_883192004',
    socialAccountId: 'acc-1',
    socialAccountName: 'Firm Expo Official IG',
    displayName: 'Chloe Dubois',
    username: 'chloe_design_studio',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    conversationId: 'conv-105',
    firstInteractionAt: daysAgo(8),
    lastInteractionAt: hoursAgo(6),
    windowExpiresAt: hoursFromNow(18),
    eligibilityStatus: 'opted_out',
    ineligibilityReason: 'Recipient replied with keyword "STOP". Added to global suppression list.',
    optInSource: 'user_initiated_dm',
    optInTimestamp: daysAgo(8),
    isOptedOut: true,
    tags: ['Design Expo', 'Opted-Out'],
    internalNotes: ['Opted out on 2026-09-24 via keyword STOP. Automated outreach suppressed.'],
    assignedTeamMember: 'System Suppression'
  },
  {
    id: 'cnt-6',
    platform: 'facebook',
    platformRecipientId: 'psid_990128312',
    socialAccountId: 'acc-2',
    socialAccountName: 'Firm Expo Global Page',
    displayName: 'Mateo Rossi',
    username: 'mateo.rossi.motors',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    conversationId: 'conv-106',
    firstInteractionAt: daysAgo(1),
    lastInteractionAt: hoursAgo(5),
    windowExpiresAt: hoursFromNow(19),
    eligibilityStatus: 'eligible',
    optInSource: 'qr_code_expo_optin',
    optInTimestamp: daysAgo(1),
    isOptedOut: false,
    tags: ['Mobility Expo', 'Electric Vehicles', 'Buyer'],
    internalNotes: ['Scanned check-in QR code at Munich preview exhibition.'],
    assignedTeamMember: 'Elena Rostova'
  }
];

export const INITIAL_OPT_OUTS: OptOutRecord[] = [
  {
    id: 'opt-1',
    platform: 'instagram',
    recipientIdentifier: 'igsid_883192004',
    displayName: 'Chloe Dubois (@chloe_design_studio)',
    reason: 'user_keyword_stop',
    optedOutAt: daysAgo(1),
    recordedBy: 'Meta Inbound Webhook Listener',
    campaignsSuppressedCount: 2
  },
  {
    id: 'opt-2',
    platform: 'facebook',
    recipientIdentifier: 'psid_102938471',
    displayName: 'Lucas Vance (lucas.vance.press)',
    reason: 'privacy_deletion',
    optedOutAt: daysAgo(4),
    recordedBy: 'User Data Deletion Callback',
    campaignsSuppressedCount: 5
  },
  {
    id: 'opt-3',
    platform: 'instagram',
    recipientIdentifier: 'igsid_554109283',
    displayName: 'Tara Flynn (@tara_fintech)',
    reason: 'support_request',
    optedOutAt: daysAgo(10),
    recordedBy: 'Support Agent (Sarah Chen)',
    campaignsSuppressedCount: 3
  }
];

export const INITIAL_MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Exhibition VIP Badge Fast-Track',
    platform: 'both',
    purpose: 'event_registration',
    category: 'Registration Confirmation',
    body: 'Hello {{firstName}}! Your digital pass for {{eventName}} is ready. Show this confirmation or access your personalized agenda here: {{registrationLink}}. Need assistance? Reply directly to this message.',
    supportedVariables: ['firstName', 'eventName', 'registrationLink'],
    approvalStatus: 'approved',
    createdBy: 'Sarah Chen',
    updatedAt: daysAgo(2)
  },
  {
    id: 'tpl-2',
    name: 'Exhibitor Pavilion Q&A Follow-up',
    platform: 'instagram',
    purpose: 'customer_support_followup',
    category: 'Support Response',
    body: 'Hi {{firstName}}, following up on your question about the {{eventName}} showcase pavilions. Our floor director has reserved booth {{boothNumber}} options for {{companyName}}. Let us know if you would like the 3D walkthrough!',
    supportedVariables: ['firstName', 'eventName', 'boothNumber', 'companyName'],
    approvalStatus: 'approved',
    createdBy: 'Marcus Vance',
    updatedAt: daysAgo(5)
  },
  {
    id: 'tpl-3',
    name: 'B2B Collaboration Briefing',
    platform: 'facebook',
    purpose: 'business_collaboration',
    category: 'Collaboration',
    body: 'Greetings {{fullName}}, thank you for connecting with Firm Expo. We would love to feature {{companyName}} in our global exhibition catalogue. Review the co-marketing opportunities here: {{registrationLink}}.',
    supportedVariables: ['fullName', 'companyName', 'registrationLink'],
    approvalStatus: 'approved',
    createdBy: 'Elena Rostova',
    updatedAt: daysAgo(3)
  },
  {
    id: 'tpl-4',
    name: 'Post-Expo Session Resource Kit',
    platform: 'both',
    purpose: 'existing_customer_update',
    category: 'Post-event Thank You',
    body: 'Thank you for participating in {{eventName}}, {{firstName}}! Here are the keynote slides, session recordings, and contact directory from today: {{registrationLink}}.',
    supportedVariables: ['firstName', 'eventName', 'registrationLink'],
    approvalStatus: 'approved',
    createdBy: 'Sarah Chen',
    updatedAt: daysAgo(1)
  }
];

export const INITIAL_AUDIENCE_SEGMENTS: AudienceSegment[] = [
  {
    id: 'seg-1',
    name: 'Active 24h Inquirers (Instagram & FB)',
    description: 'Recipients who messaged Firm Expo within the permitted 24-hour response window.',
    platform: 'all',
    filters: {
      tags: [],
      onlyWithin24Hours: true,
      optInSources: ['user_initiated_dm', 'story_reply', 'event_registration_optin']
    },
    totalContactsCount: 6,
    eligibleContactsCount: 4,
    lastCalculatedAt: hoursAgo(1),
    createdAt: daysAgo(10)
  },
  {
    id: 'seg-2',
    name: 'VIP Exhibition Registered Attendees',
    description: 'Pre-registered expo buyers with verified opt-in consent on record.',
    platform: 'all',
    filters: {
      tags: ['VIP Attendee', 'VIP Buyer'],
      onlyWithin24Hours: true,
      optInSources: ['event_registration_optin', 'qr_code_expo_optin']
    },
    totalContactsCount: 3,
    eligibleContactsCount: 2,
    lastCalculatedAt: hoursAgo(2),
    createdAt: daysAgo(7)
  },
  {
    id: 'seg-3',
    name: 'Exhibitor Pavilion Leads (Instagram)',
    description: 'Companies and representatives inquiring specifically on booth logistics via Instagram DMs.',
    platform: 'instagram',
    filters: {
      tags: ['Exhibitor Lead', 'Tokyo Tech'],
      onlyWithin24Hours: true,
      optInSources: ['user_initiated_dm', 'story_reply']
    },
    totalContactsCount: 2,
    eligibleContactsCount: 1,
    lastCalculatedAt: hoursAgo(3),
    createdAt: daysAgo(4)
  }
];

export const INITIAL_DM_CAMPAIGNS: DMCampaign[] = [
  {
    id: 'dm-cmp-1',
    name: 'Architecture & Urban Expo VIP Fast-Pass',
    description: 'Direct response dispatch with digital badges for verified attendees inquiring on Instagram.',
    objective: 'event_registration',
    firmExpoEventId: 'evt-1',
    firmExpoEventName: 'Firm Expo Paris 2026: Smart Architecture',
    platform: 'instagram',
    accountId: 'acc-1',
    accountName: 'Firm Expo Official IG',
    audienceSegmentId: 'seg-1',
    audienceSegmentName: 'Active 24h Inquirers (Instagram & FB)',
    templateId: 'tpl-1',
    messageBody: 'Hello {{firstName}}! Your digital VIP pass for {{eventName}} is ready. Show this confirmation or access your personalized agenda here: {{registrationLink}}.',
    variables: {
      eventName: 'Firm Expo Paris 2026',
      registrationLink: 'https://firmexpo.com/paris/vip'
    },
    status: 'running',
    scheduledAt: hoursAgo(2),
    startedAt: hoursAgo(2),
    createdBy: {
      id: 'usr-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@firmexpo.com'
    },
    approvedBy: {
      id: 'usr-admin',
      name: 'Marcus Vance',
      approvedAt: hoursAgo(3)
    },
    stats: {
      totalTargeted: 5,
      eligibleCount: 3,
      excludedCount: 2, // 1 expired, 1 opted out
      sentCount: 3,
      deliveredCount: 3,
      replyCount: 2,
      optOutCount: 0,
      failedCount: 0
    },
    complianceSummary: {
      is24HourWindowEnforced: true,
      optOutSuppressionPassed: true,
      consentVerified: true,
      policyCheckPassed: true
    },
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(1)
  },
  {
    id: 'dm-cmp-2',
    name: 'Tokyo Robotics Pavilion Exhibitor Briefing',
    description: 'Follow-up consultation links for companies that replied to robotics IG stories.',
    objective: 'customer_support_followup',
    firmExpoEventId: 'evt-2',
    firmExpoEventName: 'Tokyo Advanced Robotics Pavilion 2026',
    platform: 'instagram',
    accountId: 'acc-1',
    accountName: 'Firm Expo Official IG',
    audienceSegmentId: 'seg-3',
    audienceSegmentName: 'Exhibitor Pavilion Leads (Instagram)',
    templateId: 'tpl-2',
    messageBody: 'Hi {{firstName}}, following up on your question about the {{eventName}} showcase pavilions. Our floor director has reserved booth options for {{companyName}}.',
    variables: {
      eventName: 'Tokyo Advanced Robotics Pavilion 2026',
      companyName: 'your engineering team'
    },
    status: 'scheduled',
    scheduledAt: hoursFromNow(4),
    createdBy: {
      id: 'usr-2',
      name: 'Kenji Takahashi',
      email: 'kenji@firmexpo.com'
    },
    approvedBy: {
      id: 'usr-1',
      name: 'Sarah Chen',
      approvedAt: hoursAgo(1)
    },
    stats: {
      totalTargeted: 3,
      eligibleCount: 2,
      excludedCount: 1,
      sentCount: 0,
      deliveredCount: 0,
      replyCount: 0,
      optOutCount: 0,
      failedCount: 0
    },
    complianceSummary: {
      is24HourWindowEnforced: true,
      optOutSuppressionPassed: true,
      consentVerified: true,
      policyCheckPassed: true
    },
    createdAt: daysAgo(1),
    updatedAt: hoursAgo(2)
  },
  {
    id: 'dm-cmp-3',
    name: 'CleanTech Global Speaker Coordination',
    description: 'Confirmed speaker schedule updates sent over Facebook Messenger.',
    objective: 'business_collaboration',
    firmExpoEventId: 'evt-3',
    firmExpoEventName: 'Global CleanTech Exhibition 2026',
    platform: 'facebook',
    accountId: 'acc-2',
    accountName: 'Firm Expo Global Page',
    audienceSegmentId: 'seg-2',
    audienceSegmentName: 'VIP Exhibition Registered Attendees',
    templateId: 'tpl-3',
    messageBody: 'Greetings {{fullName}}, thank you for connecting with Firm Expo. We look forward to your keynote at {{eventName}}!',
    variables: {
      eventName: 'Global CleanTech Exhibition 2026'
    },
    status: 'completed',
    startedAt: daysAgo(3),
    completedAt: daysAgo(3),
    createdBy: {
      id: 'usr-3',
      name: 'Elena Rostova',
      email: 'elena@firmexpo.com'
    },
    stats: {
      totalTargeted: 8,
      eligibleCount: 8,
      excludedCount: 0,
      sentCount: 8,
      deliveredCount: 8,
      replyCount: 5,
      optOutCount: 0,
      failedCount: 0
    },
    complianceSummary: {
      is24HourWindowEnforced: true,
      optOutSuppressionPassed: true,
      consentVerified: true,
      policyCheckPassed: true
    },
    createdAt: daysAgo(4),
    updatedAt: daysAgo(3)
  }
];

export const INITIAL_SCHEDULED_MESSAGES: ScheduledMessageItem[] = [
  {
    id: 'sch-101',
    campaignId: 'dm-cmp-2',
    campaignName: 'Tokyo Robotics Pavilion Exhibitor Briefing',
    contactId: 'cnt-2',
    recipientName: 'Kenji Takahashi',
    recipientIdentifier: 'igsid_771920381',
    platform: 'instagram',
    renderedBody: 'Hi Kenji, following up on your question about the Tokyo Advanced Robotics Pavilion 2026 showcase pavilions. Our floor director has reserved booth options for your engineering team.',
    scheduledFor: hoursFromNow(4),
    status: 'pending',
    eligibilityRechecked: true,
    eligibilityPassed: true,
    idempotencyKey: 'idem-tokyo-kenji-101'
  },
  {
    id: 'sch-102',
    campaignId: 'dm-cmp-1',
    campaignName: 'Architecture & Urban Expo VIP Fast-Pass',
    contactId: 'cnt-1',
    recipientName: 'Sophia Sterling',
    recipientIdentifier: 'igsid_902831201',
    platform: 'instagram',
    renderedBody: 'Hello Sophia! Your digital VIP pass for Firm Expo Paris 2026 is ready. Show this confirmation or access your personalized agenda here: https://firmexpo.com/paris/vip.',
    scheduledFor: hoursAgo(2),
    status: 'dispatched',
    eligibilityRechecked: true,
    eligibilityPassed: true,
    dispatchedAt: hoursAgo(2),
    idempotencyKey: 'idem-paris-sophia-102'
  },
  {
    id: 'sch-103',
    campaignId: 'dm-cmp-1',
    campaignName: 'Architecture & Urban Expo VIP Fast-Pass',
    contactId: 'cnt-6',
    recipientName: 'Mateo Rossi',
    recipientIdentifier: 'psid_990128312',
    platform: 'facebook',
    renderedBody: 'Hello Mateo! Your digital VIP pass for Firm Expo Paris 2026 is ready. Show this confirmation or access your personalized agenda here: https://firmexpo.com/paris/vip.',
    scheduledFor: hoursAgo(1),
    status: 'dispatched',
    eligibilityRechecked: true,
    eligibilityPassed: true,
    dispatchedAt: hoursAgo(1),
    idempotencyKey: 'idem-paris-mateo-103'
  }
];

export const INITIAL_COMPLIANCE_AUDIT: ComplianceAuditEntry[] = [
  {
    id: 'audit-201',
    timestamp: hoursAgo(1),
    action: 'ELIGIBILITY_EVALUATION',
    actor: 'DMCampaignService',
    targetType: 'campaign',
    targetId: 'dm-cmp-1',
    status: 'passed',
    policyRule: 'Meta 24h Customer Window',
    details: 'Verified 3 eligible recipients within 24h customer window. Excluded 2 recipients (1 window expired, 1 on opt-out list).'
  },
  {
    id: 'audit-202',
    timestamp: hoursAgo(3),
    action: 'OPT_OUT_SUPPRESSION_ENFORCED',
    actor: 'OptOutManager',
    targetType: 'opt_out',
    targetId: 'opt-1',
    status: 'passed',
    policyRule: 'Global Suppression Policy',
    details: 'Recipient Chloe Dubois (@chloe_design_studio) sent keyword STOP. Suppressed from all future campaigns.'
  },
  {
    id: 'audit-203',
    timestamp: hoursAgo(6),
    action: 'DISPATCH_TIME_RECHECK',
    actor: 'MessageDispatcher',
    targetType: 'contact',
    targetId: 'cnt-4',
    status: 'blocked',
    policyRule: 'Meta Instagram Messaging Window Constraint',
    details: 'Blocked outbound message dispatch to David Miller. 24-hour customer service window elapsed (42h inactive).'
  },
  {
    id: 'audit-204',
    timestamp: daysAgo(1),
    action: 'FOLLOWER_SCRAPING_ATTEMPT_BLOCKED',
    actor: 'SecurityPolicyEngine',
    targetType: 'campaign',
    targetId: 'security-guard',
    status: 'blocked',
    policyRule: 'Anti-Scraping & Follower Extraction Ban',
    details: 'Blocked request to export public follower list. Follower relationships do NOT constitute direct messaging authorization under Meta Platform Terms.'
  }
];

export const INITIAL_RESEARCH_ACCOUNTS: PublicAccountResearchItem[] = [
  {
    id: 'res-1',
    username: 'nordic_cleantech_summit',
    displayName: 'Nordic CleanTech Summit',
    biography: 'Premier Scandinavian clean energy forum & exhibition. Connecting 1,200+ green innovators across Oslo, Stockholm, and Copenhagen.',
    website: 'https://nordiccleantech.org',
    followersCount: 48200,
    mediaCount: 382,
    industry: 'Clean Energy & Sustainability',
    collaborationOpportunity: 'Cross-promotion of European renewable pavilions at Firm Expo Paris 2026',
    outreachStatus: 'in_dialogue',
    internalNotes: [
      'Met representative at Oslo Green Days.',
      'Official partnership discussion scheduled for Q3 2026.'
    ],
    researchedAt: daysAgo(3),
    recentMedia: [
      {
        id: 'med-101',
        caption: 'Announcing our 2026 hydrogen innovation stage partners! #CleanEnergy #Hydrogen',
        mediaUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=400&q=80',
        likeCount: 642,
        commentsCount: 29,
        timestamp: daysAgo(4),
        permalink: 'https://instagram.com/p/nordic101'
      },
      {
        id: 'med-102',
        caption: 'Early bird registration open for municipal delegates. Link in bio.',
        mediaUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=400&q=80',
        likeCount: 420,
        commentsCount: 14,
        timestamp: daysAgo(7),
        permalink: 'https://instagram.com/p/nordic102'
      }
    ]
  },
  {
    id: 'res-2',
    username: 'tokyo_future_mobility',
    displayName: 'Tokyo Future Mobility Expo',
    biography: 'Autonomous vehicles, electric aviation, and urban smart transit showcase at Tokyo Big Sight.',
    website: 'https://tokyomobility.jp',
    followersCount: 89400,
    mediaCount: 520,
    industry: 'Automotive & Smart Transit',
    collaborationOpportunity: 'Hosting a joint bilateral Japan-EU robotics pavilion',
    outreachStatus: 'lead_identified',
    internalNotes: [
      'Public Business Discovery profile reviewed.',
      'Identified head of international partnerships for direct B2B outreach via corporate email.'
    ],
    researchedAt: daysAgo(1),
    recentMedia: [
      {
        id: 'med-201',
        caption: 'First look at Level 4 autonomous shuttle demonstrations planned for October.',
        mediaUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80',
        likeCount: 1840,
        commentsCount: 88,
        timestamp: daysAgo(2),
        permalink: 'https://instagram.com/p/tokyo201'
      }
    ]
  },
  {
    id: 'res-3',
    username: 'milan_digital_biennale',
    displayName: 'Milan Digital Design Biennale',
    biography: 'International creative forum bringing together 400 architectural studios, CGI artists, and spatial computing labs.',
    website: 'https://digitalbiennale.it',
    followersCount: 112000,
    mediaCount: 740,
    industry: 'Design & Spatial Computing',
    collaborationOpportunity: 'Co-curating spatial computing pavilion at Firm Expo Dubai',
    outreachStatus: 'contacted',
    internalNotes: [
      'Sent partnership inquiry via official B2B press office.'
    ],
    researchedAt: daysAgo(6),
    recentMedia: [
      {
        id: 'med-301',
        caption: 'Exploring generative acoustics inside the historic Palazzo Giureconsulti.',
        mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
        likeCount: 2450,
        commentsCount: 115,
        timestamp: daysAgo(5),
        permalink: 'https://instagram.com/p/milan301'
      }
    ]
  }
];

export const INITIAL_DM_METRICS: DMOverviewMetrics = {
  totalCampaigns: 14,
  activeCampaigns: 2,
  draftCampaigns: 3,
  scheduledCampaigns: 1,
  completedCampaigns: 8,
  eligibleContacts: 142,
  messagesSent: 586,
  messagesDelivered: 582,
  repliesReceived: 248,
  failedMessages: 4,
  responseRate: 42.6, // (248 / 582) * 100
  optOutRate: 0.8
};
