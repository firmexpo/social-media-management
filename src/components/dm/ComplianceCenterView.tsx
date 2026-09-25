import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Search, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Lock, 
  FileText, 
  Clock,
  Instagram,
  Facebook,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OptOutRecord, Platform } from '../../types';

export const ComplianceCenterView: React.FC = () => {
  const { 
    isDarkMode, 
    optOutRecords, 
    addOptOutRecord, 
    removeOptOutRecord, 
    complianceAudits,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'suppression' | 'audit' | 'policy'>('suppression');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New opt-out form
  const [newPlatform, setNewPlatform] = useState<Platform>('instagram');
  const [newRecipientId, setNewRecipientId] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newReason, setNewReason] = useState<OptOutRecord['reason']>('user_keyword_stop');

  const filteredOptOuts = optOutRecords.filter(r => 
    r.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.recipientIdentifier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOptOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientId.trim() || !newDisplayName.trim()) {
      showToast('Recipient ID and name are required', 'error');
      return;
    }

    const record: OptOutRecord = {
      id: `opt-${Date.now()}`,
      platform: newPlatform,
      recipientIdentifier: newRecipientId.trim(),
      displayName: newDisplayName.trim(),
      reason: newReason,
      optedOutAt: new Date().toISOString(),
      recordedBy: 'Compliance Officer (Manual Addition)',
      campaignsSuppressedCount: 0
    };

    addOptOutRecord(record);
    setShowAddModal(false);
    setNewRecipientId('');
    setNewDisplayName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Opt-Out & Compliance Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Global suppression lists, audit trail, consent provenance, and Meta 24-hour response window enforcement.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Suppression Record</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-inherit pb-2 text-xs">
        <button
          onClick={() => setActiveTab('suppression')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'suppression'
              ? 'bg-slate-200 dark:bg-neutral-800 text-slate-900 dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-red-500" />
          <span>Suppression List ({optOutRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'audit'
              ? 'bg-slate-200 dark:bg-neutral-800 text-slate-900 dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>Eligibility Audit Trail ({complianceAudits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('policy')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'policy'
              ? 'bg-slate-200 dark:bg-neutral-800 text-slate-900 dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Meta Policy Guidelines</span>
        </button>
      </div>

      {/* TAB 1: Suppression List */}
      {activeTab === 'suppression' && (
        <div className="space-y-4">
          <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search suppressed recipients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <span className="text-xs text-slate-400 font-mono">
              {filteredOptOuts.length} active suppressions
            </span>
          </div>

          <div className={`rounded-xl border overflow-hidden ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-inherit text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-slate-50/50 dark:bg-neutral-850">
                  <th className="py-3 px-3.5">Recipient</th>
                  <th className="py-3 px-3.5">Platform</th>
                  <th className="py-3 px-3.5">Suppression Trigger</th>
                  <th className="py-3 px-3.5">Recorded At</th>
                  <th className="py-3 px-3.5">Recorded By</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit">
                {filteredOptOuts.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-3.5">
                      <span className="font-semibold text-slate-900 dark:text-white block">{rec.displayName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {rec.recipientIdentifier}</span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-1 font-medium capitalize">
                        {rec.platform === 'instagram' ? <Instagram className="w-3.5 h-3.5 text-pink-500" /> : <Facebook className="w-3.5 h-3.5 text-blue-500" />}
                        <span>{rec.platform}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="font-semibold text-red-600 dark:text-red-400 capitalize">
                        {rec.reason.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-500">
                      {new Date(rec.optedOutAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 text-slate-700 dark:text-neutral-300">
                      {rec.recordedBy}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        onClick={() => removeOptOutRecord(rec.id)}
                        className="text-xs text-red-600 hover:underline font-semibold"
                        title="Remove suppression"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Eligibility Audit Trail */}
      {activeTab === 'audit' && (
        <div className={`p-5 rounded-2xl border space-y-3 ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Immutable Automated Audit Events
          </h3>

          <div className="space-y-2">
            {complianceAudits.map(item => (
              <div key={item.id} className="p-3 rounded-xl border border-inherit flex items-start justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      item.status === 'passed' ? 'bg-emerald-500' : item.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-[11px]">{item.action}</span>
                    <span className="text-[10px] text-slate-400">· {item.policyRule}</span>
                  </div>
                  <p className="text-slate-600 dark:text-neutral-300 text-[11px] leading-relaxed">
                    {item.details}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Meta Platform Policy Documentation */}
      {activeTab === 'policy' && (
        <div className={`p-6 rounded-2xl border space-y-4 text-xs ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Meta Graph API v22.0 Messaging Compliance Architecture
          </h3>

          <div className="space-y-3 leading-relaxed text-slate-600 dark:text-neutral-300">
            <p>
              The Firm Expo Social DM Campaign Manager implements the following architectural constraints to maintain 100% compliance with Meta Platform Terms and regional privacy regulations:
            </p>

            <div className="p-3.5 rounded-xl border border-inherit space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">1. The 24-Hour Customer Care Window</h4>
              <p>
                Instagram Direct APIs mandate that messages sent by businesses are in response to a customer-initiated interaction occurring within the past 24 hours. The engine calculates window expiration on every recipient at schedule-time and again immediately prior to network dispatch.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-inherit space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">2. Prohibition on Public Follower Extraction</h4>
              <p>
                Public followers of Instagram accounts do <em>not</em> constitute an eligible messaging list. Firm Expo's Public Account Research module is isolated in a separate database model without export-to-campaign or cold DM initiation pathways.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-inherit space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">3. Commercial Opt-Out & Suppression</h4>
              <p>
                Inbound keywords such as STOP, UNSUBSCRIBE, and CANCEL are parsed automatically by webhook listeners and recorded into a global suppression list with instant exclusion from future dispatches.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Manual Opt-Out Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-bold">Add Manual Suppression Entry</h3>

            <form onSubmit={handleAddOptOut} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Platform</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as Platform)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="instagram">Instagram Direct (IGSID)</option>
                  <option value="facebook">Facebook Messenger (PSID)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Recipient ID / Scoped ID</label>
                <input
                  type="text"
                  placeholder="e.g. igsid_902831201 or psid_4401928310"
                  value={newRecipientId}
                  onChange={(e) => setNewRecipientId(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-mono ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Attendee / User Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe (@john_doe)"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Reason</label>
                <select
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value as any)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="user_keyword_stop">User Inbound Keyword STOP</option>
                  <option value="support_request">Direct Support Request to Unsubscribe</option>
                  <option value="privacy_deletion">GDPR / Privacy Data Deletion</option>
                  <option value="manual_suppression">Manual Administrative Suppression</option>
                </select>
              </div>

              <div className="pt-3 border-t border-inherit flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-xs"
                >
                  Suppress Recipient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
