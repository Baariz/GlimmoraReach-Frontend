import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { createCampaign, calculateBid, estimateAudience, getBudgetRecommendation } from '../utils/api';
import { objectiveOptions, biddingStrategies, interestOptions, locationOptions } from '../data/mockData';
import { formatCurrency, CURRENCIES } from '../utils/helpers';

const steps = ['Basic Info', 'Budget & Schedule', 'Targeting', 'Bidding Strategy', 'Creative Upload', 'Review & Launch'];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { currency } = useAuth();
  const addToast = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    objective: '',
    campaignType: 'display',
    adCopy: '',
    description: '',
    targetUrl: '',
    budgetType: 'daily',
    budgetAmount: '',
    startDate: '',
    endDate: '',
    ageMin: 18,
    ageMax: 55,
    gender: 'all',
    locations: [],
    interests: [],
    biddingStrategy: '',
    platforms: [],
    creativeFiles: [],
  });
  const [budgetRec, setBudgetRec] = useState(null);
  const [audienceEst, setAudienceEst] = useState(null);
  const [bidResult, setBidResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleArrayItem = (key, item) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter((i) => i !== item)
        : [...prev[key], item],
    }));
  };

  const nextStep = () => {
    if (currentStep === 1 && form.objective) {
      getBudgetRecommendation({ objective: form.objective, platforms: form.platforms })
        .then((res) => setBudgetRec(res.data.data))
        .catch(() => {});
    }
    if (currentStep === 2) {
      estimateAudience({
        ageMin: form.ageMin,
        ageMax: form.ageMax,
        gender: form.gender,
        locations: form.locations,
        interests: form.interests,
      })
        .then((res) => setAudienceEst(res.data.data))
        .catch(() => {});
    }
    if (currentStep === 3) {
      calculateBid({
        audience: audienceEst?.min || 500000,
        platform: form.platforms[0] || 'google',
        budget: Number(form.budgetAmount) || 5000,
        objective: form.objective,
      })
        .then((res) => setBidResult(res.data.data))
        .catch(() => {});
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await createCampaign(form);
      addToast('Campaign launched successfully!');
      navigate('/campaigns');
    } catch {
      addToast('Failed to launch campaign. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Campaign</h1>

      {/* Step Progress Indicator */}
      <div className="flex items-center mb-10">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i < currentStep
                    ? 'bg-primary text-white'
                    : i === currentStep
                    ? 'bg-primary text-white'
                    : 'border-2 border-gray-300 text-gray-400'
                }`}
              >
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span className={`text-sm hidden lg:inline ${i <= currentStep ? 'text-primary font-medium' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 ${i < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        {currentStep === 0 && (
          <StepBasicInfo form={form} updateForm={updateForm} />
        )}
        {currentStep === 1 && (
          <StepBudget form={form} updateForm={updateForm} budgetRec={budgetRec} currency={currency} />
        )}
        {currentStep === 2 && (
          <StepTargeting
            form={form}
            updateForm={updateForm}
            toggleArrayItem={toggleArrayItem}
            audienceEst={audienceEst}
          />
        )}
        {currentStep === 3 && (
          <StepBidding
            form={form}
            updateForm={updateForm}
            toggleArrayItem={toggleArrayItem}
            bidResult={bidResult}
            currency={currency}
          />
        )}
        {currentStep === 4 && (
          <StepCreativeUpload form={form} updateForm={updateForm} addToast={addToast} />
        )}
        {currentStep === 5 && (
          <StepReview form={form} audienceEst={audienceEst} bidResult={bidResult} currency={currency} />
        )}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {currentStep > 0 ? (
          <Button variant="outline" onClick={prevStep}>Back</Button>
        ) : (
          <div />
        )}
        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep}>Continue</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Launching...' : 'Launch Campaign'}
          </Button>
        )}
      </div>
    </div>
  );
}

