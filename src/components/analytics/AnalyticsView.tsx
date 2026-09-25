import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Layers, 
  Share2, 
  Eye, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Filter, 
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { 
    posts, 
    campaigns, 
    socialAccounts, 
    isDarkMode, 
    showToast 
  } = useApp();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'instagram' | 'facebook'>('all');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all');
  const [metricTab, setMetricTab] = useState<'reach' | 'engagement' | 'impressions'>('reach');

  const publishedPosts = posts.filter(p => p.status === 'published');

  // CSV Export Generator
  const handleExportCsv = () => {
    const headers = ['Post ID', 'Campaign', 'Platform', 'Published Date', 'Reach', 'Impressions', 'Engagement', 'Likes', 'Comments', 'Shares', 'Saves'];
    const rows = publishedPosts.map(p => [
      p.id,
      `"${p.campaignName.replace(/"/g, '""')}"`,
      p.platform,
      p.publishedAt || p.scheduledAt,
      p.metrics?.reach || 0,
      p.metrics?.impressions || 0,
      p.metrics?.engagement || 0,
      p.metrics?.likes || 0,
      p.metrics?.comments || 0,
      p.metrics?.shares || 0,
      p.metrics?.saves || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `firm_expo_meta_analytics_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Analytics CSV report exported successfully', 'success');
  };

  // Synthetic performance trend points
  const pointsCount = dateRange === '7d' ? 7 : dateRange === '30d' ? 14 : 24;
  const trendPoints = Array.from({ length: pointsCount }).map((_, i) => {
    const val = 12000 + Math.sin(i * 0.7) * 5000 + i * 1100;
    return {
      label: `Day ${i + 1}`,
      value: Math.round(val),
    };
  });
  const maxVal = Math.max(...trendPoints.map(p => p.value)) * 1.2;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Performance & Insights Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Meta Graph API telemetry for exhibition reach, impression depth, and interaction rates
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-indigo-500" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Campaign Filter */}
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-lg border outline-none ${
              isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <option value="all">All Campaigns</option>
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Platform Segmented Control */}
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
        </div>

        {/* Date Range Selector */}
        <div className={`p-0.5 rounded-lg border flex items-center text-xs ${
          isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-100 border-slate-200'
        }`}>
          {(['7d', '30d', '90d'] as const).map(r => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                dateRange === r 
                  ? 'bg-white dark:bg-neutral-900 font-semibold text-slate-900 dark:text-white shadow-2xs' 
                  : 'text-slate-500'
              }`}
            >
              {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metric Chart Container */}
      <div className={`p-5 rounded-xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-inherit gap-3">
          <div className="flex items-center gap-2">
            {(['reach', 'engagement', 'impressions'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setMetricTab(tab)}
                className={`px-3 py-1.5 text-xs rounded-lg capitalize font-semibold transition-colors ${
                  metricTab === tab
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isDarkMode
                    ? 'text-neutral-400 hover:bg-neutral-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab === 'reach' ? 'Total Reach' : tab === 'engagement' ? 'Engagement Rate' : 'Impressions'}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 dark:text-neutral-400">
            Comparing against prior 30-day window (+14.2% growth)
          </div>
        </div>

        {/* Chart SVG */}
        <div className="pt-6 pb-2">
          <div className="h-60 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                const y = 200 - ratio * 170;
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
                      {Math.round((maxVal * ratio) / 1000)}k
                    </text>
                  </g>
                );
              })}

              {/* Area path */}
              {(() => {
                const points = trendPoints.map((d, i) => {
                  const x = (i / (trendPoints.length - 1)) * 800;
                  const y = 200 - (d.value / maxVal) * 170;
                  return `${x},${y}`;
                });
                const linePath = `M ${points.join(' L ')}`;
                const areaPath = `M 0,200 L ${points.join(' L ')} L 800,200 Z`;

                return (
                  <>
                    <path d={areaPath} fill="url(#metricGrad)" />
                    <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
                    {trendPoints.map((d, i) => {
                      const x = (i / (trendPoints.length - 1)) * 800;
                      const y = 200 - (d.value / maxVal) * 170;
                      return (
                        <circle key={i} cx={x} cy={y} r="3.5" fill="#6366f1" />
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Platform Comparison & Format Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform Share Comparison */}
        <div className={`p-5 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Platform Distribution & Share
          </h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
            Audience volume and engagement split between Facebook & Instagram
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Instagram Business
                </span>
                <span className="tabular-nums">64.5% (958,000 Reach)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" style={{ width: '64.5%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Facebook Pages
                </span>
                <span className="tabular-nums">35.5% (527,200 Reach)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '35.5%' }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-inherit text-xs text-center">
            <div>
              <span className="text-slate-400">Top Format (IG)</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">Reels (8.4% ER)</p>
            </div>
            <div>
              <span className="text-slate-400">Top Format (FB)</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">Photo Albums (5.1% ER)</p>
            </div>
          </div>
        </div>

        {/* Campaign ROI & Performance */}
        <div className={`p-5 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Top Performing Exhibition Campaigns
          </h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
            Ranked by aggregate attendee reach and verified clicks
          </p>

          <div className="space-y-3">
            {campaigns.slice(0, 3).map((cmp, idx) => (
              <div key={cmp.id} className="p-3 rounded-lg border border-inherit flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-neutral-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{cmp.name}</p>
                    <p className="text-[11px] text-slate-400">{cmp.firmExpoEventName || 'Firm Expo'}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                    {((cmp.totalReach || 0) / 1000).toFixed(0)}k reach
                  </span>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {cmp.engagementRate || 0}% ER
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Posts Leaderboard */}
      <div className={`p-5 rounded-xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Top Published Posts Leaderboard
        </h3>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
          Direct engagement metrics retrieved via Meta Graph insights endpoint
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase ${
                isDarkMode ? 'border-neutral-800 text-neutral-400' : 'border-slate-200 text-slate-500'
              }`}>
                <th className="py-2.5 px-3">Post Content</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3 text-right">Reach</th>
                <th className="py-2.5 px-3 text-right">Likes</th>
                <th className="py-2.5 px-3 text-right">Comments</th>
                <th className="py-2.5 px-3 text-right">Shares</th>
                <th className="py-2.5 px-3 text-right">Link Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {publishedPosts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-neutral-850">
                  <td className="py-2.5 px-3 max-w-xs">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {post.campaignName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {post.caption}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 capitalize">
                    <span className={`px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded ${
                      post.platform === 'instagram' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {post.platform}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium tabular-nums">
                    {(post.metrics?.reach || 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium tabular-nums">
                    {(post.metrics?.likes || 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium tabular-nums">
                    {(post.metrics?.comments || 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium tabular-nums">
                    {(post.metrics?.shares || 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium tabular-nums text-indigo-600 dark:text-indigo-400 font-bold">
                    {(post.metrics?.clicks || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
