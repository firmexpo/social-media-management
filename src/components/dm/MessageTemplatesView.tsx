import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Copy, 
  Trash2, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Instagram, 
  Facebook, 
  CheckCircle2, 
  Eye,
  Edit3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MessageTemplate, DMCampaignObjective, Platform } from '../../types';
import { TemplateRenderer } from '../../lib/messaging/template-renderer';

export const MessageTemplatesView: React.FC = () => {
  const { 
    isDarkMode, 
    messageTemplates, 
    addMessageTemplate, 
    updateMessageTemplate, 
    deleteMessageTemplate,
    showToast 
  } = useApp();

  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(messageTemplates[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Template Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MessageTemplate['category']>('Registration Confirmation');
  const [platform, setPlatform] = useState<Platform | 'both'>('both');
  const [body, setBody] = useState('');

  const previewRender = selectedTemplate ? TemplateRenderer.render(selectedTemplate.body, {
    firstName: 'Sophia',
    fullName: 'Sophia Sterling',
    companyName: 'Firm Expo Partners',
    eventName: 'Firm Expo Global 2026',
    registrationLink: 'https://firmexpo.com/register'
  }) : null;

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) {
      showToast('Name and message body are required', 'error');
      return;
    }

    const newTpl: MessageTemplate = {
      id: `tpl-${Date.now()}`,
      name,
      platform,
      purpose: 'event_registration',
      category,
      body,
      supportedVariables: TemplateRenderer.extractVariables(body),
      approvalStatus: 'approved',
      createdBy: 'Sarah Chen',
      updatedAt: 'Just now'
    };

    addMessageTemplate(newTpl);
    setSelectedTemplate(newTpl);
    setShowCreateModal(false);
    setName('');
    setBody('');
  };

  const handleDuplicate = (tpl: MessageTemplate) => {
    const copy: MessageTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      name: `${tpl.name} (Copy)`,
      approvalStatus: 'draft',
      updatedAt: 'Just now'
    };
    addMessageTemplate(copy);
    showToast(`Duplicated template as "${copy.name}"`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Message Templates Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Approved copy patterns, safe variable placeholders, and compliance-reviewed message content.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Template</span>
        </button>
      </div>

      {/* Compliance Advisory */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isDarkMode ? 'bg-neutral-850 border-neutral-750 text-neutral-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">
          <strong>Compliance Note:</strong> Saving or approving a message template does <em>not</em> grant blanket authorization to dispatch unsolicited DMs. Every recipient must independently pass the 24-hour customer window and opt-out suppression check at sending time.
        </p>
      </div>

      {/* Two Column Layout: Template Directory vs Template Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Templates List */}
        <div className={`p-4 rounded-2xl border space-y-3 ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-inherit">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Approved Templates ({messageTemplates.length})
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[550px] overflow-y-auto">
            {messageTemplates.map(tpl => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedTemplate?.id === tpl.id
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30'
                    : isDarkMode ? 'border-neutral-800 hover:bg-neutral-800/40' : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {tpl.name}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {tpl.approvalStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-2">
                  <span>{tpl.category}</span>
                  <span>·</span>
                  <span className="capitalize">{tpl.platform}</span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {tpl.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Template Inspector & Simulator */}
        {selectedTemplate ? (
          <div className={`lg:col-span-2 p-6 rounded-2xl border space-y-5 ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className="flex items-start justify-between pb-4 border-b border-inherit">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedTemplate.name}</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {selectedTemplate.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Platform: {selectedTemplate.platform.toUpperCase()} · Author: {selectedTemplate.createdBy}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDuplicate(selectedTemplate)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 text-xs font-medium hover:bg-slate-100 dark:hover:bg-neutral-800"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>
              </div>
            </div>

            {/* Template Raw Body */}
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1.5">
                Template Body & Placeholders
              </span>
              <div className={`p-4 rounded-xl border font-mono text-xs leading-relaxed whitespace-pre-line ${
                isDarkMode ? 'bg-neutral-800/80 border-neutral-700 text-neutral-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                {selectedTemplate.body}
              </div>
            </div>

            {/* Supported Variables */}
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1.5">
                Parsed Dynamic Variables ({selectedTemplate.supportedVariables.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTemplate.supportedVariables.map(v => (
                  <span
                    key={v}
                    className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-mono border border-indigo-200 dark:border-indigo-800"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            </div>

            {/* Rendered Live Simulation */}
            <div className={`p-4 rounded-xl border ${
              isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 pb-2 border-b border-inherit mb-3 text-xs font-semibold text-slate-800 dark:text-neutral-200">
                <Eye className="w-4 h-4 text-indigo-500" />
                <span>Simulated Attendee View (Variables Injected)</span>
              </div>
              <div className="max-w-lg rounded-2xl rounded-tl-xs p-3.5 text-xs bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 shadow-2xs leading-relaxed">
                {previewRender?.renderedText}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 p-12 text-center text-slate-400 border border-dashed rounded-2xl flex items-center justify-center">
            Select a template from the library
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-bold">Create New Message Template</h3>

            <form onSubmit={handleCreateTemplate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Template Name</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Pass Confirmation 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="Event Invitation">Event Invitation</option>
                    <option value="Registration Confirmation">Registration Confirmation</option>
                    <option value="Expo Update">Expo Update</option>
                    <option value="Support Response">Support Response</option>
                    <option value="Opt-in Lead Follow-up">Opt-in Lead Follow-up</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Post-event Thank You">Post-event Thank You</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="both">Both (Instagram & FB)</option>
                    <option value="instagram">Instagram Direct Only</option>
                    <option value="facebook">Facebook Messenger Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Message Body</label>
                <textarea
                  rows={4}
                  placeholder="Hello {{firstName}}, your badge for {{eventName}} is confirmed..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className={`w-full p-3 text-xs rounded-lg border outline-none font-mono ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="pt-3 border-t border-inherit flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold shadow-xs"
                >
                  Save to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
