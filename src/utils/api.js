import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach user email header for user-scoped data
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('glimmora_user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user.email) config.headers['x-user-email'] = user.email;
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

// Dashboard
export const fetchDashboard = () => api.get('/dashboard');

// Campaigns
export const fetchCampaigns = (status) =>
  api.get('/campaigns', { params: status ? { status } : {} });
export const fetchCampaign = (id) => api.get(`/campaigns/${id}`);
export const createCampaign = (data) => api.post('/campaigns', data);
export const updateCampaign = (id, data) => api.put(`/campaigns/${id}`, data);
export const updateCampaignStatus = (id, status) => api.patch(`/campaigns/${id}/status`, { status });
export const deleteCampaign = (id) => api.delete(`/campaigns/${id}`);

// Analytics
export const fetchFunnel = () => api.get('/analytics/funnel');
export const fetchTimeSeries = (days = 30) =>
  api.get('/analytics/timeseries', { params: { days } });
export const fetchPlatformComparison = () => api.get('/analytics/platforms');
export const fetchAttribution = (model = 'last_click') =>
  api.get('/analytics/attribution', { params: { model } });

// Platforms & Placements
export const fetchPlatformStatus = () => api.get('/platforms/status');
export const fetchPlacements = (filters) =>
  api.get('/placements', { params: filters });

// Creatives
export const fetchCreatives = (campaignId) =>
  api.get('/creatives', { params: campaignId ? { campaignId } : {} });
export const fetchCreative = (id) => api.get(`/creatives/${id}`);
export const createCreativeEntry = (data) => api.post('/creatives', data);
export const deleteCreative = (id) => api.delete(`/creatives/${id}`);
export const fetchCreativeInsights = (id) => api.post(`/creatives/${id}/insights`);

// Bidding & AI
export const calculateBid = (data) => api.post('/bidding/calculate', data);
export const estimateAudience = (data) => api.post('/audience/estimate', data);
export const getBudgetRecommendation = (data) => api.post('/budget/recommend', data);

// Team management
export const fetchTeam = () => api.get('/team');
export const inviteTeamMember = (data) => api.post('/team', data);
export const removeTeamMember = (id) => api.delete(`/team/${id}`);

// Auth (backend-stored users)
export const apiRegister = (data) => api.post('/auth/register', data);
export const apiLogin = (data) => api.post('/auth/login', data);

export default api;
