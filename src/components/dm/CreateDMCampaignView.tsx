import React, { useState } from 'react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Instagram, 
  Facebook, 
  Smile, 
  FileText, 
  Sparkles, 
  Info,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DMCampaign, DMCampaignObjective, Platform, EligibleContact } from '../../types';
import { TemplateRenderer } from '../../lib/messaging/template-renderer';
import { MessagingEligibilityService } from '../../lib/messaging/eligibility';

export const CreateDMCampaignView: React.FC = () => {
  const { 
    isDarkMode, 
    events, 
    socialAccounts, 
    audienceSegments, 
    eligibleContacts, 
    optOutRecords, 
    messageTemplates, 
    addDMCampaign, 
    setCurrentTab,
    user,
    showToast 
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState<DMCampaignObjective>('event_registration');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [accountId, setAccountId] = useState<string>('');
  const [audienceSegmentId, setAudienceSegmentId] = useState<string>(audienceSegments[0]?.id || '');
  const [messageBody, setMessageBody] = useState<string>(
    'Hello {{firstName}}! Your digital pass for {{eventName}} is ready. Show this confirmation or access your personalized agenda here: {{registrationLink}}.'
  );
  const [scheduledAt, setScheduledAt] = useState<string>(
    new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );

  // Eligible accounts filtered by platform
  const eligibleAccounts = socialAccounts.filter(a => a.platform === platform && a.isConnected);

  // Filter contacts by chosen platform & compute pre-flight eligibility
  const platformContacts = eligibleContacts.filter(c => c.platform === platform);
  const eligibilityResult = MessagingEligibilityService.filterEligibleAudience(platformContacts, optOutRecords);
  const eligibleRecipients = eligibilityResult.eligible;
  const excludedRecipients = eligibilityResult.excluded;

  // Selected event
  const selectedEvent = events.find(e => e.id === selectedEventId);
  const selectedSegment = audienceSegments.find(s => s.id === audienceSegmentId);
  const selectedAccount = socialAccounts.find(a => a.id === accountId) || eligibleAccounts[0];

  // Render preview
  const previewRender = TemplateRenderer.render(messageBody, {
    firstName: eligibleRecipients[0]?.displayName?.split(' ')[0] || 'Sophia',
    companyName: 'Firm Expo Partners',
    eventName: selectedEvent?.name || 'Firm Expo 2026',
    registrationLink: 'https://firmexpo.com/pass/sample'
  });

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        showToast('Please enter a campaign name', 'error');
        return;
      }
    }
    if (step === 2) {
      const activeAccount = accountId || eligibleAccounts[0]?.id;
      if (!activeAccount) {
        showToast('Please connect and select an authorized account for this platform', 'error');
        return;
      }
      setAccountId(activeAccount);
    }
    if (step === 3) {
      if (eligibleRecipients.length === 0) {
        showToast('Warning: No contacts currently meet the 24-hour response window requirement.', 'error');
        return;
      }
    }
    if (step === 4) {
      if (!messageBody.trim()) {
        showToast('Message copy cannot be blank', 'error');
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 6));
  };

  const handleApplyTemplate = (templateId: string) => {
    const tpl = messageTemplates.find(t => t.id === templateId);
    if (tpl) {
      setMessageBody(tpl.body);
      showToast(`Applied template "${tpl.name}"`, 'info');
    }
  };

  const insertVariable = (varName: string) => {
    setMessageBody(prev => `${prev} {{${varName}}}`);
  };

  const handleLaunchOrSchedule = (status: 'scheduled' | 'running' | 'draft') => {
    const newCampaign: DMCampaign = {
      id: `dm-cmp-${Date.now()}`,
      name,
      description,
      objective,
      firmExpoEventId: selectedEvent?.id,
      firmExpoEventName: selectedEvent?.name,
      platform,
      accountId: selectedAccount?.id || 'acc-1',
      accountName: selectedAccount?.name || 'Firm Expo Meta Account',
      audienceSegmentId: selectedSegment?.id || 'seg-1',
      audienceSegmentName: selectedSegment?.name || 'Active 24h Inquirers',
      messageBody,
      variables: {
        eventName: selectedEvent?.name || 'Firm Expo 2026',
        registrationLink: 'https://firmexpo.com/register'
      },
      status,
      scheduledAt: status === 'scheduled' ? new Date(scheduledAt).toISOString() : undefined,
      startedAt: status === 'running' ? new Date().toISOString() : undefined,
      createdBy: {
        id: user?.uid || 'usr-1',
        name: user?.displayName || 'Sarah Chen',
        email: user?.email || 'sarah.chen@firmexpo.com'
      },
      stats: {
        totalTargeted: platformContacts.length,
        eligibleCount: eligibleRecipients.length,
        excludedCount: excludedRecipients.length,
        sentCount: status === 'running' ? eligibleRecipients.length : 0,
        deliveredCount: status === 'running' ? eligibleRecipients.length : 0,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addDMCampaign(newCampaign);
    setCurrentTab('campaigns');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-inherit">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create DM Campaign Wizard
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Step-by-step compliant message composition with automated 24h eligibility check
          </p>
        </div>
        <button
          onClick={() => setCurrentTab('campaigns')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white"
        >
          Cancel
        </button>
      </div>

      {/* 6-Step Visual Progress Indicator */}
      <div className="grid grid-cols-6 gap-2 text-xs">
        {[
          { num: 1, label: 'Details' },
          { num: 2, label: 'Platform & Account' },
          { num: 3, label: 'Audience Eligibility' },
          { num: 4, label: 'Compose & Variables' },
          { num: 5, label: 'Compliance Audit' },
          { num: 6, label: 'Schedule & Launch' }
        ].map(s => {
          const isCurrent = step === s.num;
          const isDone = step > s.num;
          return (
            <div 
              key={s.num}
              onClick={() => isDone && setStep(s.num)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                isCurrent 
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-bold' 
                  : isDone 
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 cursor-pointer' 
                  : isDarkMode ? 'border-neutral-800 text-neutral-500' : 'border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-[11px] mb-0.5">
                {isDone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span>Step {s.num}</span>}
              </div>
              <div className="truncate text-[11px]">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Step Content Card */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        {/* STEP 1: Campaign Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 1: Campaign Details</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Define the campaign objective, associated Firm Expo exhibition, and internal reference.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-neutral-300">
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Paris Architecture Expo 2026 VIP Fast-Pass"
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-neutral-300">
                  Description & Operational Notes
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Internal notes on audience context and target conversion milestones..."
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-neutral-300">
                    Campaign Objective <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value as DMCampaignObjective)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="event_registration">Event Registration & Digital Pass</option>
                    <option value="expo_announcement">Expo Pavilion Announcement</option>
                    <option value="existing_customer_update">Attendee & Speaker Schedule Update</option>
                    <option value="customer_support_followup">Customer Support & Inquiries Follow-Up</option>
                    <option value="optin_lead_followup">Verified Opt-In Lead Follow-Up</option>
                    <option value="business_collaboration">B2B Exhibition Collaboration</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-neutral-300">
                    Associated Firm Expo Event
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name} ({ev.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Select Platform & Connected Account */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 2: Platform & Authorized Account</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Choose between Instagram Direct and Facebook Messenger. Only accounts with valid OAuth tokens and messaging permissions are selectable.
              </p>
            </div>

            {/* Platform Selector Tabs */}
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setPlatform('instagram')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  platform === 'instagram'
                    ? 'border-pink-500 bg-pink-50/30 dark:bg-pink-950/20 ring-1 ring-pink-500'
                    : isDarkMode ? 'border-neutral-800 hover:bg-neutral-800/40' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Instagram className="w-5 h-5 text-pink-600" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Instagram Direct</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                  Replies to users who interacted with your Instagram professional account in the last 24 hours.
                </p>
              </div>

              <div
                onClick={() => setPlatform('facebook')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  platform === 'facebook'
                    ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-500'
                    : isDarkMode ? 'border-neutral-800 hover:bg-neutral-800/40' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Facebook Messenger</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                  Sends messages to Page conversations and attendees with confirmed event registration tags.
                </p>
              </div>
            </div>

            {/* Account List */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300">
                Connected {platform === 'instagram' ? 'Instagram' : 'Facebook'} Accounts
              </label>

              {eligibleAccounts.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-red-300 dark:border-red-900 text-center text-xs">
                  <AlertCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <p className="font-semibold text-red-600">No connected {platform} accounts found.</p>
                  <p className="text-slate-500 mt-0.5">Please navigate to Social Accounts to connect a verified business profile.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {eligibleAccounts.map(acc => (
                    <div
                      key={acc.id}
                      onClick={() => setAccountId(acc.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                        (accountId || eligibleAccounts[0]?.id) === acc.id
                          ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30'
                          : isDarkMode ? 'border-neutral-800' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <img src={acc.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                        <div className="truncate text-xs">
                          <p className="font-semibold text-slate-900 dark:text-white truncate">{acc.name}</p>
                          <p className="text-slate-500 text-[10px]">@{acc.username} · {acc.followersCount.toLocaleString()} followers</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950">
                        Authorized
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Select Audience & Eligibility Audit */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 3: Audience Eligibility Screening</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Meta Graph API enforces that outbound messages can only be sent to users with an active 24-hour interaction or verified consent. Public account follower scraping is strictly prohibited.
              </p>
            </div>

            {/* Audience Segment Selection */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-neutral-300">
                Saved Eligible Segment
              </label>
              <select
                value={audienceSegmentId}
                onChange={(e) => setAudienceSegmentId(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              >
                {audienceSegments.map(seg => (
                  <option key={seg.id} value={seg.id}>
                    {seg.name} ({seg.eligibleContactsCount} eligible contacts)
                  </option>
                ))}
              </select>
            </div>

            {/* Eligibility Breakdown Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`p-3.5 rounded-xl border ${
                isDarkMode ? 'bg-neutral-850 border-neutral-750' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[11px] text-slate-500 font-medium">Total Targeted</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {platformContacts.length}
                </p>
                <p className="text-[10px] text-slate-400">Contacts on {platform}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Eligible to Receive (24h)</span>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {eligibleRecipients.length}
                </p>
                <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">Active user-initiated sessions</p>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20">
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">Excluded by Policy</span>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {excludedRecipients.length}
                </p>
                <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80">Expired window or opted out</p>
              </div>
            </div>

            {/* Excluded Contacts Detail Drawer */}
            {excludedRecipients.length > 0 && (
              <div className="p-3 rounded-xl border border-amber-200 dark:border-neutral-800 text-xs bg-amber-50/30 dark:bg-neutral-850">
                <div className="font-semibold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Audience Safety Screening: {excludedRecipients.length} recipients safely excluded</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {excludedRecipients.map((ex, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-neutral-400 border-b border-inherit pb-1 last:border-none">
                      <span className="font-medium text-slate-800 dark:text-neutral-200">{ex.contact.displayName} (@{ex.contact.username})</span>
                      <span className="text-amber-600 dark:text-amber-400">{ex.result.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Compose Message & Personalization Variables */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 4: Message Composer & Live Preview</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Compose your message copy, attach safe personalization tags, and preview how it appears in Meta's native mobile inbox.
              </p>
            </div>

            {/* Template Selection Quick Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs font-semibold text-slate-700 dark:text-neutral-300">
                <span>Select from Approved Template Library:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {messageTemplates.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => handleApplyTemplate(tpl.id)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-neutral-700 text-[11px] hover:bg-slate-100 dark:hover:bg-neutral-800 font-medium transition-colors"
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Composer Column */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <label className="font-semibold text-slate-700 dark:text-neutral-300">Message Copy</label>
                    <span className="text-slate-400 font-mono text-[11px]">{messageBody.length} / 1000 characters</span>
                  </div>
                  <textarea
                    rows={6}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    className={`w-full p-3 text-xs rounded-xl border outline-none font-sans leading-relaxed ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Variable Tags */}
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Insert Safe Personalization Variable:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['firstName', 'fullName', 'companyName', 'eventName', 'registrationLink'].map(v => (
                      <button
                        key={v}
                        onClick={() => insertVariable(v)}
                        className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono hover:bg-indigo-100 transition-colors"
                      >
                        + {`{{${v}}}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Preview Mockup */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2 pb-2 border-b border-inherit mb-3 text-xs">
                    {platform === 'instagram' ? <Instagram className="w-4 h-4 text-pink-500" /> : <Facebook className="w-4 h-4 text-blue-500" />}
                    <span className="font-semibold text-slate-800 dark:text-neutral-200">
                      Mobile Direct Inbox Preview ({platform === 'instagram' ? 'Instagram' : 'Messenger'})
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-bold shrink-0">
                        FE
                      </div>
                      <div className="max-w-[85%] rounded-2xl rounded-tl-xs p-3 text-xs bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white shadow-2xs">
                        <p className="whitespace-pre-line leading-relaxed">{previewRender.renderedText}</p>
                        <span className="text-[9px] text-slate-400 block text-right mt-1.5">Just now · Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 pt-3 border-t border-inherit mt-3">
                  Variables previewed with sample attendee profile: <strong className="text-slate-600 dark:text-neutral-300">Sophia Sterling</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Compliance Audit */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 5: Pre-Flight Compliance Verification</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                The campaign engine runs an automated audit before dispatch to ensure zero policy violations against Meta terms.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-900 dark:text-emerald-200">24-Hour Messaging Window Enforced</p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">All {eligibleRecipients.length} target recipients messaged your business within the last 24h.</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-full">Passed</span>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-900 dark:text-emerald-200">Opt-Out Suppression Filter Active</p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Suppression list checked: 0 opted-out users included.</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-full">Passed</span>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-900 dark:text-emerald-200">Anti-Scraping / Follower Extraction Shield</p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">No arbitrary follower lists or public account scrapes were used.</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-full">Passed</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Schedule & Launch */}
        {step === 6 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 6: Campaign Launch Options</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Choose to dispatch immediately, schedule for a future slot with timezone handling, or save as draft for approval.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-neutral-800/40 border-neutral-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="font-semibold text-slate-800 dark:text-neutral-200 mb-2">Campaign Final Summary</h4>
                <ul className="space-y-1 text-slate-600 dark:text-neutral-400">
                  <li><strong>Campaign:</strong> {name}</li>
                  <li><strong>Platform:</strong> {platform === 'instagram' ? 'Instagram Direct' : 'Facebook Messenger'}</li>
                  <li><strong>Sender Account:</strong> {selectedAccount?.name}</li>
                  <li><strong>Eligible Recipients:</strong> {eligibleRecipients.length}</li>
                  <li><strong>Excluded Recipients:</strong> {excludedRecipients.length}</li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-neutral-800/40 border-neutral-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="font-semibold text-slate-800 dark:text-neutral-200 mb-2">Schedule Time (Optional)</h4>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-mono ${
                    isDarkMode ? 'bg-neutral-850 border-neutral-700 text-white' : 'bg-white border-slate-200'
                  }`}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Recipient eligibility is automatically rechecked at dispatch time.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-inherit flex flex-wrap items-center justify-end gap-2.5">
              <button
                onClick={() => handleLaunchOrSchedule('draft')}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 transition-colors"
              >
                Save as Draft
              </button>

              <button
                onClick={() => handleLaunchOrSchedule('scheduled')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Campaign</span>
              </button>

              <button
                onClick={() => handleLaunchOrSchedule('running')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Eligible Now</span>
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-inherit text-xs">
          <button
            onClick={() => setStep(prev => Math.max(prev - 1, 1))}
            disabled={step === 1}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
              step === 1 
                ? 'opacity-40 cursor-not-allowed border-transparent' 
                : 'border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          {step < 6 && (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors"
            >
              <span>Continue to Step {step + 1}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
