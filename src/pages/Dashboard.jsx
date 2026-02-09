import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import LineChartComponent from '../components/charts/LineChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import { fetchDashboard } from '../utils/api';
import { formatNumber, formatCurrency, formatCompact } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currency } = useAuth();

  useEffect(() => {
    fetchDashboard()
      .then((res) => setData(res.data.data))
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

  if (!data) return <p className="text-gray-500">Failed to load dashboard data.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="animate-fade-in-up stagger-1">
          <StatCard
            title="Active Campaigns"
            value={data.activeCampaigns}
            change={`+${data.activeCampaignsGrowth}%`}
            icon={<CampaignStatIcon />}
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatCard
            title="Budget Spent"
            value={formatCurrency(data.totalSpent, currency)}
            subtitle={
              <ProgressBar value={data.totalSpent} max={data.totalBudget} className="mt-2" />
            }
            subtext={`${data.budgetUtilization}% of ${formatCurrency(data.totalBudget, currency)}`}
            icon={<BudgetStatIcon />}
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatCard
            title="Total Impressions"
            value={formatCompact(data.totalImpressions)}
            change={`+${data.impressionsGrowth}%`}
            icon={<ImpressionStatIcon />}
          />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatCard
            title="Total Conversions"
            value={formatNumber(data.totalConversions)}
            change={`+${data.conversionsGrowth}%`}
            icon={<ConversionStatIcon />}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-8 animate-fade-in-up">
        {/* Performance Chart */}
        <Card className="col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance (Last 7 Days)</h3>
          <LineChartComponent
            data={data.performanceData}
            height={280}
          />
        </Card>

        {/* Platform Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Distribution</h3>
          <PieChartComponent data={data.platformDistribution} height={280} />
        </Card>
      </div>

      {/* Recent Campaigns Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
          <button
            onClick={() => navigate('/campaigns')}
            className="text-sm text-primary font-medium hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Spend</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Impressions</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">CTR</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Conversions</th>
              </tr>
            </thead>
            <tbody>
              {data.recentCampaigns.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-100 hover:bg-cream cursor-pointer transition duration-150"
                  onClick={() => navigate(`/campaigns/${c.id}`)}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3"><Badge status={c.status} /></td>
                  <td className="px-4 py-3 text-gray-700">{formatCurrency(c.metrics.spend, currency)}</td>
                  <td className="px-4 py-3 text-gray-700">{formatCompact(c.metrics.impressions)}</td>
                  <td className="px-4 py-3 text-primary font-medium">{c.metrics.ctr}%</td>
                  <td className="px-4 py-3 text-primary font-medium">{formatNumber(c.metrics.conversions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ title, value, change, subtitle, subtext, icon }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-primary mt-1">{value}</p>
          {change && (
            <p className="text-sm text-green-500 mt-1">{change} from last period</p>
          )}
          {subtitle}
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function CampaignStatIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function BudgetStatIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ImpressionStatIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ConversionStatIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
