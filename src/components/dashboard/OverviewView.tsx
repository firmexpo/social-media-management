import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Eye, 
  Share2, 
  Calendar, 
  Megaphone, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Layers, 
  Info,
  CalendarDays,
  ExternalLink,
  RefreshCw,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OVERVIEW_METRICS } from '../../data/mockData';

export const OverviewView: React.FC = () => {
  const { 
    isDemoMode, 
    isDarkMode, 
    campaigns, 
    posts, 
    setCurrentTab, 
    socialAccounts,
    currentWorkspace,
    metaConfig,
    syncLiveMetaAccounts,
    clearAllDummyData
  } = useApp();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'instagram' | 'facebook'>('all');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);
  const [syncingMeta, setSyncingMeta] = useState(false);

  const hasDummyData = campaigns.some(c => c.id.startsWith('cmp-')) || socialAccounts.some(a => a.id.startsWith('acc-ig-') || a.id.startsWith('acc-fb-'));
  const hasRealToken = Boolean(metaConfig.pageAccessToken && metaConfig.pageAccessToken.trim().length > 10);

  const handleSyncRealData = async () => {
    setSyncingMeta(true);
    try {
      await syncLiveMetaAccounts();
    } finally {
      setSyncingMeta(false);
    }
  };

  // Dynamic calculations based on state
  const activeCampaignsCount = campaigns.filter(c => c.status === 'published' || c.status === 'publishing').length;
  const scheduledPostsCount = posts.filter(p => p.status === 'scheduled').length;
  const publishedPostsCount = posts.filter(p => p.status === 'published').length;

  // Chart data points (30 days synthesized)
  const chartDays = dateRange === '7d' ? 7 : dateRange === '30d' ? 14 : 20;
  const trendData = Array.from({ length: chartDays }).map((_, i) => {
    const baseIg = 24000 + Math.sin(i * 0.8) * 12000 + i * 1800;
    const baseFb = 18000 + Math.cos(i * 0.6) * 8000 + i * 1200;
    return {
      day: `Day ${i + 1}`,
      instagram: Math.round(baseIg),
      facebook: Math.round(baseFb),
      total: Math.round(baseIg + baseFb),
    };
  });

  const maxChartVal = Math.max(...trendData.map(d => d.total)) * 1.15;

  return (
    <div className="space-y-6">
      {/* Demo Mode Notice Banner */}
      {isDemoMode && (
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isDarkMode 
            ? 'bg-amber-950/20 border-amber-900/50 text-amber-200' 
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold">Active Mode: Demo & Sandbox Simulation</span>
              <p className="text-amber-800 dark:text-amber-300/80 mt-0.5">
                Displaying realistic sample data for Firm Expo exhibition campaigns. No live Meta API credentials required for testing post scheduling, content planning, and analytics.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('settings')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shrink-0 transition-colors"
          >
            Configure Meta App
          </button>
        </div>
      )}

      {/* Live Meta Token Sync Notice Banner */}
      {!isDemoMode && hasRealToken && hasDummyData && (
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDarkMode ? 'bg-indigo-950/30 border-indigo-800/60 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
        }`}>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold">Real Meta Credentials Active</span>
              <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-neutral-300">
                You have updated your real Meta tokens! Click <span className="font-bold text-indigo-600 dark:text-indigo-400">"Sync My Live Accounts"</span> to pull your real Facebook Pages and Instagram profiles, or <span className="font-bold text-red-600 dark:text-red-400">"Clear Dummy Data"</span> to clean out sample campaigns.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSyncRealData}
              disabled={syncingMeta}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingMeta ? 'animate-spin' : ''}`} />
              <span>{syncingMeta ? 'Syncing...' : 'Sync My Live Accounts'}</span>
            </button>
            <button
              onClick={clearAllDummyData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Dummy Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Marketing Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            System performance, reach analytics, and scheduled content for {currentWorkspace.name}
          </p>
        </div>

        {/* Date & Platform Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Platform Segmented Control */}
          <div className={`p-0.5 rounded-lg border flex items-center text-xs font-medium ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                platformFilter === 'all' 
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold' 
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Platforms
            </button>
            <button
              onClick={() => setPlatformFilter('instagram')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                platformFilter === 'instagram' 
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold' 
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Instagram
            </button>
            <button
              onClick={() => setPlatformFilter('facebook')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                platformFilter === 'facebook' 
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold' 
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Facebook
            </button>
          </div>

          {/* Date Range Selector */}
          <div className={`p-0.5 rounded-lg border flex items-center text-xs font-medium ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {(['7d', '30d', '90d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  dateRange === range 
                    ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold' 
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Reach */}
        <div className={`p-4 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 mb-1">
            <span className="font-medium">Total Reach</span>
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +{OVERVIEW_METRICS.reachChange}%
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {(OVERVIEW_METRICS.totalReach).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1">Unique accounts reached</p>
        </div>

        {/* Total Impressions */}
        <div className={`p-4 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 mb-1">
            <span className="font-medium">Total Impressions</span>
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +{OVERVIEW_METRICS.impressionsChange}%
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {(OVERVIEW_METRICS.totalImpressions).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1">Content display frequency</p>
        </div>

        {/* Engagement Rate */}
        <div className={`p-4 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 mb-1">
            <span className="font-medium">Avg Engagement Rate</span>
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +{OVERVIEW_METRICS.engagementChange}%
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {OVERVIEW_METRICS.engagementRate}%
          </div>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1">Benchmark: 3.2%</p>
        </div>

        {/* Total Interactions */}
        <div className={`p-4 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 mb-1">
            <span className="font-medium">Total Interactions</span>
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +{OVERVIEW_METRICS.interactionsChange}%
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {(OVERVIEW_METRICS.totalInteractions).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1">Likes, comments, shares & saves</p>
        </div>
      </div>

      {/* Secondary Quick Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
          isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-neutral-400">Total Campaigns</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
              {campaigns.length}
            </div>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
          isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-neutral-400">Active Campaigns</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
              {activeCampaignsCount}
            </div>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
          isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-neutral-400">Scheduled Posts</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
              {scheduledPostsCount}
            </div>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
          isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-neutral-400">Published Posts</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
              {publishedPostsCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Analytics Chart */}
      <div className={`p-5 rounded-xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-inherit gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Cross-Platform Reach Trends
              <span className="text-[11px] font-normal text-slate-500">· Instagram vs Facebook</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Daily estimated reach across authorized Meta Graph accounts
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500" />
              <span className="text-slate-600 dark:text-neutral-300 font-medium">Instagram</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-slate-600 dark:text-neutral-300 font-medium">Facebook</span>
            </div>
          </div>
        </div>

        {/* SVG Interactive Area Chart */}
        <div className="pt-6 pb-2">
          <div className="relative h-64 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="igGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="fbGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = 220 - ratio * 190;
                return (
                  <g key={idx}>
                    <line 
                      x1="0" 
                      y1={y} 
                      x2="800" 
                      y2={y} 
                      stroke={isDarkMode ? '#262626' : '#f1f5f9'} 
                      strokeDasharray="4 4" 
                    />
                    <text 
                      x="0" 
                      y={y - 4} 
                      fill={isDarkMode ? '#737373' : '#94a3b8'} 
                      fontSize="10" 
                      className="tabular-nums"
                    >
                      {Math.round((maxChartVal * ratio) / 1000)}k
                    </text>
                  </g>
                );
              })}

              {/* Path generation */}
              {(() => {
                const pointsIg = trendData.map((d, i) => {
                  const x = (i / (trendData.length - 1)) * 800;
                  const y = 220 - (d.instagram / maxChartVal) * 190;
                  return `${x},${y}`;
                });

                const pointsFb = trendData.map((d, i) => {
                  const x = (i / (trendData.length - 1)) * 800;
                  const y = 220 - (d.facebook / maxChartVal) * 190;
                  return `${x},${y}`;
                });

                const igPath = `M ${pointsIg.join(' L ')}`;
                const fbPath = `M ${pointsFb.join(' L ')}`;
                const igArea = `M 0,220 L ${pointsIg.join(' L ')} L 800,220 Z`;
                const fbArea = `M 0,220 L ${pointsFb.join(' L ')} L 800,220 Z`;

                return (
                  <>
                    {(platformFilter === 'all' || platformFilter === 'facebook') && (
                      <>
                        <path d={fbArea} fill="url(#fbGradient)" />
                        <path d={fbPath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                      </>
                    )}
                    {(platformFilter === 'all' || platformFilter === 'instagram') && (
                      <>
                        <path d={igArea} fill="url(#igGradient)" />
                        <path d={igPath} fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
                      </>
                    )}

                    {/* Interactive hover points */}
                    {trendData.map((d, i) => {
                      const x = (i / (trendData.length - 1)) * 800;
                      const yIg = 220 - (d.instagram / maxChartVal) * 190;
                      return (
                        <g 
                          key={i} 
                          onMouseEnter={() => setHoveredDataPoint(i)}
                          onMouseLeave={() => setHoveredDataPoint(null)}
                          className="cursor-pointer"
                        >
                          <circle cx={x} cy={yIg} r={hoveredDataPoint === i ? 6 : 3} fill="#ec4899" />
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredDataPoint !== null && (
              <div 
                className={`absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg border shadow-lg text-xs z-10 ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-slate-200'
                }`}
              >
                <div className="font-semibold text-slate-900 dark:text-white mb-0.5">
                  Day {hoveredDataPoint + 1}
                </div>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="text-pink-600 dark:text-pink-400">
                    IG: {trendData[hoveredDataPoint].instagram.toLocaleString()}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    FB: {trendData[hoveredDataPoint].facebook.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Posts & Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduled & Recent Content */}
        <div className={`p-5 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming & Recent Posts</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Scheduled pipeline across Meta channels</p>
            </div>
            <button
              onClick={() => setCurrentTab('planner')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Planner <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {posts.slice(0, 4).map(post => {
              const postAccount = socialAccounts.find(a => a.id === post.socialAccountId);
              return (
                <div key={post.id} className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                  isDarkMode ? 'bg-neutral-850 border-neutral-800' : 'bg-slate-50 border-slate-200/80'
                }`}>
                  {post.media[0] ? (
                    <img 
                      src={post.media[0].url} 
                      alt="" 
                      className="w-12 h-12 rounded-md object-cover shrink-0 border border-slate-200 dark:border-neutral-700" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-slate-200 dark:bg-neutral-800 shrink-0 flex items-center justify-center text-slate-400">
                      <Layers className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {post.campaignName}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                        post.status === 'published' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : post.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}>
                        {post.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-neutral-300 line-clamp-1">
                      {post.caption}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 dark:text-neutral-500">
                      <span className="capitalize">{post.platform}</span>
                      <span>·</span>
                      <span>{new Date(post.scheduledAt).toLocaleDateString()} at {new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {post.metrics && (
                        <>
                          <span>·</span>
                          <span className="text-slate-600 dark:text-neutral-400 font-medium">
                            {post.metrics.reach.toLocaleString()} reach
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Campaigns */}
        <div className={`p-5 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Firm Expo Campaigns</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Current exhibition marketing performance</p>
            </div>
            <button
              onClick={() => setCurrentTab('campaigns')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              All Campaigns <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {campaigns.slice(0, 4).map(cmp => (
              <div key={cmp.id} className={`p-3 rounded-lg border transition-colors ${
                isDarkMode ? 'bg-neutral-850 border-neutral-800' : 'bg-slate-50 border-slate-200/80'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {cmp.name}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                    cmp.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : cmp.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : cmp.status === 'publishing'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}>
                    {cmp.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-1 mb-2">
                  {cmp.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400 pt-1.5 border-t border-inherit">
                  <span>{cmp.postCount} posts scheduled</span>
                  <div className="flex items-center gap-3 tabular-nums font-medium text-slate-700 dark:text-neutral-300">
                    <span>{((cmp.totalReach || 0) / 1000).toFixed(0)}k reach</span>
                    <span>·</span>
                    <span>{cmp.engagementRate || 0}% engagement</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
