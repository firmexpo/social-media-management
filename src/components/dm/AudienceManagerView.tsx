import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Tag, 
  Instagram, 
  Facebook, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Layers, 
  Download,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EligibleContact, AudienceSegment, OptInSource, Platform } from '../../types';

export const AudienceManagerView: React.FC = () => {
  const { 
    isDarkMode, 
    eligibleContacts, 
    audienceSegments, 
    addAudienceSegment, 
    addEligibleContact,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'contacts' | 'segments'>('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'instagram' | 'facebook'>('all');
  const [eligibilityFilter, setEligibilityFilter] = useState<'all' | 'eligible' | 'window_expired' | 'opted_out'>('all');
  const [showAddSegmentModal, setShowAddSegmentModal] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');
  const [newSegmentDesc, setNewSegmentDesc] = useState('');

  const filteredContacts = eligibleContacts.filter(c => {
    const matchesSearch = c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = platformFilter === 'all' || c.platform === platformFilter;
    const matchesEligibility = eligibilityFilter === 'all' || c.eligibilityStatus === eligibilityFilter;
    return matchesSearch && matchesPlatform && matchesEligibility;
  });

  const handleCreateSegment = () => {
    if (!newSegmentName.trim()) {
      showToast('Please provide a segment name', 'error');
      return;
    }
    const eligibleCount = filteredContacts.filter(c => c.eligibilityStatus === 'eligible').length;
    const newSeg: AudienceSegment = {
      id: `seg-${Date.now()}`,
      name: newSegmentName,
      description: newSegmentDesc || 'Custom filtered segment of eligible conversations',
      platform: platformFilter,
      filters: {
        tags: [],
        onlyWithin24Hours: true,
        optInSources: ['user_initiated_dm', 'story_reply', 'event_registration_optin']
      },
      totalContactsCount: filteredContacts.length,
      eligibleContactsCount: eligibleCount,
      lastCalculatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    addAudienceSegment(newSeg);
    setShowAddSegmentModal(false);
    setNewSegmentName('');
    setNewSegmentDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Audience & Conversation Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Strict conversation-based audience segmentation. Only verified opt-ins and active 24h contacts are eligible for direct messaging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddSegmentModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Segment</span>
          </button>
        </div>
      </div>

      {/* Critical Platform Policy Directive Callout */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isDarkMode ? 'bg-amber-950/20 border-amber-900/40 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold">
            Zero-Tolerance Anti-Scraping & Follower Extraction Policy
          </p>
          <p className="text-slate-600 dark:text-amber-200/80 leading-relaxed">
            Under Meta Platform Terms, following a public account does <strong>NOT</strong> constitute consent to receive direct messages. Firm Expo strictly excludes arbitrary follower lists. Contacts below represent real users who initiated conversation threads or registered through official Firm Expo opt-in channels.
          </p>
        </div>
      </div>

      {/* Primary Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-inherit pb-2 text-xs">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'contacts'
              ? 'bg-slate-200 dark:bg-neutral-800 text-slate-900 dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Eligible Contacts ({eligibleContacts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('segments')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'segments'
              ? 'bg-slate-200 dark:bg-neutral-800 text-slate-900 dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Saved Segments ({audienceSegments.length})</span>
        </button>
      </div>

      {/* CONTACTS TAB VIEW */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
              {/* Platform Selector */}
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value as any)}
                className={`px-2.5 py-1.5 rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram Direct</option>
                <option value="facebook">Facebook Messenger</option>
              </select>

              {/* Eligibility Filter */}
              <select
                value={eligibilityFilter}
                onChange={(e) => setEligibilityFilter(e.target.value as any)}
                className={`px-2.5 py-1.5 rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <option value="all">All Eligibility States</option>
                <option value="eligible">Eligible (Within 24h)</option>
                <option value="window_expired">Window Expired (&gt;24h)</option>
                <option value="opted_out">Suppressed / Opted Out</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, handle, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>
          </div>

          {/* Contacts Table */}
          <div className={`rounded-xl border overflow-hidden ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-inherit text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-slate-50/50 dark:bg-neutral-850">
                    <th className="py-3 px-3.5">Contact</th>
                    <th className="py-3 px-3.5">Platform</th>
                    <th className="py-3 px-3.5">24h Eligibility</th>
                    <th className="py-3 px-3.5">Opt-In Channel</th>
                    <th className="py-3 px-3.5">Last Interaction</th>
                    <th className="py-3 px-3.5">Assigned Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {filteredContacts.map(contact => (
                    <tr key={contact.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          {contact.avatarUrl ? (
                            <img src={contact.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {contact.displayName[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{contact.displayName}</p>
                            <p className="text-[11px] text-slate-400">@{contact.username}</p>
                            {contact.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {contact.tags.slice(0, 2).map((t, i) => (
                                  <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-1.5 font-medium">
                          {contact.platform === 'instagram' ? (
                            <>
                              <Instagram className="w-3.5 h-3.5 text-pink-500" />
                              <span>Instagram</span>
                            </>
                          ) : (
                            <>
                              <Facebook className="w-3.5 h-3.5 text-blue-500" />
                              <span>Messenger</span>
                            </>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[120px]">
                          ID: {contact.platformRecipientId}
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        {contact.eligibilityStatus === 'eligible' && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Eligible (24h Active)</span>
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">Permitted response window</p>
                          </div>
                        )}
                        {contact.eligibilityStatus === 'window_expired' && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Window Expired</span>
                            </span>
                            <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">Cold DM blocked</p>
                          </div>
                        )}
                        {contact.eligibilityStatus === 'opted_out' && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800">
                              <XCircle className="w-3 h-3 text-red-600" />
                              <span>Suppressed (STOP)</span>
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">User opt-out on file</p>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3.5">
                        <span className="font-medium text-slate-700 dark:text-neutral-300 capitalize">
                          {contact.optInSource.replace(/_/g, ' ')}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(contact.optInTimestamp).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3 px-3.5 text-slate-600 dark:text-neutral-400">
                        {new Date(contact.lastInteractionAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(contact.lastInteractionAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-slate-700 dark:text-neutral-300 font-medium">
                        {contact.assignedTeamMember || 'Unassigned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SAVED SEGMENTS VIEW */}
      {activeTab === 'segments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {audienceSegments.map(seg => (
            <div
              key={seg.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {seg.platform.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Updated {new Date(seg.lastCalculatedAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{seg.name}</h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                  {seg.description}
                </p>

                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs mb-3 ${
                  isDarkMode ? 'bg-neutral-800/50 border-neutral-700' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total In CRM</span>
                    <span className="font-bold text-slate-800 dark:text-white font-mono">{seg.totalContactsCount}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-600 font-semibold block">24h Ready to Message</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-base">
                      {seg.eligibleContactsCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-inherit flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Meta Policy Verified</span>
                <button
                  onClick={() => showToast(`Audience preview generated for ${seg.name}`, 'info')}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Preview Recipient IDs
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Segment Modal */}
      {showAddSegmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-bold">Create New Eligible Audience Segment</h3>
            <p className="text-xs text-slate-500">
              Only contacts who have messaged your account within the last 24 hours will be indexed into active campaign dispatch.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Segment Name</label>
                <input
                  type="text"
                  placeholder="e.g. CleanTech Keynote Inquirers (24h Window)"
                  value={newSegmentName}
                  onChange={(e) => setNewSegmentName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Segment Purpose & Description</label>
                <textarea
                  rows={2}
                  placeholder="Targeting attendees who submitted speaking inquiries..."
                  value={newSegmentDesc}
                  onChange={(e) => setNewSegmentDesc(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-inherit flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setShowAddSegmentModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSegment}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
              >
                Save Segment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
