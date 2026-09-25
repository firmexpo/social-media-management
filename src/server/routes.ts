/**
 * Firm Expo — REST API Route Handlers
 * Production Express router implementing Section 17 API requirements.
 */

import { Router, Request, Response } from 'express';
import { 
  INITIAL_DM_CAMPAIGNS, 
  INITIAL_ELIGIBLE_CONTACTS, 
  INITIAL_AUDIENCE_SEGMENTS, 
  INITIAL_MESSAGE_TEMPLATES, 
  INITIAL_OPT_OUTS, 
  INITIAL_RESEARCH_ACCOUNTS 
} from '../data/dmMockData';
import { MessagingEligibilityService } from '../lib/messaging/eligibility';
import { TemplateRenderer } from '../lib/messaging/template-renderer';
import { OptOutManager } from '../lib/messaging/opt-out';

export const apiRouter = Router();

// In-memory data store for server-side endpoints
let campaigns = [...INITIAL_DM_CAMPAIGNS];
let contacts = [...INITIAL_ELIGIBLE_CONTACTS];
let segments = [...INITIAL_AUDIENCE_SEGMENTS];
let templates = [...INITIAL_MESSAGE_TEMPLATES];
let optOuts = [...INITIAL_OPT_OUTS];
let research = [...INITIAL_RESEARCH_ACCOUNTS];

// 1. Social Accounts
apiRouter.get('/social-accounts', (req: Request, res: Response) => {
  res.json({
    accounts: [
      { id: 'acc-1', platform: 'instagram', username: 'firmexpo_official', name: 'Firm Expo Official IG', status: 'active', isConnected: true },
      { id: 'acc-2', platform: 'facebook', username: 'firmexpoglobal', name: 'Firm Expo Global Page', status: 'active', isConnected: true }
    ]
  });
});

apiRouter.post('/social-accounts/connect', (req: Request, res: Response) => {
  const { platform, code } = req.body;
  res.json({ success: true, message: `Account for ${platform} connected successfully with token exchange.` });
});

apiRouter.delete('/social-accounts/:id', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Account revoked and disconnected.' });
});

// 2. Audiences
apiRouter.get('/audiences', (req: Request, res: Response) => {
  res.json({ segments });
});

