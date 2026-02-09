import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ConnectPlatformModal from '../components/ConnectPlatformModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { fetchPlatformStatus, fetchPlacements, fetchCampaigns } from '../utils/api';
import { formatNumber, formatCurrency, formatCompact } from '../utils/helpers';

export default function Placements() {
  const { currency } = useAuth();
  const addToast = useToast();
  const [platforms, setPlatforms] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectModal, setConnectModal] = useState(null);
  const [filterCampaign, setFilterCampaign] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [previewPlacement, setPreviewPlacement] = useState(null);

  useEffect(() => {
    Promise.all([fetchPlatformStatus(), fetchPlacements(), fetchCampaigns()])
      .then(([platRes, plRes, campRes]) => {
        setPlatforms(platRes.data.data);
        setPlacements(plRes.data.data);
        setCampaigns(campRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = placements.filter((p) => {
    if (filterCampaign !== 'all' && p.campaignId !== filterCampaign) return false;
    if (filterPlatform !== 'all' && p.platform !== filterPlatform) return false;
    return true;
  });

  const totalSpend = filtered.reduce((sum, p) => sum + p.spend, 0);
  const glimmoraSpend = filtered.filter((p) => p.platform === 'Glimmora').reduce((sum, p) => sum + p.spend, 0);
  const googleSpend = filtered.filter((p) => p.platform === 'Google').reduce((sum, p) => sum + p.spend, 0);
  const metaSpend = filtered.filter((p) => p.platform === 'Meta').reduce((sum, p) => sum + p.spend, 0);
  const linkedinSpend = filtered.filter((p) => p.platform === 'LinkedIn').reduce((sum, p) => sum + p.spend, 0);

  const uniqueCampaigns = [...new Map(placements.map((p) => [p.campaignId, p.campaignName])).entries()];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ad Placements & Delivery</h1>

      {/* Platform Status Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {platforms && Object.entries(platforms).map(([key, p]) => (
          <PlatformCard key={key} platform={p} platformKey={key} currency={currency} onConnect={() => setConnectModal(key)} />
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Campaign</label>
            <select
              value={filterCampaign}
              onChange={(e) => setFilterCampaign(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Campaigns</option>
              {uniqueCampaigns.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Platform</label>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Platforms</option>
              <option value="Glimmora">Glimmora Reach</option>
              <option value="Google">Google Ads</option>
              <option value="Meta">Meta</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>
          <div className="ml-auto text-sm text-gray-500">
            Showing <strong className="text-primary">{filtered.length}</strong> of {placements.length} placements
          </div>
        </div>
      </Card>

      {/* Budget Distribution Bar */}
      <Card className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Distribution</h3>
        <div className="flex rounded-lg overflow-hidden h-10 mb-3">
          {totalSpend > 0 && (
            <>
              {glimmoraSpend > 0 && (
                <div
                  className="bg-primary-dark flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(glimmoraSpend / totalSpend) * 100}%` }}
                  title={`Glimmora Reach: ${formatCurrency(glimmoraSpend, currency)}`}
                >
                  Glimmora {Math.round((glimmoraSpend / totalSpend) * 100)}%
                </div>
              )}
              {googleSpend > 0 && (
                <div
                  className="bg-primary flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(googleSpend / totalSpend) * 100}%` }}
                  title={`Google Ads: ${formatCurrency(googleSpend, currency)}`}
                >
                  Google {Math.round((googleSpend / totalSpend) * 100)}%
                </div>
              )}
              {metaSpend > 0 && (
                <div
                  className="bg-primary-light flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(metaSpend / totalSpend) * 100}%` }}
                  title={`Meta: ${formatCurrency(metaSpend, currency)}`}
                >
                  Meta {Math.round((metaSpend / totalSpend) * 100)}%
                </div>
              )}
              {linkedinSpend > 0 && (
                <div
                  className="bg-gold flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(linkedinSpend / totalSpend) * 100}%` }}
                  title={`LinkedIn: ${formatCurrency(linkedinSpend, currency)}`}
                >
                  LinkedIn {Math.round((linkedinSpend / totalSpend) * 100)}%
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex gap-6 text-sm flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary-dark" /> Glimmora Reach: {formatCurrency(glimmoraSpend, currency)}</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary" /> Google Ads: {formatCurrency(googleSpend, currency)}</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary-light" /> Meta: {formatCurrency(metaSpend, currency)}</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gold" /> LinkedIn: {formatCurrency(linkedinSpend, currency)}</span>
        </div>
      </Card>

      {/* Delivery Status Table */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Campaign</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Creative</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Platform</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Impressions</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Clicks</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">CTR</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Spend</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Preview</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-cream transition duration-150">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900 text-xs">{p.campaignName}</span>
                  </td>
                  <td className="px-4 py-3">
                    {p.creativeThumbnail ? (
                      <div className="flex items-center gap-2">
                        <img src={p.creativeThumbnail} alt="" className="w-10 h-6 rounded object-cover border border-gray-200" />
                        <span className="text-xs text-gray-600 truncate max-w-[100px]">{p.creativeName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No creative</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${p.platform === 'Glimmora' ? 'bg-primary-dark' : p.platform === 'Google' ? 'bg-primary' : p.platform === 'Meta' ? 'bg-primary-light' : 'bg-gold'}`} />
                      <span className="font-medium text-gray-900">{p.platform}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{p.type}</td>
                  <td className="px-4 py-3"><Badge status={p.status} /></td>
                  <td className="px-4 py-3 text-gray-700">{formatCompact(p.impressions)}</td>
                  <td className="px-4 py-3 text-gray-700">{formatNumber(p.clicks)}</td>
                  <td className="px-4 py-3 text-primary font-medium">{p.ctr}%</td>
                  <td className="px-4 py-3 text-gray-700">{formatCurrency(p.spend, currency)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setPreviewPlacement(p)}
                      className="text-primary hover:underline text-xs font-medium cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-medium mb-1">No placements match your filters</p>
            <p className="text-sm">Try adjusting the campaign or platform filter above</p>
          </div>
        )}
      </Card>

      {/* Ad Preview Modal */}
      {previewPlacement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setPreviewPlacement(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Ad Placement Preview</h3>
                <button onClick={() => setPreviewPlacement(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Placement context */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                    previewPlacement.platform === 'Glimmora' ? 'bg-primary-dark' : previewPlacement.platform === 'Google' ? 'bg-primary' : previewPlacement.platform === 'Meta' ? 'bg-primary-light' : 'bg-gold'
                  }`}>
                    {previewPlacement.platform === 'Glimmora' ? 'GR' : previewPlacement.platform === 'Google' ? 'G' : previewPlacement.platform === 'Meta' ? 'M' : 'in'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{previewPlacement.platform} - {previewPlacement.type}</p>
                    <p className="text-xs text-gray-500">Campaign: {previewPlacement.campaignName}</p>
                  </div>
                  <Badge status={previewPlacement.status} className="ml-auto" />
                </div>
              </div>

              {/* Creative preview */}
              {previewPlacement.creativeThumbnail ? (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Creative Preview</p>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <img src={previewPlacement.creativeThumbnail} alt={previewPlacement.creativeName} className="w-full h-48 object-cover" />
                    <div className="p-3 bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">{previewPlacement.creativeName}</p>
                      <p className="text-xs text-gray-500">Displayed as {previewPlacement.type} on {previewPlacement.platform}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 border border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                  <p className="text-sm text-gray-400">No creative assigned to this placement</p>
                  <p className="text-xs text-gray-400 mt-1">Go to Creatives to upload and assign</p>
                </div>
              )}

              {/* Metrics */}
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Performance Metrics</p>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-cream rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Impressions</p>
                  <p className="text-lg font-bold text-primary">{formatCompact(previewPlacement.impressions)}</p>
                </div>
                <div className="bg-cream rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Clicks</p>
                  <p className="text-lg font-bold text-primary">{formatNumber(previewPlacement.clicks)}</p>
                </div>
                <div className="bg-cream rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">CTR</p>
                  <p className="text-lg font-bold text-primary">{previewPlacement.ctr}%</p>
                </div>
                <div className="bg-cream rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Spend</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(previewPlacement.spend, currency)}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <Button variant="outline" className="w-full" onClick={() => setPreviewPlacement(null)}>Close Preview</Button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Platform Modal */}
      {connectModal && (
        <ConnectPlatformModal
          platform={connectModal}
          isOpen={true}
          onClose={() => setConnectModal(null)}
          onConnect={() => {
            addToast(`Successfully connected to ${connectModal === 'google' ? 'Google Ads' : connectModal === 'meta' ? 'Meta' : 'LinkedIn'}!`);
            setConnectModal(null);
          }}
        />
      )}
    </div>
  );
}

function PlatformCard({ platform, platformKey, currency, onConnect }) {
  const icons = { glimmora: 'GR', google: 'G', meta: 'M', linkedin: 'in' };

  return (
    <Card className="border-l-4 border-primary">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm">
            {icons[platformKey]}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{platform.name}</h4>
            <p className="text-xs text-gray-400">ID: {platform.accountId}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-600 font-medium">Connected</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-3">
        Last sync: {new Date(platform.lastSync).toLocaleTimeString()}
      </p>

      <div className="space-y-2 mb-4">
        {platform.placements.map((pl) => (
          <div key={pl.type} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{pl.type}</span>
            <Badge status="active">{pl.active} active</Badge>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400">Impressions</p>
          <p className="text-sm font-bold text-primary">{formatCompact(platform.metrics.impressions)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Spend</p>
          <p className="text-sm font-bold text-primary">{formatCurrency(platform.metrics.spend, currency)}</p>
        </div>
      </div>
      <button onClick={onConnect} className="w-full mt-3 text-xs text-primary font-medium hover:underline cursor-pointer text-center">
        Reconnect Platform
      </button>
    </Card>
  );
}
