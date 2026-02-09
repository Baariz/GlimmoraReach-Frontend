import { useState, useEffect } from 'react';

const PLATFORM_CONFIG = {
  google: {
    name: 'Google Ads',
    letter: 'G',
    color: '#4285F4',
    buttonColor: 'bg-[#4285F4] hover:bg-[#3367D6]',
    prerequisites: [
      'Google Ads account',
      'Admin access to your account',
      'Billing set up in Google Ads',
    ],
    accounts: [
      { name: 'GlimmoraReach Main', id: '123-456-7890' },
      { name: 'GlimmoraReach Test', id: '098-765-4321' },
    ],
  },
  meta: {
    name: 'Meta Ads',
    letter: 'M',
    color: '#1877F2',
    buttonColor: 'bg-[#1877F2] hover:bg-[#166FE5]',
    prerequisites: [
      'Meta Business Suite account',
      'Ad account with admin role',
      'Facebook Page connected',
    ],
    accounts: [
      { name: 'Glimmora Business', id: 'act_12345678' },
      { name: 'Glimmora EU', id: 'act_87654321' },
    ],
  },
  linkedin: {
    name: 'LinkedIn Ads',
    letter: 'in',
    color: '#0A66C2',
    buttonColor: 'bg-[#0A66C2] hover:bg-[#004182]',
    prerequisites: [
      'LinkedIn Campaign Manager account',
      'Company page admin access',
      'Payment method added',
    ],
    accounts: [
      { name: 'Glimmora Reach Corp', id: '507412345' },
      { name: 'Glimmora APAC', id: '507498765' },
    ],
  },
};

const PERMISSIONS = [
  'View campaigns',
  'Manage ads',
  'Access analytics',
  'Read billing info',
];

const STEP_LABELS = ['Prerequisites', 'Authorize Access', 'Select Ad Account', 'Connected!'];

