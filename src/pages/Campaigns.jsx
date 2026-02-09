import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import { fetchCampaigns, updateCampaignStatus } from '../utils/api';
import { formatCurrency, formatCompact, formatNumber } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const filterTabs = ['all', 'active', 'paused', 'completed'];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { currency } = useAuth();
  const addToast = useToast();

  const loadCampaigns = () => {
    setLoading(true);
    fetchCampaigns(activeFilter === 'all' ? undefined : activeFilter)
      .then((res) => setCampaigns(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCampaigns();
  }, [activeFilter]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleStatusChange = async (e, campaign) => {
    e.stopPropagation();
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    try {
      await updateCampaignStatus(campaign.id, newStatus);
      addToast(`Campaign "${campaign.name}" ${newStatus === 'paused' ? 'paused' : 'resumed'}!`);
      loadCampaigns();
    } catch {
      addToast('Failed to update campaign status', 'error');
    }
    setOpenMenu(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
        <Button onClick={() => navigate('/campaigns/create')}>+ Create Campaign</Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 capitalize cursor-pointer ${
              activeFilter === tab
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-cream hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Campaigns Table */}
      <Card className="animate-fade-in-up">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            <p className="text-sm">No campaigns found</p>
            <Button size="sm" className="mt-3" onClick={() => navigate('/campaigns/create')}>Create Your First Campaign</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Budget</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Impressions</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Clicks</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">CTR</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Conversions</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-100 hover:bg-cream cursor-pointer transition duration-150"
                    onClick={() => navigate(`/campaigns/${c.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{(c.platforms || []).join(', ')}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge status={c.status} /></td>
                    <td className="px-4 py-3">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{formatCurrency(c.budget?.spent || 0, currency)}</span>
                          <span className="text-gray-400">{formatCurrency(c.budget?.total || 0, currency)}</span>
                        </div>
                        <ProgressBar value={c.budget?.spent || 0} max={c.budget?.total || 1} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatCompact(c.metrics?.impressions || 0)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatCompact(c.metrics?.clicks || 0)}</td>
                    <td className="px-4 py-3 text-primary font-medium">{c.metrics?.ctr || 0}%</td>
                    <td className="px-4 py-3 text-primary font-medium">{formatNumber(c.metrics?.conversions || 0)}</td>
                    <td className="px-4 py-3 relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                        className="text-primary hover:text-primary-dark transition cursor-pointer p-1 rounded hover:bg-cream"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                      </button>

                      {openMenu === c.id && (
                        <div ref={menuRef} className="absolute right-4 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-40 py-1 animate-fade-in">
                          <button
                            onClick={() => { navigate(`/campaigns/${c.id}`); setOpenMenu(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cream transition cursor-pointer flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            View Details
                          </button>
                          <button
                            onClick={() => { navigate(`/campaigns/${c.id}`); setOpenMenu(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cream transition cursor-pointer flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                            Edit
                          </button>
                          {c.status !== 'completed' && (
                            <button
                              onClick={(e) => handleStatusChange(e, c)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cream transition cursor-pointer flex items-center gap-2"
                            >
                              {c.status === 'active' ? (
                                <>
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>
                                  Pause
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>
                                  Resume
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
