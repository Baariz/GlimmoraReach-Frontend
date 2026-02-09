import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LineChartComponent from '../components/charts/LineChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { fetchFunnel, fetchTimeSeries, fetchPlatformComparison, fetchAttribution } from '../utils/api';
import { formatNumber, formatCurrency, formatPercent } from '../utils/helpers';
import { reportTemplates, scheduledReports } from '../data/mockData';
import ExportReportModal from '../components/ExportReportModal';

export default function Analytics() {
  const { currency } = useAuth();
  const addToast = useToast();
  const [funnel, setFunnel] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [attribution, setAttribution] = useState(null);
  const [days, setDays] = useState(30);
  const [attrModel, setAttrModel] = useState('last_click');
  const [loading, setLoading] = useState(true);
  const [exportModal, setExportModal] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchFunnel(),
      fetchTimeSeries(days),
      fetchPlatformComparison(),
      fetchAttribution(attrModel),
    ])
      .then(([fRes, tsRes, pRes, aRes]) => {
        setFunnel(fRes.data.data);
        setTimeSeries(tsRes.data.data);
        setPlatforms(pRes.data.data);
        setAttribution(aRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const changeDays = (d) => {
    setDays(d);
    fetchTimeSeries(d).then((res) => setTimeSeries(res.data.data)).catch(() => {});
  };

  const changeModel = (model) => {
    setAttrModel(model);
    fetchAttribution(model).then((res) => setAttribution(res.data.data)).catch(() => {});
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const attrPieData = attribution
    ? Object.entries(attribution.breakdown).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics & Reports</h1>

      {/* Funnel Visualization */}
      {funnel && (
        <Card className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
          <div className="flex items-center justify-center gap-4">
            <FunnelStage
              label="Impressions"
              value={formatNumber(funnel.impressions)}
              percent="100%"
              color="bg-primary"
              width="w-72"
            />
            <Arrow />
            <FunnelStage
              label="Clicks"
              value={formatNumber(funnel.clicks)}
              percent={`${funnel.clickRate}%`}
              color="bg-primary-light"
              width="w-56"
            />
            <Arrow />
            <FunnelStage
              label="Conversions"
              value={formatNumber(funnel.conversions)}
              percent={`${funnel.conversionRate}%`}
              color="bg-gold"
              width="w-44"
            />
          </div>
          <div className="flex justify-center gap-12 mt-4 text-sm text-gray-500">
            <span>Click Rate: <strong className="text-primary">{funnel.clickRate}%</strong></span>
            <span>Conv. Rate: <strong className="text-primary">{funnel.conversionRate}%</strong></span>
            <span>Cost/Conv: <strong className="text-primary">{formatCurrency(funnel.costPerConversion, currency)}</strong></span>
          </div>
        </Card>
      )}

      {/* Time Series Chart */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance Over Time</h3>
          <div className="flex gap-1">
            {[7, 14, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => changeDays(d)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition duration-200 cursor-pointer ${
                  days === d ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-cream'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
        <LineChartComponent data={timeSeries} height={320} />
      </Card>

      {/* Platform Comparison Table */}
      <Card className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Platform</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Impressions</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Clicks</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">CTR</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">CPC</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Conversions</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">CPA</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((p, i) => {
                const bestRoas = Math.max(...platforms.map((x) => x.roas));
                return (
                  <tr key={p.platform} className={`border-b border-gray-100 ${p.roas === bestRoas ? 'bg-cream' : 'hover:bg-cream'} transition duration-150`}>
                    <td className="px-4 py-3 font-medium text-gray-900">{p.platform}</td>
                    <td className="px-4 py-3 text-gray-700">{formatNumber(p.impressions)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatNumber(p.clicks)}</td>
                    <td className="px-4 py-3">
                      <span className={p.ctr >= 4 ? 'text-green-500 font-medium' : 'text-gray-700'}>{formatPercent(p.ctr)}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatCurrency(p.cpc, currency)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatNumber(p.conversions)}</td>
                    <td className="px-4 py-3">
                      <span className={p.cpa < 25 ? 'text-green-500 font-medium' : p.cpa > 40 ? 'text-red-400 font-medium' : 'text-gray-700'}>
                        {formatCurrency(p.cpa, currency)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={p.roas >= 3 ? 'text-green-500 font-medium' : p.roas < 2 ? 'text-red-400 font-medium' : 'text-gray-700'}>
                        {p.roas}x
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Attribution Model */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Attribution Model</h3>
          <select
            value={attrModel}
            onChange={(e) => changeModel(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="last_click">Last Click</option>
            <option value="first_click">First Click</option>
            <option value="linear">Linear</option>
            <option value="time_decay">Time Decay</option>
            <option value="position_based">Position Based</option>
          </select>
        </div>

        {attribution && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="border-l-4 border-primary bg-cream rounded-r-lg p-4 mb-4">
                <p className="font-semibold text-primary">{attribution.model}</p>
                <p className="text-sm text-gray-600 mt-1">{attribution.description}</p>
              </div>
              {/* // Future: Real multi-touch attribution engine */}
              <PieChartComponent data={attrPieData} height={280} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Channel Breakdown</h4>
              <div className="space-y-3">
                {Object.entries(attribution.breakdown).map(([channel, pct]) => (
                  <div key={channel}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{channel}</span>
                      <span className="text-primary font-medium">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Export Modal */}
      <ExportReportModal
        isOpen={exportModal}
        onClose={(success) => {
          setExportModal(false);
          if (success) addToast('Report exported successfully!');
        }}
        funnel={funnel}
        platforms={platforms}
      />

      {/* Reports Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-primary">Reports</h3>
          <Button variant="outline" onClick={() => setExportModal(true)}>
            Export PDF Report
          </Button>
        </div>

        {/* Report Templates */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {reportTemplates.map((r) => (
            <Card key={r.id} hover className="cursor-pointer" onClick={() => addToast(`${r.title} generated!`)}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center text-primary text-lg">
                  {r.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{r.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{r.description}</p>
                  <Button variant="outline" size="sm" className="mt-3">Generate Report</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Scheduled Reports */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Scheduled Reports</h4>
            <Button size="sm">Schedule New</Button>
          </div>
          <p className="text-xs text-gray-400 mb-3">Scheduling simulated - no real emails</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Report Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Frequency</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Recipients</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Next Run</th>
                </tr>
              </thead>
              <tbody>
                {scheduledReports.map((sr) => (
                  <tr key={sr.id} className="border-b border-gray-100 hover:bg-cream transition duration-150">
                    <td className="px-4 py-3 font-medium text-gray-900">{sr.name}</td>
                    <td className="px-4 py-3 text-gray-700">{sr.frequency}</td>
                    <td className="px-4 py-3 text-gray-700">{sr.recipients}</td>
                    <td className="px-4 py-3 text-gray-700">{sr.nextRun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* // Future: Implement CSV/PDF generation */}
        </Card>
      </div>
    </div>
  );
}

function FunnelStage({ label, value, percent, color, width }) {
  return (
    <div className={`${width} ${color} rounded-lg py-4 px-5 text-white text-center`}>
      <p className="text-xs font-medium opacity-80">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs opacity-70">{percent}</p>
    </div>
  );
}

function Arrow() {
  return (
    <svg className="w-6 h-6 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}
