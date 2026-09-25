import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  Info, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp,
  Instagram,
  Facebook
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const DMAnalyticsView: React.FC = () => {
  const { isDarkMode, dmCampaigns, dmMetrics, showToast } = useApp();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  const dailyVolumeData = [
    { day: 'Mon', attempted: 50, delivered: 49, replies: 23, optOuts: 0 },
    { day: 'Tue', attempted: 74, delivered: 73, replies: 32, optOuts: 1 },
    { day: 'Wed', attempted: 68, delivered: 68, replies: 29, optOuts: 0 },
    { day: 'Thu', attempted: 98, delivered: 97, replies: 46, optOuts: 1 },
    { day: 'Fri', attempted: 114, delivered: 112, replies: 54, optOuts: 0 },
    { day: 'Sat', attempted: 92, delivered: 91, replies: 38, optOuts: 1 },
    { day: 'Sun', attempted: 90, delivered: 89, replies: 26, optOuts: 0 },
  ];

  const failureReasonsData = [
    { reason: '24h Window Elapsed', count: 18, color: '#f59e0b' },
    { reason: 'Recipient Opted Out', count: 4, color: '#ef4444' },
    { reason: 'User Privacy Settings', count: 2, color: '#6366f1' },
    { reason: 'Transient Rate Limit', count: 1, color: '#a855f7' }
  ];

  const handleExportCSV = () => {
    const headers = 'Campaign Name,Platform,Objective,Targeted,Eligible,Delivered,Replies,Response Rate (%)\n';
    const rows = dmCampaigns.map(c => {
      const rate = c.stats.deliveredCount > 0 ? ((c.stats.replyCount / c.stats.deliveredCount) * 100).toFixed(1) : '0';
      return `"${c.name}","${c.platform}","${c.objective}",${c.stats.totalTargeted},${c.stats.eligibleCount},${c.stats.deliveredCount},${c.stats.replyCount},${rate}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firmexpo_dm_analytics_${Date.now()}.csv`;
    a.click();
    showToast('Analytics CSV exported successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            DM Campaign Analytics & Insights
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Audit-grade performance metrics, webhook-confirmed delivery stats, and conversion attribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Selector */}
          <div className={`flex items-center rounded-lg border p-1 text-xs ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
          }`}>
            {(['7d', '30d', '90d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  dateRange === range 
                    ? 'bg-slate-200 dark:bg-neutral-800 text-slate-900 dark:text-white font-semibold' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
                }`}
              >
                Last {range.replace('d', ' Days')}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Messages Attempted</span>
            <Send className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">586</span>
          <p className="text-[10px] text-slate-500 mt-1">Dispatched via Meta Send API</p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Webhook-Confirmed Delivery</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">582</span>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">99.3% delivery rate</p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Customer Replies</span>
            <MessageSquare className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">248</span>
          <p className="text-[10px] text-purple-600 font-semibold mt-1">{dmMetrics.responseRate}% response rate</p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Opt-Out Suppression</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">3</span>
          <p className="text-[10px] text-slate-400 mt-1">0.5% suppression rate</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Delivery & Replies Trend */}
        <div className={`lg:col-span-2 p-5 rounded-2xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Daily Transmission & Replies Comparison
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                Delivered direct messages vs inbound attendee conversation responses
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#262626' : '#f1f5f9'} />
                <XAxis dataKey="day" stroke={isDarkMode ? '#737373' : '#94a3b8'} fontSize={11} />
                <YAxis stroke={isDarkMode ? '#737373' : '#94a3b8'} fontSize={11} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#171717' : '#ffffff',
                    borderColor: isDarkMode ? '#262626' : '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="delivered" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Delivered DMs" />
                <Bar dataKey="replies" fill="#a855f7" radius={[4, 4, 0, 0]} name="Inbound Replies" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exclusion & Failure Reason Breakdown */}
        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
            Pre-Send Safety Exclusions
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-neutral-400 mb-4">
            Why potential contacts were safely blocked from dispatch
          </p>

          <div className="space-y-3 text-xs">
            {failureReasonsData.map(item => (
              <div key={item.reason} className="p-3 rounded-xl border border-inherit space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800 dark:text-neutral-200">{item.reason}</span>
                  <span className="font-mono text-xs">{item.count}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(item.count / 25) * 100}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-inherit mt-4 text-[10px] text-slate-400 leading-relaxed">
            * All exclusions are enforced by <code>MessagingEligibilityService</code> prior to any external API call to Meta.
          </div>
        </div>
      </div>
    </div>
  );
};
