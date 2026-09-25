import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  CalendarDays, 
  PlusCircle, 
  Share2, 
  Image as ImageIcon, 
  BarChart3, 
  MessageSquare, 
  Search, 
  Users2, 
  Settings, 
  ChevronDown, 
  Building2, 
  PanelLeftClose, 
  PanelLeftOpen,
  CheckCircle2,
  AlertTriangle,
  Globe2
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { 
    currentTab, 
    setCurrentTab, 
    workspaces, 
    currentWorkspace, 
    setCurrentWorkspace,
    conversations,
    posts,
    scheduledMessages,
    isDarkMode,
    user,
    loginWithGoogle,
    logout
  } = useApp();

  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  // Unread inbox count
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const pendingScheduledCount = scheduledMessages.filter(s => s.status === 'pending').length;

  const dmNavItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeVariant?: 'purple' | 'amber';
  }> = [
    { id: 'overview', label: 'DM Overview', icon: LayoutDashboard },
    { id: 'create_dm_campaign', label: 'Create DM Campaign', icon: PlusCircle },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'audience', label: 'Audience Manager', icon: Users2 },
    { id: 'research', label: 'Public Account Research', icon: Search },
    { id: 'inbox', label: 'Inbox', icon: MessageSquare, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined, badgeVariant: 'purple' },
    { id: 'templates', label: 'Message Templates', icon: ImageIcon },
    { id: 'scheduled', label: 'Scheduled Messages', icon: CalendarDays, badge: pendingScheduledCount > 0 ? pendingScheduledCount : undefined, badgeVariant: 'amber' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'compliance', label: 'Compliance Center', icon: CheckCircle2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const secondaryNavItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
  }> = [
    { id: 'accounts', label: 'Social Accounts', icon: Share2 },
    { id: 'planner', label: 'Content Planner', icon: CalendarDays },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'team', label: 'Team Roles', icon: Users2 }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col border-r transition-all duration-200 ${
        isDarkMode 
          ? 'bg-neutral-900 border-neutral-800 text-neutral-200' 
          : 'bg-white border-slate-200 text-slate-800'
      } ${collapsed ? 'w-18' : 'w-64'}`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-inherit">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
              <Globe2 className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <div className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Firm Expo
                <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  Social
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">Meta Campaign Manager</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
        )}

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Workspace Switcher */}
      <div className="p-3 border-b border-inherit">
        <div className="relative">
          <button
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs font-medium transition-colors ${
              isDarkMode 
                ? 'bg-neutral-800/70 hover:bg-neutral-800 text-neutral-200' 
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              {!collapsed && (
                <div className="truncate">
                  <p className="font-semibold truncate">{currentWorkspace.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-neutral-400">{currentWorkspace.plan}</p>
                </div>
              )}
            </div>
            {!collapsed && <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          </button>

          {workspaceMenuOpen && !collapsed && (
            <div className={`absolute top-full left-0 right-0 mt-1.5 p-1 rounded-lg border shadow-lg z-50 ${
              isDarkMode ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-slate-200'
            }`}>
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Switch Workspace
              </div>
              {workspaces.map(ws => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setCurrentWorkspace(ws);
                    setWorkspaceMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                    ws.id === currentWorkspace.id 
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300'
                  }`}
                >
                  <span className="truncate">{ws.name}</span>
                  {ws.id === currentWorkspace.id && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {!collapsed && 'DM Campaign Suite'}
        </div>
        {dmNavItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? isDarkMode
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-indigo-50 text-indigo-700 font-semibold'
                  : isDarkMode
                    ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-neutral-200'}`} />
              
              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!collapsed && item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  item.badgeVariant === 'amber'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                }`}>
                  {item.badge}
                </span>
              )}

              {collapsed && item.badge !== undefined && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}

        <div className="pt-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-inherit mt-2">
          {!collapsed && 'Social Publishing & Vault'}
        </div>
        {secondaryNavItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? isDarkMode
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-indigo-50 text-indigo-700 font-semibold'
                  : isDarkMode
                    ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-neutral-200'}`} />
              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-inherit">
        {user ? (
          <div className={`flex items-center gap-3 p-2 rounded-lg ${
            isDarkMode ? 'bg-neutral-850' : 'bg-slate-50'
          }`}>
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-neutral-700" 
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            {!collapsed && (
              <div className="truncate flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-neutral-100 truncate">
                  {user.displayName || 'Authorized User'}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
                  Cloud Synced
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className={`flex items-center gap-3 p-2 rounded-lg ${
            isDarkMode ? 'bg-neutral-850' : 'bg-slate-50'
          }`}>
            <img 
              src="/src/assets/images/post_tech_headphones_1790377245788.jpg" 
              alt="Sarah Chen" 
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-neutral-700" 
            />
            {!collapsed && (
              <div className="truncate flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-900 dark:text-neutral-100 truncate">Guest / Demo</p>
                </div>
                <button
                  onClick={loginWithGoogle}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline text-left"
                >
                  Sign In with Google
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
