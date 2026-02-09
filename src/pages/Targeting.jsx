import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import BarChartComponent from '../components/charts/BarChartComponent';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { calculateBid, estimateAudience, fetchCampaigns } from '../utils/api';
import { interestOptions, locationOptions } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';

export default function Targeting() {
  const { currency } = useAuth();
  const addToast = useToast();

  // Campaign context state
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  // Targeting / audience builder state
  const [targeting, setTargeting] = useState({
    ageMin: 25, ageMax: 45, gender: 'all',
    locations: ['United States'],
    interests: ['Technology', 'E-commerce'],
  });
  const [audienceEst, setAudienceEst] = useState(null);
  const [bidResult, setBidResult] = useState(null);
  const [platform, setPlatform] = useState('google');
  const [objective, setObjective] = useState('conversion');
  const [allocation, setAllocation] = useState({ google: 40, meta: 45, linkedin: 15 });

  // Deep Analysis state
  const [industry, setIndustry] = useState('');
  const [competitionLevel, setCompetitionLevel] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');

  // ---- Fetch campaigns on mount ----
  useEffect(() => {
    setLoadingCampaigns(true);
    fetchCampaigns()
      .then((res) => {
        const list = res.data.data || res.data || [];
        setCampaigns(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        setCampaigns([]);
      })
      .finally(() => setLoadingCampaigns(false));
  }, []);

  // ---- When a campaign is selected, pre-fill fields ----
  const handleCampaignSelect = (e) => {
    const id = e.target.value;
    setSelectedCampaignId(id);

    if (!id) return; // "Enter Custom Details" chosen – leave fields as-is

    const campaign = campaigns.find((c) => String(c.id) === String(id));
    if (!campaign) return;

    // Pre-fill targeting fields from campaign data when available
    const t = campaign.targeting || {};
    setTargeting({
      ageMin: t.ageMin ?? t.ageRange?.[0] ?? 25,
      ageMax: t.ageMax ?? t.ageRange?.[1] ?? 45,
      gender: t.gender || 'all',
      locations: t.locations && t.locations.length > 0 ? t.locations : ['United States'],
      interests: t.interests && t.interests.length > 0 ? t.interests : ['Technology', 'E-commerce'],
    });

    // Pre-fill objective
    if (campaign.objective) {
      setObjective(campaign.objective);
    }

    // Pre-fill platform
    if (campaign.platform) {
      const p = campaign.platform.toLowerCase();
      if (['google', 'meta', 'linkedin'].includes(p)) {
        setPlatform(p);
      }
    }

    addToast(`Loaded targeting from "${campaign.name}"`, 'info');
  };

  // ---- Toggle helper for multi-select chips ----
  const toggleItem = (key, item) => {
    setTargeting((prev) => ({
      ...prev,
      [key]: prev[key].includes(item) ? prev[key].filter((i) => i !== item) : [...prev[key], item],
    }));
  };

  // ---- Run estimate & bid ----
  const runEstimate = () => {
    estimateAudience(targeting)
      .then((res) => setAudienceEst(res.data.data))
      .catch(() => {});

    calculateBid({
      audience: 500000,
      platform,
      budget: 10000,
      objective,
      industry: industry || undefined,
      competitionLevel: competitionLevel || undefined,
      budgetMin: budgetMin !== '' ? Number(budgetMin) : undefined,
      budgetMax: budgetMax !== '' ? Number(budgetMax) : undefined,
    })
      .then((res) => setBidResult(res.data.data))
      .catch(() => {});
  };

  // ---- Bar chart data for budget allocation ----
  const allocationData = [
    { name: 'Google Ads', value: allocation.google, fill: '#6b4d3d' },
    { name: 'Meta', value: allocation.meta, fill: '#8b6d5d' },
    { name: 'LinkedIn', value: allocation.linkedin, fill: '#d4a574' },
  ];

  // ---- Industry options ----
  const industryOptions = ['Technology', 'Retail', 'Healthcare', 'Finance', 'Education', 'Entertainment', 'Other'];

  // ---- Competition level options ----
  const competitionLevels = ['Low', 'Medium', 'High'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Targeting & Bidding Intelligence</h1>

      {/* ======== Campaign Context Section ======== */}
      <Card className="mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4">Campaign Context</h3>
        <p className="text-sm text-gray-500 mb-4">
          Select an existing campaign to pre-fill targeting fields, or choose "Enter Custom Details" to configure manually.
        </p>

        <div className="max-w-md">
          <label htmlFor="campaign-select" className="block text-sm font-medium text-gray-700 mb-1">
            Campaign
          </label>
          {loadingCampaigns ? (
            <p className="text-sm text-gray-400 italic py-2">Loading campaigns...</p>
          ) : (
            <select
              id="campaign-select"
              value={selectedCampaignId}
              onChange={handleCampaignSelect}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition duration-200"
            >
              <option value="">Enter Custom Details</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.status ? `(${c.status})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedCampaignId && (
          <div className="mt-4 border-l-4 border-primary bg-cream rounded-r-lg p-3">
            <p className="text-xs text-gray-600">
              Targeting fields have been pre-filled from the selected campaign. You can still adjust any value below before running the estimate.
            </p>
          </div>
        )}
      </Card>

      {/* ======== Main Two-Column Grid ======== */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Audience Builder */}
        <Card>
          <h3 className="text-xl font-semibold text-primary mb-5">Audience Builder</h3>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Age Range</p>
            <div className="flex items-center gap-3">
              <Input type="number" value={targeting.ageMin} onChange={(e) => setTargeting((p) => ({ ...p, ageMin: Number(e.target.value) }))} className="w-24" />
              <span className="text-gray-400">to</span>
              <Input type="number" value={targeting.ageMax} onChange={(e) => setTargeting((p) => ({ ...p, ageMax: Number(e.target.value) }))} className="w-24" />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Gender</p>
            <div className="flex gap-2">
              {['all', 'male', 'female'].map((g) => (
                <button key={g} onClick={() => setTargeting((p) => ({ ...p, gender: g }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition duration-200 cursor-pointer ${targeting.gender === g ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-cream'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Locations</p>
            <div className="flex flex-wrap gap-2">
              {locationOptions.map((loc) => (
                <button key={loc} onClick={() => toggleItem('locations', loc)}
                  className={`px-3 py-1.5 rounded-full text-sm transition duration-200 cursor-pointer ${targeting.locations.includes(loc) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-cream'}`}>
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 mb-2">Interests</p>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button key={interest} onClick={() => toggleItem('interests', interest)}
                  className={`px-3 py-1.5 rounded-full text-sm transition duration-200 cursor-pointer ${targeting.interests.includes(interest) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-cream'}`}>
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={runEstimate} className="w-full">Estimate Audience & Bid</Button>

          {audienceEst && (
            <div className="border-l-4 border-primary bg-cream rounded-r-lg p-4 mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">Estimated Audience Size</p>
              <p className="text-2xl font-bold text-primary">{audienceEst.formatted}</p>
              <p className="text-xs text-gray-500 capitalize">Quality: {audienceEst.quality}</p>
            </div>
          )}
        </Card>

        {/* Bidding Intelligence Panel */}
        <div className="space-y-6">
          <Card className="border-l-4 border-primary">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">AI</div>
              <h3 className="text-xl font-semibold text-primary">AI Bidding Engine</h3>
            </div>

            {/* Platform selector */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Platform</p>
              <div className="flex gap-2">
                {['google', 'meta', 'linkedin'].map((p) => (
                  <button key={p} onClick={() => setPlatform(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition duration-200 cursor-pointer ${platform === p ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {p === 'google' ? 'Google Ads' : p === 'meta' ? 'Meta' : 'LinkedIn'}
                  </button>
                ))}
              </div>
            </div>

            {/* Objective selector */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Objective</p>
              <div className="flex gap-2">
                {['awareness', 'consideration', 'conversion'].map((o) => (
                  <button key={o} onClick={() => setObjective(o)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition duration-200 cursor-pointer ${objective === o ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* ======== Deep Analysis Section ======== */}
            <div className="border-t border-gray-200 pt-4 mt-4 mb-4">
              <p className="text-sm font-semibold text-gray-800 mb-3">Deep Analysis</p>

              {/* Industry */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Industry</p>
                <div className="flex flex-wrap gap-2">
                  {industryOptions.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(industry === ind ? '' : ind)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition duration-200 cursor-pointer ${
                        industry === ind ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-cream'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Competition Level */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Competition Level</p>
                <div className="flex gap-2">
                  {competitionLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => setCompetitionLevel(competitionLevel === level ? '' : level)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition duration-200 cursor-pointer ${
                        competitionLevel === level ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-cream'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Budget Range</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Min</label>
                    <Input
                      type="number"
                      placeholder="e.g. 1000"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <span className="text-gray-400 mt-5">to</span>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Max</label>
                    <Input
                      type="number"
                      placeholder="e.g. 50000"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* ======== End Deep Analysis ======== */}

            {bidResult ? (
              <div className="bg-cream rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Suggested Bid</p>
                <p className="text-4xl font-bold text-primary mb-2">{formatCurrency(bidResult.suggestedBid, currency)}</p>
                <p className="text-xs text-gray-500 mb-3">
                  Range: {formatCurrency(bidResult.min, currency)} - {formatCurrency(bidResult.max, currency)} | Confidence: {bidResult.confidence}%
                </p>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Calculation Breakdown</p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between"><span>Base Bid</span><span>{formatCurrency(bidResult.breakdown.baseBid, currency)}</span></div>
                    <div className="flex justify-between"><span>Audience Factor</span><span>{bidResult.breakdown.audienceFactor}x</span></div>
                    <div className="flex justify-between"><span>Platform Factor</span><span>{bidResult.breakdown.platformFactor}x</span></div>
                    <div className="flex justify-between"><span>Objective Factor</span><span>{bidResult.breakdown.objectiveFactor}x</span></div>
                    <div className="flex justify-between"><span>Time Factor</span><span>{bidResult.breakdown.timeFactor}x</span></div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Reasoning</p>
                  <ul className="space-y-1">
                    {bidResult.reasoning.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-primary mt-0.5">&#10003;</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Click "Estimate Audience & Bid" to see AI recommendations</p>
            )}
          </Card>
        </div>
      </div>

      {/* Budget Allocation Simulator */}
      <Card>
        <h3 className="text-xl font-semibold text-primary mb-5">Budget Allocation Simulator</h3>
        <div className="grid grid-cols-3 gap-6 mb-6">
          {[
            { key: 'google', label: 'Google Ads', color: '#6b4d3d' },
            { key: 'meta', label: 'Meta', color: '#8b6d5d' },
            { key: 'linkedin', label: 'LinkedIn', color: '#d4a574' },
          ].map((p) => (
            <div key={p.key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{p.label}</span>
                <span className="text-primary font-bold">{allocation[p.key]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={allocation[p.key]}
                onChange={(e) => setAllocation((prev) => ({ ...prev, [p.key]: Number(e.target.value) }))}
                className="w-full accent-primary"
              />
            </div>
          ))}
        </div>

        <BarChartComponent
          data={allocationData}
          bars={[{ dataKey: 'value', color: '#6b4d3d', name: 'Allocation %' }]}
          height={200}
        />
      </Card>
    </div>
  );
}
