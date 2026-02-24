import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ConnectPlatformModal from '../components/ConnectPlatformModal';

const ROLES = [
  { value: '', label: 'Select your role' },
  { value: 'marketing_manager', label: 'Marketing Manager' },
  { value: 'business_owner', label: 'Business Owner' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'agency_manager', label: 'Agency Manager' },
  { value: 'other', label: 'Other' },
];

const BENEFITS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
      </svg>
    ),
    text: 'Real-time campaign analytics across all platforms',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
      </svg>
    ),
    text: 'AI-powered optimization and smart recommendations',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
    text: 'Team collaboration with role-based access control',
  },
];

const PLATFORMS = [
  {
    key: 'google',
    name: 'Google Ads',
    letter: 'G',
    color: '#4285F4',
    description: 'Search, Display, YouTube, and Shopping campaigns',
  },
  {
    key: 'meta',
    name: 'Meta Ads',
    letter: 'M',
    color: '#1877F2',
    description: 'Facebook, Instagram, Messenger, and Audience Network',
  },
  {
    key: 'linkedin',
    name: 'LinkedIn Ads',
    letter: 'in',
    color: '#0A66C2',
    description: 'Sponsored content, messaging, and lead gen forms',
  },
];

export default function Register() {
  const [step, setStep] = useState('register'); // 'register' | 'platforms'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Platform connection state
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [modalPlatform, setModalPlatform] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();
  const addToast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!role) {
      setError('Please select your role.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service.');
      return;
    }

    setIsLoading(true);

    // Brief delay to simulate network request
    await new Promise((r) => setTimeout(r, 600));

    const result = register(name.trim(), email.trim(), password, company.trim(), role);
    setIsLoading(false);

    if (result.success) {
      addToast('Account created successfully!');
      setStep('platforms');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  }

  function handleConnectPlatform(platformKey) {
    setModalPlatform(platformKey);
  }

  function handlePlatformConnected() {
    if (modalPlatform && !connectedPlatforms.includes(modalPlatform)) {
      setConnectedPlatforms((prev) => [...prev, modalPlatform]);
    }
    setModalPlatform(null);
  }

  function handleContinue() {
    navigate('/');
  }

  // ── Connect Platforms Step ──
  if (step === 'platforms') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center mb-6">
              <img src="/Glimmora_reach_logo_fit.png" alt="Glimmora Reach" className="h-10 w-auto object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Ad Platforms</h1>
            <p className="text-gray-500 text-sm">Connect now or add them later from your profile</p>
          </div>

          {/* Platform cards */}
          <div className="space-y-4 mb-8">
            {PLATFORMS.map((platform) => {
              const isConnected = connectedPlatforms.includes(platform.key);
              return (
                <div
                  key={platform.key}
                  className={`bg-white border rounded-xl p-5 flex items-center gap-4 transition duration-200 ${
                    isConnected ? 'border-green-300 bg-green-50/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: platform.color }}
                  >
                    {platform.letter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">{platform.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{platform.description}</p>
                  </div>
                  {isConnected ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Connected
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConnectPlatform(platform.key)}
                      className="px-4 py-2 text-sm font-medium text-white rounded-lg transition hover:opacity-90 cursor-pointer"
                      style={{ backgroundColor: platform.color }}
                    >
                      Connect
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleContinue}
              className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 cursor-pointer"
            >
              Skip for Now
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-white rounded-lg gradient-primary hover:opacity-90 transition duration-200 cursor-pointer"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>

        {/* Connect Platform Modal */}
        <ConnectPlatformModal
          platform={modalPlatform || 'google'}
          isOpen={modalPlatform !== null}
          onClose={() => setModalPlatform(null)}
          onConnect={handlePlatformConnected}
        />
      </div>
    );
  }

  // ── Registration Form ──
  return (
    <div className="min-h-screen flex">
      {/* Left panel -- brand gradient */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #6b4d3d 0%, #8b6d5d 40%, #d4a574 100%)' }}
      >
        {/* Decorative floating circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 animate-float" />
        <div
          className="absolute top-1/3 right-10 w-40 h-40 rounded-full bg-white/5 animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-20 left-16 w-56 h-56 rounded-full bg-white/5 animate-float"
          style={{ animationDelay: '2s' }}
        />

        {/* Logo and tagline */}
        <div className="relative z-10">
          <div className="inline-flex bg-white rounded-xl px-3 py-2 mb-3">
            <img src="/Glimmora_reach_logo_fit.png" alt="Glimmora Reach" className="h-10 w-auto object-contain" />
          </div>
          <p className="text-white/80 text-lg">Start managing your campaigns like a pro</p>
        </div>

        {/* Benefit bullets */}
        <div className="relative z-10 space-y-6">
          {BENEFITS.map((benefit, i) => (
            <div
              key={i}
              className="flex items-start gap-4 animate-fade-in-up"
              style={{ animationDelay: `${0.2 + i * 0.15}s`, animationFillMode: 'both' }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white">
                {benefit.icon}
              </div>
              <p className="text-white/90 text-sm leading-relaxed mt-2">{benefit.text}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-white/50 text-xs">&copy; 2026 Glimmora Reach. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel -- registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in">
          {/* Back to home */}
          <Link
            to="/landing"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition duration-200 mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to home
          </Link>

          {/* Mobile-only logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center">
              <img src="/Glimmora_reach_logo_fit.png" alt="Glimmora Reach" className="h-9 w-auto object-contain" />
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 mt-1">Get started with Glimmora Reach in minutes.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Full Name field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </span>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Company Name field */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                  </svg>
                </span>
                <input
                  id="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Your company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Role dropdown */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </span>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-8 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200 appearance-none bg-white cursor-pointer text-gray-700"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value} disabled={!r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary cursor-pointer accent-[#6b4d3d]"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                I agree to the{' '}
                <span className="text-primary hover:underline font-medium cursor-pointer">Terms of Service</span>{' '}
                and{' '}
                <span className="text-primary hover:underline font-medium cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            {/* Create Account button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white rounded-lg gradient-primary hover:opacity-90 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