/* Step 1: Basic Information */
function StepBasicInfo({ form, updateForm }) {
  const campaignTypes = [
    { id: 'display', label: 'Display', icon: '🖼️' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'social', label: 'Social', icon: '💬' },
    { id: 'video', label: 'Video', icon: '🎬' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-6">Basic Information</h2>
      <Input
        label="Campaign Name"
        placeholder="e.g., Summer Product Launch"
        value={form.name}
        onChange={(e) => updateForm('name', e.target.value)}
        className="mb-6"
      />
      <p className="text-sm font-medium text-gray-700 mb-3">Campaign Objective</p>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {objectiveOptions.map((obj) => (
          <button
            key={obj.id}
            onClick={() => updateForm('objective', obj.id)}
            className={`p-5 rounded-lg border-2 text-left transition duration-200 cursor-pointer ${
              form.objective === obj.id
                ? 'border-primary bg-cream'
                : 'border-gray-200 hover:border-primary-light'
            }`}
          >
            <div className="w-10 h-10 bg-primary-light/20 rounded-lg flex items-center justify-center text-xl mb-3">
              {obj.icon}
            </div>
            <p className="font-semibold text-gray-900">{obj.title}</p>
            <p className="text-xs text-gray-500 mt-1">{obj.description}</p>
          </button>
        ))}
      </div>

      {/* Campaign Type */}
      <p className="text-sm font-medium text-gray-700 mb-3">Campaign Type</p>
      <div className="flex gap-3 mb-6">
        {campaignTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => updateForm('campaignType', type.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition duration-200 cursor-pointer ${
              form.campaignType === type.id
                ? 'border-primary bg-cream text-primary'
                : 'border-gray-200 text-gray-600 hover:border-primary-light'
            }`}
          >
            <span className="text-lg">{type.icon}</span>
            {type.label}
          </button>
        ))}
      </div>

      {/* Ad Copy / Headline */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Copy / Headline</label>
        <textarea
          value={form.adCopy}
          onChange={(e) => updateForm('adCopy', e.target.value)}
          placeholder="Write a compelling headline for your ad..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200 resize-none"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => updateForm('description', e.target.value)}
          placeholder="Describe your product or offer in detail..."
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200 resize-none"
        />
      </div>

      {/* Target URL / Landing Page */}
      <Input
        label="Target URL / Landing Page"
        placeholder="https://example.com/landing-page"
        value={form.targetUrl}
        onChange={(e) => updateForm('targetUrl', e.target.value)}
      />
    </div>
  );
}

/* Step 2: Budget & Schedule */
function StepBudget({ form, updateForm, budgetRec, currency }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-6">Budget & Schedule</h2>

      {/* Budget Type Toggle */}
      <p className="text-sm font-medium text-gray-700 mb-2">Budget Type</p>
      <div className="flex gap-2 mb-6">
        {['daily', 'lifetime'].map((type) => (
          <button
            key={type}
            onClick={() => updateForm('budgetType', type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition duration-200 cursor-pointer ${
              form.budgetType === type
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-cream'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <Input
        label={`${form.budgetType === 'daily' ? 'Daily' : 'Total'} Budget`}
        prefix={(CURRENCIES[currency] || CURRENCIES.USD).symbol}
        type="number"
        placeholder="5000"
        value={form.budgetAmount}
        onChange={(e) => updateForm('budgetAmount', e.target.value)}
        className="mb-6"
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Input
          label="Start Date"
          type="date"
          value={form.startDate}
          onChange={(e) => updateForm('startDate', e.target.value)}
        />
        <Input
          label="End Date"
          type="date"
          value={form.endDate}
          onChange={(e) => updateForm('endDate', e.target.value)}
        />
      </div>

      {/* AI Recommendation */}
      {budgetRec && (
        <div className="border-l-4 border-gold bg-cream rounded-r-lg p-4">
          {/* // Will be replaced by ML budget optimization */}
          <p className="text-sm font-semibold text-primary mb-1">AI Budget Recommendation</p>
          <p className="text-sm text-gray-600">{budgetRec.reasoning}</p>
          <p className="text-lg font-bold text-primary mt-2">
            {formatCurrency(budgetRec.min, currency)} - {formatCurrency(budgetRec.max, currency)}
          </p>
        </div>
      )}
    </div>
  );
}

/* Step 3: Targeting */
function StepTargeting({ form, updateForm, toggleArrayItem, audienceEst }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-6">Targeting</h2>

      {/* Demographics */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Age Range</p>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            value={form.ageMin}
            onChange={(e) => updateForm('ageMin', Number(e.target.value))}
            className="w-24"
          />
          <span className="text-gray-400">to</span>
          <Input
            type="number"
            value={form.ageMax}
            onChange={(e) => updateForm('ageMax', Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Gender</p>
        <div className="flex gap-2">
          {['all', 'male', 'female'].map((g) => (
            <button
              key={g}
              onClick={() => updateForm('gender', g)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition duration-200 cursor-pointer ${
                form.gender === g
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-cream'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Locations</p>
        <div className="flex flex-wrap gap-2">
          {locationOptions.map((loc) => (
            <button
              key={loc}
              onClick={() => toggleArrayItem('locations', loc)}
              className={`px-3 py-1.5 rounded-full text-sm transition duration-200 cursor-pointer ${
                form.locations.includes(loc)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-cream'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Interests</p>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleArrayItem('interests', interest)}
              className={`px-3 py-1.5 rounded-full text-sm transition duration-200 cursor-pointer ${
                form.interests.includes(interest)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-cream'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Audience Size Estimator */}
      {audienceEst && (
        <div className="border-l-4 border-primary bg-cream rounded-r-lg p-4">
          {/* // Simulated - will connect to audience graph API */}
          <p className="text-sm font-semibold text-gray-700 mb-1">Estimated Audience Size</p>
          <p className="text-2xl font-bold text-primary">{audienceEst.formatted}</p>
          <p className="text-xs text-gray-500 mt-1 capitalize">Audience: {audienceEst.quality}</p>
        </div>
      )}
    </div>
  );
}

/* Step 4: Bidding Strategy */
function StepBidding({ form, updateForm, toggleArrayItem, bidResult, currency }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-6">Bidding Strategy</h2>

      {/* Strategy Selection */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {biddingStrategies.map((s) => (
          <button
            key={s.id}
            onClick={() => updateForm('biddingStrategy', s.id)}
            className={`p-4 rounded-lg border-2 text-left transition duration-200 cursor-pointer ${
              form.biddingStrategy === s.id
                ? 'border-primary bg-cream'
                : 'border-gray-200 hover:border-primary-light'
            }`}
          >
            <p className="font-semibold text-gray-900">{s.title}</p>
            <p className="text-xs text-gray-500 mt-1">{s.description}</p>
          </button>
        ))}
      </div>

      {/* Platform Selection */}
      <p className="text-sm font-medium text-gray-700 mb-2">Platforms</p>
      <div className="flex gap-3 mb-6">
        {[
          { key: 'glimmora', label: 'Glimmora Reach' },
          { key: 'google', label: 'Google Ads' },
          { key: 'meta', label: 'Meta' },
          { key: 'linkedin', label: 'LinkedIn' },
        ].map((p) => (
          <label key={p.key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.platforms.includes(p.key)}
              onChange={() => toggleArrayItem('platforms', p.key)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{p.label}</span>
          </label>
        ))}
      </div>

      {/* AI Bidding Recommendations */}
      {bidResult && (
        <div className="border-l-4 border-primary bg-cream rounded-r-lg p-5">
          {/* // Replace with ML model */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">AI</div>
            <p className="font-semibold text-primary">AI Bidding Recommendation</p>
          </div>
          <p className="text-3xl font-bold text-primary mb-3">{formatCurrency(bidResult.suggestedBid, currency)}</p>
          <p className="text-xs text-gray-500 mb-3">
            Range: {formatCurrency(bidResult.min, currency)} - {formatCurrency(bidResult.max, currency)} | Confidence: {bidResult.confidence}%
          </p>
          <ul className="space-y-1.5">
            {bidResult.reasoning.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-primary mt-0.5">✓</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* Step 5: Creative Upload */
function StepCreativeUpload({ form, updateForm, addToast }) {
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toLocaleString(),
    }));
    updateForm('creativeFiles', [...form.creativeFiles, ...newFiles]);
    addToast(`${files.length} file(s) uploaded successfully!`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toLocaleString(),
    }));
    updateForm('creativeFiles', [...form.creativeFiles, ...newFiles]);
    addToast(`${files.length} file(s) uploaded successfully!`);
  };

  const removeFile = (id) => {
    updateForm('creativeFiles', form.creativeFiles.filter((f) => f.id !== id));
    addToast('File removed');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-6">Creative Upload</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      {/* Drag & Drop Zone */}
      <div
        className="border-2 border-dashed border-primary-light rounded-lg p-10 text-center hover:border-primary transition duration-200 cursor-pointer mb-6"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <svg className="w-12 h-12 text-primary-light mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm font-medium text-gray-700 mb-1">Drag & drop images or PDFs here, or click to browse</p>
        <p className="text-xs text-gray-400">Supports JPG, PNG, GIF, PDF - files stored locally in browser</p>
      </div>

      {/* Uploaded Files List */}
      {form.creativeFiles.length > 0 && (
        <div className="space-y-2 mb-6">
          <p className="text-sm font-semibold text-gray-700">Uploaded Files ({form.creativeFiles.length})</p>
          {form.creativeFiles.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-3 bg-cream rounded-lg">
              {file.type.startsWith('image/') ? (
                <img src={file.url} alt={file.name} className="w-12 h-12 object-cover rounded" />
              ) : (
                <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center text-red-500 text-xs font-bold">PDF</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(file.size)} · {file.uploadedAt}</p>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="text-xs text-red-400 font-medium hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Note */}
      <div className="bg-cream rounded-lg p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-gray-600">
          Creatives will be associated with this campaign. You can manage and preview them from the Creatives library after launch.
        </p>
      </div>
    </div>
  );
}

/* Step 6: Review & Launch */
function StepReview({ form, audienceEst, bidResult, currency }) {
  const campaignTypeLabels = { display: 'Display', search: 'Search', social: 'Social', video: 'Video' };

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-6">Review & Launch</h2>

      <div className="space-y-6">
        <ReviewSection title="Basic Information">
          <ReviewItem label="Campaign Name" value={form.name || '(not set)'} />
          <ReviewItem label="Objective" value={form.objective || '(not set)'} />
          <ReviewItem label="Campaign Type" value={campaignTypeLabels[form.campaignType] || form.campaignType} />
          <ReviewItem label="Ad Copy / Headline" value={form.adCopy || '(not set)'} />
          <ReviewItem label="Description" value={form.description || '(not set)'} />
          <ReviewItem label="Target URL" value={form.targetUrl || '(not set)'} />
        </ReviewSection>

        <ReviewSection title="Budget & Schedule">
          <ReviewItem label="Budget Type" value={form.budgetType} />
          <ReviewItem label="Amount" value={form.budgetAmount ? formatCurrency(Number(form.budgetAmount), currency) : '(not set)'} />
          <ReviewItem label="Start Date" value={form.startDate || '(not set)'} />
          <ReviewItem label="End Date" value={form.endDate || '(not set)'} />
        </ReviewSection>

        <ReviewSection title="Targeting">
          <ReviewItem label="Age Range" value={`${form.ageMin} - ${form.ageMax}`} />
          <ReviewItem label="Gender" value={form.gender} />
          <ReviewItem label="Locations" value={form.locations.join(', ') || '(none selected)'} />
          <ReviewItem label="Interests" value={form.interests.join(', ') || '(none selected)'} />
          {audienceEst && <ReviewItem label="Est. Audience" value={audienceEst.formatted} />}
        </ReviewSection>

        <ReviewSection title="Bidding & Platforms">
          <ReviewItem label="Strategy" value={form.biddingStrategy || '(not set)'} />
          <ReviewItem label="Platforms" value={form.platforms.join(', ') || '(none selected)'} />
          {bidResult && <ReviewItem label="Suggested Bid" value={formatCurrency(bidResult.suggestedBid, currency)} />}
        </ReviewSection>

        <ReviewSection title="Creatives">
          <ReviewItem label="Files Uploaded" value={`${form.creativeFiles.length} file(s)`} />
          {form.creativeFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.creativeFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1">
                  {file.type.startsWith('image/') ? (
                    <img src={file.url} alt={file.name} className="w-8 h-8 object-cover rounded" />
                  ) : (
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-500 text-[10px] font-bold">PDF</div>
                  )}
                  <span className="text-xs text-gray-600 truncate max-w-[140px]">{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </ReviewSection>
      </div>
    </div>
  );
}

function ReviewSection({ title, children }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-primary mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium capitalize">{value}</span>
    </div>
  );
}
