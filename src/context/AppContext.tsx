import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Campaign, 
  FirmExpoEvent, 
  InboxConversation, 
  MediaAsset, 
  PostItem, 
  SocialAccount, 
  TeamMember, 
  Workspace,
  AuditLogEntry,
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
import { 
  INITIAL_CAMPAIGNS, 
  INITIAL_MEDIA_ASSETS, 
  INITIAL_POSTS, 
  INITIAL_SOCIAL_ACCOUNTS, 
  INITIAL_TEAM_MEMBERS, 
  INITIAL_WORKSPACES, 
  INITIAL_INBOX_CONVERSATIONS, 
  INITIAL_AUDIT_LOGS,
  FIRM_EXPO_EVENTS
} from '../data/mockData';
import {
  INITIAL_DM_CAMPAIGNS,
  INITIAL_ELIGIBLE_CONTACTS,
  INITIAL_AUDIENCE_SEGMENTS,
  INITIAL_MESSAGE_TEMPLATES,
  INITIAL_SCHEDULED_MESSAGES,
  INITIAL_OPT_OUTS,
  INITIAL_COMPLIANCE_AUDIT,
  INITIAL_RESEARCH_ACCOUNTS,
  INITIAL_DM_METRICS
} from '../data/dmMockData';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  type User,
  doc, 
  collection, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  getDocs,
  handleFirestoreError,
  OperationType,
  testConnection
} from '../lib/firebase';
import { MessageDispatcher } from '../lib/messaging/dispatcher';
import { OptOutManager } from '../lib/messaging/opt-out';

export type NavigationTab = 
  | 'overview' 
  | 'create_dm_campaign'
  | 'create_campaign'
  | 'campaigns' 
  | 'audience' 
  | 'research'
  | 'inbox' 
  | 'templates'
  | 'scheduled'
  | 'analytics' 
  | 'compliance'
  | 'settings'
  | 'accounts'
  | 'planner'
  | 'media'
  | 'team';

interface AppContextType {
  // Navigation & Workspace
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  setCurrentWorkspace: (ws: Workspace) => void;
  
  // Demo Mode vs Live Meta API Mode
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;

  // Firebase Auth & Cloud Sync
  user: User | null;
  isAuthReady: boolean;
  isSyncing: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Events
  events: FirmExpoEvent[];

  // Traditional Post Campaigns (Existing)
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  duplicateCampaign: (id: string) => void;
  deleteCampaign: (id: string) => void;
  togglePauseCampaign: (id: string) => void;

  // DM Campaigns Management (New Dedicated Module)
  dmCampaigns: DMCampaign[];
  addDMCampaign: (campaign: DMCampaign) => void;
  updateDMCampaign: (id: string, updates: Partial<DMCampaign>) => void;
  pauseDMCampaign: (id: string) => void;
  resumeDMCampaign: (id: string) => void;
  cancelDMCampaign: (id: string) => void;
  approveDMCampaign: (id: string) => void;

  // Audience & Contacts (Eligible Conversations)
  eligibleContacts: EligibleContact[];
  addEligibleContact: (contact: EligibleContact) => void;
  updateEligibleContact: (id: string, updates: Partial<EligibleContact>) => void;
  audienceSegments: AudienceSegment[];
  addAudienceSegment: (segment: AudienceSegment) => void;

  // Message Templates
  messageTemplates: MessageTemplate[];
  addMessageTemplate: (template: MessageTemplate) => void;
  updateMessageTemplate: (id: string, updates: Partial<MessageTemplate>) => void;
  deleteMessageTemplate: (id: string) => void;

  // Scheduled Dispatch Queue
  scheduledMessages: ScheduledMessageItem[];
  cancelScheduledMessage: (id: string) => void;
  dispatchScheduledMessage: (id: string) => Promise<boolean>;
  isQueuePaused: boolean;
  toggleQueuePause: () => void;

  // Opt-Out & Suppression List
  optOutRecords: OptOutRecord[];
  addOptOutRecord: (record: OptOutRecord) => void;
  removeOptOutRecord: (id: string) => void;

