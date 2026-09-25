import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  ArrowUpRight,
  MoreVertical,
  Instagram,
  Facebook,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DMCampaign, DMCampaignStatus } from '../../types';

export const DMCampaignsListView: React.FC = () => {
  const { 
    isDarkMode, 
    dmCampaigns, 
    pauseDMCampaign, 
    resumeDMCampaign, 
    cancelDMCampaign, 
    setCurrentTab,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DMCampaignStatus>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<DMCampaign | null>(null);

  const filteredCampaigns = dmCampaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.firmExpoEventName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            DM Campaigns
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Manage, schedule, monitor, and pause direct messaging outreach across Instagram & Facebook
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('create_dm_campaign')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New DM Campaign</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
      }`}>
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 text-xs w-full sm:w-auto">
          {(['all', 'running', 'scheduled', 'completed', 'draft', 'paused'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
              }`}
            >
              {tab === 'all' ? 'All Campaigns' : tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none ${
              isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
            }`}
          />
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCampaigns.map(c => {
          const responseRate = c.stats.deliveredCount > 0 
            ? Math.round((c.stats.replyCount / c.stats.deliveredCount) * 100) 
            : 0;

          return (
            <div
              key={c.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isDarkMode ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {c.platform === 'instagram' ? (
                      <span className="p-1 rounded-md bg-pink-50 dark:bg-pink-950/60 text-pink-600">
                        <Instagram className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                        <Facebook className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {c.platform === 'instagram' ? 'Instagram' : 'Messenger'}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    c.status === 'running'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : c.status === 'scheduled'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      : c.status === 'completed'
                      ? 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
                      : c.status === 'paused'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-1 mb-1">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                  {c.description || 'Targeted 1-on-1 direct messaging campaign for expo attendees.'}
                </p>

                {/* Event Tag */}
                {c.firmExpoEventName && (
                  <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mb-3 truncate">
                    📍 {c.firmExpoEventName}
                  </div>
                )}

                {/* Metrics 3-box */}
                <div className={`p-2.5 rounded-xl border grid grid-cols-3 gap-2 text-center text-xs mb-4 ${
                  isDarkMode ? 'bg-neutral-800/50 border-neutral-700/60' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Eligible</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{c.stats.eligibleCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Delivered</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{c.stats.deliveredCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Replies</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400 font-mono">{c.stats.replyCount} ({responseRate}%)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-inherit flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedCampaign(c)}
                  className="flex items-center gap-1 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                <div className="flex items-center gap-2">
                  {c.status === 'running' && (
                    <button
                      onClick={() => pauseDMCampaign(c.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 font-semibold"
                    >
                      <Pause className="w-3 h-3" />
                      <span>Pause</span>
                    </button>
                  )}

                  {c.status === 'paused' && (
                    <button
                      onClick={() => resumeDMCampaign(c.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold"
                    >
                      <Play className="w-3 h-3" />
                      <span>Resume</span>
                    </button>
                  )}

                  {c.status !== 'completed' && c.status !== 'cancelled' && (
                    <button
                      onClick={() => cancelDMCampaign(c.id)}
                      className="text-red-500 hover:text-red-700 text-xs p-1"
                      title="Cancel remaining queue"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Inspection Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl space-y-4 ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between pb-3 border-b border-inherit">
              <div>
                <h3 className="text-lg font-bold">{selectedCampaign.name}</h3>
                <p className="text-xs text-slate-500">{selectedCampaign.firmExpoEventName || 'Firm Expo Global'}</p>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Message Copy:</span>
                <div className={`p-3 rounded-xl border font-mono text-[11px] whitespace-pre-line ${
                  isDarkMode ? 'bg-neutral-800/80 border-neutral-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  {selectedCampaign.messageBody}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-inherit">
                  <span className="text-slate-400 block text-[10px]">Audience Segment</span>
                  <p className="font-semibold mt-0.5">{selectedCampaign.audienceSegmentName}</p>
                </div>
                <div className="p-3 rounded-lg border border-inherit">
                  <span className="text-slate-400 block text-[10px]">Created By</span>
                  <p className="font-semibold mt-0.5">{selectedCampaign.createdBy.name}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Audited: Meta 24-hour response window strictly enforced on all {selectedCampaign.stats.eligibleCount} recipients.</span>
              </div>
            </div>

            <div className="pt-3 border-t border-inherit flex justify-end">
              <button
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
