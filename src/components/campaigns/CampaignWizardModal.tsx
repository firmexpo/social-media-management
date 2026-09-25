import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Image as ImageIcon, 
  Share2, 
  Layers, 
  Globe2, 
  AlertCircle, 
  CheckCircle2,
  X,
  FileText,
  Hash,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  MoreHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CampaignObjective, Platform, PostFormat } from '../../types';

export const CampaignWizardModal: React.FC = () => {
  const { 
    events, 
    socialAccounts, 
    mediaAssets, 
    addCampaign, 
    addPost, 
    setCurrentTab, 
    isDarkMode, 
    showToast 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState<CampaignObjective>('event_promotion');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');

  // Step 2: Platforms & Accounts
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['instagram', 'facebook']);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(
    socialAccounts.filter(a => a.isConnected).map(a => a.id)
  );

  // Step 3: Content
  const [caption, setCaption] = useState(
    'We are thrilled to announce that Firm Expo will feature 800+ global brands and industrial innovators at our upcoming showcase! Secure your accredited visitor pass today.\n\n#FirmExpo #TradeSummit #GlobalBusiness #Exhibitions2026'
  );
  const [firstComment, setFirstComment] = useState('#ExpoDubai #TradeShow #CorporateInnovation');
  const [aiDraftPrompt, setAiDraftPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Step 4: Media
  const [selectedMediaId, setSelectedMediaId] = useState<string>(mediaAssets[0]?.id || '');
  const [altText, setAltText] = useState('Delegates meeting at the exhibition venue entrance');

  // Step 5: Schedule
  const [scheduleType, setScheduleType] = useState<'immediate' | 'scheduled' | 'draft'>('scheduled');
  const [scheduledDate, setScheduledDate] = useState('2026-10-02');
  const [scheduledTime, setScheduledTime] = useState('14:30');
  const [timezone, setTimezone] = useState('UTC+04:00 (Dubai)');

  // Step 6: Confirmation
  const [reviewedApproved, setReviewedApproved] = useState(false);

  // Preview Mode
  const [previewPlatform, setPreviewPlatform] = useState<Platform>('instagram');

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const selectedMedia = mediaAssets.find(m => m.id === selectedMediaId);

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const toggleAccount = (accId: string) => {
    if (selectedAccountIds.includes(accId)) {
      if (selectedAccountIds.length > 1) {
        setSelectedAccountIds(selectedAccountIds.filter(id => id !== accId));
      }
    } else {
      setSelectedAccountIds([...selectedAccountIds, accId]);
    }
  };

  const handleAiDraft = (preset?: string) => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      if (preset === 'vip') {
        setCaption(
          `Exclusive invitation: The ${selectedEvent?.name || 'Firm Expo Summit'} is unlocking early executive badge allocations. Network with multinational procurement directors and explore 14 international trade pavilions.\n\nSecure priority access at the link in bio.\n\n#FirmExpo #VIPDelegates #ExecutiveNetworking #GlobalTrade2026`
        );
      } else if (preset === 'speakers') {
        setCaption(
          `Keynote Speaker Lineup Revealed! 🎙️ Join visionary industry leaders at the ${selectedEvent?.name || 'Firm Expo Summit'} as we unpack the next decade of cross-border commerce and digital exhibition technology.\n\nRegister now: firmexpo.com\n\n#Keynote #InnovationSummit #FirmExpo #ThoughtLeadership`
        );
      } else {
        setCaption(
          `Stand registrations are officially live for ${selectedEvent?.name || 'Firm Expo 2026'}. Elevate your brand presence before 60,000+ verified trade buyers and global media delegations.\n\nReserve your exhibition booth today.\n\n#ExhibitorCall #TradeShow #FirmExpo #B2BNetworking`
        );
      }
      setIsGeneratingAi(false);
      showToast('Caption draft generated with Firm Expo marketing tone', 'success');
    }, 600);
  };

  const handleFinalSubmit = () => {
    if (!reviewedApproved && scheduleType !== 'draft') {
      showToast('Please check the confirmation box verifying content compliance', 'error');
      return;
    }

    const newCampaignId = `cmp-${Date.now()}`;
    const scheduledIso = scheduleType === 'immediate' 
      ? new Date().toISOString() 
      : `${scheduledDate}T${scheduledTime}:00Z`;

    // 1. Create Campaign
    addCampaign({
      id: newCampaignId,
      workspaceId: 'ws-firm-expo-main',
      name: name || 'Firm Expo Exhibition Campaign',
      description: description || 'Promotional campaign across Facebook and Instagram.',
      objective,
      firmExpoEventId: selectedEvent?.id,
      firmExpoEventName: selectedEvent?.name,
      targetPlatforms: selectedPlatforms,
      accountIds: selectedAccountIds,
      status: scheduleType === 'immediate' ? 'published' : scheduleType === 'draft' ? 'draft' : 'scheduled',
      startDate: scheduledDate,
      createdBy: {
        id: 'usr-1',
        name: 'Sarah Chen',
        avatar: '/src/assets/images/post_tech_headphones_1790377245788.jpg',
      },
      lastUpdated: new Date().toISOString(),
      postCount: selectedAccountIds.length,
      budget: {
        currency: 'USD',
        total: 5000,
        spent: 0,
      },
      totalReach: scheduleType === 'immediate' ? 1240 : 0,
      totalImpressions: scheduleType === 'immediate' ? 2800 : 0,
      engagementRate: scheduleType === 'immediate' ? 4.9 : 0,
    });

    // 2. Schedule Posts for each selected account
    selectedAccountIds.forEach((accId, idx) => {
      const acc = socialAccounts.find(a => a.id === accId);
      if (!acc) return;

      addPost({
        id: `post-${Date.now()}-${idx}`,
        campaignId: newCampaignId,
        campaignName: name || 'Firm Expo Exhibition Campaign',
        socialAccountId: accId,
        platform: acc.platform,
        format: acc.platform === 'instagram' ? 'instagram_feed' : 'facebook_post',
        caption: caption,
        firstComment: acc.platform === 'instagram' ? firstComment : undefined,
        media: selectedMedia ? [{
          id: `pm-${Date.now()}`,
          url: selectedMedia.url,
          type: selectedMedia.type,
          aspectRatio: selectedMedia.aspectRatio as any || '1:1',
          fileSizeMb: selectedMedia.fileSizeBytes / (1024 * 1024),
          altText: altText,
        }] : [],
        scheduledAt: scheduledIso,
        publishedAt: scheduleType === 'immediate' ? new Date().toISOString() : undefined,
        status: scheduleType === 'immediate' ? 'published' : scheduleType === 'draft' ? 'draft' : 'scheduled',
        externalPostId: scheduleType === 'immediate' ? `meta_${Date.now()}` : undefined,
        permalink: scheduleType === 'immediate' 
          ? (acc.platform === 'instagram' ? 'https://instagram.com/firmexpo' : 'https://facebook.com/firmexpocarnival') 
          : undefined,
      });
    });

    setCurrentTab('campaigns');
  };

  const steps = [
    { num: 1, label: 'Campaign Info' },
    { num: 2, label: 'Target Channels' },
    { num: 3, label: 'Create Content' },
    { num: 4, label: 'Media Selection' },
    { num: 5, label: 'Scheduling' },
    { num: 6, label: 'Review & Publish' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header & Progress Steps */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between pb-4 border-b border-inherit mb-6">
          <div>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Firm Expo Social Campaign Wizard
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              Create & Publish Campaign
            </h1>
          </div>
          <button
            onClick={() => setCurrentTab('campaigns')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar / Stepper */}
        <div className="grid grid-cols-6 gap-2">
          {steps.map(step => (
            <div key={step.num} className="flex flex-col gap-1.5">
              <div className={`h-1.5 rounded-full transition-colors ${
                currentStep >= step.num ? 'bg-indigo-600' : isDarkMode ? 'bg-neutral-800' : 'bg-slate-100'
              }`} />
              <span className={`text-[10px] font-semibold truncate ${
                currentStep === step.num 
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
                  : currentStep > step.num 
                  ? 'text-slate-700 dark:text-neutral-300' 
                  : 'text-slate-400 dark:text-neutral-600'
              }`}>
                {step.num}. {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content Card */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        {/* STEP 1: CAMPAIGN INFO */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold">Step 1: Campaign Information</h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Define the campaign identity and connect it to a Firm Expo global exhibition.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold mb-1">Campaign Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dubai World Trade 2026 — Exhibitor Early Bird Push"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Campaign Description</label>
                <textarea
                  rows={3}
                  placeholder="Summarize the core message, audience focus, and key promotional goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Marketing Objective *</label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value as CampaignObjective)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="brand_awareness">Brand Awareness</option>
                    <option value="event_promotion">Event Promotion & Attendance</option>
                    <option value="product_launch">Product Launch / Pavilion Reveal</option>
                    <option value="lead_generation">Lead Generation / Exhibitor Inquiry</option>
                    <option value="website_traffic">Website Registration Traffic</option>
                    <option value="community_engagement">Community Engagement</option>
                    <option value="company_announcement">Official Expo Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Associated Firm Expo Event</label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {events.map(evt => (
                      <option key={evt.id} value={evt.id}>
                        {evt.name} ({evt.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT SOCIAL PLATFORMS */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold">Step 2: Select Social Platforms & Connected Accounts</h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Choose which Meta Graph channels will publish this campaign.
            </p>

            {/* Platform Checkboxes */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div 
                onClick={() => togglePlatform('instagram')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedPlatforms.includes('instagram')
                    ? 'border-pink-500 bg-pink-500/10'
                    : isDarkMode ? 'border-neutral-800 bg-neutral-800/40' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">Instagram</span>
                  <div className={`w-4 h-4 rounded flex items-center justify-center ${
                    selectedPlatforms.includes('instagram') ? 'bg-pink-600 text-white' : 'border border-slate-400'
                  }`}>
                    {selectedPlatforms.includes('instagram') && <Check className="w-3 h-3" />}
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Publish to Instagram Feed, Stories, and Reels via Instagram Graph API.
                </p>
              </div>

              <div 
                onClick={() => togglePlatform('facebook')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedPlatforms.includes('facebook')
                    ? 'border-blue-500 bg-blue-500/10'
                    : isDarkMode ? 'border-neutral-800 bg-neutral-800/40' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">Facebook Pages</span>
                  <div className={`w-4 h-4 rounded flex items-center justify-center ${
                    selectedPlatforms.includes('facebook') ? 'bg-blue-600 text-white' : 'border border-slate-400'
                  }`}>
                    {selectedPlatforms.includes('facebook') && <Check className="w-3 h-3" />}
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Publish directly to authorized Facebook Pages feed and photo albums.
                </p>
              </div>
            </div>

            {/* Connected Accounts Selector */}
            <div className="pt-4">
              <label className="block text-xs font-semibold mb-2">Select Connected Profiles:</label>
              <div className="space-y-2">
                {socialAccounts.filter(a => a.isConnected).map(acc => (
                  <div 
                    key={acc.id}
                    onClick={() => toggleAccount(acc.id)}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                      selectedAccountIds.includes(acc.id)
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                        : isDarkMode ? 'border-neutral-800' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={acc.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-xs">{acc.name}</div>
                        <div className="text-[11px] text-slate-500 capitalize">
                          {acc.platform} · @{acc.username} · {acc.followersCount.toLocaleString()} followers
                        </div>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded flex items-center justify-center ${
                      selectedAccountIds.includes(acc.id) ? 'bg-indigo-600 text-white' : 'border border-slate-400'
                    }`}>
                      {selectedAccountIds.includes(acc.id) && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CREATE CONTENT & AI DRAFTER */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold">Step 3: Create Campaign Content & Captions</h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Draft compelling copy with optional AI presets and live preview.
            </p>

            {/* AI Assistant Banner */}
            <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isDarkMode ? 'bg-indigo-950/30 border-indigo-800/40' : 'bg-indigo-50/70 border-indigo-100'
            }`}>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-indigo-950 dark:text-indigo-200">AI Campaign Copy Generator:</span>
                  <p className="text-indigo-800 dark:text-indigo-300 text-[11px]">Generate high-converting exhibition copy tailored for trade audiences</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleAiDraft('default')}
                  disabled={isGeneratingAi}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white dark:bg-neutral-800 border border-indigo-200 dark:border-neutral-700 hover:bg-indigo-100 dark:hover:bg-neutral-700 transition-colors shadow-2xs"
                >
                  Exhibitor Pitch
                </button>
                <button
                  type="button"
                  onClick={() => handleAiDraft('vip')}
                  disabled={isGeneratingAi}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white dark:bg-neutral-800 border border-indigo-200 dark:border-neutral-700 hover:bg-indigo-100 dark:hover:bg-neutral-700 transition-colors shadow-2xs"
                >
                  VIP Invitation
                </button>
                <button
                  type="button"
                  onClick={() => handleAiDraft('speakers')}
                  disabled={isGeneratingAi}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white dark:bg-neutral-800 border border-indigo-200 dark:border-neutral-700 hover:bg-indigo-100 dark:hover:bg-neutral-700 transition-colors shadow-2xs"
                >
                  Keynotes Reveal
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Editor */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold">Post Caption</label>
                    <span className={`text-[11px] tabular-nums ${
                      caption.length > 2200 ? 'text-red-500 font-bold' : 'text-slate-400'
                    }`}>
                      {caption.length} / 2,200 chars
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none leading-relaxed ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Instagram First Comment (Hashtags)</label>
                  <input
                    type="text"
                    value={firstComment}
                    onChange={(e) => setFirstComment(e.target.value)}
                    placeholder="#FirmExpo #TradeShow #Dubai2026"
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Automatically publishes in the 1st comment to keep the main caption clean.
                  </p>
                </div>
              </div>

              {/* Live Preview Mockup */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">Live Feed Mockup:</span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setPreviewPlatform('instagram')}
                      className={`px-2 py-0.5 rounded ${previewPlatform === 'instagram' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400'}`}
                    >
                      Instagram
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewPlatform('facebook')}
                      className={`px-2 py-0.5 rounded ${previewPlatform === 'facebook' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
                    >
                      Facebook
                    </button>
                  </div>
                </div>

                {/* Smartphone Card Mockup */}
                <div className={`p-3 rounded-xl border max-w-sm mx-auto shadow-sm ${
                  isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-slate-200'
                }`}>
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-inherit">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5">
                        <img 
                          src="/src/assets/images/post_tech_headphones_1790377245788.jpg" 
                          alt="" 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold block leading-none">firmexpo</span>
                        <span className="text-[10px] text-slate-400">Sponsored · Global Expo</span>
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Mockup Media */}
                  <div className="aspect-square bg-slate-100 dark:bg-neutral-850 rounded-lg overflow-hidden my-2">
                    {selectedMedia ? (
                      <img src={selectedMedia.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Mockup Action Icons */}
                  <div className="flex items-center justify-between py-1 text-slate-700 dark:text-neutral-300">
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4" />
                      <MessageCircle className="w-4 h-4" />
                      <Send className="w-4 h-4" />
                    </div>
                    <Bookmark className="w-4 h-4" />
                  </div>

                  {/* Caption preview */}
                  <div className="text-[11px] pt-1">
                    <span className="font-bold mr-1">firmexpo</span>
                    <span className="text-slate-600 dark:text-neutral-300 whitespace-pre-line line-clamp-3">
                      {caption}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: MEDIA SELECTION */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold">Step 4: Select Exhibition Media & Creatives</h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Select verified images or videos from the Firm Expo Asset Vault. Meets Meta Graph v22.0 requirements.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {mediaAssets.map(asset => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedMediaId(asset.id)}
                  className={`relative rounded-xl border overflow-hidden cursor-pointer group transition-all ${
                    selectedMediaId === asset.id
                      ? 'ring-2 ring-indigo-600 border-transparent shadow-md'
                      : 'border-slate-200 dark:border-neutral-800'
                  }`}
                >
                  <img src={asset.url} alt={asset.name} className="w-full aspect-square object-cover" />
                  <div className="p-2 text-xs">
                    <p className="font-semibold truncate">{asset.name}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{asset.dimensions}</span>
                      <span>{(asset.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                    </div>
                  </div>
                  {selectedMediaId === asset.id && (
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1 shadow-sm">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold mb-1">Accessibility Alternative Text (Alt Text)</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Descriptive text for screen readers..."
                className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>
          </div>
        )}

        {/* STEP 5: SCHEDULING */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold">Step 5: Publishing Schedule</h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Set automated publishing times or launch immediately to connected Meta accounts.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div
                onClick={() => setScheduleType('scheduled')}
                className={`p-4 rounded-xl border cursor-pointer ${
                  scheduleType === 'scheduled'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                    : isDarkMode ? 'border-neutral-800' : 'border-slate-200'
                }`}
              >
                <Clock className="w-5 h-5 text-indigo-600 mb-2" />
                <h3 className="font-bold text-xs">Schedule Future Post</h3>
                <p className="text-[11px] text-slate-500 mt-1">Automated dispatch at peak engagement time</p>
              </div>

              <div
                onClick={() => setScheduleType('immediate')}
                className={`p-4 rounded-xl border cursor-pointer ${
                  scheduleType === 'immediate'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                    : isDarkMode ? 'border-neutral-800' : 'border-slate-200'
                }`}
              >
                <Send className="w-5 h-5 text-indigo-600 mb-2" />
                <h3 className="font-bold text-xs">Publish Immediately</h3>
                <p className="text-[11px] text-slate-500 mt-1">Send to Meta Graph API right now</p>
              </div>

              <div
                onClick={() => setScheduleType('draft')}
                className={`p-4 rounded-xl border cursor-pointer ${
                  scheduleType === 'draft'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                    : isDarkMode ? 'border-neutral-800' : 'border-slate-200'
                }`}
              >
                <FileText className="w-5 h-5 text-indigo-600 mb-2" />
                <h3 className="font-bold text-xs">Save as Draft</h3>
                <p className="text-[11px] text-slate-500 mt-1">Store for team review and approval</p>
              </div>
            </div>

            {scheduleType === 'scheduled' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-700">
                <div>
                  <label className="block text-xs font-semibold mb-1">Target Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-neutral-900 border-slate-300 dark:border-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Target Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-neutral-900 border-slate-300 dark:border-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-neutral-900 border-slate-300 dark:border-neutral-700"
                  >
                    <option>UTC+04:00 (Dubai / GST)</option>
                    <option>UTC+01:00 (Paris, Munich / CET)</option>
                    <option>UTC+09:00 (Tokyo / JST)</option>
                    <option>UTC-05:00 (New York / EST)</option>
                    <option>UTC+00:00 (London / GMT)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: REVIEW & CONFIRMATION */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold">Step 6: Review & Confirmation</h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Verify your campaign payload prior to scheduling with Meta Graph API.
            </p>

            <div className="p-4 rounded-xl border border-inherit space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-3 border-b border-inherit">
                <div>
                  <span className="text-slate-400 font-medium">Campaign</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{name || 'Firm Expo Campaign'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Associated Event</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedEvent?.name}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Accounts ({selectedAccountIds.length})</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedPlatforms.join(', ').toUpperCase()}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Dispatch Mode</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5 capitalize">{scheduleType}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Caption Preview:</span>
                <p className="mt-1 p-3 rounded-lg bg-slate-50 dark:bg-neutral-800/80 leading-relaxed text-slate-700 dark:text-neutral-300">
                  {caption}
                </p>
              </div>

              {selectedMedia && (
                <div className="flex items-center gap-3 pt-1">
                  <img src={selectedMedia.url} alt="" className="w-14 h-14 rounded-lg object-cover" />
                  <div className="text-[11px]">
                    <span className="font-semibold block">{selectedMedia.name}</span>
                    <span className="text-slate-400">{selectedMedia.dimensions} · {selectedMedia.type}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Compliance Confirmation Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reviewedApproved}
                  onChange={(e) => setReviewedApproved(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600 dark:text-neutral-400 leading-tight">
                  I confirm that this content complies with Firm Expo media guidelines and Meta Platform Terms of Service.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-inherit mt-6">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              currentStep === 1 
                ? 'opacity-40 cursor-not-allowed text-slate-400' 
                : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              {scheduleType === 'immediate' ? 'Publish Now to Meta' : scheduleType === 'draft' ? 'Save Draft' : 'Confirm & Schedule Campaign'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
