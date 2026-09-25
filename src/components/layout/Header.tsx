import React, { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  Plus, 
  Radio, 
  ChevronRight,
  Database,
  Cloud,
  CloudCheck,
  LogIn,
  LogOut,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ sidebarCollapsed }) => {
  const { 
    currentTab, 
    setCurrentTab, 
    currentWorkspace, 
    isDemoMode, 
    setIsDemoMode, 
    isDarkMode, 
    toggleDarkMode,
    socialAccounts,
    auditLogs,
    user,
    isSyncing,
    loginWithGoogle,
    logout
  } = useApp();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'overview': return 'Executive Overview';
      case 'campaigns': return 'Campaign Management';
      case 'planner': return 'Content Planner & Calendar';
      case 'create_campaign': return 'Create Campaign Wizard';
      case 'accounts': return 'Connected Social Accounts';
      case 'media': return 'Exhibition Media Library';
      case 'analytics': return 'Performance & Audience Analytics';
      case 'inbox': return 'Shared Social Inbox';
      case 'audience': return 'Public Account Research (Business Discovery)';
      case 'team': return 'Team Roles & Permissions';
      case 'settings': return 'Meta API & Compliance Settings';
      default: return 'Dashboard';
    }
  };

  const activeAccountsCount = socialAccounts.filter(a => a.isConnected).length;

  return (
    <header className={`sticky top-0 z-20 h-16 border-b transition-colors flex items-center justify-between px-6 ${
      isDarkMode 
        ? 'bg-neutral-900/90 backdrop-blur-md border-neutral-800 text-neutral-100' 
        : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-800'
    }`}>
      {/* Breadcrumbs Zone */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 dark:text-neutral-500 font-medium">Firm Expo</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-neutral-600" />
        <span className="text-slate-500 dark:text-neutral-400 font-medium truncate max-w-[140px] sm:max-w-none">
          {currentWorkspace.name}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-neutral-600" />
        <span className="font-semibold text-slate-900 dark:text-white">
          {getBreadcrumbTitle()}
        </span>
      </div>

      {/* Action Controls & Mode Switcher */}
      <div className="flex items-center gap-3">
        {/* Firestore Database Sync Badge */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
          user 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300' 
            : 'bg-slate-100 dark:bg-neutral-800/60 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400'
        }`}>
          {isSyncing ? (
            <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
          ) : user ? (
            <Database className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Cloud className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span className="text-[11px] font-medium">
            {isSyncing ? 'Syncing to Firestore...' : user ? 'Firestore Persistent' : 'Local Sandbox'}
          </span>
        </div>

        {/* Mode Selector Toggle */}
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs border ${
          isDemoMode 
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300'
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="font-medium text-[11px] whitespace-nowrap hidden md:inline">
            {isDemoMode ? 'Demo Mode' : 'Live Meta Graph API v22.0'}
          </span>
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wider transition-colors ${
              isDemoMode 
                ? 'bg-amber-200/70 hover:bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                : 'bg-emerald-200/70 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100'
            }`}
            title="Toggle between sample demonstration data and production Meta API connectivity"
          >
            {isDemoMode ? 'Live Mode' : 'Demo Mode'}
          </button>
        </div>

        {/* Connected Accounts indicator */}
        <button 
          onClick={() => setCurrentTab('accounts')}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          title="Manage connected Meta Pages and Instagram Business accounts"
        >
          <Radio className="w-3.5 h-3.5 text-indigo-500" />
          <span>{activeAccountsCount} Connected</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
          </button>

          {notificationOpen && (
            <div className={`absolute right-0 mt-2 w-80 rounded-xl border shadow-xl p-3 z-50 ${
              isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-inherit mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Activity Notifications</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer" onClick={() => setNotificationOpen(false)}>
                  Dismiss
                </span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {auditLogs.slice(0, 4).map(log => (
                  <div key={log.id} className="p-2 rounded-lg bg-slate-50 dark:bg-neutral-800/60 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-800 dark:text-neutral-200 mb-0.5">
                      <span className="truncate">{log.targetName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">Just now</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-neutral-400">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Google Sign-in */}
        <div className="relative">
          {user ? (
            <div>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium max-w-[100px] truncate hidden sm:inline">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-xl p-2 z-50 ${
                  isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="px-3 py-2 border-b border-inherit">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {user.displayName || 'Authorized User'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                      {user.email}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <Database className="w-3 h-3" />
                      <span>Firebase Database Active</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-700 rounded-lg shadow-2xs transition-colors shrink-0"
              title="Sign in with Google to sync campaigns with Firebase Firestore"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-500" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => setCurrentTab('create_campaign')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Campaign</span>
        </button>
      </div>
    </header>
  );
};
