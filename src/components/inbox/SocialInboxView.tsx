import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Send, 
  CheckCircle2, 
  User, 
  Tag, 
  FileText, 
  Layers, 
  AlertCircle, 
  Sparkles, 
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InboxConversation } from '../../types';

export const SocialInboxView: React.FC = () => {
  const { 
    conversations, 
    replyToConversation, 
    toggleResolveConversation, 
    addInternalNote, 
    isDarkMode, 
    teamMembers,
    showToast 
  } = useApp();

  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'instagram' | 'facebook'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'dm' | 'comment'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId);

  const filteredConversations = conversations.filter(c => {
    const matchesPlatform = platformFilter === 'all' || c.platform === platformFilter;
    const matchesType = typeFilter === 'all' || 
                        (typeFilter === 'dm' && (c.type === 'instagram_dm' || c.type === 'messenger')) ||
                        (typeFilter === 'comment' && c.type === 'post_comment');
    const matchesSearch = c.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.sender.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.lastMessageSnippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesType && matchesSearch;
  });

  const handleSendReply = () => {
    if (!replyText.trim() || !activeConv) return;
    replyToConversation(activeConv.id, replyText);
    setReplyText('');
  };

  const handleCannedReply = (text: string) => {
    setReplyText(text);
  };

  const handleAddNote = () => {
    if (!newNoteText.trim() || !activeConv) return;
    addInternalNote(activeConv.id, newNoteText);
    setNewNoteText('');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Shared Social Inbox
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Manage incoming attendee questions, booth inquiries, and comments across Instagram & Facebook
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
            {conversations.filter(c => !c.isResolved).length} open conversations
          </span>
        </div>
      </div>

      {/* Main Inbox Two-Pane Container */}
      <div className={`rounded-xl border overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        {/* Left Pane: Conversation List */}
        <div className={`md:col-span-5 border-r border-inherit flex flex-col ${
          isDarkMode ? 'bg-neutral-900' : 'bg-white'
        }`}>
          {/* Search & Filters */}
          <div className="p-3 border-b border-inherit space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search messages, attendees, handles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border outline-none ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1">
                {(['all', 'instagram', 'facebook'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatformFilter(p)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors ${
                      platformFilter === p 
                        ? 'bg-indigo-600 text-white font-semibold' 
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                {(['all', 'dm', 'comment'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase transition-colors ${
                      typeFilter === t 
                        ? 'bg-slate-200 dark:bg-neutral-700 text-slate-900 dark:text-white font-semibold' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conversation Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-inherit max-h-[520px]">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No matching conversations found.
              </div>
            ) : (
              filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    activeConvId === conv.id
                      ? isDarkMode ? 'bg-neutral-800/80' : 'bg-indigo-50/70'
                      : isDarkMode ? 'hover:bg-neutral-850' : 'hover:bg-slate-50'
                  }`}
                >
                  <img 
                    src={conv.sender.avatarUrl} 
                    alt="" 
                    className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-neutral-700" 
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs truncate text-slate-900 dark:text-white">
                        {conv.sender.name}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {conv.lastMessageAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                      <span className="capitalize">{conv.platform}</span>
                      <span>·</span>
                      <span>{conv.type.replace('_', ' ')}</span>
                      {conv.sentiment === 'inquiry' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          Inquiry
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-neutral-300 line-clamp-1">
                      {conv.lastMessageSnippet}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 self-center" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Active Thread & Response Desk */}
        <div className={`md:col-span-7 flex flex-col justify-between ${
          isDarkMode ? 'bg-neutral-900/60' : 'bg-slate-50/50'
        }`}>
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-inherit bg-white dark:bg-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={activeConv.sender.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                        {activeConv.sender.name}
                      </h3>
                      <span className="text-slate-400 text-xs">@{activeConv.sender.username}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 capitalize">
                      {activeConv.platform} {activeConv.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleResolveConversation(activeConv.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeConv.isResolved
                        ? 'bg-slate-200 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{activeConv.isResolved ? 'Mark Open' : 'Resolve'}</span>
                  </button>
                </div>
              </div>

              {/* Post Context Bar (If Comment) */}
              {activeConv.postContext && (
                <div className="px-4 py-2 border-b border-inherit bg-slate-100/70 dark:bg-neutral-800/50 flex items-center gap-3 text-xs">
                  <img src={activeConv.postContext.postMediaUrl} alt="" className="w-8 h-8 rounded object-cover" />
                  <div className="truncate flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Post Commented On:</span>
                    <span className="text-slate-700 dark:text-neutral-300 truncate block">
                      {activeConv.postContext.postCaption}
                    </span>
                  </div>
                </div>
              )}

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[340px]">
                {activeConv.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.senderType === 'customer' ? 'items-start' : 'items-end'
                    }`}
                  >
                    <div className={`p-3 rounded-xl max-w-sm text-xs leading-relaxed ${
                      msg.senderType === 'customer'
                        ? isDarkMode ? 'bg-neutral-800 text-white' : 'bg-white border border-slate-200 text-slate-900 shadow-2xs'
                        : 'bg-indigo-600 text-white'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Canned Response Presets */}
              <div className="px-4 py-2 border-t border-inherit bg-white dark:bg-neutral-900 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="text-slate-400 font-semibold shrink-0">Quick Reply:</span>
                <button
                  type="button"
                  onClick={() => handleCannedReply('Hello! Yes, booth registration for Dubai 2026 is currently open. You can apply at firmexpo.com/dubai or book a consultation call.')}
                  className="px-2 py-0.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-600 dark:text-neutral-300 shrink-0"
                >
                  Booth Space Link
                </button>
                <button
                  type="button"
                  onClick={() => handleCannedReply('Thank you for connecting! We have resent your visitor accreditation pass confirmation to your registered email.')}
                  className="px-2 py-0.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-600 dark:text-neutral-300 shrink-0"
                >
                  Resend Ticket
                </button>
                <button
                  type="button"
                  onClick={() => handleCannedReply('Thanks for your comment! See you at the Paris Design & Living Summit.')}
                  className="px-2 py-0.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-600 dark:text-neutral-300 shrink-0"
                >
                  Thank You
                </button>
              </div>

              {/* Reply Input Bar */}
              <div className="p-3 border-t border-inherit bg-white dark:bg-neutral-900 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type an official reply to send via Meta Graph API..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  className={`flex-1 px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                <button
                  onClick={handleSendReply}
                  className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
              Select a conversation from the left to view messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
