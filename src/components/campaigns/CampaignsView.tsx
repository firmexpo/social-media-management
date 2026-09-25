import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Copy, 
  Pause, 
  Play, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Archive,
  BarChart2,
  Eye,
  Megaphone,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Campaign, CampaignStatus } from '../../types';

export const CampaignsView: React.FC = () => {
  const { 
    campaigns, 
    setCurrentTab, 
    duplicateCampaign, 
    deleteCampaign, 
    togglePauseCampaign, 
    isDarkMode,
    posts 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.firmExpoEventName && c.firmExpoEventName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Published</span>;
      case 'scheduled':
        return <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Scheduled</span>;
      case 'publishing':
        return <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 animate-pulse">Publishing...</span>;
      case 'paused':
        return <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Paused</span>;
      case 'draft':
        return <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-200 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">Draft</span>;
      case 'failed':
        return <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">Failed</span>;
      default:
        return <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  const getObjectiveLabel = (obj: string) => {
    return obj.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Campaign Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Monitor and coordinate multi-channel exhibition campaigns across Facebook & Instagram
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('create_campaign')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Search and Filters Toolbar */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns, objectives, exhibitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border outline-none transition-colors ${
              isDarkMode 
                ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-indigo-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
            }`}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 font-medium shrink-0">Status:</span>
          {['all', 'published', 'scheduled', 'paused', 'draft'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs rounded-md capitalize font-medium transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white font-semibold'
                  : isDarkMode
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Table */}
      <div className={`rounded-xl border overflow-hidden ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${
                isDarkMode ? 'border-neutral-800 text-neutral-400 bg-neutral-900/80' : 'border-slate-200 text-slate-500 bg-slate-50'
              }`}>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Objective</th>
                <th className="py-3 px-4">Platforms</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timeline</th>
                <th className="py-3 px-4 text-right">Reach</th>
                <th className="py-3 px-4 text-right">Engagement</th>
                <th className="py-3 px-4 text-center">Posts</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-slate-600 dark:text-neutral-300">No campaigns found</p>
                    <p className="text-xs text-slate-400 mt-1">Adjust your search query or create a new campaign.</p>
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map(cmp => (
                  <tr 
                    key={cmp.id} 
                    className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-neutral-850 cursor-pointer`}
                    onClick={() => setSelectedCampaign(cmp)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
                        {cmp.name}
                      </div>
                      {cmp.firmExpoEventName && (
                        <div className="text-[11px] text-slate-400 dark:text-neutral-500 truncate max-w-xs">
                          {cmp.firmExpoEventName}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-neutral-300 font-medium">
                      {getObjectiveLabel(cmp.objective)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {cmp.targetPlatforms.map(p => (
                          <span 
                            key={p} 
                            className={`px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded ${
                              p === 'instagram' 
                                ? 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300' 
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {p === 'instagram' ? 'IG' : 'FB'}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {getStatusBadge(cmp.status)}
                    </td>

                    <td className="py-3 px-4 text-slate-500 dark:text-neutral-400 whitespace-nowrap">
                      {new Date(cmp.startDate).toLocaleDateString()}
                      {cmp.endDate && ` – ${new Date(cmp.endDate).toLocaleDateString()}`}
                    </td>

                    <td className="py-3 px-4 text-right font-medium tabular-nums text-slate-800 dark:text-neutral-200">
                      {(cmp.totalReach || 0).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right font-medium tabular-nums text-slate-800 dark:text-neutral-200">
                      {cmp.engagementRate ? `${cmp.engagementRate}%` : '—'}
                    </td>

                    <td className="py-3 px-4 text-center font-medium tabular-nums">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 text-[11px]">
                        {cmp.postCount}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => togglePauseCampaign(cmp.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                          title={cmp.status === 'paused' ? 'Resume Campaign' : 'Pause Campaign'}
                        >
                          {cmp.status === 'paused' ? <Play className="w-3.5 h-3.5 text-emerald-500" /> : <Pause className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => duplicateCampaign(cmp.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Duplicate Campaign"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(cmp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Details Drawer / Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl p-6 overflow-hidden ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-inherit mb-4">
              <div>
                <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-wider">
                  Campaign Details
                </span>
                <h2 className="text-lg font-bold">{selectedCampaign.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedCampaign(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Description:</span>
                <p className="mt-1 text-slate-700 dark:text-neutral-300 leading-relaxed">
                  {selectedCampaign.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-inherit">
                <div>
                  <span className="text-slate-400">Objective</span>
                  <p className="font-semibold mt-0.5">{getObjectiveLabel(selectedCampaign.objective)}</p>
                </div>
                <div>
                  <span className="text-slate-400">Status</span>
                  <div className="mt-0.5">{getStatusBadge(selectedCampaign.status)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Start Date</span>
                  <p className="font-semibold mt-0.5">{selectedCampaign.startDate}</p>
                </div>
                <div>
                  <span className="text-slate-400">Total Posts</span>
                  <p className="font-semibold mt-0.5">{selectedCampaign.postCount} scheduled</p>
                </div>
              </div>

              {/* Associated Posts in Campaign */}
              <div>
                <h3 className="font-bold mb-2">Campaign Content Pipeline</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {posts.filter(p => p.campaignId === selectedCampaign.id).map(p => (
                    <div key={p.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <span className="capitalize font-semibold">{p.platform}</span>
                        <span className="text-slate-400">·</span>
                        <span className="truncate text-slate-600 dark:text-neutral-300">{p.caption.slice(0, 45)}...</span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 shrink-0">
                        {p.status}
                      </span>
                    </div>
                  ))}
                  {posts.filter(p => p.campaignId === selectedCampaign.id).length === 0 && (
                    <p className="text-slate-400 italic">No posts directly assigned yet.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-inherit">
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-neutral-700 font-semibold hover:bg-slate-100 dark:hover:bg-neutral-800"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedCampaign(null);
                    setCurrentTab('planner');
                  }}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                >
                  View in Content Planner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Deletion */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Confirm Campaign Removal
            </h3>
            <p className="text-xs text-slate-600 dark:text-neutral-400 mt-2 leading-relaxed">
              Are you sure you want to remove this campaign? This will archive all associated scheduled posts and cancel pending Meta publishing jobs.
            </p>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCampaign(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
