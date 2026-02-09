import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
    title: 'Multi-Platform Management',
    description: 'Run campaigns across Glimmora Reach, Google, Meta, and LinkedIn from a single dashboard. Includes a built-in internal ad engine for native delivery.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
      </svg>
    ),
    title: 'AI-Powered Bidding',
    description: 'Smart bid optimization using machine learning for maximum ROI. Automatically adjusts to market conditions.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title: 'Real-Time Analytics',
    description: 'Live dashboards, funnel analysis, and attribution modeling. Know exactly what is working and why.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
      </svg>
    ),
    title: 'Creative AI Studio',
    description: 'Generate and optimize ad creatives with AI assistance. A/B test variations automatically at scale.',
  },
];

const STEPS = [
  {
    number: '1',
    title: 'Connect Your Platforms',
    description: 'Start with Glimmora Reach as your native ad engine, then link Google Ads, Meta, and LinkedIn in just a few clicks. Secure OAuth connections keep your data safe.',
  },
  {
    number: '2',
    title: 'Create Campaigns',
    description: 'Use AI-guided campaign creation with smart recommendations. Set budgets, targeting, and creatives with intelligent defaults.',
  },
  {
    number: '3',
    title: 'Optimize & Scale',
    description: 'Let AI optimize bids, creatives, and targeting automatically. Watch your ROI grow while you focus on strategy.',
  },
];

const TESTIMONIALS = [
  {
    quote: 'Glimmora Reach transformed how we manage our ad spend. We consolidated 5 platforms into one and saw a 40% improvement in ROAS within the first month.',
    name: 'Sarah Mitchell',
    role: 'VP of Marketing',
    company: 'TechFlow Inc.',
    stars: 5,
  },
  {
    quote: 'The AI bidding engine is incredible. It caught optimization opportunities our team missed and saved us over $200K in wasted spend last quarter.',
    name: 'James Rodriguez',
    role: 'Performance Lead',
    company: 'ScaleUp Media',
    stars: 5,
  },
  {
    quote: 'Finally, a platform that gives us enterprise-grade analytics without the enterprise-grade complexity. Our reporting time dropped by 80%.',
    name: 'Priya Sharma',
    role: 'Head of Growth',
    company: 'Nexus Digital',
    stars: 5,
  },
];

