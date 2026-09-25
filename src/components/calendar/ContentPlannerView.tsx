import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Layers, 
  Trash2, 
  ExternalLink,
  X,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PostItem, PostStatus } from '../../types';

export const ContentPlannerView: React.FC = () => {
  const { 
    posts, 
    socialAccounts, 
    campaigns, 
    retryPost, 
    deletePost, 
    updatePost, 
    setCurrentTab, 
    isDarkMode, 
    showToast 
  } = useApp();

  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'instagram' | 'facebook'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [isRetryingId, setIsRetryingId] = useState<string | null>(null);

  // Month navigation
  const [currentDate, setCurrentDate] = useState(new Date('2026-09-25'));

  const filteredPosts = posts.filter(p => {
    const matchesPlatform = platformFilter === 'all' || p.platform === platformFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesPlatform && matchesStatus;
  });

  const failedPosts = posts.filter(p => p.status === 'failed');

  const handleRetry = async (postId: string) => {
    setIsRetryingId(postId);
    try {
      await retryPost(postId);
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(null);
      }
    } finally {
      setIsRetryingId(null);
    }
  };

  // Calendar dates generation (September 2026)
  const daysInMonth = 30;
  const startDayOfWeek = 2; // Tuesday start for Sept 2026

  const renderMonthGrid = () => {
    const cells = [];
    // Previous month padding
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push(
        <div key={`prev-${i}`} className={`min-h-28 p-2 border-r border-b ${
          isDarkMode ? 'border-neutral-800 bg-neutral-900/30' : 'border-slate-200 bg-slate-50/50'
        } opacity-40`}>
          <span className="text-[11px] text-slate-400 font-medium">{28 + i}</span>
        </div>
      );
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `2026-09-${day < 10 ? '0' + day : day}`;
      const dayPosts = filteredPosts.filter(p => p.scheduledAt.startsWith(dateStr));
      const isToday = day === 25;

      cells.push(
        <div
          key={`day-${day}`}
          className={`min-h-28 p-2 border-r border-b transition-colors relative flex flex-col justify-between group ${
            isDarkMode ? 'border-neutral-800 hover:bg-neutral-850' : 'border-slate-200 hover:bg-slate-50'
          } ${isToday ? isDarkMode ? 'bg-indigo-950/20' : 'bg-indigo-50/40' : ''}`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center ${
              isToday 
                ? 'bg-indigo-600 text-white font-bold' 
                : 'text-slate-700 dark:text-neutral-300'
            }`}>
              {day}
            </span>

            {/* Quick Add on Hover */}
            <button
              onClick={() => setCurrentTab('create_campaign')}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-neutral-800 transition-opacity"
              title="Schedule post on this date"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Posts on this date */}
          <div className="space-y-1 flex-1 overflow-y-auto max-h-20">
            {dayPosts.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedPost(p)}
                className={`p-1.5 rounded text-[11px] font-medium truncate cursor-pointer flex items-center gap-1.5 transition-all shadow-2xs ${
                  p.status === 'failed'
                    ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-900'
                    : p.status === 'published'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                }`}
                title={p.caption}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  p.platform === 'instagram' ? 'bg-pink-500' : 'bg-blue-600'
                }`} />
                <span className="truncate">{p.campaignName || p.caption}</span>
              </div>
            ))}
          </div>

          {isToday && (
            <div className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-right">
              Today
            </div>
          )}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Content Planner & Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Coordinate multi-account release dates, view drafts, and resolve dispatch exceptions
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('create_campaign')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Scheduled Post</span>
        </button>
      </div>

      {/* Prominent Failed Posts Alert Section */}
      {failedPosts.length > 0 && (
        <div className={`p-4 rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold">
                  {failedPosts.length} Scheduled Post Failed to Publish via Meta Graph API
                </h3>
                <p className="text-xs text-red-800 dark:text-red-300/90 mt-1">
                  {failedPosts[0].failureReason || 'Meta session expired or permissions revoked.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleRetry(failedPosts[0].id)}
              disabled={isRetryingId === failedPosts[0].id}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetryingId === failedPosts[0].id ? 'animate-spin' : ''}`} />
              <span>Retry Dispatch</span>
            </button>
          </div>
        </div>
      )}

      {/* Calendar Controls & Filters Toolbar */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        {/* Month Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentDate(new Date('2026-08-25'))}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-500"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-900 dark:text-white min-w-32 text-center">
              September 2026
            </span>
            <button
              onClick={() => setCurrentDate(new Date('2026-10-25'))}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-500"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setCurrentDate(new Date('2026-09-25'))}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Today
          </button>
        </div>

        {/* View Switcher and Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Platform Filter */}
          <div className={`p-0.5 rounded-lg border flex items-center text-xs ${
            isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-100 border-slate-200'
          }`}>
            {(['all', 'instagram', 'facebook'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={`px-2 py-1 rounded capitalize font-medium transition-colors ${
                  platformFilter === p 
                    ? 'bg-white dark:bg-neutral-900 font-semibold text-slate-900 dark:text-white shadow-2xs' 
                    : 'text-slate-500'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className={`p-0.5 rounded-lg border flex items-center text-xs ${
            isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-100 border-slate-200'
          }`}>
            {(['month', 'list'] as const).map(v => (
              <button
                key={v}
                onClick={() => setCalendarView(v)}
                className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                  calendarView === v 
                    ? 'bg-white dark:bg-neutral-900 font-semibold text-slate-900 dark:text-white shadow-2xs' 
                    : 'text-slate-500'
                }`}
              >
                {v} View
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid View */}
      {calendarView === 'month' && (
        <div className={`rounded-xl border overflow-hidden ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {/* Days of week header */}
          <div className={`grid grid-cols-7 border-b text-[11px] font-semibold uppercase text-center ${
            isDarkMode ? 'border-neutral-800 text-neutral-400 bg-neutral-900' : 'border-slate-200 text-slate-500 bg-slate-50'
          }`}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-2.5 border-r border-inherit last:border-r-0">
                {d}
              </div>
            ))}
          </div>

          {/* Month Cells Grid */}
          <div className="grid grid-cols-7">
            {renderMonthGrid()}
          </div>
        </div>
      )}

      {/* List View */}
      {calendarView === 'list' && (
        <div className={`rounded-xl border divide-y overflow-hidden ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800 divide-neutral-800' : 'bg-white border-slate-200 divide-slate-200 shadow-xs'
        }`}>
          {filteredPosts.map(post => (
            <div 
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-neutral-850 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                {post.media[0] ? (
                  <img src={post.media[0].url} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-400">
                    <Layers className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{post.campaignName}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                      post.platform === 'instagram' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {post.platform}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                    {post.caption}
                  </p>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Scheduled: {new Date(post.scheduledAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                  post.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                  post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                }`}>
                  {post.status}
                </span>
                {post.status === 'failed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRetry(post.id);
                    }}
                    className="px-2.5 py-1 text-xs font-bold rounded bg-red-600 hover:bg-red-700 text-white"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Details & Management Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                  Post Manifest & Meta Dispatch
                </span>
                <h3 className="font-bold text-base">{selectedPost.campaignName}</h3>
              </div>
              <button 
                onClick={() => setSelectedPost(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {selectedPost.media[0] && (
                <div className="aspect-video max-h-48 rounded-lg overflow-hidden bg-slate-100 dark:bg-neutral-800">
                  <img src={selectedPost.media[0].url} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <span className="text-slate-400 font-medium">Caption:</span>
                <p className="mt-1 p-3 rounded-lg bg-slate-50 dark:bg-neutral-800/80 leading-relaxed text-slate-700 dark:text-neutral-300 whitespace-pre-line">
                  {selectedPost.caption}
                </p>
              </div>

              {selectedPost.firstComment && (
                <div>
                  <span className="text-slate-400 font-medium">Instagram First Comment:</span>
                  <p className="mt-0.5 text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
                    {selectedPost.firstComment}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 py-2 border-y border-inherit">
                <div>
                  <span className="text-slate-400">Platform:</span>
                  <p className="font-semibold capitalize mt-0.5">{selectedPost.platform}</p>
                </div>
                <div>
                  <span className="text-slate-400">Scheduled Date:</span>
                  <p className="font-semibold mt-0.5">{new Date(selectedPost.scheduledAt).toLocaleString()}</p>
                </div>
              </div>

              {selectedPost.failureReason && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300">
                  <span className="font-bold block">Error Encountered:</span>
                  <span>{selectedPost.failureReason}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-inherit">
                <button
                  onClick={() => {
                    deletePost(selectedPost.id);
                    setSelectedPost(null);
                  }}
                  className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold"
                >
                  <Trash2 className="w-4 h-4" /> Cancel Post
                </button>

                <div className="flex items-center gap-2">
                  {selectedPost.status === 'failed' && (
                    <button
                      onClick={() => handleRetry(selectedPost.id)}
                      disabled={isRetryingId === selectedPost.id}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                      Retry Publish
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
