import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Dedicated DM Campaign Suite Views
import { DMOverviewView } from './components/dm/DMOverviewView';
import { CreateDMCampaignView } from './components/dm/CreateDMCampaignView';
import { DMCampaignsListView } from './components/dm/DMCampaignsListView';
import { AudienceManagerView } from './components/dm/AudienceManagerView';
import { PublicAccountResearchView } from './components/dm/PublicAccountResearchView';
import { DMInboxView } from './components/dm/DMInboxView';
import { MessageTemplatesView } from './components/dm/MessageTemplatesView';
import { ScheduledMessagesView } from './components/dm/ScheduledMessagesView';
import { DMAnalyticsView } from './components/dm/DMAnalyticsView';
import { ComplianceCenterView } from './components/dm/ComplianceCenterView';

// Core Platform & Settings Views
import { SettingsView } from './components/settings/SettingsView';
import { SocialAccountsView } from './components/accounts/SocialAccountsView';
import { ContentPlannerView } from './components/calendar/ContentPlannerView';
import { MediaLibraryView } from './components/media/MediaLibraryView';
import { TeamPermissionsView } from './components/team/TeamPermissionsView';

import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { currentTab, isDarkMode, toast } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActiveView = () => {
    switch (currentTab) {
      // 11 Main DM Campaign Management Routes
      case 'overview':
        return <DMOverviewView />;
      case 'create_dm_campaign':
        return <CreateDMCampaignView />;
      case 'campaigns':
        return <DMCampaignsListView />;
      case 'audience':
        return <AudienceManagerView />;
      case 'research':
        return <PublicAccountResearchView />;
      case 'inbox':
        return <DMInboxView />;
      case 'templates':
        return <MessageTemplatesView />;
      case 'scheduled':
        return <ScheduledMessagesView />;
      case 'analytics':
        return <DMAnalyticsView />;
      case 'compliance':
        return <ComplianceCenterView />;
      case 'settings':
        return <SettingsView />;

      // Secondary & Supporting Views
      case 'accounts':
        return <SocialAccountsView />;
      case 'planner':
        return <ContentPlannerView />;
      case 'media':
        return <MediaLibraryView />;
      case 'team':
        return <TeamPermissionsView />;

      default:
        return <DMOverviewView />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isDarkMode ? 'dark bg-neutral-950 text-neutral-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-xl text-xs font-semibold backdrop-blur-md bg-white/95 dark:bg-neutral-900/95 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white animate-in fade-in slide-in-from-top-2">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-500" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className={`transition-all duration-200 ${sidebarCollapsed ? 'pl-18' : 'pl-64'}`}>
        <Header sidebarCollapsed={sidebarCollapsed} />

        <main className="p-6 max-w-7xl mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
