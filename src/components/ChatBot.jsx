import { useState, useRef, useEffect } from 'react';

const CREATIVE_RESPONSES = {
  'banner': "Here's a banner concept for you:\n\n**Layout:** Clean hero image with bold headline on the left, CTA button on the right\n**Headline:** \"Transform Your Business Today\"\n**Colors:** Brand gradient background with white text\n**CTA:** \"Get Started Free\" button in contrasting gold\n**Image:** Professional lifestyle photo showing product in use\n\n**Tips:** Banner ads work best at 1200x628px for feeds and 728x90 for display networks.",
  'social': "Here's a social media ad concept:\n\n**Format:** Square (1080x1080) for maximum reach\n**Hook:** Start with a question - \"Still struggling with [problem]?\"\n**Body:** 3 bullet points showing benefits, not features\n**Visual:** Before/after split or a short testimonial quote\n**CTA:** \"Swipe Up\" or \"Learn More\" with arrow icon\n\n**Tips:** Social ads with faces get 38% more engagement. Keep text under 20% of the image.",
  'video': "Here's a video ad script concept:\n\n**Duration:** 15-30 seconds (optimal for social)\n**Hook (0-3s):** \"What if you could [solve problem] in just [timeframe]?\"\n**Problem (3-8s):** Show the pain point visually\n**Solution (8-18s):** Introduce your product with key benefits\n**Social Proof (18-25s):** Quick testimonial or stats\n**CTA (25-30s):** Clear call to action with URL\n\n**Tips:** 85% of social videos are watched without sound - add captions!",
  'email': "Here's an email creative concept:\n\n**Subject Line:** \"[Name], your exclusive offer expires tonight\"\n**Preview Text:** \"Save 30% on everything - limited time\"\n**Header:** Brand logo + hero image\n**Body:** Short paragraph + 3 benefit bullets\n**CTA Button:** Large, centered, brand color - \"Shop Now\"\n**Footer:** Unsubscribe link + social icons\n\n**Tips:** Emails with personalized subject lines get 26% higher open rates.",
  'carousel': "Here's a carousel ad concept (3-5 slides):\n\n**Slide 1:** Eye-catching hook image + \"Swipe to discover →\"\n**Slide 2:** Problem statement with empathy\n**Slide 3:** Your solution with key feature\n**Slide 4:** Social proof (reviews, stats)\n**Slide 5:** Strong CTA with offer\n\n**Tips:** Each slide should make sense on its own AND as part of the story. Use consistent branding across all slides.",
  'default': "I'd love to help you create something! Here are the types of creatives I can help brainstorm:\n\n• **Banner Ads** - For display networks and feeds\n• **Social Media Posts** - Instagram, Facebook, LinkedIn\n• **Video Scripts** - Short-form video ad concepts\n• **Email Templates** - Newsletter and promotional emails\n• **Carousel Ads** - Multi-slide storytelling\n\nJust tell me what type you need, your product/service, and your target audience, and I'll generate a concept for you!\n\n**Example:** \"Create a social media ad for a fitness app targeting young professionals\"",
};

function getResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes('banner') || lower.includes('display')) return CREATIVE_RESPONSES.banner;
  if (lower.includes('social') || lower.includes('instagram') || lower.includes('facebook') || lower.includes('post')) return CREATIVE_RESPONSES.social;
  if (lower.includes('video') || lower.includes('youtube') || lower.includes('reel')) return CREATIVE_RESPONSES.video;
  if (lower.includes('email') || lower.includes('newsletter')) return CREATIVE_RESPONSES.email;
  if (lower.includes('carousel') || lower.includes('slide') || lower.includes('swipe')) return CREATIVE_RESPONSES.carousel;

  // If they describe a product/service, generate a custom-ish response
  if (lower.includes('create') || lower.includes('make') || lower.includes('design') || lower.includes('generate')) {
    return `Great idea! Here's a creative concept based on your request:\n\n**Headline:** "Discover Something Amazing"\n**Visual Style:** Modern, clean design with your brand colors\n**Key Message:** Focus on the main benefit your audience cares about\n**CTA:** Action-oriented button like "Try Free" or "Learn More"\n\n**Recommended Formats:**\n• Feed ad (1080x1080) for Meta/LinkedIn\n• Banner (1200x628) for Google Display\n• Story (1080x1920) for Instagram/Facebook Stories\n\nWant me to elaborate on any specific format? Just ask for "banner", "social", "video", "email", or "carousel"!`;
  }

  return CREATIVE_RESPONSES.default;
}

export default function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! I'm the Glimmora Creative AI. I can help you brainstorm ad creative concepts, write copy, and suggest designs.\n\nTry asking me to create a banner ad, social media post, video script, or email template!",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: getResponse(msg) }]);
      setTyping(false);
    }, 1200);
  };

  const chips = ['Banner ad', 'Social post', 'Video script', 'Email template', 'Carousel ad'];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-[100] animate-scale-in overflow-hidden">
      {/* Header */}
      <div className="gradient-primary px-4 py-3 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-bold">AI</div>
          <div>
            <p className="text-white font-semibold text-sm">Creative AI Assistant</p>
            <p className="text-white/70 text-xs">Brainstorm ad concepts</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white cursor-pointer">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] px-3 py-2 text-sm whitespace-pre-line ${
              m.role === 'user'
                ? 'gradient-primary text-white rounded-2xl rounded-br-md'
                : 'bg-cream border border-gray-200 text-gray-800 rounded-2xl rounded-bl-md'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-cream border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto border-t border-gray-100">
        {chips.map((c) => (
          <button key={c} onClick={() => send(c)}
            className="px-2.5 py-1 text-xs bg-cream text-primary rounded-full whitespace-nowrap hover:bg-primary hover:text-white transition duration-200 cursor-pointer border border-primary/20">
            {c}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Describe your creative idea..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button onClick={() => send()}
          className="gradient-primary text-white px-3 py-2 rounded-lg hover:opacity-90 transition cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
