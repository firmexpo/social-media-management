import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Instagram, 
  Globe2, 
  Users, 
  Image as ImageIcon, 
  ExternalLink, 
  Plus, 
  Tag, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Download,
  Building2,
  BookmarkPlus,
  Trash2,
  Heart,
  MessageCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PublicAccountResearchItem } from '../../types';

export const PublicAccountResearchView: React.FC = () => {
  const { 
    isDarkMode, 
    researchAccounts, 
    addResearchAccount, 
    updateResearchAccount, 
    deleteResearchAccount,
    showToast 
  } = useApp();

  const [inputHandle, setInputHandle] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeResearchItem, setActiveResearchItem] = useState<PublicAccountResearchItem | null>(researchAccounts[0] || null);
  const [newNote, setNewNote] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const handle = inputHandle.trim().replace(/^@/, '');
    if (!handle) {
      showToast('Please enter an Instagram professional account username', 'error');
      return;
    }

    setIsSearching(true);
    // Simulate Meta Business Discovery API query
    await new Promise(r => setTimeout(r, 600));

    const simulatedAccount: PublicAccountResearchItem = {
      id: `res-${Date.now()}`,
      username: handle,
      displayName: handle.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      biography: `Official Instagram professional account for ${handle}. Showcasing global exhibition highlights, conference sessions, and pavilion innovations.`,
      website: `https://${handle}.com`,
      followersCount: Math.floor(Math.random() * 80000) + 15000,
      mediaCount: Math.floor(Math.random() * 400) + 50,
      industry: 'Exhibitions & Events',
      collaborationOpportunity: 'Potential co-branded pavilion partner for upcoming Firm Expo global exhibition series.',
      outreachStatus: 'lead_identified',
      internalNotes: [`Researched via Meta Business Discovery API on ${new Date().toLocaleDateString()}`],
      researchedAt: new Date().toISOString(),
      recentMedia: [
        {
          id: `m-${Date.now()}-1`,
          caption: 'Delighted to present our upcoming sustainable exhibition showcases! #Innovations #Expo',
          mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80',
          likeCount: 840,
          commentsCount: 34,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          permalink: `https://instagram.com/${handle}`
        },
        {
          id: `m-${Date.now()}-2`,
          caption: 'Speaker registration announcement for the upcoming fall summit. Link in bio.',
          mediaUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=400&q=80',
          likeCount: 512,
          commentsCount: 19,
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          permalink: `https://instagram.com/${handle}`
        }
      ]
    };

    addResearchAccount(simulatedAccount);
    setActiveResearchItem(simulatedAccount);
    setIsSearching(false);
    setInputHandle('');
    showToast(`Retrieved verified public profile for @${handle}`, 'success');
  };

  const handleAddNote = () => {
    if (!activeResearchItem || !newNote.trim()) return;
    const updatedNotes = [...activeResearchItem.internalNotes, newNote.trim()];
    updateResearchAccount(activeResearchItem.id, { internalNotes: updatedNotes });
    setActiveResearchItem({ ...activeResearchItem, internalNotes: updatedNotes });
    setNewNote('');
    showToast('Internal note saved to partnership dossier', 'success');
  };

  const handleUpdateStatus = (status: PublicAccountResearchItem['outreachStatus']) => {
    if (!activeResearchItem) return;
    updateResearchAccount(activeResearchItem.id, { outreachStatus: status });
    setActiveResearchItem({ ...activeResearchItem, outreachStatus: status });
    showToast(`Outreach status updated to ${status.replace('_', ' ')}`, 'info');
  };

  const handleExportData = () => {
    if (!activeResearchItem) return;
    const exportPayload = {
      username: activeResearchItem.username,
      displayName: activeResearchItem.displayName,
      biography: activeResearchItem.biography,
      website: activeResearchItem.website,
      followersCount: activeResearchItem.followersCount,
      mediaCount: activeResearchItem.mediaCount,
      industry: activeResearchItem.industry,
      collaborationOpportunity: activeResearchItem.collaborationOpportunity,
      outreachStatus: activeResearchItem.outreachStatus,
      researchedAt: activeResearchItem.researchedAt,
      complianceNotice: 'Public account research does not provide a downloadable follower list or permission to message the account followers.'
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firmexpo_research_${activeResearchItem.username}.json`;
    a.click();
    showToast('Research dossier exported as JSON', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Public Account Research & Partnership Discovery
          </h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Meta Business Discovery API
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
          Research relevant public exhibition organizers, brands, and pavilions to identify B2B collaboration opportunities.
        </p>
      </div>

      {/* MANDATORY PROMINENT DISCLAIMER */}
      <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/30 text-red-950 dark:text-red-200 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-red-900 dark:text-red-300">
            Mandatory Meta API Compliance Restriction:
          </p>
          <p className="font-semibold text-red-800 dark:text-red-200 leading-relaxed">
            "Public account research does not provide a downloadable follower list or permission to message the account's followers."
          </p>
          <p className="text-red-700/80 dark:text-red-300/80 text-[11px] leading-relaxed">
            Meta Graph API strict policy prevents mass scraping, third-party follower extraction, and unsolicited bulk messaging. This dossier is maintained strictly for lawful B2B partnership tracking and corporate relationship records.
          </p>
        </div>
      </div>

      {/* Discovery Search Bar */}
      <div className={`p-4 rounded-xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
      }`}>
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Instagram className="w-4 h-4 text-pink-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Instagram professional handle (e.g. tokyo_future_mobility, nordic_cleantech_summit)..."
              value={inputHandle}
              onChange={(e) => setInputHandle(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border outline-none font-mono ${
                isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0 w-full sm:w-auto"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isSearching ? 'Querying Meta API...' : 'Research Account'}</span>
          </button>
        </form>
      </div>

      {/* Main 2-Column Split View: Saved Dossiers vs Active Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Saved Research List */}
        <div className={`p-4 rounded-2xl border space-y-3 ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-inherit">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Company Research Dossiers ({researchAccounts.length})
            </h3>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {researchAccounts.map(acc => (
              <div
                key={acc.id}
                onClick={() => setActiveResearchItem(acc)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  activeResearchItem?.id === acc.id
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30'
                    : isDarkMode ? 'border-neutral-800 hover:bg-neutral-800/40' : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="truncate">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">@{acc.username}</p>
                    <p className="text-[11px] text-slate-500 truncate">{acc.displayName}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded capitalize shrink-0 ${
                    acc.outreachStatus === 'in_dialogue' || acc.outreachStatus === 'partnered'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}>
                    {acc.outreachStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-mono">
                  <span>{acc.followersCount.toLocaleString()} followers</span>
                  <span>·</span>
                  <span>{acc.mediaCount} posts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Profile Information */}
        {activeResearchItem ? (
          <div className={`lg:col-span-2 p-6 rounded-2xl border space-y-6 ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            {/* Profile Overview Card */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-inherit">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 p-0.5 shrink-0">
                  <div className="w-full h-full rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center font-bold text-lg text-pink-600">
                    {activeResearchItem.displayName[0]}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{activeResearchItem.displayName}</h2>
                    <span className="text-xs font-mono text-slate-400">@{activeResearchItem.username}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-neutral-300 mt-1 leading-relaxed max-w-xl">
                    {activeResearchItem.biography}
                  </p>
                  {activeResearchItem.website && (
                    <a
                      href={activeResearchItem.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-1 font-medium"
                    >
                      <Globe2 className="w-3 h-3" />
                      <span>{activeResearchItem.website}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 text-xs font-medium hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Export verified research dossier"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Profile Metrics 3-Col */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className={`p-3 rounded-xl border ${
                isDarkMode ? 'bg-neutral-850 border-neutral-750' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Public Followers</span>
                <p className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  {activeResearchItem.followersCount.toLocaleString()}
                </p>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDarkMode ? 'bg-neutral-850 border-neutral-750' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Media Posts</span>
                <p className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  {activeResearchItem.mediaCount}
                </p>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDarkMode ? 'bg-neutral-850 border-neutral-750' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Industry Sector</span>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1 truncate">
                  {activeResearchItem.industry}
                </p>
              </div>
            </div>

            {/* Collaboration Opportunity & Outreach Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className={`p-3.5 rounded-xl border ${
                isDarkMode ? 'bg-neutral-800/40 border-neutral-750' : 'bg-slate-50/70 border-slate-200'
              }`}>
                <span className="font-semibold text-slate-800 dark:text-neutral-200 block mb-1">
                  Collaboration Opportunity
                </span>
                <p className="text-slate-600 dark:text-neutral-400 leading-relaxed">
                  {activeResearchItem.collaborationOpportunity}
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border ${
                isDarkMode ? 'bg-neutral-800/40 border-neutral-750' : 'bg-slate-50/70 border-slate-200'
              }`}>
                <span className="font-semibold text-slate-800 dark:text-neutral-200 block mb-1.5">
                  Corporate Outreach Status
                </span>
                <div className="flex flex-wrap gap-1">
                  {(['uncontacted', 'lead_identified', 'contacted', 'in_dialogue', 'partnered', 'declined'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize transition-colors ${
                        activeResearchItem.outreachStatus === st
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'bg-slate-200 dark:bg-neutral-700 text-slate-700 dark:text-neutral-300 hover:bg-slate-300'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Public Media Highlights */}
            {activeResearchItem.recentMedia.length > 0 && (
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Recent Public Media Posts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {activeResearchItem.recentMedia.map(m => (
                    <div key={m.id} className="p-3 rounded-xl border border-inherit flex gap-3">
                      <img src={m.mediaUrl} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                      <div className="flex flex-col justify-between truncate">
                        <p className="text-slate-700 dark:text-neutral-300 line-clamp-2 text-[11px] leading-relaxed">
                          {m.caption}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-500" />
                            {m.likeCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-indigo-500" />
                            {m.commentsCount}
                          </span>
                          <span>{new Date(m.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Partnership Notes */}
            <div className="pt-2 border-t border-inherit">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-2">
                Internal Partnership Notes ({activeResearchItem.internalNotes.length})
              </h4>
              <div className="space-y-1.5 mb-3">
                {activeResearchItem.internalNotes.map((note, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-neutral-800/60 text-xs text-slate-600 dark:text-neutral-300">
                    • {note}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add confidential B2B meeting or outreach notes..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  className={`flex-1 px-3 py-1.5 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                <button
                  onClick={handleAddNote}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 p-12 text-center text-slate-400 border border-dashed rounded-2xl flex flex-col items-center justify-center">
            <Building2 className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs font-semibold">Select or search for an account to inspect research dossier</p>
          </div>
        )}
      </div>
    </div>
  );
};
