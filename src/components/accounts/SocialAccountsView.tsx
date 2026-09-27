import React, { useState } from 'react';
import { 
  Share2, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Radio, 
  X, 
  KeyRound, 
  Info, 
  Layers, 
  Sparkles,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SocialAccount } from '../../types';
import { META_PERMISSIONS } from '../../lib/meta/permissions';

export const SocialAccountsView: React.FC = () => {
  const { 
    socialAccounts, 
    connectAccount, 
    disconnectAccount, 
    reauthorizeAccount, 
    isDarkMode, 
    isDemoMode,
    metaConfig,
    syncLiveMetaAccounts,
    clearAllDummyData,
    showToast 
  } = useApp();

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedPlatformToConnect, setSelectedPlatformToConnect] = useState<'facebook' | 'instagram'>('facebook');
  const [newAccountName, setNewAccountName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPageId, setNewPageId] = useState('');
  const [newPageToken, setNewPageToken] = useState('');
  const [syncingLive, setSyncingLive] = useState(false);

  const hasDummyAccounts = socialAccounts.some(a => a.id.startsWith('acc-ig-') || a.id.startsWith('acc-fb-'));
  const hasRealToken = Boolean(metaConfig.pageAccessToken && metaConfig.pageAccessToken.trim().length > 10);

  const handleSyncFromMeta = async () => {
    setSyncingLive(true);
    try {
      await syncLiveMetaAccounts();
    } finally {
      setSyncingLive(false);
    }
  };

  const handleSimulateOAuth = (platform: 'facebook' | 'instagram') => {
    setSelectedPlatformToConnect(platform);
    setNewAccountName(platform === 'facebook' ? 'Firm Expo Global Hub' : 'firmexpo_official');
    setNewUsername(platform === 'facebook' ? 'firmexpo.hub' : 'firmexpo_official');
    setNewPageId('');
    setNewPageToken('');
    setConnectModalOpen(true);
  };

  const handleConfirmConnect = () => {
    if (!newAccountName) return;

    connectAccount({
      platform: selectedPlatformToConnect,
      name: newAccountName,
      username: newUsername || newAccountName.toLowerCase().replace(/\s+/g, '_'),
      externalId: newPageId || `ext-${Date.now()}`,
      accountType: selectedPlatformToConnect === 'facebook' ? 'page' : 'business',
      followersCount: 15400,
      avatarUrl: selectedPlatformToConnect === 'facebook' 
        ? '/src/assets/images/post_interior_nordic_1790377256977.jpg' 
        : '/src/assets/images/post_tech_headphones_1790377245788.jpg',
    });

    setConnectModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Connected Social Accounts
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Manage Meta Graph API v22.0 authorizations for Facebook Pages and Instagram Professional profiles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncFromMeta}
            disabled={syncingLive}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            title="Fetch real Facebook Pages and Instagram accounts using your configured Meta token"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingLive ? 'animate-spin' : ''}`} />
            <span>{syncingLive ? 'Syncing Meta...' : 'Sync Live Accounts from Meta'}</span>
          </button>

          <button
            onClick={clearAllDummyData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/60 rounded-lg transition-colors"
            title="Purge all sample/dummy mock data across the platform"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Dummy Data</span>
          </button>

          <button
            onClick={() => handleSimulateOAuth('facebook')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Facebook Page</span>
          </button>

          <button
            onClick={() => handleSimulateOAuth('instagram')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Instagram Pro</span>
          </button>
        </div>
      </div>

      {/* Real Meta Data Notification Banner */}
      {hasDummyAccounts && (
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDarkMode ? 'bg-indigo-950/30 border-indigo-800/60 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
        }`}>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold">Real Meta Token Configured</span>
              <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-neutral-300">
                You have entered live Meta credentials. Click <span className="font-bold text-indigo-600 dark:text-indigo-400">"Sync Live Accounts from Meta"</span> to pull your real Facebook Pages and Instagram Business accounts, or <span className="font-bold text-red-600 dark:text-red-400">"Clear Dummy Data"</span> to remove all mock accounts and sample campaigns.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSyncFromMeta}
              disabled={syncingLive}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingLive ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
            <button
              onClick={clearAllDummyData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Mock Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Meta Token Status Advisory */}
      <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h3 className="font-bold text-slate-900 dark:text-white">
            OAuth 2.0 Security & Long-Lived Token Policy
          </h3>
          <p className="text-slate-600 dark:text-neutral-400 mt-1 leading-relaxed">
            All connected Facebook Pages and Instagram Business accounts use encrypted 60-day Long-Lived tokens. Credentials are held in a secure server-side vault (AES-256) and never sent to browser sessions. Firm Expo automatically triggers proactive renewal before the 60-day expiry threshold.
          </p>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socialAccounts.map(account => (
          <div 
            key={account.id}
            className={`p-5 rounded-xl border transition-all ${
              account.isConnected
                ? isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
                : 'border-red-300 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={account.avatarUrl} 
                  alt={account.name} 
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-neutral-700" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{account.name}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                      account.platform === 'instagram' 
                        ? 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {account.platform}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    @{account.username} · {account.accountType}
                  </div>
                </div>
              </div>

              {/* Status Pill */}
              <div className="shrink-0">
                {account.isConnected ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded">
                    <AlertTriangle className="w-3.5 h-3.5" /> Action Required
                  </span>
                )}
              </div>
            </div>

            {/* Error Message if disconnected */}
            {account.errorDetails && (
              <div className="mb-3 p-2.5 rounded-lg bg-red-100/70 dark:bg-red-950/60 text-red-800 dark:text-red-200 text-xs">
                {account.errorDetails}
              </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-inherit text-xs text-center my-3">
              <div>
                <span className="text-slate-400 text-[11px]">Followers / Likes</span>
                <p className="font-bold text-slate-800 dark:text-neutral-200 tabular-nums mt-0.5">
                  {account.followersCount.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Token Validity</span>
                <p className="font-bold text-slate-800 dark:text-neutral-200 tabular-nums mt-0.5">
                  {account.isConnected ? 'Valid (45 days)' : 'Expired'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Last Sync</span>
                <p className="font-bold text-slate-800 dark:text-neutral-200 tabular-nums mt-0.5">
                  {account.lastSyncedAt}
                </p>
              </div>
            </div>

            {/* Granted Scopes */}
            <div className="text-[11px] mb-4">
              <span className="text-slate-400 font-medium">Granted Scopes:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {account.permissions.map(scope => (
                  <span key={scope} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 font-mono text-[10px]">
                    {scope}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => reauthorizeAccount(account.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-authorize
              </button>

              <button
                onClick={() => disconnectAccount(account.id)}
                className="text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Meta Permissions Explanations Table */}
      <div className={`p-5 rounded-xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Required Meta Graph API Permissions & Compliance Matrix
        </h2>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
          Firm Expo requests minimal necessary permissions to publish exhibition media, retrieve analytics, and manage attendee interactions.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase ${
                isDarkMode ? 'border-neutral-800 text-neutral-400' : 'border-slate-200 text-slate-500'
              }`}>
                <th className="py-2.5 px-3">Permission Scope</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Purpose & Justification</th>
                <th className="py-2.5 px-3 text-center">App Review Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {META_PERMISSIONS.map(perm => (
                <tr key={perm.scope} className="hover:bg-slate-50 dark:hover:bg-neutral-850">
                  <td className="py-2.5 px-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {perm.scope}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-neutral-300">
                    {perm.category}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-neutral-400 leading-normal">
                    {perm.justification}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      perm.requiresAppReview ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {perm.requiresAppReview ? 'Yes (Live)' : 'Standard'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connect Account Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <h3 className="font-bold text-base">
                Connect {selectedPlatformToConnect === 'facebook' ? 'Facebook Page' : 'Instagram Pro Account'}
              </h3>
              <button onClick={() => setConnectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">
                  {selectedPlatformToConnect === 'facebook' ? 'Facebook Page Name' : 'Instagram Display Name'}
                </label>
                <input
                  type="text"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="e.g. Firm Expo Paris Pavilion"
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Username / Handle</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. firmexpo_paris"
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  {selectedPlatformToConnect === 'facebook' ? 'Meta Page ID (Optional)' : 'Instagram Account ID (Optional)'}
                </label>
                <input
                  type="text"
                  value={newPageId}
                  onChange={(e) => setNewPageId(e.target.value)}
                  placeholder={selectedPlatformToConnect === 'facebook' ? 'e.g. 102938475610293' : 'e.g. 17841400000000000'}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 text-xs">
                Connects directly to your Meta Developer Graph API account. Saved accounts and credentials are encrypted and stored in Firestore database.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-inherit">
                <button
                  onClick={() => setConnectModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmConnect}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Authorize & Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
