import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Send, 
  Instagram, 
  Facebook, 
  CheckCircle2, 
  Clock, 
  Tag, 
  User, 
  FileText, 
  Paperclip, 
  Smile, 
  MoreVertical,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InboxConversation } from '../../types';

export const DMInboxView: React.FC = () => {
  const { 
    isDarkMode, 
    conversations, 
    replyToConversation, 
    toggleResolveConversation, 
    addInternalNote,
    messageTemplates,
    showToast 
  } = useApp();

  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'instagram' | 'facebook'>('all');
  const [replyText, setReplyText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');

  const getContactName = (conv: InboxConversation) => conv.sender?.name || conv.contactName || 'Attendee';
  const getContactUsername = (conv: InboxConversation) => conv.sender?.username || conv.contactUsername || 'attendee';
  const getContactAvatar = (conv: InboxConversation) => conv.sender?.avatarUrl || conv.contactAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  const filteredConversations = conversations.filter(c => {
    const name = getContactName(c).toLowerCase();
    const handle = getContactUsername(c).toLowerCase();
    const snippet = c.lastMessageSnippet.toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) ||
      handle.includes(searchQuery.toLowerCase()) ||
      snippet.includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || c.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  const activeConversation = conversations.find(c => c.id === selectedConvId) || filteredConversations[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConversation) return;

    replyToConversation(activeConversation.id, replyText.trim());
    setReplyText('');
  };

  const handleAddNote = () => {
    if (!internalNoteText.trim() || !activeConversation) return;
    addInternalNote(activeConversation.id, internalNoteText.trim());
    setInternalNoteText('');
  };

  const handleInsertTemplate = (tplBody: string) => {
    setReplyText(prev => `${prev ? prev + ' ' : ''}${tplBody}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Shared Social Inbox
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Centralized multi-agent inbox for eligible incoming Instagram Direct & Facebook Messenger conversations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Meta Webhooks Active (v22.0)</span>
          </div>
        </div>
      </div>

      {/* Main Inbox Workspace Container */}
      <div className={`rounded-2xl border flex flex-col md:flex-row h-[650px] overflow-hidden ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
      }`}>
        {/* Left Column: Conversation Directory */}
        <div className="w-full md:w-80 border-r border-inherit flex flex-col shrink-0">
          {/* Search & Filters */}
          <div className="p-3 border-b border-inherit space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              {(['all', 'instagram', 'facebook'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(p)}
                  className={`px-2 py-0.5 rounded capitalize font-medium ${
                    platformFilter === p
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-inherit">
            {filteredConversations.map(conv => {
              const isSelected = conv.id === activeConversation?.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-l-3 border-l-indigo-600' 
                      : 'hover:bg-slate-50 dark:hover:bg-neutral-850'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <img src={getContactAvatar(conv)} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="truncate text-xs">
                        <span className="font-semibold text-slate-900 dark:text-white truncate block">
                          {getContactName(conv)}
                        </span>
                        <span className="text-[10px] text-slate-400">@{getContactUsername(conv)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {conv.platform === 'instagram' ? (
                        <Instagram className="w-3 h-3 text-pink-500" />
                      ) : (
                        <Facebook className="w-3 h-3 text-blue-500" />
                      )}
                      <span className="text-[9px] text-slate-400">{conv.lastMessageAt}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-1 mt-1">
                    {conv.lastMessageSnippet}
                  </p>

                  <div className="flex items-center justify-between mt-1.5 text-[9px]">
                    <span className="text-emerald-600 font-medium">Within 24h Window</span>
                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Conversation Thread */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-3.5 border-b border-inherit flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={getContactAvatar(activeConversation)} alt="" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{getContactName(activeConversation)}</h3>
                    <span className="text-xs text-slate-400">@{getContactUsername(activeConversation)}</span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      24h Window Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Channel: {activeConversation.platform === 'instagram' ? 'Instagram Direct' : 'Facebook Messenger'} · Assigned: Sarah Chen
                  </p>
                </div>
              </div>

              {/* Sub-Tabs: Chat vs Internal Notes */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex border rounded-lg p-0.5 border-inherit">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-2.5 py-1 rounded-md font-medium ${
                      activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                    }`}
                  >
                    Messages
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-2.5 py-1 rounded-md font-medium ${
                      activeTab === 'notes' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                    }`}
                  >
                    Notes ({activeConversation.internalNotes?.length || 0})
                  </button>
                </div>

                <button
                  onClick={() => toggleResolveConversation(activeConversation.id)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                    activeConversation.isResolved
                      ? 'bg-slate-100 text-slate-600'
                      : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {activeConversation.isResolved ? 'Reopen' : 'Resolve'}
                </button>
              </div>
            </div>

            {/* Content Area */}
            {activeTab === 'chat' ? (
              <>
                {/* Messages Stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  <div className="text-center">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-500 font-medium">
                      User-Initiated Conversation · End-to-End Meta API Verified
                    </span>
                  </div>

                  {activeConversation.messages.map(msg => {
                    const isAgent = msg.senderType === 'agent';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                          isAgent 
                            ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs' 
                            : isDarkMode ? 'bg-neutral-800 border border-neutral-700 text-neutral-100 rounded-bl-xs' : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                        }`}>
                          <p className="whitespace-pre-line">{msg.text}</p>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.timestamp}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Composer */}
                <div className="p-3 border-t border-inherit space-y-2">
                  {/* Template Quick Insert */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
                    <span className="text-slate-400 text-[10px] shrink-0 font-medium">Templates:</span>
                    {messageTemplates.slice(0, 3).map(tpl => (
                      <button
                        key={tpl.id}
                        onClick={() => handleInsertTemplate(tpl.body)}
                        className="px-2 py-0.5 rounded border border-inherit text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 truncate max-w-[140px] shrink-0"
                      >
                        {tpl.name}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSendReply} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Reply to ${getContactName(activeConversation)} via official Meta API...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className={`flex-1 px-3 py-2 text-xs rounded-xl border outline-none ${
                        isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* Internal Notes Tab */
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                    Internal Agent Collaboration Notes
                  </h4>
                  <p className="text-xs text-slate-500">
                    Private notes visible only to Firm Expo campaign managers and support agents. Not visible to attendee.
                  </p>
                </div>

                <div className="space-y-2">
                  {(activeConversation.internalNotes || []).map((note, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-xs">
                      • {note}
                    </div>
                  ))}
                  {(!activeConversation.internalNotes || activeConversation.internalNotes.length === 0) && (
                    <p className="text-xs text-slate-400 italic">No notes recorded yet for this attendee.</p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add an internal note (e.g., Attendee requested VIP badge hold at Desk 4)..."
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    className={`flex-1 px-3 py-1.5 text-xs rounded-lg border outline-none ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
            <p className="text-xs">Select a conversation to review messages</p>
          </div>
        )}
      </div>
    </div>
  );
};
