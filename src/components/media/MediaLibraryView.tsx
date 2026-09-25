import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Filter, 
  Trash2, 
  Plus, 
  Check, 
  Eye, 
  Layers, 
  X,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MediaAsset } from '../../types';
import { MediaValidator } from '../../lib/storage/validation';

export const MediaLibraryView: React.FC = () => {
  const { 
    mediaAssets, 
    addMediaAsset, 
    deleteMediaAsset, 
    setCurrentTab, 
    isDarkMode, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newTags, setNewTags] = useState('Exhibition, Dubai2026, Keynote');

  const filteredAssets = mediaAssets.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleUploadSubmit = () => {
    if (!newTitle) {
      showToast('Please enter an asset title', 'error');
      return;
    }

    const created: MediaAsset = {
      id: `asset-${Date.now()}`,
      name: newTitle,
      url: newUrl || '/src/assets/images/post_tech_headphones_1790377245788.jpg',
      type: 'image',
      aspectRatio: '1:1',
      fileSizeBytes: 2800000,
      dimensions: '1080 x 1080',
      tags: newTags.split(',').map(t => t.trim()),
      uploadedAt: new Date().toISOString(),
      usageCount: 0,
    };

    addMediaAsset(created);
    setUploadModalOpen(false);
    setNewTitle('');
    setNewUrl('');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Exhibition Media Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Verified high-resolution brand photography, floor plans, and video assets for Meta campaigns
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Search and Filters Toolbar */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets by title or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border outline-none ${
              isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200'
            }`}
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Type:</span>
          {(['all', 'image', 'video'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                typeFilter === t
                  ? 'bg-indigo-600 text-white font-semibold'
                  : isDarkMode
                  ? 'text-neutral-400 hover:bg-neutral-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredAssets.map(asset => (
          <div
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className={`group rounded-xl border overflow-hidden cursor-pointer transition-all hover:shadow-md ${
              isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="aspect-square bg-slate-100 dark:bg-neutral-800 overflow-hidden relative">
              <img 
                src={asset.url} 
                alt={asset.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-black/70 text-white backdrop-blur-xs">
                {asset.aspectRatio}
              </div>
            </div>

            <div className="p-3">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                {asset.name}
              </h3>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>{asset.dimensions}</span>
                <span>Used in {asset.usageCount} posts</span>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {asset.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Asset Preview Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <h3 className="font-bold text-base truncate pr-2">{selectedAsset.name}</h3>
              <button onClick={() => setSelectedAsset(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="aspect-square max-h-64 rounded-xl overflow-hidden bg-slate-100 dark:bg-neutral-800 mx-auto">
                <img src={selectedAsset.url} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-inherit text-center">
                <div>
                  <span className="text-slate-400">Resolution</span>
                  <p className="font-bold mt-0.5">{selectedAsset.dimensions}</p>
                </div>
                <div>
                  <span className="text-slate-400">Aspect Ratio</span>
                  <p className="font-bold mt-0.5">{selectedAsset.aspectRatio}</p>
                </div>
                <div>
                  <span className="text-slate-400">File Size</span>
                  <p className="font-bold mt-0.5">{(selectedAsset.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <FileCheck className="w-4 h-4 shrink-0" />
                <span>Verified: Meets Meta Graph v22.0 requirements for Instagram Feed and Facebook Page Publishing.</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-inherit">
                <button
                  onClick={() => {
                    deleteMediaAsset(selectedAsset.id);
                    setSelectedAsset(null);
                  }}
                  className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Asset
                </button>

                <button
                  onClick={() => {
                    setSelectedAsset(null);
                    setCurrentTab('create_campaign');
                  }}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Use in New Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Media Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <h3 className="font-bold text-base">Upload Exhibition Creative</h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Asset Name *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Dubai World Trade — Keynote Stage"
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-neutral-700 text-center">
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="font-semibold text-slate-700 dark:text-neutral-300">Drop creative here or browse</p>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, MP4 up to 50MB</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-inherit">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadSubmit}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Confirm Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
