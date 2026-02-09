import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Tabs from '../components/common/Tabs';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LineChartComponent from '../components/charts/LineChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import { fetchCampaign, fetchTimeSeries, updateCampaign, updateCampaignStatus } from '../utils/api';
import { formatCurrency, formatNumber, formatCompact } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'targeting', label: 'Targeting' },
  { id: 'creatives', label: 'Creatives' },
  { id: 'performance', label: 'Performance' },
];

export default function CampaignDetail() {
  const { id } = useParams();
  const { currency } = useAuth();
  const addToast = useToast();
  const [campaign, setCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const loadCampaign = () => {
    return fetchCampaign(id).then((res) => {
      setCampaign(res.data.data);
    });
  };

  useEffect(() => {
    Promise.all([
      fetchCampaign(id),
      fetchTimeSeries(30),
    ])
      .then(([campRes, tsRes]) => {
        setCampaign(campRes.data.data);
        setTimeData(tsRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleStatus = async () => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    try {
      await updateCampaignStatus(id, newStatus);
      await loadCampaign();
      addToast(`Campaign ${newStatus === 'paused' ? 'paused' : 'resumed'} successfully`);
    } catch {
      addToast('Failed to update campaign status', 'error');
    }
  };

  const handleEditOpen = () => {
    setEditForm({
      name: campaign.name,
      budgetAmount: campaign.budget.total,
      startDate: campaign.schedule?.startDate || '',
      endDate: campaign.schedule?.endDate || '',
    });
    setEditModal(true);
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      await updateCampaign(id, editForm);
      setEditModal(false);
      await loadCampaign();
      addToast('Campaign updated successfully');
    } catch {
      addToast('Failed to update campaign', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!campaign) return <p className="text-gray-500">Campaign not found.</p>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge status={campaign.status} />
            <span className="text-sm text-gray-500">Created {campaign.createdAt}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleEditOpen}>Edit</Button>
          <Button onClick={handleToggleStatus}>
            {campaign.status === 'active' ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab campaign={campaign} timeData={timeData} currency={currency} />}
        {activeTab === 'targeting' && <TargetingTab campaign={campaign} />}
        {activeTab === 'creatives' && <CreativesTab />}
        {activeTab === 'performance' && <PerformanceTab campaign={campaign} timeData={timeData} currency={currency} />}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setEditModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 z-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Campaign</h2>
            <div className="space-y-4">
              <Input
                label="Campaign Name"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <Input
                label="Budget Amount"
                type="number"
                prefix="$"
                value={editForm.budgetAmount || ''}
                onChange={(e) => setEditForm({ ...editForm, budgetAmount: Number(e.target.value) })}
              />
              <Input
                label="Start Date"
                type="date"
                value={editForm.startDate || ''}
                onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                value={editForm.endDate || ''}
                onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setEditModal(false)}>Cancel</Button>
              <Button onClick={handleEditSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({ campaign, timeData, currency }) {
  const metrics = campaign.metrics;

  return (
    <div>
      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Spend" value={formatCurrency(metrics.spend, currency)} icon="$" />
        <MetricCard title="Impressions" value={formatCompact(metrics.impressions)} icon="👁" />
        <MetricCard title="Clicks" value={formatNumber(metrics.clicks)} icon="👆" />
        <MetricCard title="Conversions" value={formatNumber(metrics.conversions)} icon="✓" />
      </div>

      {/* Performance Timeline */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Timeline (30 Days)</h3>
        <LineChartComponent data={timeData} height={300} />
      </Card>

      {/* Budget Pacing */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Pacing</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            {formatCurrency(campaign.budget.spent, currency)} of {formatCurrency(campaign.budget.total, currency)}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round((campaign.budget.spent / campaign.budget.total) * 100)}%
          </span>
        </div>
        <ProgressBar value={campaign.budget.spent} max={campaign.budget.total} />
        <p className="text-xs text-gray-500 mt-2">
          Daily spend rate: {formatCurrency(campaign.budget.daily, currency)} / day
        </p>
      </Card>

      {/* AI Recommendations */}
      {campaign.recommendations && campaign.recommendations.length > 0 && (
        <Card className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
          <div className="space-y-3">
            {campaign.recommendations.map((rec, i) => (
              <div key={i} className="border-l-4 border-primary bg-cream rounded-r-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{rec.priority}</span>
                  <span className="text-sm font-semibold text-gray-900">{rec.title}</span>
                </div>
                <p className="text-sm text-gray-600">{rec.description}</p>
                <p className="text-xs text-primary mt-1">{rec.impact}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function TargetingTab({ campaign }) {
  const targeting = campaign.targeting;

  const audienceData = [
    { name: '18-24', value: 15 },
    { name: '25-34', value: 35 },
    { name: '35-44', value: 30 },
    { name: '45-54', value: 15 },
    { name: '55+', value: 5 },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Breakdown</h3>
        <PieChartComponent data={audienceData} height={250} />
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographics</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Age Range</p>
            <p className="text-sm font-medium">{targeting.ageRange[0]} - {targeting.ageRange[1]}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="text-sm font-medium capitalize">{targeting.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Locations</p>
            <p className="text-sm font-medium">{targeting.locations.join(', ')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Interests</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {targeting.interests.map((i) => (
                <span key={i} className="px-2.5 py-1 bg-primary-light text-white text-xs rounded-full">{i}</span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CreativesTab() {
  // TODO: Replace with real API call to fetch campaign-specific creatives
  const mockCreatives = [
    { id: 1, name: 'Hero Banner', ctr: 5.2, conversions: 145, performance: 'high', thumbnail: 'https://placehold.co/300x200/6b4d3d/ffffff?text=Hero+Banner' },
    { id: 2, name: 'Carousel Ad', ctr: 4.1, conversions: 98, performance: 'high', thumbnail: 'https://placehold.co/300x200/8b6d5d/ffffff?text=Carousel' },
    { id: 3, name: 'Story Ad', ctr: 3.2, conversions: 56, performance: 'medium', thumbnail: 'https://placehold.co/300x200/d4a574/ffffff?text=Story+Ad' },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {mockCreatives.map((c) => (
        <Card key={c.id} hover>
          <img src={c.thumbnail} alt={c.name} className="w-full h-40 object-cover rounded-lg mb-3" />
          <p className="font-semibold text-gray-900">{c.name}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">CTR: <span className="text-primary font-medium">{c.ctr}%</span></span>
            <Badge performance={c.performance} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{c.conversions} conversions</p>
        </Card>
      ))}
    </div>
  );
}

function PerformanceTab({ campaign, timeData, currency }) {
  return (
    <div>
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Metrics</h3>
          <Button variant="outline" size="sm">Export</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Metric</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Value</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Impressions', formatNumber(campaign.metrics.impressions)],
                ['Clicks', formatNumber(campaign.metrics.clicks)],
                ['CTR', `${campaign.metrics.ctr}%`],
                ['Conversions', formatNumber(campaign.metrics.conversions)],
                ['CPA', formatCurrency(campaign.metrics.cpa, currency)],
                ['Total Spend', formatCurrency(campaign.metrics.spend, currency)],
                ['ROAS', `${campaign.metrics.roas}x`],
              ].map(([label, val]) => (
                <tr key={label} className="border-b border-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">{label}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-primary">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend Over Time</h3>
        <LineChartComponent
          data={timeData}
          lines={[{ dataKey: 'spend', color: '#6b4d3d', name: 'Daily Spend ($)' }]}
          height={250}
        />
      </Card>
    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center text-primary text-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold text-primary">{value}</p>
        </div>
      </div>
    </Card>
  );
}
