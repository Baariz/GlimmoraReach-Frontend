import { useState, useCallback } from 'react';

const STEPS = [
  {
    emoji: '🚀',
    secondaryEmojis: ['✨', '🌟', '💫'],
    gradient: 'from-[#6b4d3d] via-[#8b6d5d] to-[#d4a574]',
    title: 'Welcome to Glimmora Reach!',
    description:
      "Your all-in-one advertising campaign platform. Whether you're a marketing pro or complete beginner, we'll help you run successful ad campaigns across Google, Meta, and LinkedIn.",
    tip: "Don't worry if you're new to advertising - we'll guide you every step of the way!",
  },
  {
    emoji: '📊',
    secondaryEmojis: ['📈', '💰', '👥'],
    gradient: 'from-[#5a3f31] via-[#6b4d3d] to-[#8b6d5d]',
    title: 'Your Command Center',
    description:
      "The Dashboard gives you a bird's-eye view of all your campaigns. See how much you're spending, how many people see your ads, and how many become customers.",
    tip: 'Key terms: Impressions = people who saw your ad. Clicks = people who clicked. Conversions = people who took action (bought, signed up, etc.)',
  },
  {
    emoji: '📢',
    secondaryEmojis: ['🎯', '🏷️', '⚡'],
    gradient: 'from-[#8b6d5d] via-[#d4a574] to-[#6b4d3d]',
    title: 'Create & Manage Campaigns',
    description:
      "A campaign is a set of ads with a goal. Want more website visitors? Create a 'Consideration' campaign. Want sales? Create a 'Conversion' campaign. It's like choosing what you want your ads to achieve.",
    tip: "Start with 'Awareness' if you're new - it's the simplest and helps people discover your brand.",
  },
  {
    emoji: '🎯',
    secondaryEmojis: ['🤖', '👤', '📍'],
    gradient: 'from-[#d4a574] via-[#6b4d3d] to-[#5a3f31]',
    title: 'Find Your Perfect Audience',
    description:
      'Targeting means choosing WHO sees your ads. Pick age, location, interests, and more. Our AI Bidding Engine then figures out the best price to pay for each ad view.',
    tip: 'Bidding = how much you pay per ad view/click. Our AI handles this for you!',
  },
  {
    emoji: '🎨',
    secondaryEmojis: ['🖼️', '✏️', '💡'],
    gradient: 'from-[#6b4d3d] via-[#5a3f31] to-[#d4a574]',
    title: 'Design Eye-Catching Ads',
    description:
      "Creatives are your actual ad images, videos, and text. Upload your designs, and our AI will tell you what's working and suggest improvements.",
    tip: 'You can upload images or PDFs. Our AI chatbot can even help you brainstorm creative ideas!',
  },
  {
    emoji: '🌐',
    secondaryEmojis: ['📱', '💼', '🔍'],
    gradient: 'from-[#5a3f31] via-[#8b6d5d] to-[#d4a574]',
    title: 'Advertise Everywhere',
    description:
      'Connect to Google Ads, Meta (Facebook/Instagram), and LinkedIn. Your ads can appear on search results, social feeds, stories, and more - all managed from one place.',
    tip: 'Each platform has different strengths. Google = people searching for things. Meta = social browsing. LinkedIn = professionals.',
  },
  {
    emoji: '📈',
    secondaryEmojis: ['🏆', '📋', '🔄'],
    gradient: 'from-[#d4a574] via-[#8b6d5d] to-[#6b4d3d]',
    title: 'Measure & Improve',
    description:
      "Track how your campaigns perform with detailed analytics. See which platforms give you the best results, understand where your budget goes, and export reports.",
    tip: "The 'funnel' shows your journey: Impressions \u2192 Clicks \u2192 Conversions. A higher conversion rate means your ads are working well!",
  },
];

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('next');

  const isLastStep = currentStep === STEPS.length - 1;
  const step = STEPS[currentStep];

  const goToStep = useCallback(
    (nextIndex, dir) => {
      if (animating || nextIndex < 0 || nextIndex >= STEPS.length) return;
      setDirection(dir);
      setAnimating(true);
      // Brief pause to let the exit state register, then switch step
      setTimeout(() => {
        setCurrentStep(nextIndex);
        setAnimating(false);
      }, 150);
    },
    [animating],
  );

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
    } else {
      goToStep(currentStep + 1, 'next');
    }
  };

  const handleBack = () => {
    goToStep(currentStep - 1, 'back');
  };

  const handleDotClick = (index) => {
    if (index === currentStep) return;
    goToStep(index, index > currentStep ? 'next' : 'back');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Outer modal container */}
      <div
        className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        style={{ maxHeight: '92vh' }}
      >
        {/* Skip link - top right */}
        <button
          onClick={() => onComplete?.()}
          className="absolute top-4 right-4 z-10 text-sm text-gray-400 hover:text-primary transition-colors cursor-pointer"
        >
          Skip Tour
        </button>

        {/* Step counter badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-white rounded-full gradient-primary">
            {currentStep + 1} / {STEPS.length}
          </span>
        </div>

        {/* ---- Illustration Area ---- */}
        <div
          className={`relative h-56 sm:h-64 bg-gradient-to-br ${step.gradient} flex items-center justify-center overflow-hidden transition-all duration-300`}
        >
          {/* Decorative blurred circles */}
          <div className="absolute top-6 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-4 right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

          {/* Floating secondary emojis */}
          {step.secondaryEmojis.map((e, i) => (
            <span
              key={`${currentStep}-${i}`}
              className="absolute text-2xl sm:text-3xl opacity-70 animate-float select-none"
              style={{
                top: `${20 + i * 22}%`,
                left: i === 0 ? '12%' : i === 1 ? '78%' : '55%',
                animationDelay: `${i * 0.6}s`,
              }}
            >
              {e}
            </span>
          ))}

          {/* Main emoji */}
          <span
            key={`main-${currentStep}`}
            className="relative text-6xl sm:text-7xl drop-shadow-lg animate-fade-in-up select-none"
          >
            {step.emoji}
          </span>
        </div>

        {/* ---- Content Area ---- */}
        <div className="px-6 sm:px-10 pt-6 pb-4 overflow-y-auto" style={{ maxHeight: 'calc(92vh - 14rem - 4.5rem)' }}>
          <div
            key={currentStep}
            className={`${animating ? 'opacity-0' : 'animate-fade-in-up'} transition-opacity duration-150`}
          >
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 leading-tight">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed mb-5">
              {step.description}
            </p>

            {/* Tip box */}
            <div className="flex gap-3 items-start bg-cream/60 border border-gold/30 rounded-xl px-4 py-3 mb-2">
              <span className="text-lg mt-0.5 shrink-0 select-none" aria-hidden="true">
                💡
              </span>
              <p className="text-sm text-primary-dark leading-relaxed">
                <span className="font-semibold">Tip: </span>
                {step.tip}
              </p>
            </div>
          </div>
        </div>

        {/* ---- Footer: dots + buttons ---- */}
        <div className="px-6 sm:px-10 pb-6 pt-2 flex flex-col gap-4">
          {/* Progress dots */}
          <div className="flex justify-center gap-2" role="tablist" aria-label="Onboarding steps">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                role="tab"
                aria-selected={i === currentStep}
                aria-label={`Step ${i + 1}`}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentStep
                    ? 'w-8 h-2.5 gradient-primary'
                    : i < currentStep
                      ? 'w-2.5 h-2.5 bg-gold'
                      : 'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Buttons row */}
          <div className="flex items-center justify-between">
            {/* Back button */}
            {currentStep > 0 ? (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-primary hover:bg-cream rounded-lg transition-colors cursor-pointer"
              >
                Back
              </button>
            ) : (
              <span />
            )}

            {/* Next / Get Started */}
            <button
              onClick={handleNext}
              className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg gradient-primary hover:opacity-90 transition-opacity shadow-md cursor-pointer"
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