  // Compliance Audit Trail
  complianceAudits: ComplianceAuditEntry[];
  addComplianceAudit: (entry: ComplianceAuditEntry) => void;

  // Public Account Research (Separate from messaging recipients)
  researchAccounts: PublicAccountResearchItem[];
  addResearchAccount: (account: PublicAccountResearchItem) => void;
  updateResearchAccount: (id: string, updates: Partial<PublicAccountResearchItem>) => void;
  deleteResearchAccount: (id: string) => void;

  // Metrics
  dmMetrics: DMOverviewMetrics;

  // Posts
  posts: PostItem[];
  addPost: (post: PostItem) => void;
  updatePost: (id: string, updates: Partial<PostItem>) => void;
  retryPost: (id: string) => Promise<boolean>;
  deletePost: (id: string) => void;

  // Social Accounts
  socialAccounts: SocialAccount[];
  connectAccount: (account: Partial<SocialAccount>) => void;
  disconnectAccount: (id: string) => void;
  reauthorizeAccount: (id: string) => void;

  // Media
  mediaAssets: MediaAsset[];
  addMediaAsset: (asset: MediaAsset) => void;
  deleteMediaAsset: (id: string) => void;

  // Inbox
  conversations: InboxConversation[];
  replyToConversation: (conversationId: string, replyText: string) => void;
  toggleResolveConversation: (conversationId: string) => void;
  addInternalNote: (conversationId: string, note: string) => void;

  // Team & Audit
  teamMembers: TeamMember[];
  auditLogs: AuditLogEntry[];