export default function ConnectPlatformModal({ platform, isOpen, onClose, onConnect }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [authorizing, setAuthorizing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [connectedAt, setConnectedAt] = useState('');

  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.google;

  // Reset state when modal opens or platform changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setAuthorizing(false);
      setSelectedAccount(null);
      setConnectedAt('');
    }
  }, [isOpen, platform]);

  if (!isOpen) return null;

  const handleAuthorize = () => {
    setAuthorizing(true);
    setTimeout(() => {
      setAuthorizing(false);
      setCurrentStep(3);
    }, 1500);
  };

  const handleSelectAccount = () => {
    if (selectedAccount !== null) {
      setConnectedAt(new Date().toLocaleTimeString());
      setCurrentStep(4);
    }
  };

  const handleFinish = () => {
    onConnect?.();
    onClose?.();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const progressPercent = (currentStep / 4) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-scale-in overflow-hidden">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-1.5">
          <div
            className="gradient-primary h-1.5 rounded-r-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isCompleted = currentStep > stepNum;
            const isActive = currentStep === stepNum;
            return (
              <div key={label} className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                    isCompleted
                      ? 'gradient-primary text-white'
                      : isActive
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium ${
                    isActive ? 'text-primary' : isCompleted ? 'text-primary-light' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Platform branding header */}
        <div className="px-6 pt-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: config.color }}
            >
              {config.letter}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Connect {config.name}</h2>
              <div className="h-0.5 w-12 rounded-full mt-1" style={{ backgroundColor: config.color }} />
            </div>
            <button
              onClick={onClose}
              className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-5">
          {currentStep === 1 && <StepPrerequisites config={config} onNext={() => setCurrentStep(2)} />}
          {currentStep === 2 && (
            <StepAuthorize config={config} authorizing={authorizing} onAuthorize={handleAuthorize} />
          )}
          {currentStep === 3 && (
            <StepSelectAccount
              config={config}
              selectedAccount={selectedAccount}
              onSelect={setSelectedAccount}
              onNext={handleSelectAccount}
            />
          )}
          {currentStep === 4 && (
            <StepConnected
              config={config}
              selectedAccount={selectedAccount}
              connectedAt={connectedAt}
              onFinish={handleFinish}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 1: Prerequisites ──────────────────────────────────────────── */
function StepPrerequisites({ config, onNext }) {
  return (
    <div className="animate-fade-in">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Prerequisites</h3>
      <p className="text-xs text-gray-500 mb-4">
        Make sure you have the following before connecting.
      </p>

      <div className="space-y-3 mb-6">
        {config.prerequisites.map((item) => (
          <div key={item} className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-2.5">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-sm text-gray-700 font-medium">{item}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full gradient-primary text-white font-medium py-2.5 rounded-lg transition hover:opacity-90 cursor-pointer text-sm"
      >
        I have all of these
      </button>
    </div>
  );
}

/* ─── Step 2: Authorize Access ───────────────────────────────────────── */
function StepAuthorize({ config, authorizing, onAuthorize }) {
  return (
    <div className="animate-fade-in">
      <div className="border border-gray-200 rounded-xl p-5 mb-4">
        {/* Mock OAuth header */}
        <div className="flex justify-center mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: config.color }}
          >
            {config.letter}
          </div>
        </div>

        <p className="text-center text-sm text-gray-700 font-medium mb-4">
          <span className="font-bold text-primary">Glimmora Reach</span> is requesting access to
          your <span className="font-bold" style={{ color: config.color }}>{config.name}</span> account
        </p>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Permissions requested</p>
          <div className="space-y-2">
            {PERMISSIONS.map((perm) => (
              <div key={perm} className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {perm}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onAuthorize}
          disabled={authorizing}
          className={`w-full text-white font-medium py-2.5 rounded-lg transition cursor-pointer text-sm flex items-center justify-center gap-2 ${config.buttonColor} disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {authorizing ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Authorizing...
            </>
          ) : (
            'Authorize'
          )}
        </button>
      </div>

      <p className="text-xs text-center text-gray-400 italic">
        Mock authorization &mdash; no real data is shared
      </p>
    </div>
  );
}

/* ─── Step 3: Select Ad Account ──────────────────────────────────────── */
function StepSelectAccount({ config, selectedAccount, onSelect, onNext }) {
  return (
    <div className="animate-fade-in">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Select Ad Account</h3>
      <p className="text-xs text-gray-500 mb-4">
        Choose which ad account to connect with Glimmora Reach.
      </p>

      <div className="space-y-3 mb-6">
        {config.accounts.map((account, index) => {
          const isSelected = selectedAccount === index;
          return (
            <label
              key={account.id}
              className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition duration-200 ${
                isSelected
                  ? 'border-primary bg-cream'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {/* Custom radio */}
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition duration-200 ${
                  isSelected ? 'border-primary' : 'border-gray-300'
                }`}
              >
                {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </span>
              <div>
                <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                  {account.name}
                </p>
                <p className="text-xs text-gray-400">ID: {account.id}</p>
              </div>
              <input
                type="radio"
                name="adAccount"
                className="sr-only"
                checked={isSelected}
                onChange={() => onSelect(index)}
              />
            </label>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={selectedAccount === null}
        className="w-full gradient-primary text-white font-medium py-2.5 rounded-lg transition hover:opacity-90 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}

/* ─── Step 4: Connected! ─────────────────────────────────────────────── */
function StepConnected({ config, selectedAccount, connectedAt, onFinish }) {
  const account = config.accounts[selectedAccount] || config.accounts[0];

  return (
    <div className="animate-fade-in text-center">
      {/* Success checkmark */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center animate-scale-in">
          <svg
            className="w-9 h-9 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1">
        Successfully connected to {config.name}!
      </h3>
      <p className="text-xs text-gray-500 mb-5">
        Your ad account is now linked to Glimmora Reach.
      </p>

      {/* Connection summary card */}
      <div className="bg-cream rounded-lg p-4 text-left mb-6">
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Account name</span>
            <span className="text-sm font-medium text-gray-900">{account.name}</span>
          </div>
          <div className="border-t border-gray-200" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Account ID</span>
            <span className="text-sm font-mono text-gray-700">{account.id}</span>
          </div>
          <div className="border-t border-gray-200" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Permissions granted</span>
            <span className="text-sm font-medium text-gray-900">{PERMISSIONS.length} permissions</span>
          </div>
          <div className="border-t border-gray-200" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Connected at</span>
            <span className="text-sm font-medium text-gray-900">{connectedAt}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onFinish}
        className="w-full gradient-primary text-white font-medium py-2.5 rounded-lg transition hover:opacity-90 cursor-pointer text-sm"
      >
        Start Managing Ads
      </button>
    </div>
  );
}
