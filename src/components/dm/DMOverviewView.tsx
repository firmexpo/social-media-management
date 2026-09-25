import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  AlertTriangle, 
  Users, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  Plus, 
  Calendar, 
  Filter, 
  Info, 
  Radio, 
  Layers, 
  FileText,
  Activity,
  Instagram,
  Facebook,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const DMOverviewView: React.FC = () => {
  const { 
    isDarkMode, 
    setCurrentTab, 
    isDemoMode, 
    dmCampaigns, 
    eligibleContacts, 
    optOutRecords,
    dmMetrics 
  } = useApp();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'instagram' | 'facebook'>('all');

  // Chart data for daily message transmission and response trend
  const trendData = [
    { date: 'Sep 19', sent: 48, delivered: 48, replies: 22, failed: 0 },
    { date: 'Sep 20', sent: 72, delivered: 71, replies: 35, failed: 1 },
    { date: 'Sep 21', sent: 65, delivered: 65, replies: 28, failed: 0 },
    { date: 'Sep 22', sent: 94, delivered: 93, replies: 44, failed: 1 },
    { date: 'Sep 23', sent: 110, delivered: 109, replies: 52, failed: 1 },
    { date: 'Sep 24', sent: 88, delivered: 87, replies: 39, failed: 1 },
    { date: 'Sep 25', sent: 109, delivered: 109, replies: 28, failed: 0 },
  ];

  // Platform breakdown data
  const platformComparisonData = [
    { name: 'Instagram Direct', sent: 392, delivered: 390, replies: 178, rate: 45.4, color: '#E1306C' },
    { name: 'Facebook Messenger', sent: 194, delivered: 192, replies: 70, rate: 36.1, color: '#1877F2' }
  ];

  const pieData = [
    { name: 'Instagram', value: 392, color: '#E1306C' },
    { name: 'Facebook', value: 194, color: '#1877F2' }
  ];

  const activeContactsCount = eligibleContacts.filter(c => c.eligibilityStatus === 'eligible').length;
  const expiredContactsCount = eligibleContacts.filter(c => c.eligibilityStatus === 'window_expired').length;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Instagram & Facebook DM Campaign Overview
            </h1>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
              isDemoMode 
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' 
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            }`}>
              {isDemoMode ? 'Demo Sandbox' : 'Live Graph API v22.0'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            Compliant 1-to-1 conversational outreach for Firm Expo attendees, exhibitors, and verified event registrants.
          </p>
        </div>

        {/* Global Action & Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Platform Filter */}
          <div className={`flex items-center rounded-lg border p-1 text-xs ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedPlatform === 'all'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Platforms
            </button>
            <button
              onClick={() => setSelectedPlatform('instagram')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedPlatform === 'instagram'
                  ? 'bg-pink-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Instagram className="w-3 h-3" />
              <span>Instagram</span>
            </button>
            <button
              onClick={() => setSelectedPlatform('facebook')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedPlatform === 'facebook'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Facebook className="w-3 h-3" />
              <span>Facebook</span>
            </button>
          </div>

          {/* Date Range Selector */}
          <div className={`flex items-center rounded-lg border p-1 text-xs ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            {(['7d', '30d', '90d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  dateRange === range 
                    ? 'bg-slate-200 dark:bg-neutral-800 text-slate-900 dark:text-white' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                Last {range.replace('d', ' Days')}
              </button>
            ))}
          </div>

          {/* New Campaign CTA Button */}
          <button
            onClick={() => setCurrentTab('create_dm_campaign')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create DM Campaign</span>
          </button>
        </div>
      </div>

      {/* Meta 24-Hour Policy Notice Banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isDarkMode 
          ? 'bg-indigo-950/20 border-indigo-900/40 text-indigo-300' 
          : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
      }`}>
        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-indigo-950 dark:text-indigo-200">
            Meta Graph API Official Policy Enforced: 24-Hour Standard Response Window
          </p>
          <p className="text-slate-600 dark:text-indigo-300/80 leading-relaxed">
            Per Meta terms, businesses can only message customers who have initiated contact within the last 24 hours (or via approved Facebook Event Tags). Arbitrary scraping or unsolicited bulk DMing to public account followers is technically prohibited and strictly blocked.
          </p>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Campaigns */}
        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Total Campaigns</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {dmCampaigns.length}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {dmCampaigns.filter(c => c.status === 'running').length} active
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-1 truncate">
            {dmCampaigns.filter(c => c.status === 'scheduled').length} scheduled · {dmCampaigns.filter(c => c.status === 'completed').length} completed
          </p>
        </div>

        {/* Eligible Contacts within 24h Window */}
        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">24h Eligible Contacts</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {activeContactsCount}
            </span>
            <span className="text-[10px] text-slate-400">
              of {eligibleContacts.length} in CRM
            </span>
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 truncate">
            {expiredContactsCount} outside 24h window (safe-locked)
          </p>
        </div>

        {/* Messages Delivered */}
        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Delivered Messages</span>
            <Send className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {dmMetrics.messagesDelivered}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">
              99.3% delivery
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-1">
            Confirmed by Meta webhook status
          </p>
        </div>

        {/* Replies Received */}
        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Replies Received</span>
            <MessageSquare className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {dmMetrics.repliesReceived}
            </span>
            <span className="text-[10px] text-purple-600 font-semibold">
              {dmMetrics.responseRate}% rate
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-1 truncate">
            Inbound responses in Shared Inbox
          </p>
        </div>

        {/* Suppressed / Opted Out */}
        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Opt-Out Suppression</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {optOutRecords.length}
            </span>
            <span className="text-[10px] text-slate-400">
              records active
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-1 truncate">
            100% blocked from future campaigns
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Activity Over Time */}
        <div className={`lg:col-span-2 p-5 rounded-xl border ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Message Transmission & Replies Activity
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                Daily sent DMs, verified delivery, and inbound conversation replies
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span className="text-slate-600 dark:text-neutral-300 text-[11px]">Sent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-slate-600 dark:text-neutral-300 text-[11px]">Replies</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#262626' : '#f1f5f9'} />
                <XAxis dataKey="date" stroke={isDarkMode ? '#737373' : '#94a3b8'} fontSize={11} />
                <YAxis stroke={isDarkMode ? '#737373' : '#94a3b8'} fontSize={11} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#171717' : '#ffffff',
                    borderColor: isDarkMode ? '#262626' : '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
                <Area type="monotone" dataKey="sent" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorSent)" name="Sent DMs" />
                <Area type="monotone" dataKey="replies" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorReplies)" name="Customer Replies" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Volume Distribution */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Platform Distribution
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 mb-2">
              Instagram Direct vs Facebook Messenger outreach share
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#171717' : '#ffffff',
                      borderColor: isDarkMode ? '#262626' : '#e2e8f0',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-inherit text-xs">
            {platformComparisonData.map(p => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="font-medium text-slate-700 dark:text-neutral-300">{p.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span>{p.sent} sent</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-emerald-600 font-semibold">{p.rate}% reply</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Campaigns Table & Quick Navigation */}
      <div className={`p-5 rounded-xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Recent DM Campaigns
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400">
              Active, scheduled, and completed direct messaging campaigns
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('campaigns')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Campaigns</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-inherit text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Campaign</th>
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Audience</th>
                <th className="py-2.5 px-3">Sent / Deliv.</th>
                <th className="py-2.5 px-3">Replies</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {dmCampaigns.slice(0, 4).map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{c.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-neutral-400 truncate max-w-[240px]">
                      {c.firmExpoEventName || c.objective.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-medium">
                      {c.platform === 'instagram' ? (
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
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      c.status === 'running' 
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : c.status === 'scheduled'
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                        : c.status === 'completed'
                        ? 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-800 dark:text-neutral-200 font-medium">{c.audienceSegmentName}</div>
                    <div className="text-[10px] text-slate-400">{c.stats.eligibleCount} eligible recipients</div>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className="font-semibold text-slate-800 dark:text-neutral-200">{c.stats.sentCount}</span>
                    <span className="text-slate-400"> / {c.stats.deliveredCount}</span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">{c.stats.replyCount}</span>
                    {c.stats.deliveredCount > 0 && (
                      <span className="text-[10px] text-slate-400 ml-1">
                        ({Math.round((c.stats.replyCount / c.stats.deliveredCount) * 100)}%)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setCurrentTab('campaigns')}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      Manage
                    </button>
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