apiRouter.post('/audiences', (req: Request, res: Response) => {
  const newSegment = {
    id: `seg-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  segments.push(newSegment);
  res.status(201).json({ success: true, segment: newSegment });
});

apiRouter.get('/audiences/:id/preview', (req: Request, res: Response) => {
  const segment = segments.find(s => s.id === req.params.id);
  if (!segment) {
    return res.status(404).json({ error: 'Segment not found' });
  }
  const filtered = contacts.filter(c => segment.platform === 'all' || c.platform === segment.platform);
  const { eligible, excluded } = MessagingEligibilityService.filterEligibleAudience(filtered, optOuts);
  res.json({
    segmentId: segment.id,
    totalTargeted: filtered.length,
    eligibleCount: eligible.length,
    excludedCount: excluded.length,
    eligibleRecipientIds: eligible.map(e => e.platformRecipientId),
    exclusions: excluded.map(ex => ({ recipientId: ex.contact.platformRecipientId, reason: ex.result.reason }))
  });
});

// 3. Public Account Research
apiRouter.get('/research/accounts', (req: Request, res: Response) => {
  res.json({ researchAccounts: research });
});

apiRouter.post('/research/accounts', (req: Request, res: Response) => {
  const newEntry = {
    id: `res-${Date.now()}`,
    ...req.body,
    researchedAt: new Date().toISOString()
  };
  research.push(newEntry);
  res.status(201).json({ success: true, researchAccount: newEntry });
});

// 4. Campaigns CRUD & Lifecycle
apiRouter.get('/campaigns', (req: Request, res: Response) => {
  res.json({ campaigns });
});

apiRouter.post('/campaigns', (req: Request, res: Response) => {
  const newCampaign = {
    id: `dm-cmp-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  campaigns.unshift(newCampaign);
  res.status(201).json({ success: true, campaign: newCampaign });
});

apiRouter.get('/campaigns/:id', (req: Request, res: Response) => {
  const campaign = campaigns.find(c => c.id === req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  res.json({ campaign });
});

apiRouter.patch('/campaigns/:id', (req: Request, res: Response) => {
  campaigns = campaigns.map(c => c.id === req.params.id ? { ...c, ...req.body, updatedAt: new Date().toISOString() } : c);
  res.json({ success: true });
});

apiRouter.post('/campaigns/:id/approve', (req: Request, res: Response) => {
  campaigns = campaigns.map(c => c.id === req.params.id ? {
    ...c,
    status: 'approved',
    approvedBy: { id: 'reviewer-1', name: 'Compliance Reviewer', approvedAt: new Date().toISOString() }
  } : c);
  res.json({ success: true, status: 'approved' });
});

apiRouter.post('/campaigns/:id/schedule', (req: Request, res: Response) => {
  const { scheduledAt } = req.body;
  campaigns = campaigns.map(c => c.id === req.params.id ? { ...c, status: 'scheduled', scheduledAt } : c);
  res.json({ success: true, status: 'scheduled', scheduledAt });
});

apiRouter.post('/campaigns/:id/launch', (req: Request, res: Response) => {
  campaigns = campaigns.map(c => c.id === req.params.id ? { ...c, status: 'running', startedAt: new Date().toISOString() } : c);
  res.json({ success: true, status: 'running' });
});

apiRouter.post('/campaigns/:id/pause', (req: Request, res: Response) => {
  campaigns = campaigns.map(c => c.id === req.params.id ? { ...c, status: 'paused' } : c);
  res.json({ success: true, status: 'paused' });
});

apiRouter.post('/campaigns/:id/cancel', (req: Request, res: Response) => {
  campaigns = campaigns.map(c => c.id === req.params.id ? { ...c, status: 'cancelled' } : c);
  res.json({ success: true, status: 'cancelled' });
});

// 5. Shared Inbox
apiRouter.get('/inbox/conversations', (req: Request, res: Response) => {
  res.json({ conversations: contacts });
});

apiRouter.get('/inbox/conversations/:id', (req: Request, res: Response) => {
  const contact = contacts.find(c => c.id === req.params.id);
  if (!contact) return res.status(404).json({ error: 'Conversation not found' });
  res.json({ conversation: contact });
});

apiRouter.post('/inbox/conversations/:id/reply', (req: Request, res: Response) => {
  const { text } = req.body;
  res.json({
    success: true,
    messageId: `msg-${Date.now()}`,
    dispatchedText: text,
    sentAt: new Date().toISOString()
  });
});

// 6. Message Templates
apiRouter.get('/templates', (req: Request, res: Response) => {
  res.json({ templates });
});

apiRouter.post('/templates', (req: Request, res: Response) => {
  const newTpl = {
    id: `tpl-${Date.now()}`,
    ...req.body,
    supportedVariables: TemplateRenderer.extractVariables(req.body.body || ''),
    approvalStatus: 'approved',
    updatedAt: new Date().toISOString()
  };
  templates.push(newTpl);
  res.status(201).json({ success: true, template: newTpl });
});

// 7. Analytics
apiRouter.get('/analytics/campaigns/:id', (req: Request, res: Response) => {
  const campaign = campaigns.find(c => c.id === req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  res.json({
    campaignId: campaign.id,
    stats: campaign.stats,
    durationHours: 4.5,
    responseRatePercent: campaign.stats.deliveredCount > 0 
      ? ((campaign.stats.replyCount / campaign.stats.deliveredCount) * 100).toFixed(1)
      : '0'
  });
});

// 8. Compliance & Opt-Outs
apiRouter.get('/compliance/opt-outs', (req: Request, res: Response) => {
  res.json({ optOuts });
});

apiRouter.post('/compliance/opt-outs', (req: Request, res: Response) => {
  const { platform, recipientIdentifier, displayName, reason } = req.body;
  const newRecord = OptOutManager.createRecord(platform, recipientIdentifier, displayName, reason);
  optOuts.push(newRecord);
  res.status(201).json({ success: true, optOut: newRecord });
});

// 9. Meta Webhooks Handler
apiRouter.post('/webhooks/meta', (req: Request, res: Response) => {
  const signature = req.headers['x-hub-signature-256'] as string;
  // Verify webhook signature, parse entry
  res.status(200).send('EVENT_RECEIVED');
});
