import React, { useState } from 'react';
import { 
  Users2, 
  Shield, 
  UserPlus, 
  Check, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const TeamPermissionsView: React.FC = () => {
  const { teamMembers, auditLogs, isDarkMode, showToast } = useApp();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('content_creator');

  const handleSendInvite = () => {
    if (!inviteEmail) return;
    showToast(`Invitation sent to ${inviteEmail} with role: ${inviteRole}`, 'success');
    setInviteModalOpen(false);
    setInviteEmail('');
  };

  const roleDefinitions: Array<{
    role: UserRole;
    name: string;
    description: string;
    accounts: boolean;
    campaigns: boolean;
    approval: boolean;
    publish: boolean;
    analytics: boolean;
  }> = [
    {
      role: 'owner',
      name: 'Owner',
      description: 'Full workspace governance, billing, API credential management, and publishing rights.',
      accounts: true,
      campaigns: true,
      approval: true,
      publish: true,
      analytics: true,
    },
    {
      role: 'admin',
      name: 'Admin',
      description: 'Manages connected Meta accounts, approves content, and adds team members.',
      accounts: true,
      campaigns: true,
      approval: true,
      publish: true,
      analytics: true,
    },
    {
      role: 'campaign_manager',
      name: 'Campaign Manager',
      description: 'Oversees exhibition campaign schedules, budgets, and reviews creator drafts.',
      accounts: false,
      campaigns: true,
      approval: true,
      publish: true,
      analytics: true,
    },
    {
      role: 'content_creator',
      name: 'Content Creator',
      description: 'Drafts captions, selects media, and submits posts for internal manager approval.',
      accounts: false,
      campaigns: true,
      approval: false,
      publish: false,
      analytics: true,
    },
    {
      role: 'analyst',
      name: 'Analyst',
      description: 'Read-only access to campaign performance metrics, post insights, and CSV reports.',
      accounts: false,
      campaigns: false,
      approval: false,
      publish: false,
      analytics: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Team Roles & Permissions
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Role-based access control, content approval gates, and immutable audit logs
          </p>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className={`p-5 rounded-xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Active Workspace Members ({teamMembers.length})
        </h3>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
          Authorized staff with publishing and management permissions
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase ${
                isDarkMode ? 'border-neutral-800 text-neutral-400' : 'border-slate-200 text-slate-500'
              }`}>
                <th className="py-2.5 px-3">Member</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Assigned Campaigns</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {teamMembers.map(member => (
                <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-neutral-850">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-3">
                      <img src={member.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{member.name}</div>
                        <div className="text-[11px] text-slate-400">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded font-semibold text-[11px] uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {member.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 tabular-nums font-medium">
                    {member.campaignsAssigned} campaigns
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {member.joinedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix */}
      <div className={`p-5 rounded-xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Permission Governance Matrix
        </h3>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
          Strict separation of duties enforcing approval gates before live Meta publishing
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase ${
                isDarkMode ? 'border-neutral-800 text-neutral-400' : 'border-slate-200 text-slate-500'
              }`}>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3 text-center">Connect Accounts</th>
                <th className="py-2.5 px-3 text-center">Create Drafts</th>
                <th className="py-2.5 px-3 text-center">Approve Posts</th>
                <th className="py-2.5 px-3 text-center">Direct Publish</th>
                <th className="py-2.5 px-3 text-center">View Analytics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {roleDefinitions.map(def => (
                <tr key={def.role} className="hover:bg-slate-50 dark:hover:bg-neutral-850">
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block">{def.name}</span>
                    <span className="text-[10px] text-slate-400 max-w-xs block leading-tight">{def.description}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {def.accounts ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-slate-300 dark:text-neutral-700">—</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {def.campaigns ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-slate-300 dark:text-neutral-700">—</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {def.approval ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-slate-300 dark:text-neutral-700">—</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {def.publish ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-slate-300 dark:text-neutral-700">—</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {def.analytics ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-slate-300 dark:text-neutral-700">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className={`p-5 rounded-xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Security & Publishing Audit Trail
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
          Immutable event log for all campaign changes, approvals, account connections, and dispatches
        </p>

        <div className="space-y-2">
          {auditLogs.map(log => (
            <div key={log.id} className="p-3 rounded-lg border border-inherit flex items-start justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{log.actor.name}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400">
                    {log.action}
                  </span>
                  <span className="font-medium text-slate-700 dark:text-neutral-300 truncate">
                    {log.targetName}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1">{log.details}</p>
              </div>

              <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="font-bold text-base mb-3">Invite Team Member</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@firmexpo.com"
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="content_creator">Content Creator (Requires Manager Approval)</option>
                  <option value="campaign_manager">Campaign Manager</option>
                  <option value="analyst">Analyst (Read-Only Insights)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-inherit">
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvite}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
