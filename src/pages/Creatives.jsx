import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Tabs from '../components/common/Tabs';
import { useToast } from '../components/Toast';
import { fetchCreatives, fetchCreativeInsights, fetchCampaigns, createCreativeEntry, deleteCreative } from '../utils/api';
import { formatNumber } from '../utils/helpers';

/* ─── Mock AI Creative Ideas Responses ─── */
const IDEA_RESPONSES = {
  banner:
    "Here are some banner ad creative ideas:\n\n**1. Hero Split Layout**\nLeft: Bold headline with gradient overlay. Right: Product lifestyle shot.\nCTA: Bright contrasting button \"Shop Now\"\nSizes: 728x90, 300x250, 1200x628\n\n**2. Animated Countdown**\nUrgency-driven banner with a live countdown timer, dynamic product image rotation, and pulsing CTA.\n\n**3. Minimalist Brand**\nClean white background, single product hero, subtle shadow, one-line value prop, brand-color CTA.\n\n**Tip:** Keep file size under 150KB for fast load. Test both static and animated versions.",
  social:
    "Here are some social media creative ideas:\n\n**1. Carousel Story**\nSlide 1: Bold question hook. Slides 2-4: Pain points with solutions. Slide 5: CTA + offer.\nBest for: Instagram, LinkedIn, Facebook\n\n**2. UGC-Style Testimonial**\nCustomer photo/video with quote overlay, star rating, and subtle brand watermark. Feels authentic.\n\n**3. Before/After Split**\nDramatic split-screen showing transformation. Works great for products with visible results.\n\n**Tip:** Square (1080x1080) gets best reach. Use faces for 38% more engagement. Keep text under 20% of image area.",
  video:
    "Here are some video ad creative concepts:\n\n**1. Problem-Solution Hook (15s)**\n0-3s: Surprising visual hook\n3-8s: Relatable problem\n8-12s: Product as the solution\n12-15s: Clear CTA with URL\n\n**2. Day-in-the-Life (30s)**\nFollow someone using your product naturally throughout their day. Subtle branding, authentic feel.\n\n**3. Quick Demo Reel (20s)**\nFast-paced cuts showing product features with upbeat music, text overlays for each benefit, end card CTA.\n\n**Tip:** 85% of social video is watched muted - always add captions! First 3 seconds determine if viewers stay.",
  email:
    "Here are some email campaign creative ideas:\n\n**1. Personal Story Email**\nSubject: \"[Name], I made this mistake so you don't have to\"\nFormat: Plain-text style, storytelling approach, single CTA button at the end.\n\n**2. Visual Product Showcase**\nHero image + 3 product cards in a grid, each with a short benefit line and individual \"Shop\" links.\n\n**3. Countdown Urgency**\nAnimated GIF countdown timer, limited-time offer, bold headline, single focused CTA.\n\n**Tip:** Personalized subject lines get 26% higher open rates. Keep emails under 200 words for mobile.",
  default:
    "I can help you brainstorm creative concepts! Here are the types I specialize in:\n\n- **Banner Ads** - Display network and feed creatives\n- **Social Media Posts** - Instagram, Facebook, LinkedIn content\n- **Video Ads** - Short-form video scripts and concepts\n- **Email Campaigns** - Newsletter and promotional templates\n\nTry clicking one of the suggestion chips below, or describe what you need!\n\n**Example prompts:**\n\"Banner ad for a SaaS product\"\n\"Social media post for a fitness brand\"\n\"Video ad script for an e-commerce launch\"",
};

function getIdeaResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes('banner') || lower.includes('display')) return IDEA_RESPONSES.banner;
  if (lower.includes('social') || lower.includes('instagram') || lower.includes('facebook') || lower.includes('post')) return IDEA_RESPONSES.social;
  if (lower.includes('video') || lower.includes('youtube') || lower.includes('reel')) return IDEA_RESPONSES.video;
  if (lower.includes('email') || lower.includes('newsletter')) return IDEA_RESPONSES.email;

  if (lower.includes('create') || lower.includes('make') || lower.includes('design') || lower.includes('generate') || lower.includes('idea')) {
    return `Great prompt! Here's a quick creative concept:\n\n**Headline:** "Discover Something Amazing"\n**Visual Style:** Modern, clean design with your brand colors\n**Key Message:** Lead with the #1 benefit your audience cares about\n**CTA:** Action-oriented like "Try Free" or "Learn More"\n\n**Recommended Formats:**\n- Feed ad (1080x1080) for Meta / LinkedIn\n- Banner (1200x628) for Google Display\n- Story (1080x1920) for Instagram / Facebook Stories\n\nWant something more specific? Try "banner ad", "social media post", "video ad", or "email campaign"!`;
  }

  return IDEA_RESPONSES.default;
}

/* ─── Main Component ─── */
export default function Creatives() {
  const addToast = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const ideasEndRef = useRef(null);

  // Server creatives
  const [creatives, setCreatives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detail view
  const [selected, setSelected] = useState(null);
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [previewFormat, setPreviewFormat] = useState('feed');

  // Upload
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [viewingFile, setViewingFile] = useState(null);

  // Campaigns
  const [campaigns, setCampaigns] = useState([]);
  const [campaignFilter, setCampaignFilter] = useState('all');

  // Campaign selector modal (shown on upload)
  const [pendingFiles, setPendingFiles] = useState([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Creative Ideas Generator
  const [ideaMessages, setIdeaMessages] = useState([
    { role: 'ai', text: "Hi! I'm the Creative Ideas Generator. Describe the kind of ad creative you need, and I'll brainstorm concepts for you." },
  ]);
  const [ideaInput, setIdeaInput] = useState('');
  const [ideaTyping, setIdeaTyping] = useState(false);

  /* ─── Data Fetching ─── */
  useEffect(() => {
    Promise.all([
      fetchCreatives().then((res) => res.data.data).catch(() => []),
      fetchCampaigns().then((res) => res.data.data).catch(() => []),
    ]).then(([creativesData, campaignsData]) => {
      setCreatives(creativesData || []);
      setCampaigns(campaignsData || []);
      setLoading(false);
    });
  }, []);

  /* ─── Scroll ideas to bottom ─── */
  useEffect(() => {
    ideasEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ideaMessages, ideaTyping]);

  /* ─── Detail View ─── */
  const openDetail = (creative) => {
    setSelected(creative);
    setInsights(null);
    setInsightsLoading(true);
    fetchCreativeInsights(creative.id)
      .then((res) => setInsights(res.data.data))
      .catch(() => {})
      .finally(() => setInsightsLoading(false));
  };

  /* ─── Upload Handling ─── */
  const initiateUpload = (files) => {
    if (files.length === 0) return;
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toLocaleString(),
    }));
    setPendingFiles(newFiles);
    setSelectedCampaignId('');
    setShowCampaignModal(true);
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    initiateUpload(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    initiateUpload(files);
  };

  const confirmCampaignAssociation = async () => {
    if (!selectedCampaignId) {
      addToast('Please select a campaign', 'error');
      return;
    }
    if (selectedCampaignId === 'new') {
      setShowCampaignModal(false);
      setPendingFiles([]);
      navigate('/campaigns/create');
      return;
    }
    const filesWithCampaign = pendingFiles.map((f) => ({
      ...f,
      campaignId: selectedCampaignId,
    }));
    setUploadedFiles((prev) => [...prev, ...filesWithCampaign]);
    setShowCampaignModal(false);
    setPendingFiles([]);
    addToast(`${filesWithCampaign.length} file(s) uploaded and associated with campaign!`);

    // Create server entries for each uploaded file, then re-fetch
    try {
      await Promise.all(
        filesWithCampaign.map((f) =>
          createCreativeEntry({
            name: f.name,
            type: f.type.startsWith('image/') ? 'image' : 'document',
            dimensions: 'uploaded',
            campaignId: f.campaignId,
            thumbnail: f.type.startsWith('image/') ? f.url : 'https://placehold.co/1200x628/6b4d3d/white?text=Document',
          })
        )
      );
    } catch {
      // some entries may fail, still refresh
    }

    // Re-fetch creatives from the server to refresh the list
    fetchCreatives().then((res) => setCreatives(res.data.data || [])).catch(() => {});
  };

  const cancelCampaignModal = () => {
    // Revoke object URLs for pending files
    pendingFiles.forEach((f) => URL.revokeObjectURL(f.url));
    setShowCampaignModal(false);
    setPendingFiles([]);
  };

  /* ─── Delete Handling ─── */
  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget._source === 'uploaded') {
      // Local uploaded file
      setUploadedFiles((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      if (viewingFile && viewingFile.id === deleteTarget.id) setViewingFile(null);
      setDeleteTarget(null);
      addToast('File removed');
    } else {
      // Server creative
      deleteCreative(deleteTarget.id)
        .then(() => {
          setCreatives((prev) => prev.filter((c) => c.id !== deleteTarget.id));
          if (selected && selected.id === deleteTarget.id) setSelected(null);
          addToast('Creative deleted successfully');
        })
        .catch(() => {
          addToast('Failed to delete creative', 'error');
        })
        .finally(() => setDeleteTarget(null));
    }
  };

  /* ─── File helpers ─── */
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getCampaignName = (campaignId) => {
    const c = campaigns.find((camp) => camp.id === campaignId);
    return c ? c.name : 'Unknown Campaign';
  };

  /* ─── Creative Ideas Generator ─── */
  const sendIdea = (text) => {
    const msg = text || ideaInput.trim();
    if (!msg) return;
    setIdeaMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setIdeaInput('');
    setIdeaTyping(true);
    setTimeout(() => {
      setIdeaMessages((prev) => [...prev, { role: 'ai', text: getIdeaResponse(msg) }]);
      setIdeaTyping(false);
    }, 1000);
  };

  const ideaChips = ['Banner Ad', 'Social Media Post', 'Video Ad', 'Email Campaign'];

  /* ─── Filter Logic ─── */
  // Campaigns that have at least one server creative or uploaded file
  const campaignsWithCreatives = campaigns.filter((camp) => {
    const hasServerCreative = creatives.some((c) => c.campaignId === camp.id);
    const hasUploadedFile = uploadedFiles.some((f) => f.campaignId === camp.id);
    return hasServerCreative || hasUploadedFile;
  });

  const filterTabs = [
    { id: 'all', label: 'All Creatives' },
    ...campaignsWithCreatives.map((camp) => ({
      id: camp.id,
      label: camp.name,
    })),
  ];

  const filteredCreatives = campaignFilter === 'all'
    ? creatives
    : creatives.filter((c) => c.campaignId === campaignFilter);

  const filteredUploadedFiles = campaignFilter === 'all'
    ? uploadedFiles
    : uploadedFiles.filter((f) => f.campaignId === campaignFilter);

  /* ─── Loading State ─── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Ad Creatives</h1>
        <Button onClick={() => fileInputRef.current?.click()}>Upload Creative</Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* ─── Campaign Filter Tabs ─── */}
      {filterTabs.length > 1 && (
        <div className="mb-6">
          <Tabs tabs={filterTabs} activeTab={campaignFilter} onChange={setCampaignFilter} />
        </div>
      )}

      {/* ─── Upload Zone ─── */}
      <Card className="mb-6">
        <div
          className="border-2 border-dashed border-primary-light rounded-lg p-8 text-center hover:border-primary transition duration-200 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <svg className="w-10 h-10 text-primary-light mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm text-gray-600 mb-1">Drag & drop images or PDFs here, or click to browse</p>
          <p className="text-xs text-gray-400">Supports JPG, PNG, GIF, PDF - files stored locally in browser</p>
        </div>

        {/* Uploaded Files List */}
        {filteredUploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold text-gray-700">Uploaded Files ({filteredUploadedFiles.length})</p>
            {filteredUploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                {file.type.startsWith('image/') ? (
                  <img src={file.url} alt={file.name} className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center text-red-500 text-xs font-bold">PDF</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(file.size)} · {file.uploadedAt}
                    {file.campaignId && (
                      <span className="ml-2 text-primary">· {getCampaignName(file.campaignId)}</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setViewingFile(file); }}
                  className="text-xs text-primary font-medium hover:underline cursor-pointer"
                >
                  View
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget({ ...file, _source: 'uploaded' }); }}
                  className="text-xs text-red-400 font-medium hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ─── File Viewer Modal ─── */}
      {viewingFile && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-8" onClick={() => setViewingFile(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{viewingFile.name}</h3>
              <button onClick={() => setViewingFile(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl">&times;</button>
            </div>
            {viewingFile.type.startsWith('image/') ? (
              <img src={viewingFile.url} alt={viewingFile.name} className="w-full rounded-lg" />
            ) : viewingFile.type === 'application/pdf' ? (
              <iframe src={viewingFile.url} className="w-full h-[70vh] rounded-lg border" title={viewingFile.name} />
            ) : (
              <p className="text-sm text-gray-500">Preview not available for this file type.</p>
            )}
            <p className="text-xs text-gray-400 mt-3">Size: {formatFileSize(viewingFile.size)} · Uploaded: {viewingFile.uploadedAt}</p>
          </div>
        </div>
      )}

      {/* ─── Campaign Selector Modal ─── */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-8" onClick={cancelCampaignModal}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Associate with Campaign</h3>
              <button onClick={cancelCampaignModal} className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl">&times;</button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Select a campaign to associate with {pendingFiles.length} file{pendingFiles.length > 1 ? 's' : ''}:
            </p>

            {/* Pending files preview */}
            <div className="mb-4 space-y-1.5 max-h-32 overflow-y-auto">
              {pendingFiles.map((f) => (
                <div key={f.id} className="flex items-center gap-2 text-xs text-gray-600 bg-cream rounded px-2 py-1.5">
                  {f.type.startsWith('image/') ? (
                    <img src={f.url} alt={f.name} className="w-6 h-6 object-cover rounded" />
                  ) : (
                    <span className="w-6 h-6 bg-red-100 rounded flex items-center justify-center text-red-500 text-[9px] font-bold">PDF</span>
                  )}
                  <span className="truncate">{f.name}</span>
                  <span className="text-gray-400 ml-auto">{formatFileSize(f.size)}</span>
                </div>
              ))}
            </div>

            {/* Campaign selector dropdown */}
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-4"
            >
              <option value="">-- Select a Campaign --</option>
              {campaigns.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.name} ({camp.status})
                </option>
              ))}
              <option value="new">+ Create New Campaign</option>
            </select>

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={cancelCampaignModal}>Cancel</Button>
              <Button size="sm" onClick={confirmCampaignAssociation}>
                {selectedCampaignId === 'new' ? 'Go to Create' : 'Associate & Upload'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Modal ─── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-8" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Creative</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-5">
              Are you sure you want to delete <span className="font-medium">{deleteTarget.name}</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <button
                onClick={confirmDelete}
                className="px-4 py-1.5 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Creative Grid / Detail Split View ─── */}
      {selected ? (
        <div>
          <button onClick={() => setSelected(null)} className="text-sm text-primary font-medium mb-4 hover:underline cursor-pointer">
            &larr; Back to Library
          </button>
          <div className="grid grid-cols-2 gap-6">
            {/* Preview Panel */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{selected.name}</h3>
              <Tabs
                tabs={[
                  { id: 'feed', label: 'Feed' },
                  { id: 'story', label: 'Story' },
                  { id: 'search', label: 'Search Ad' },
                ]}
                activeTab={previewFormat}
                onChange={setPreviewFormat}
              />
              <div className="mt-4">
                <img
                  src={selected.thumbnail}
                  alt={selected.name}
                  className="w-full rounded-lg"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Impressions</p>
                  <p className="text-lg font-bold text-primary">{formatNumber(selected.metrics.impressions)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">CTR</p>
                  <p className="text-lg font-bold text-primary">{selected.metrics.ctr}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Conversions</p>
                  <p className="text-lg font-bold text-primary">{formatNumber(selected.metrics.conversions)}</p>
                </div>
              </div>
            </Card>

            {/* AI Insights Panel */}
            <Card className="border-l-4 border-gold">
              <h3 className="text-lg font-semibold text-primary mb-4">AI Creative Insights</h3>
              {insightsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 text-sm text-gray-500">Analyzing creative...</span>
                </div>
              ) : insights ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Performance Score</p>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-primary">{insights.score}</div>
                      <span className="text-sm text-gray-500">/ 100</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">High-Performing Elements</p>
                    <ul className="space-y-1.5">
                      {insights.highPerformingElements.map((el, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-500 mt-0.5">{'\u2713'}</span>{el}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Suggested Variations</p>
                    <ul className="space-y-1.5">
                      {insights.suggestedVariations.map((v, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-primary mt-0.5">{'\u2022'}</span>{v}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-cream rounded-lg p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Predicted Improvement</p>
                    <p className="text-xl font-bold text-primary">+{insights.predictedImprovement}%</p>
                    <p className="text-xs text-gray-500">If suggested variations are applied</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No insights available.</p>
              )}
            </Card>
          </div>
        </div>
      ) : (
        /* ─── Creative Library Grid ─── */
        <div className="grid grid-cols-3 gap-6">
          {filteredCreatives.map((c) => (
            <Card key={c.id} hover className="cursor-pointer relative group" onClick={() => openDetail(c)}>
              <div className="relative">
                <img src={c.thumbnail} alt={c.name} className="w-full h-44 object-cover rounded-lg mb-3" />
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <Badge performance={c.performance} />
                </div>
                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget({ ...c, _source: 'server' }); }}
                  className="absolute top-2 left-2 w-7 h-7 bg-red-500/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  title="Delete creative"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="font-semibold text-gray-900">{c.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.type} · {c.dimensions}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">CTR: <span className="text-primary font-medium">{c.metrics.ctr}%</span></span>
                <span className="text-sm text-gray-500">{formatNumber(c.metrics.conversions)} conv.</span>
              </div>
            </Card>
          ))}

          {filteredCreatives.length === 0 && filteredUploadedFiles.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-400 text-sm">No creatives found for this campaign.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── Creative Ideas Generator ─── */}
      {!selected && (
        <Card className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold">AI</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Creative Ideas Generator</h3>
              <p className="text-xs text-gray-500">Brainstorm ad creative concepts with AI assistance</p>
            </div>
          </div>

          {/* Messages area */}
          <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto mb-4 space-y-3">
            {ideaMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-sm whitespace-pre-line ${
                    m.role === 'user'
                      ? 'gradient-primary text-white rounded-2xl rounded-br-md'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-md shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {ideaTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={ideasEndRef} />
          </div>

          {/* Quick suggestion chips */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {ideaChips.map((chip) => (
              <button
                key={chip}
                onClick={() => sendIdea(chip)}
                className="px-3 py-1.5 text-xs bg-cream text-primary rounded-full whitespace-nowrap hover:bg-primary hover:text-white transition duration-200 cursor-pointer border border-primary/20 font-medium"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              value={ideaInput}
              onChange={(e) => setIdeaInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendIdea()}
              placeholder="Describe the creative you need, e.g. &quot;banner ad for a SaaS product&quot;..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={() => sendIdea()}
              className="gradient-primary text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              <span className="text-sm font-medium">Send</span>
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
