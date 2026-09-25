import React, { useState } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  XCircle, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Instagram, 
  Facebook, 
  Search, 
  RefreshCw 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ScheduledMessagesView: React.FC = () => {
  const { 
    isDarkMode, 
    scheduledMessages, 
    cancelScheduledMessage, 
    dispatchScheduledMessage, 
    isQueuePaused, 
    toggleQueuePause,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'dispatched' | 'cancelled'>('all');
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  const filteredMessages = scheduledMessages.filter(m => {
    const matchesSearch = m.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.renderedBody.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleManualDispatch = async (id: string) => {
    setDispatchingId(id);
    await dispatchScheduledMessage(id);
    setDispatchingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Scheduled Messages & Queue Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            BullMQ & Redis background worker queue with pre-dispatch eligibility re-check and emergency pause switch.
          </p>
        </div>

        {/* Global Emergency Pause Switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleQueuePause}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold text-xs shadow-xs transition-colors ${
              isQueuePaused
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 hover:bg-slate-300'
            }`}
          >
            {isQueuePaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isQueuePaused ? 'Resume Queue Dispatch' : 'Emergency Pause Queue'}</span>
          </button>
        </div>
      </div>

      {/* Queue Status Callout */}
      {isQueuePaused && (
        <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Queue is currently <strong>PAUSED</strong>. No pending messages will be dispatched until resumed.</span>
        </div>
      )}

      {/* Filter and Stats Bar */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
      }`}>
        <div className="flex items-center gap-2 text-xs">
          {(['all', 'pending', 'dispatched', 'cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
              }`}
            >
              {tab} ({scheduledMessages.filter(m => tab === 'all' || m.status === tab).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search queue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none ${
              isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
            }`}
          />
        </div>
      </div>

      {/* Scheduled Queue Items Table */}
      <div className={`rounded-xl border overflow-hidden ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-inherit text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-slate-50/50 dark:bg-neutral-850">
                <th className="py-3 px-3.5">Recipient</th>
                <th className="py-3 px-3.5">Campaign</th>
                <th className="py-3 px-3.5">Platform</th>
                <th className="py-3 px-3.5">Message Copy</th>
                <th className="py-3 px-3.5">Scheduled Slot</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filteredMessages.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-3.5">
                    <span className="font-semibold text-slate-900 dark:text-white block">{item.recipientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {item.recipientIdentifier}</span>
                  </td>

                  <td className="py-3 px-3.5 text-slate-700 dark:text-neutral-300 font-medium">
                    {item.campaignName}
                  </td>

                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-1.5 font-medium">
                      {item.platform === 'instagram' ? (
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

                  <td className="py-3 px-3.5 max-w-xs">
                    <p className="line-clamp-2 text-slate-600 dark:text-neutral-300 text-[11px] leading-relaxed">
                      {item.renderedBody}
                    </p>
                  </td>

                  <td className="py-3 px-3.5 text-slate-600 dark:text-neutral-400">
                    {new Date(item.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(item.scheduledFor).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-3 px-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'dispatched'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : item.status === 'pending'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        : item.status === 'cancelled'
                        ? 'bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                    }`}>
                      {item.status}
                    </span>
                    {item.eligibilityRechecked && (
                      <span className="text-[9px] text-emerald-600 block mt-0.5">✓ 24h Re-checked</span>
                    )}
                  </td>

                  <td className="py-3 px-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleManualDispatch(item.id)}
                            disabled={dispatchingId === item.id || isQueuePaused}
                            className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] flex items-center gap-1"
                            title="Dispatch this queued message immediately"
                          >
                            <Send className="w-3 h-3" />
                            <span>{dispatchingId === item.id ? 'Sending...' : 'Dispatch'}</span>
                          </button>

                          <button
                            onClick={() => cancelScheduledMessage(item.id)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Cancel scheduled dispatch"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
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
