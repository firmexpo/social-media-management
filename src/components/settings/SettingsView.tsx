import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  KeyRound, 
  ShieldCheck, 
  Globe2, 
  Check, 
  AlertCircle, 
  AlertTriangle,
  ExternalLink,
  Copy,
  Radio,
  FileCode,
  Lock,
  Database,
  CheckCircle2,
  LogIn,
  LogOut,
  RefreshCw,
  HardDrive,
  Server,
  Cloud,
  Eye,
  EyeOff,
  Zap,
  Info,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { testConnection } from '../../lib/firebase';
import firebaseConfig from '../../../firebase-applet-config.json';

export const SettingsView: React.FC = () => {
  const { 
    isDemoMode, 
    setIsDemoMode, 
    metaConfig,
    updateMetaConfig,
    disableTestModeInDatabase,
    syncLiveMetaAccounts,
    clearAllDummyData,
    isDarkMode, 
    showToast, 
    user, 
    loginWithGoogle, 
    logout,
    bucketUrl,
    setBucketUrl,
    bucketName,
    setBucketName,
    testStorageConnection
  } = useApp();

  // Meta Developer Credentials State
  const [appId, setAppId] = useState(metaConfig.appId || '958144749148301');
  const [appSecret, setAppSecret] = useState(metaConfig.appSecret || '');
  const [pageAccessToken, setPageAccessToken] = useState(metaConfig.pageAccessToken || '');
  const [pageId, setPageId] = useState(metaConfig.pageId || '');
  const [instagramAccountId, setInstagramAccountId] = useState(metaConfig.instagramAccountId || '');
  const [webhookToken, setWebhookToken] = useState(metaConfig.webhookToken || 'firmexpo_secure_webhook_token_2026');
  
  // Visibility toggles
  const [showSecret, setShowSecret] = useState(false);
  const [showToken, setShowToken] = useState(false);
  
  // Action States
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [testingDb, setTestingDb] = useState(false);
  const [testingMeta, setTestingMeta] = useState(false);
  const [savingMeta, setSavingMeta] = useState(false);
  const [metaTestResult, setMetaTestResult] = useState<{
    success: boolean;
    message?: string;
    account?: any;
    tokenDetails?: any;
    error?: string;
    guidance?: string;
  } | null>(null);

  // Sync state when metaConfig loads from database
  useEffect(() => {
    if (metaConfig.appId) setAppId(metaConfig.appId);
    if (metaConfig.appSecret) setAppSecret(metaConfig.appSecret);
    if (metaConfig.pageAccessToken) setPageAccessToken(metaConfig.pageAccessToken);
    if (metaConfig.pageId) setPageId(metaConfig.pageId);
    if (metaConfig.instagramAccountId) setInstagramAccountId(metaConfig.instagramAccountId);
    if (metaConfig.webhookToken) setWebhookToken(metaConfig.webhookToken);
  }, [metaConfig]);

  // S3 Storage State
  const [storageEndpoint, setStorageEndpoint] = useState(bucketUrl);
  const [storageBucket, setStorageBucket] = useState(bucketName);
  const [testingStorage, setTestingStorage] = useState(false);
  const [storageStatusMessage, setStorageStatusMessage] = useState<string | null>(null);

  const handleTestStorage = async () => {
    setTestingStorage(true);
    setStorageStatusMessage(null);
    try {
      const res = await testStorageConnection();
      setStorageStatusMessage(res.message);
      showToast('Supabase S3 bucket endpoint reached successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Storage check failed', 'error');
    } finally {
      setTestingStorage(false);
    }
  };

  const handleSaveStorage = () => {
    setBucketUrl(storageEndpoint);
    setStorageBucket(storageBucket);
    setBucketName(storageBucket);
    showToast('S3 Storage configuration saved successfully', 'success');
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName} to clipboard`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestDatabase = async () => {
    setTestingDb(true);
    try {
      const ok = await testConnection();
      if (ok) {
        showToast('Firestore connection verified successfully!', 'success');
      } else {
        showToast('Firestore check reached server (offline or standby)', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Database test failed', 'error');
    } finally {
      setTestingDb(false);
    }
  };

  // Test Meta API Connection
  const handleTestMetaApi = async () => {
    if (!pageAccessToken && !appId) {
      showToast('Please provide a Page Access Token or App ID to test Meta Graph API', 'error');
      return;
    }

    setTestingMeta(true);
    setMetaTestResult(null);

    try {
      const response = await fetch('/api/meta/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: appId.trim(),
          appSecret: appSecret.trim(),
          accessToken: pageAccessToken.trim(),
          pageId: pageId.trim(),
          instagramAccountId: instagramAccountId.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMetaTestResult({
          success: true,
          message: data.message,
          account: data.account,
          tokenDetails: data.tokenDetails
        });
        showToast('Meta Graph API connection verified successfully!', 'success');
      } else {
        setMetaTestResult({
          success: false,
          error: data.error || 'Meta Graph API token verification failed',
          guidance: data.guidance
        });
        showToast(`Meta API Test: ${data.error || 'Failed'}`, 'error');
      }
    } catch (err: any) {
      setMetaTestResult({
        success: false,
        error: err.message || 'Unable to communicate with server to verify Meta API'
      });
      showToast('Network error verifying Meta API credentials', 'error');
    } finally {
      setTestingMeta(false);
    }
  };

  // Save Meta API Configuration to Firestore Database
  const handleSaveMetaSettings = async () => {
    setSavingMeta(true);
    try {
      await updateMetaConfig({
        appId: appId.trim(),
        appSecret: appSecret.trim(),
        pageAccessToken: pageAccessToken.trim(),
        pageId: pageId.trim(),
        instagramAccountId: instagramAccountId.trim(),
        webhookToken: webhookToken.trim(),
        isDemoMode: false, // Ensure live mode is saved
        status: metaTestResult?.success ? 'connected' : (metaConfig.status || 'untested')
      });

      // Automatically sync real accounts from Meta if token is present
      if (pageAccessToken.trim().length > 10) {
        await syncLiveMetaAccounts(pageAccessToken.trim());
      }

      showToast('Meta Graph API configuration saved to Firestore database! Test mode is disabled.', 'success');
    } catch (err: any) {
      showToast('Error saving settings to database', 'error');
    } finally {
      setSavingMeta(false);
    }
  };

  // Disable test mode directly and persist to database
  const handleDisableTestModePermanently = async () => {
    await disableTestModeInDatabase();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings & Meta API Setup
        </h1>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
          Configure Meta Graph API v22.0 credentials, verify tokens, disable test mode in database, and manage cloud persistence
        </p>
      </div>

      {/* Runtime Mode Notice / Test Mode Control */}
      <div className={`p-5 rounded-xl border ${
        !isDemoMode 
          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' 
          : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {!isDemoMode ? (
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {!isDemoMode ? 'Live Meta Graph API Active' : 'Test Mode (Demo Sandbox) Active'}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  !isDemoMode 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                }`}>
                  {!isDemoMode ? 'Test Mode Disabled in Database' : 'Test Mode Enabled'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-neutral-300 mt-1 leading-relaxed">
                {!isDemoMode 
                  ? 'The application is running in Live Mode. Scheduled messages and posts will dispatch directly to Meta Graph API v22.0 using your saved Page Access Token.' 
                  : 'Test mode is currently simulating API responses. Click the button to disable test mode and persist live mode to the database.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isDemoMode ? (
              <button
                type="button"
                onClick={handleDisableTestModePermanently}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Disable Test Mode in Database</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <Check className="w-4 h-4" />
                <span>Live Mode Synced</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meta Developer App & Graph API Configuration Card */}
      <div className={`p-5 rounded-xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Meta Graph API v22.0 Credentials
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            Official Graph API
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
          Configure your registered Meta Business App credentials and Page Access Token from developers.facebook.com to send live DMs and publish posts.
        </p>

        <div className="space-y-4 text-xs">
          {/* App ID & Secret */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-neutral-300">
                Meta App ID (Client ID)
              </label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="e.g. 958144749148301"
                className={`w-full px-3 py-2 text-xs font-mono rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-neutral-300">
                Meta App Secret
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={appSecret}
                  onChange={(e) => setAppSecret(e.target.value)}
                  placeholder="Enter Meta App Secret"
                  className={`w-full px-3 py-2 pr-10 text-xs font-mono rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Meta Page / User Access Token */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700 dark:text-neutral-300">
                Meta Page Access Token (or Long-Lived System User Token)
              </label>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer" onClick={() => window.open('https://developers.facebook.com/tools/explorer/', '_blank')}>
                Open Graph API Explorer ↗
              </span>
            </div>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={pageAccessToken}
                onChange={(e) => setPageAccessToken(e.target.value)}
                placeholder="EAABw... (Paste your 60-day or Permanent Page Access Token here)"
                className={`w-full px-3 py-2 pr-10 text-xs font-mono rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Required for live sending. Must include permissions: <code className="font-mono text-[10px] bg-slate-100 dark:bg-neutral-800 px-1 py-0.5 rounded">pages_messaging</code>, <code className="font-mono text-[10px] bg-slate-100 dark:bg-neutral-800 px-1 py-0.5 rounded">instagram_manage_messages</code>.
            </p>
          </div>

          {/* Page ID & Instagram Account ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-neutral-300">
                Facebook Page ID
              </label>
              <input
                type="text"
                value={pageId}
                onChange={(e) => setPageId(e.target.value)}
                placeholder="e.g. 102938475610293"
                className={`w-full px-3 py-2 text-xs font-mono rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-neutral-300">
                Instagram Business Account ID
              </label>
              <input
                type="text"
                value={instagramAccountId}
                onChange={(e) => setInstagramAccountId(e.target.value)}
                placeholder="e.g. 17841400000000000"
                className={`w-full px-3 py-2 text-xs font-mono rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>
          </div>

          {/* Webhook Token */}
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-neutral-300">
              Webhook Verify Token
            </label>
            <input
              type="text"
              value={webhookToken}
              onChange={(e) => setWebhookToken(e.target.value)}
              className={`w-full px-3 py-2 text-xs font-mono rounded-lg border outline-none ${
                isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          {/* Meta API Test Result Card */}
          {metaTestResult && (
            <div className={`p-4 rounded-xl border text-xs ${
              metaTestResult.success 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60 text-red-900 dark:text-red-200'
            }`}>
              <div className="flex items-start gap-2.5">
                {metaTestResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 flex-1">
                  <span className="font-bold block">
                    {metaTestResult.success ? 'Meta Graph API v22.0 Connected Successfully!' : 'Meta API Connection Failed'}
                  </span>
                  
                  {metaTestResult.error && (
                    <p className="text-red-800 dark:text-red-300 font-mono text-[11px] leading-relaxed">
                      {metaTestResult.error}
                    </p>
                  )}

                  {metaTestResult.guidance && (
                    <p className="text-slate-600 dark:text-neutral-300 text-[11px] bg-white/60 dark:bg-black/20 p-2 rounded">
                      💡 {metaTestResult.guidance}
                    </p>
                  )}

                  {metaTestResult.account && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/40 text-[11px]">
                      <div>
                        <span className="text-slate-500 dark:text-neutral-400">Account Identity:</span>{' '}
                        <span className="font-semibold">{metaTestResult.account.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-neutral-400">Managed Pages Found:</span>{' '}
                        <span className="font-semibold">{metaTestResult.account.pagesCount || 1} Page(s)</span>
                      </div>
                      {metaTestResult.tokenDetails?.expiresAt && (
                        <div>
                          <span className="text-slate-500 dark:text-neutral-400">Token Expiration:</span>{' '}
                          <span className="font-semibold">{metaTestResult.tokenDetails.expiresAt}</span>
                        </div>
                      )}
                      {metaTestResult.tokenDetails?.scopes && (
                        <div className="col-span-full">
                          <span className="text-slate-500 dark:text-neutral-400">Granted Scopes:</span>{' '}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {metaTestResult.tokenDetails.scopes.map((s: string) => (
                              <span key={s} className="px-1.5 py-0.5 bg-emerald-200/70 dark:bg-emerald-900/60 rounded text-[10px] font-mono">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons for Meta API */}
          <div className="pt-3 border-t border-inherit flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleTestMetaApi}
                disabled={testingMeta}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 font-semibold text-slate-700 dark:text-neutral-200 transition-colors text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingMeta ? 'animate-spin' : ''}`} />
                <span>{testingMeta ? 'Testing Meta API...' : 'Test Meta API Connection'}</span>
              </button>

              <button
                type="button"
                onClick={() => syncLiveMetaAccounts(pageAccessToken)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold transition-colors text-xs"
                title="Fetch live Facebook Pages and Instagram profiles from Meta Graph API"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-500" />
                <span>Sync Live Meta Accounts</span>
              </button>

              <button
                type="button"
                onClick={clearAllDummyData}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold transition-colors text-xs"
                title="Purge mock and sample data from the workspace"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Dummy Data</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSaveMetaSettings}
              disabled={savingMeta}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              {savingMeta ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Save Configuration & Sync Live</span>
            </button>
          </div>
        </div>
      </div>

      {/* Firebase Database & Cloud Storage Card */}
      <div className={`p-5 rounded-xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Firebase Firestore Database & Persistence
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Database Linked
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg border ${
              isDarkMode ? 'bg-neutral-800/60 border-neutral-700/80' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[11px] text-slate-400 font-medium">Firebase Project ID</span>
              <p className="font-mono text-xs font-semibold text-slate-800 dark:text-neutral-200 mt-0.5">
                {firebaseConfig.projectId}
              </p>
            </div>

            <div className={`p-3 rounded-lg border ${
              isDarkMode ? 'bg-neutral-800/60 border-neutral-700/80' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[11px] text-slate-400 font-medium">Firestore Database ID</span>
              <p className="font-mono text-[11px] font-semibold text-slate-800 dark:text-neutral-200 mt-0.5 truncate" title={firebaseConfig.firestoreDatabaseId}>
                {firebaseConfig.firestoreDatabaseId}
              </p>
            </div>
          </div>

          <div className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDarkMode ? 'bg-neutral-800/40 border-neutral-700/60' : 'bg-slate-50/70 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-neutral-200">
                  {user ? `Signed in as ${user.displayName || user.email}` : 'Google Authentication & Sync Ready'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                  {user 
                    ? 'All Meta API settings, campaigns, posts, and suppression records are synced to Firestore' 
                    : 'Sign in to ensure settings and campaigns automatically synchronize across all team members'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleTestDatabase}
                disabled={testingDb}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 font-medium text-slate-700 dark:text-neutral-200 transition-colors text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingDb ? 'animate-spin' : ''}`} />
                <span>{testingDb ? 'Testing...' : 'Test Connection'}</span>
              </button>

              {user ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/60 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors text-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Supabase S3-Compatible Cloud Storage & Media Vault Card */}
      <div className={`p-5 rounded-xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyan-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Supabase S3-Compatible Cloud Storage (Media Vault)
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
            Active S3 Endpoint
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
          Stores high-resolution promotional graphics, video reels, venue diagrams, and compliance attachments across campaigns.
        </p>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-neutral-300">
              S3 Bucket URL (Supabase S3 API)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={storageEndpoint}
                onChange={(e) => setStorageEndpoint(e.target.value)}
                placeholder="https://pyidhqlrxjjbjoajkqjr.storage.supabase.co/storage/v1/s3"
                className={`flex-1 px-3 py-2 text-xs font-mono rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => copyToClipboard(storageEndpoint, 'S3 Bucket URL')}
                className="px-2.5 py-2 rounded-lg border border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 font-semibold"
                title="Copy Bucket URL"
              >
                {copiedField === 'S3 Bucket URL' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-neutral-300">Default Bucket Name</label>
              <input
                type="text"
                value={storageBucket}
                onChange={(e) => setStorageBucket(e.target.value)}
                placeholder="firm-expo-media-vault"
                className={`w-full px-3 py-2 text-xs font-mono rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-neutral-300">S3 Compatibility Region</label>
              <input
                type="text"
                disabled
                value="us-east-1 (Global edge acceleration)"
                className={`w-full px-3 py-2 text-xs rounded-lg border opacity-80 cursor-not-allowed ${
                  isDarkMode ? 'bg-neutral-850 border-neutral-750 text-neutral-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
              />
            </div>
          </div>

          {storageStatusMessage && (
            <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 text-cyan-800 dark:text-cyan-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
              <span>{storageStatusMessage}</span>
            </div>
          )}

          <div className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDarkMode ? 'bg-neutral-800/40 border-neutral-700/60' : 'bg-slate-50/70 border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-neutral-200">
                  Supabase S3 Storage Provider
                </p>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                  Direct uploads, public asset hosting, and presigned URLs configured
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleTestStorage}
                disabled={testingStorage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 font-medium text-slate-700 dark:text-neutral-200 transition-colors text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingStorage ? 'animate-spin' : ''}`} />
                <span>{testingStorage ? 'Pinging S3...' : 'Test S3 Bucket'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveStorage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-xs transition-colors text-xs"
              >
                <span>Update S3 URL</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Meta Webhook & Callback Endpoints */}
      <div className={`p-5 rounded-xl border ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
          Endpoints for Meta Developer Dashboard
        </h3>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
          Paste these verified endpoints into your Meta App settings under Facebook Login and Webhooks
        </p>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Valid OAuth Redirect URI:</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                readOnly
                value="https://firmexpo.com/api/auth/meta/callback"
                className={`flex-1 px-3 py-1.5 font-mono text-[11px] rounded-lg border ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              />
              <button
                onClick={() => copyToClipboard('https://firmexpo.com/api/auth/meta/callback', 'OAuth Redirect URI')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 font-semibold"
              >
                {copiedField === 'OAuth Redirect URI' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Webhooks Callback URL:</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                readOnly
                value="https://firmexpo.com/api/webhooks/meta"
                className={`flex-1 px-3 py-1.5 font-mono text-[11px] rounded-lg border ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              />
              <button
                onClick={() => copyToClipboard('https://firmexpo.com/api/webhooks/meta', 'Webhooks URL')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 font-semibold"
              >
                {copiedField === 'Webhooks URL' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-medium">User Data Deletion Callback URL (Compliance):</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                readOnly
                value="https://firmexpo.com/api/meta/data-deletion"
                className={`flex-1 px-3 py-1.5 font-mono text-[11px] rounded-lg border ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              />
              <button
                onClick={() => copyToClipboard('https://firmexpo.com/api/meta/data-deletion', 'Data Deletion URL')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 font-semibold"
              >
                {copiedField === 'Data Deletion URL' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