  // Toast / Feedback
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function cleanForFirestore<T extends Record<string, any>>(obj: T): any {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = cleanForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [workspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(INITIAL_WORKSPACES[0]);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [events] = useState<FirmExpoEvent[]>(FIRM_EXPO_EVENTS);

  // Firebase Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // DM Campaigns State
  const [dmCampaigns, setDMCampaigns] = useState<DMCampaign[]>(() => {
    const saved = localStorage.getItem('firmexpo_dm_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_DM_CAMPAIGNS;
  });

  const [eligibleContacts, setEligibleContacts] = useState<EligibleContact[]>(() => {
    const saved = localStorage.getItem('firmexpo_dm_contacts');
    return saved ? JSON.parse(saved) : INITIAL_ELIGIBLE_CONTACTS;
  });

  const [audienceSegments, setAudienceSegments] = useState<AudienceSegment[]>(() => {
    const saved = localStorage.getItem('firmexpo_dm_segments');
    return saved ? JSON.parse(saved) : INITIAL_AUDIENCE_SEGMENTS;
  });

  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(() => {
    const saved = localStorage.getItem('firmexpo_dm_templates');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGE_TEMPLATES;
  });

  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessageItem[]>(() => {
    const saved = localStorage.getItem('firmexpo_dm_scheduled');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_MESSAGES;
  });

  const [optOutRecords, setOptOutRecords] = useState<OptOutRecord[]>(() => {
    const saved = localStorage.getItem('firmexpo_dm_optouts');
    return saved ? JSON.parse(saved) : INITIAL_OPT_OUTS;
  });

  const [complianceAudits, setComplianceAudits] = useState<ComplianceAuditEntry[]>(() => {
    const saved = localStorage.getItem('firmexpo_dm_audits');
    return saved ? JSON.parse(saved) : INITIAL_COMPLIANCE_AUDIT;
  });

  const [researchAccounts, setResearchAccounts] = useState<PublicAccountResearchItem[]>(() => {
    const saved = localStorage.getItem('firmexpo_dm_research');
    return saved ? JSON.parse(saved) : INITIAL_RESEARCH_ACCOUNTS;
  });

  const [isQueuePaused, setIsQueuePaused] = useState<boolean>(false);
  const [dmMetrics, setDMMetrics] = useState<DMOverviewMetrics>(INITIAL_DM_METRICS);

  // Traditional campaigns & posts
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('firmexpo_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [posts, setPosts] = useState<PostItem[]>(() => {
    const saved = localStorage.getItem('firmexpo_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(() => {
    const saved = localStorage.getItem('firmexpo_accounts');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_ACCOUNTS;
  });

  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    const saved = localStorage.getItem('firmexpo_media');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_ASSETS;
  });

  const [conversations, setConversations] = useState<InboxConversation[]>(() => {
    const saved = localStorage.getItem('firmexpo_inbox');
    return saved ? JSON.parse(saved) : INITIAL_INBOX_CONVERSATIONS;
  });

  const [teamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) {
        showToast(`Connected to Firebase as ${currentUser.displayName || currentUser.email}`, 'success');
      }
    });
    return () => unsubscribe();
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('firmexpo_dm_campaigns', JSON.stringify(dmCampaigns));
  }, [dmCampaigns]);

  useEffect(() => {
    localStorage.setItem('firmexpo_dm_contacts', JSON.stringify(eligibleContacts));
  }, [eligibleContacts]);

  useEffect(() => {
    localStorage.setItem('firmexpo_dm_segments', JSON.stringify(audienceSegments));
  }, [audienceSegments]);

  useEffect(() => {
    localStorage.setItem('firmexpo_dm_templates', JSON.stringify(messageTemplates));
  }, [messageTemplates]);

  useEffect(() => {
    localStorage.setItem('firmexpo_dm_scheduled', JSON.stringify(scheduledMessages));
  }, [scheduledMessages]);

  useEffect(() => {
    localStorage.setItem('firmexpo_dm_optouts', JSON.stringify(optOutRecords));
  }, [optOutRecords]);

  useEffect(() => {
    localStorage.setItem('firmexpo_dm_audits', JSON.stringify(complianceAudits));
  }, [complianceAudits]);

  useEffect(() => {
    localStorage.setItem('firmexpo_dm_research', JSON.stringify(researchAccounts));
  }, [researchAccounts]);

  useEffect(() => {
    localStorage.setItem('firmexpo_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('firmexpo_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('firmexpo_accounts', JSON.stringify(socialAccounts));
  }, [socialAccounts]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      showToast(error.message || 'Google Sign-In failed', 'error');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      showToast('Signed out of Firebase', 'info');
    } catch (error: any) {
      console.error('Sign out failed:', error);
    }
  };

  // DM Campaign Handlers
  const addDMCampaign = (campaign: DMCampaign) => {
    setDMCampaigns(prev => [campaign, ...prev]);
    addComplianceAudit({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'CAMPAIGN_CREATED',
      actor: user?.displayName || 'Sarah Chen',
      targetType: 'campaign',
      targetId: campaign.id,
      status: 'passed',
      policyRule: 'Meta Messaging Campaign Policy',
      details: `Created DM campaign "${campaign.name}" for ${campaign.platform.toUpperCase()} with ${campaign.stats.eligibleCount} eligible contacts.`
    });
    showToast(`DM Campaign "${campaign.name}" configured successfully!`, 'success');
  };

  const updateDMCampaign = (id: string, updates: Partial<DMCampaign>) => {
    setDMCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    showToast('Campaign updated successfully', 'success');
  };

  const pauseDMCampaign = (id: string) => {
    setDMCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'paused', updatedAt: new Date().toISOString() } : c));
    showToast('Campaign dispatch paused', 'info');
  };

  const resumeDMCampaign = (id: string) => {
    setDMCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'running', updatedAt: new Date().toISOString() } : c));
    showToast('Campaign dispatch resumed', 'success');
  };

  const cancelDMCampaign = (id: string) => {
    setDMCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'cancelled', updatedAt: new Date().toISOString() } : c));
    setScheduledMessages(prev => prev.map(s => s.campaignId === id && s.status === 'pending' ? { ...s, status: 'cancelled' } : s));
    showToast('Campaign cancelled and remaining queued messages withdrawn', 'info');
  };

  const approveDMCampaign = (id: string) => {
    setDMCampaigns(prev => prev.map(c => c.id === id ? {
      ...c,
      status: 'approved',
      approvedBy: {
        id: user?.uid || 'usr-reviewer',
        name: user?.displayName || 'Reviewer Team',
        approvedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    } : c));
    showToast('Campaign approved for scheduled transmission', 'success');
  };

  // Contacts Handlers
  const addEligibleContact = (contact: EligibleContact) => {
    setEligibleContacts(prev => [contact, ...prev]);
    showToast(`Added contact ${contact.displayName}`, 'success');
  };

  const updateEligibleContact = (id: string, updates: Partial<EligibleContact>) => {
    setEligibleContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Contact updated', 'info');
  };

  const addAudienceSegment = (segment: AudienceSegment) => {
    setAudienceSegments(prev => [segment, ...prev]);
    showToast(`Audience segment "${segment.name}" created`, 'success');
  };

  // Message Templates Handlers
  const addMessageTemplate = (template: MessageTemplate) => {
    setMessageTemplates(prev => [template, ...prev]);
    showToast(`Template "${template.name}" added to approved library`, 'success');
  };

  const updateMessageTemplate = (id: string, updates: Partial<MessageTemplate>) => {
    setMessageTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    showToast('Template updated', 'success');
  };

  const deleteMessageTemplate = (id: string) => {
    setMessageTemplates(prev => prev.filter(t => t.id !== id));
    showToast('Template archived', 'info');
  };

  // Scheduled Queue
  const cancelScheduledMessage = (id: string) => {
    setScheduledMessages(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
    showToast('Scheduled message cancelled', 'info');
  };

  const dispatchScheduledMessage = async (id: string): Promise<boolean> => {
    const item = scheduledMessages.find(s => s.id === id);
    if (!item) return false;

    const contact = eligibleContacts.find(c => c.id === item.contactId);
    showToast(`Re-validating 24h eligibility for ${item.recipientName}...`, 'info');

    const result = await MessageDispatcher.dispatch(
      item,
      contact,
      optOutRecords,
      'EAABw...sample_token',
      isDemoMode
    );

    if (result.success) {
      setScheduledMessages(prev => prev.map(s => s.id === id ? {
        ...s,
        status: 'dispatched',
        eligibilityRechecked: true,
        eligibilityPassed: true,
        dispatchedAt: result.dispatchedAt
      } : s));
      showToast(`Dispatched message to ${item.recipientName}!`, 'success');
      return true;
    } else {
      setScheduledMessages(prev => prev.map(s => s.id === id ? {
        ...s,
        status: result.status,
        eligibilityRechecked: true,
        eligibilityPassed: false,
        failureReason: result.error
      } : s));
      showToast(`Dispatch halted: ${result.error}`, 'error');
      return false;
    }
  };

  const toggleQueuePause = () => {
    setIsQueuePaused(prev => {
      const next = !prev;
      showToast(next ? 'Scheduled queue globally paused' : 'Scheduled queue resumed', 'info');
      return next;
    });
  };

  // Opt-out Handlers
  const addOptOutRecord = (record: OptOutRecord) => {
    setOptOutRecords(prev => [record, ...prev]);
    // Suppress contact immediately
    setEligibleContacts(prev => prev.map(c => {
      if (c.platform === record.platform && c.platformRecipientId === record.recipientIdentifier) {
        return {
          ...c,
          isOptedOut: true,
          eligibilityStatus: 'opted_out',
          ineligibilityReason: `Suppressed: ${record.reason}`
        };
      }
      return c;
    }));
    addComplianceAudit({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'SUPPRESSION_RECORD_CREATED',
      actor: user?.displayName || 'System Admin',
      targetType: 'opt_out',
      targetId: record.id,
      status: 'passed',
      policyRule: 'Meta Commercial Opt-Out Regulation',
      details: `Added ${record.displayName} (${record.recipientIdentifier}) to suppression list. Reason: ${record.reason}`
    });
    showToast(`Recipient suppressed: ${record.displayName}`, 'info');
  };

  const removeOptOutRecord = (id: string) => {
    setOptOutRecords(prev => prev.filter(r => r.id !== id));
    showToast('Suppression record removed after compliance audit', 'info');
  };

  // Compliance Audit
  const addComplianceAudit = (entry: ComplianceAuditEntry) => {
    setComplianceAudits(prev => [entry, ...prev]);
  };

  // Public Account Research Handlers
  const addResearchAccount = (account: PublicAccountResearchItem) => {
    setResearchAccounts(prev => [account, ...prev]);
    showToast(`Saved @${account.username} to business research dossier`, 'success');
  };

  const updateResearchAccount = (id: string, updates: Partial<PublicAccountResearchItem>) => {
    setResearchAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    showToast('Research dossier updated', 'success');
  };

  const deleteResearchAccount = (id: string) => {
    setResearchAccounts(prev => prev.filter(a => a.id !== id));
    showToast('Research entry removed', 'info');
  };

  // Traditional campaign methods (existing)
  const addCampaign = (c: Campaign) => setCampaigns(prev => [c, ...prev]);
  const updateCampaign = (id: string, u: Partial<Campaign>) => setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...u } : c));
  const duplicateCampaign = (id: string) => {
    const existing = campaigns.find(c => c.id === id);
    if (!existing) return;
    setCampaigns(prev => [{ ...existing, id: `cmp-${Date.now()}`, name: `${existing.name} (Copy)` }, ...prev]);
  };
  const deleteCampaign = (id: string) => setCampaigns(prev => prev.filter(c => c.id !== id));
  const togglePauseCampaign = (id: string) => setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'paused' ? 'published' : 'paused' } : c));

  // Traditional post methods
  const addPost = (p: PostItem) => setPosts(prev => [p, ...prev]);
  const updatePost = (id: string, u: Partial<PostItem>) => setPosts(prev => prev.map(p => p.id === id ? { ...p, ...u } : p));
  const retryPost = async (id: string) => true;
  const deletePost = (id: string) => setPosts(prev => prev.filter(p => p.id !== id));

  // Accounts
  const connectAccount = (acc: Partial<SocialAccount>) => {};
  const disconnectAccount = (id: string) => {};
  const reauthorizeAccount = (id: string) => {};

  // Media
  const addMediaAsset = (m: MediaAsset) => setMediaAssets(prev => [m, ...prev]);
  const deleteMediaAsset = (id: string) => setMediaAssets(prev => prev.filter(m => m.id !== id));

  // Inbox
  const replyToConversation = (id: string, text: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === id) {
        return {
          ...conv,
          messages: [...conv.messages, {
            id: `msg-${Date.now()}`,
            senderId: 'agent',
            senderType: 'agent',
            text,
            timestamp: 'Just now'
          }]
        };
      }
      return conv;
    }));
    showToast('Reply dispatched via Meta Send API', 'success');
  };

  const toggleResolveConversation = (id: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, isResolved: !c.isResolved } : c));
  };

  const addInternalNote = (id: string, note: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, internalNotes: [...(c.internalNotes || []), note] } : c));
    showToast('Internal note saved', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        isDemoMode,
        setIsDemoMode,
        user,
        isAuthReady,
        isSyncing,
        loginWithGoogle,
        logout,
        isDarkMode,
        toggleDarkMode,
        events,
        campaigns,
        addCampaign,
        updateCampaign,
        duplicateCampaign,
        deleteCampaign,
        togglePauseCampaign,
        dmCampaigns,
        addDMCampaign,
        updateDMCampaign,
        pauseDMCampaign,
        resumeDMCampaign,
        cancelDMCampaign,
        approveDMCampaign,
        eligibleContacts,
        addEligibleContact,
        updateEligibleContact,
        audienceSegments,
        addAudienceSegment,
        messageTemplates,
        addMessageTemplate,
        updateMessageTemplate,
        deleteMessageTemplate,
        scheduledMessages,
        cancelScheduledMessage,
        dispatchScheduledMessage,
        isQueuePaused,
        toggleQueuePause,
        optOutRecords,
        addOptOutRecord,
        removeOptOutRecord,
        complianceAudits,
        addComplianceAudit,
        researchAccounts,
        addResearchAccount,
        updateResearchAccount,
        deleteResearchAccount,
        dmMetrics,
        posts,
        addPost,
        updatePost,
        retryPost,
        deletePost,
        socialAccounts,
        connectAccount,
        disconnectAccount,
        reauthorizeAccount,
        mediaAssets,
        addMediaAsset,
        deleteMediaAsset,
        conversations,
        replyToConversation,
        toggleResolveConversation,
        addInternalNote,
        teamMembers,
        auditLogs,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
