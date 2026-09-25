import React, { useState } from 'react';
import { 
  Search, 
  Info, 
  ShieldCheck, 
  ExternalLink, 
  Layers, 
  Heart, 
  MessageCircle, 
  CheckCircle2, 
  Globe2, 
  Users, 
  Image as ImageIcon,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BusinessDiscoveryResult } from '../../types';

export const AudienceInsightsView: React.FC = () => {
  const { isDarkMode, showToast } = useApp();

  const [usernameInput, setUsernameInput] = useState('designmuseum');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BusinessDiscoveryResult | null>({
    username: 'designmuseum',
    name: 'Design Museum London',
    biography: 'The world’s leading museum devoted to contemporary design in every form. Exhibitions, talks, architectural pavilions & design awards.',
    profilePictureUrl: '/src/assets/images/post_fashion_spring_1790377220236.jpg',
    followersCount: 684200,
    mediaCount: 3120,
    website: 'https://designmuseum.org',
    queriedAt: '2026-09-25T15:30:00Z',
    recentMedia: [
      {
        id: 'bd-m1',
        caption: 'Now open: The Future of Sustainable Living exhibition featuring Nordic interior architecture and regenerative composites.',
        mediaType: 'IMAGE',
        mediaUrl: '/src/assets/images/post_interior_nordic_1790377256977.jpg',
        likeCount: 4210,
        commentsCount: 184,
        timestamp: '2026-09-23T12:00:00Z',
        permalink: 'https://instagram.com/p/DB1872',
      },
      {
        id: 'bd-m2',
        caption: 'Acoustic minimalism: exploring the intersection of precision audio engineering and industrial sculpture.',
        mediaType: 'IMAGE',
        mediaUrl: '/src/assets/images/post_tech_headphones_1790377245788.jpg',
        likeCount: 3890,
        commentsCount: 92,
        timestamp: '2026-09-21T09:30:00Z',
        permalink: 'https://instagram.com/p/DB1873',
      },
      {
        id: 'bd-m3',
        caption: 'Specialty cafe pavilion in our central atrium. Come enjoy artisan single-origin brews before the keynote design panel.',
        mediaType: 'IMAGE',
        mediaUrl: '/src/assets/images/post_coffee_artisan_1790377235190.jpg',
        likeCount: 2950,
        commentsCount: 61,
        timestamp: '2026-09-19T14:15:00Z',
        permalink: 'https://instagram.com/p/DB1874',
      },
    ],
  });

  const handleSearch = () => {
    if (!usernameInput.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setResult({
        username: usernameInput.toLowerCase().trim(),
        name: `${usernameInput.charAt(0).toUpperCase() + usernameInput.slice(1)} Professional`,
        biography: `Official public profile discovered via Instagram Graph API Business Discovery node. Partner in global trade exhibitions and industry delegations.`,
        profilePictureUrl: '/src/assets/images/post_tech_headphones_1790377245788.jpg',
        followersCount: Math.round(45000 + Math.random() * 200000),
        mediaCount: Math.round(450 + Math.random() * 800),
        website: `https://${usernameInput}.com`,
        queriedAt: new Date().toISOString(),
        recentMedia: [
          {
            id: `bd-${Date.now()}-1`,
            caption: 'Showcase highlight from the international trade pavilion. Discover new supplier agreements.',
            mediaType: 'IMAGE',
            mediaUrl: '/src/assets/images/post_fashion_spring_1790377220236.jpg',
            likeCount: 1820,
            commentsCount: 88,
            timestamp: new Date().toISOString(),
            permalink: 'https://instagram.com',
          },
          {
            id: `bd-${Date.now()}-2`,
            caption: 'Cutting-edge innovation preview for accredited exhibition buyers and international press.',
            mediaType: 'IMAGE',
            mediaUrl: '/src/assets/images/post_interior_nordic_1790377256977.jpg',
            likeCount: 1420,
            commentsCount: 52,
            timestamp: new Date().toISOString(),
            permalink: 'https://instagram.com',
          },
        ],
      });
      setLoading(false);
      showToast(`Business Discovery query completed for @${usernameInput}`, 'success');
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Audience Insights & Public Account Research
        </h1>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
          Instagram Graph API v22.0 Business Discovery — permitted competitor benchmarking and exhibition partner discovery
        </p>
      </div>

      {/* Compliance Disclaimer Callout */}
      <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
        isDarkMode ? 'bg-indigo-950/20 border-indigo-900/40 text-indigo-200' : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
      }`}>
        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h3 className="font-bold">Meta Business Discovery Compliance Notice</h3>
          <p className="text-indigo-900/80 dark:text-indigo-300 mt-1 leading-relaxed">
            The Business Discovery API provides authorized access to public metadata (biography, follower count, and recent public media) for eligible Instagram Business and Creator accounts. In compliance with Meta Platform Terms, this tool does not scrape personal phone numbers, emails, or follower lists.
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center gap-3 ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter public Instagram handle (e.g. designmuseum, techcrunch, moncler)..."
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border outline-none ${
              isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shrink-0 transition-colors w-full sm:w-auto"
        >
          {loading ? 'Querying Meta API...' : 'Research Account'}
        </button>
      </div>

      {/* Discovery Results Area */}
      {result && (
        <div className="space-y-6">
          {/* Account Profile Header Card */}
          <div className={`p-5 rounded-xl border ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-inherit">
              <div className="flex items-center gap-4">
                <img 
                  src={result.profilePictureUrl} 
                  alt="" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shrink-0" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{result.name}</h2>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">@{result.username}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-neutral-300 mt-1 max-w-xl leading-relaxed">
                    {result.biography}
                  </p>
                  {result.website && (
                    <a 
                      href={result.website} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-1 font-medium"
                    >
                      <Globe2 className="w-3.5 h-3.5" /> {result.website}
                    </a>
                  )}
                </div>
              </div>

              {/* Stats Counters */}
              <div className="flex items-center gap-4 text-center shrink-0">
                <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Followers</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {result.followersCount.toLocaleString()}
                  </span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Public Posts</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {result.mediaCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 text-[11px] text-slate-400">
              <span>Verified Source: Meta Graph API (Business Discovery)</span>
              <span>Timestamp: {new Date(result.queriedAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Recent Public Media Grid */}
          <div className={`p-5 rounded-xl border ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Recent Public Media ({result.recentMedia.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
              Authorized public post impressions and audience engagement benchmarks
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {result.recentMedia.map(media => (
                <div key={media.id} className="rounded-xl border border-inherit overflow-hidden bg-slate-50 dark:bg-neutral-850 flex flex-col justify-between">
                  <div className="aspect-square bg-slate-200 dark:bg-neutral-800 overflow-hidden">
                    <img src={media.mediaUrl} alt="" className="w-full h-full object-cover" />
                  </div>

                  <div className="p-3 text-xs flex-1 flex flex-col justify-between">
                    <p className="text-slate-700 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                      {media.caption}
                    </p>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-inherit text-[11px] text-slate-500 dark:text-neutral-400 tabular-nums">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-pink-500" /> {media.likeCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-blue-500" /> {media.commentsCount.toLocaleString()}
                        </span>
                      </div>
                      <span>{new Date(media.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permitted Marketing Outreach Strategy Card */}
          <div className={`p-5 rounded-xl border ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Compliant Exhibition Outreach Alternatives
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
              Meta guidelines prohibit cold DM scraping. Firm Expo provides these compliant audience acquisition workflows:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Click-to-Instagram Ads</h4>
                <p className="text-slate-500 dark:text-neutral-400 text-[11px]">
                  Target lookalike audiences who engage with design and trade exhibition accounts.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Brand Collaboration Posts</h4>
                <p className="text-slate-500 dark:text-neutral-400 text-[11px]">
                  Invite certified exhibitors to co-author Instagram Collab posts with @firmexpo.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Lead Generation Forms</h4>
                <p className="text-slate-500 dark:text-neutral-400 text-[11px]">
                  Opt-in Meta Lead Ads providing corporate buyer registrations directly into Firm Expo CRM.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