const STATS = [
  { value: '10K+', label: 'Campaigns' },
  { value: '500+', label: 'Brands' },
  { value: '$50M+', label: 'Ad Spend Managed' },
  { value: '4.9', label: 'Rating' },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* ================================================================
          SECTION 1 -- Hero
          ================================================================ */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6b4d3d 0%, #8b6d5d 40%, #d4a574 100%)' }}
      >
        {/* Decorative floating circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 animate-float" />
        <div
          className="absolute top-1/4 right-12 w-48 h-48 rounded-full bg-white/5 animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-16 left-20 w-64 h-64 rounded-full bg-white/5 animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white/5 animate-float"
          style={{ animationDelay: '1.5s' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up"
            style={{ animationFillMode: 'both' }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
            <span className="text-white/90 text-sm font-medium">Now in Open Beta</span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            The Future of Ad Campaign{' '}
            <span className="relative">
              Management
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 rounded-full" />
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            Manage campaigns across Glimmora Reach, Google Ads, Meta, and LinkedIn from one intelligent platform.
            Built-in ad engine, AI-powered bidding, real-time analytics, and creative optimization.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3.5 rounded-lg hover:bg-gray-50 transition duration-200 text-sm shadow-lg"
            >
              Get Started Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-white/10 transition duration-200 text-sm cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
              </svg>
              Watch Demo
            </button>
          </div>

          {/* Stats bar */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-4"
              >
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 2 -- Features Grid
          ================================================================ */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section heading */}
          <div className="text-center mb-16">
            <span
              className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3 animate-fade-in-up"
              style={{ animationFillMode: 'both' }}
            >
              Features
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up"
              style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            >
              Why Choose Glimmora Reach?
            </h2>
            <p
              className="text-gray-500 text-lg max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: '0.15s', animationFillMode: 'both' }}
            >
              Everything you need to run high-performing ad campaigns across every major platform.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-8 border border-gray-100 group animate-fade-in-up"
                style={{ animationDelay: `${0.1 + i * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 3 -- How It Works
          ================================================================ */}
      <section id="how-it-works" className="py-24 bg-cream">
        <div className="max-w-5xl mx-auto px-6">
          {/* Section heading */}
          <div className="text-center mb-16">
            <span
              className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3 animate-fade-in-up"
              style={{ animationFillMode: 'both' }}
            >
              How It Works
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up"
              style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            >
              Get Started in 3 Simple Steps
            </h2>
            <p
              className="text-gray-500 text-lg max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: '0.15s', animationFillMode: 'both' }}
            >
              From setup to optimization, we make every step effortless.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className="flex items-start gap-6 animate-fade-in-up"
                style={{ animationDelay: `${0.1 + i * 0.15}s`, animationFillMode: 'both' }}
              >
                {/* Step number */}
                <div className="flex-shrink-0 w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">{step.number}</span>
                </div>
                {/* Step content */}
                <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 4 -- Platform Logos / Trusted Integrations
          ================================================================ */}
      <section id="integrations" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span
              className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3 animate-fade-in-up"
              style={{ animationFillMode: 'both' }}
            >
              Integrations
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up"
              style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            >
              Trusted Integrations
            </h2>
            <p
              className="text-gray-500 text-lg max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: '0.15s', animationFillMode: 'both' }}
            >
              Connect the platforms you already use. Seamless setup, secure data sync.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Glimmora Reach - Native Engine */}
            <div
              className="bg-white rounded-xl border-2 border-primary p-8 text-center hover:shadow-lg transition duration-300 animate-fade-in-up relative"
              style={{ animationDelay: '0.05s', animationFillMode: 'both' }}
            >
              <span className="absolute top-3 right-3 text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full uppercase">Native</span>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Glimmora Reach</h3>
              <p className="text-gray-500 text-sm mb-4">Built-in Ad Engine, Native Delivery</p>
              <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                Built-in
              </span>
            </div>

            {/* Google Ads */}
            <div
              className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-lg transition duration-300 animate-fade-in-up"
              style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Ads</h3>
              <p className="text-gray-500 text-sm mb-4">Search, Display, YouTube, Shopping</p>
              <span className="inline-block text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                Connected
              </span>
            </div>

            {/* Meta Ads */}
            <div
              className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-lg transition duration-300 animate-fade-in-up"
              style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Meta Ads</h3>
              <p className="text-gray-500 text-sm mb-4">Facebook, Instagram, Messenger</p>
              <span className="inline-block text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                Connected
              </span>
            </div>

            {/* LinkedIn Ads */}
            <div
              className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-lg transition duration-300 animate-fade-in-up"
              style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sky-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">LinkedIn Ads</h3>
              <p className="text-gray-500 text-sm mb-4">Sponsored Content, InMail, Display</p>
              <span className="inline-block text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                Connected
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 5 -- Testimonials
          ================================================================ */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span
              className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3 animate-fade-in-up"
              style={{ animationFillMode: 'both' }}
            >
              Testimonials
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up"
              style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            >
              What Our Users Say
            </h2>
            <p
              className="text-gray-500 text-lg max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: '0.15s', animationFillMode: 'both' }}
            >
              Trusted by marketing teams at companies of every size.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, i) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-xl shadow-md p-8 border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${0.1 + i * 0.1}s`, animationFillMode: 'both' }}
              >
                <StarRating count={testimonial.stars} />
                <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">
                      {testimonial.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 6 -- CTA Banner
          ================================================================ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6b4d3d 0%, #8b6d5d 40%, #d4a574 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 animate-float" />
        <div
          className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-white/5 animate-float"
          style={{ animationDelay: '1.5s' }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4 animate-fade-in-up"
            style={{ animationFillMode: 'both' }}
          >
            Ready to Transform Your Advertising?
          </h2>
          <p
            className="text-white/80 text-lg mb-10 animate-fade-in-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            Join thousands of marketers already using Glimmora Reach to drive results.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-10 py-4 rounded-lg hover:bg-gray-50 transition duration-200 text-sm shadow-lg animate-fade-in-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
