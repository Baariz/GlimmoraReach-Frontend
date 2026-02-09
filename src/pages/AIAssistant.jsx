import { useState, useRef, useEffect } from 'react';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { CURRENCIES } from '../utils/helpers';
import { createCampaign, fetchCampaigns } from '../utils/api';

// ── FAQ Data ──────────────────────────────────────────────────────────────────
const faqData = [
  {
    id: 1,
    icon: <MegaphoneIcon />,
    title: 'What is an ad campaign?',
    answer: [
      'An ad campaign is a coordinated series of advertisements that share a single message or theme, designed to achieve a specific business goal. Think of it like planning a party: you decide the purpose (birthday, graduation), invite the right people, choose a venue, and set a budget.',
      'Businesses use ad campaigns to:',
      '\u2022 Raise awareness -- Let people know their product or service exists',
      '\u2022 Drive traffic -- Get potential customers to visit their website or store',
      '\u2022 Generate leads -- Collect contact information from interested people',
      '\u2022 Boost sales -- Directly encourage purchases or sign-ups',
      'The campaign lifecycle typically follows these stages:',
      '\u2022 Planning -- Define your goal, audience, and budget',
      '\u2022 Creation -- Design your ads (images, copy, videos)',
      '\u2022 Launch -- Push your ads live on chosen platforms',
      '\u2022 Monitoring -- Watch how your ads perform in real time',
      '\u2022 Optimization -- Adjust targeting, budget, or creatives based on results',
      '\u2022 Reporting -- Analyze the final results and learn for next time',
      'Even a small local bakery can run an ad campaign! For example, they might run Instagram ads targeting people within 5 miles who like baking, desserts, or coffee -- all for just $10 a day.',
    ],
  },
  {
    id: 2,
    icon: <RocketIcon />,
    title: 'How do I create my first campaign?',
    answer: [
      'Creating your first campaign in Glimmora Reach is simple. Here is a step-by-step walkthrough:',
      'Step 1: Navigate to Campaigns',
      '\u2022 Click "Campaigns" in the left sidebar, then click the "Create Campaign" button at the top right.',
      'Step 2: Choose your objective',
      '\u2022 Select what you want to achieve: Awareness (get your name out there), Traffic (drive website visits), or Conversions (get people to buy or sign up). Your objective determines how the platform optimizes your ads.',
      'Step 3: Name your campaign',
      '\u2022 Give it a clear, descriptive name like "Summer Sale 2025 - Instagram" so you can find it easily later.',
      'Step 4: Set your budget',
      '\u2022 Choose a daily budget (how much to spend each day) or a lifetime budget (total amount for the entire campaign). Start small -- even $10-20/day is fine for testing.',
      'Step 5: Pick your audience',
      '\u2022 Define who should see your ads. Choose demographics (age, gender), interests (fitness, cooking, tech), and locations (cities, states, countries).',
      'Step 6: Select platforms',
      '\u2022 Choose where your ads will appear: Google Ads, Meta (Facebook/Instagram), LinkedIn, or all of them.',
      'Step 7: Upload your creatives',
      '\u2022 Add your ad images, videos, headlines, and descriptions. The platform will preview how they look.',
      'Step 8: Review and launch',
      '\u2022 Double-check everything, then hit "Launch Campaign." Your ads will go through a brief review before going live.',
      'Tip: Do not worry about getting it perfect the first time. You can always pause, edit, and optimize your campaign after launch!',
    ],
  },
  {
    id: 3,
    icon: <CoinIcon />,
    title: "What's the difference between CPC, CPM, and CPA?",
    answer: [
      'These are the three main ways you pay for advertising. Understanding them is key to choosing the right strategy:',
      'CPC (Cost Per Click) -- You pay each time someone clicks your ad.',
      '\u2022 Best for: Driving traffic to your website',
      '\u2022 Typical range: $0.50 - $3.00 per click',
      '\u2022 Real-world analogy: Like paying a street promoter only when someone actually takes your flyer and walks into your store',
      'CPM (Cost Per Mille / 1,000 Impressions) -- You pay for every 1,000 times your ad is shown.',
      '\u2022 Best for: Brand awareness and reaching large audiences',
      '\u2022 Typical range: $5 - $15 per 1,000 impressions',
      '\u2022 Real-world analogy: Like paying for a billboard on a highway -- you pay for eyeballs, whether or not people take action',
      'CPA (Cost Per Action/Acquisition) -- You pay only when someone completes a specific action (purchase, sign-up, download).',
      '\u2022 Best for: Conversions and direct sales',
      '\u2022 Typical range: $10 - $50+ per action (varies by industry)',
      '\u2022 Real-world analogy: Like paying a real estate agent a commission only when they actually close a sale',
      'Quick decision guide:',
      '\u2022 Want people to know your brand exists? Choose CPM',
      '\u2022 Want people to visit your website? Choose CPC',
      '\u2022 Want people to buy something? Choose CPA',
    ],
  },
  {
    id: 4,
    icon: <TargetIcon />,
    title: 'How does targeting work?',
    answer: [
      'Targeting is how you choose exactly who sees your ads. Think of it like this: "It\'s like choosing which neighborhood to put up a billboard, but much more precise -- you can pick the exact people walking by."',
      'There are several types of targeting:',
      'Demographics -- The basics about your audience:',
      '\u2022 Age (e.g., 25-45 year olds)',
      '\u2022 Gender',
      '\u2022 Income level',
      '\u2022 Education',
      '\u2022 Job title or industry',
      'Interest-Based Targeting -- What your audience cares about:',
      '\u2022 Hobbies (fitness, cooking, gaming)',
      '\u2022 Topics they follow (technology, fashion)',
      '\u2022 Brands they engage with',
      'Location Targeting -- Where your audience is:',
      '\u2022 Countries, states, cities, or even zip codes',
      '\u2022 Radius targeting (within 10 miles of your store)',
      'Behavioral Targeting -- What your audience does online:',
      '\u2022 Recent purchases',
      '\u2022 Websites they visit',
      '\u2022 Apps they use',
      'Lookalike/Similar Audiences -- Find new people similar to your existing customers. The platform analyzes your best customers and finds others who match their profile.',
      'Pro tip: Start broad and narrow down. If you target too narrowly from the start, your ads may not reach enough people. Let the platform learn who responds best, then refine from there.',
    ],
  },
  {
    id: 5,
    icon: <LinkIcon />,
    title: 'How do I connect Google/Meta/LinkedIn?',
    answer: [
      'Glimmora Reach lets you manage ads across multiple platforms from one dashboard. Here is how the connection process works:',
      'Note: In this MVP demo, connections are simulated. In production, you would use OAuth to securely connect your real ad accounts.',
      'To connect a platform:',
      '\u2022 Go to the Placements page from the sidebar',
      '\u2022 Click "Connect Platform" for the platform you want',
      '\u2022 You would be redirected to sign in to that platform (Google, Meta, LinkedIn)',
      '\u2022 Grant Glimmora Reach permission to manage your ads',
      '\u2022 Once connected, you can create and manage ads on that platform directly from Glimmora',
      'What each platform is best for:',
      'Google Ads:',
      '\u2022 Best for capturing people actively searching for your product (search intent)',
      '\u2022 Great for: E-commerce, local services, B2B lead generation',
      '\u2022 Ad types: Search ads, Display ads, YouTube video ads, Shopping ads',
      'Meta (Facebook & Instagram):',
      '\u2022 Best for reaching people based on interests and behaviors',
      '\u2022 Great for: Brand awareness, e-commerce, app installs, visual products',
      '\u2022 Ad types: Image ads, video ads, carousel, Stories, Reels',
      'LinkedIn:',
      '\u2022 Best for B2B (business-to-business) advertising',
      '\u2022 Great for: Recruiting, SaaS products, professional services',
      '\u2022 Ad types: Sponsored content, InMail, text ads, dynamic ads',
    ],
  },
  {
    id: 6,
    icon: <ChartIcon />,
    title: 'What is ROAS and why does it matter?',
    answer: [
      'ROAS stands for Return on Ad Spend. It is the single most important metric for understanding whether your advertising is profitable.',
      'The formula is simple:',
      '\u2022 ROAS = Revenue from Ads / Cost of Ads',
      'Example: If you spend $100 on ads and those ads generate $300 in sales, your ROAS is 3x (or 300%). This means every $1 you spent brought back $3.',
      'What is a good ROAS?',
      '\u2022 Below 1x -- You are losing money. Every $1 spent brings less than $1 back. Time to pause and rethink.',
      '\u2022 1x - 2x -- Break-even to marginal. May be okay if you value customer lifetime value.',
      '\u2022 2x - 4x -- Good. Your ads are profitable and sustainable.',
      '\u2022 4x - 8x -- Great. Your campaigns are performing very well.',
      '\u2022 8x+ -- Excellent. Rare but achievable in some niches.',
      'Why ROAS matters more than just "clicks" or "impressions":',
      '\u2022 You could get 10,000 clicks but if none of them buy anything, your ROAS is 0',
      '\u2022 ROAS connects your ad spend directly to revenue, so you know what is actually working',
      '\u2022 It helps you decide where to allocate more budget (double down on high-ROAS campaigns)',
      'Important caveat: ROAS does not account for product costs, overhead, or shipping. For a complete picture, also look at your profit margins. A 3x ROAS on a product with 70% margins is much better than 3x ROAS on a product with 20% margins.',
    ],
  },
  {
    id: 7,
    icon: <WalletIcon />,
    title: 'How should I set my budget?',
    answer: [
      'Setting the right budget is one of the most common questions for beginners. Here is a practical framework:',
      'Daily vs. Lifetime budgets:',
      '\u2022 Daily budget -- A fixed amount spent each day (e.g., $20/day). Best for ongoing campaigns where you want consistent, steady delivery.',
      '\u2022 Lifetime budget -- A total amount for the entire campaign duration (e.g., $500 over 30 days). Best for time-limited promotions where the platform can optimize daily spend.',
      'How much should a beginner spend?',
      '\u2022 Start with $10-50 per day. This gives the platform enough data to learn and optimize.',
      '\u2022 Run your test for at least 7-14 days before making big decisions. Ads need time to "warm up."',
      '\u2022 Do not judge performance on just 1-2 days of data.',
      'Budget allocation across platforms:',
      '\u2022 If you are on multiple platforms, do not split your budget evenly. Start with 60-70% on your strongest platform, 20-30% on a secondary, and 10% to experiment.',
      '\u2022 Example: $50/day total could be $30 on Meta, $15 on Google, $5 on LinkedIn.',
      'The scaling strategy:',
      '\u2022 Phase 1 (Week 1-2): Small budget, test multiple audiences and creatives',
      '\u2022 Phase 2 (Week 3-4): Identify winners, increase budget by 20-30% on top performers',
      '\u2022 Phase 3 (Month 2+): Scale winning campaigns, pause underperformers',
      'Golden rule: Never increase your budget by more than 20-30% at a time. Sudden large increases can disrupt the algorithm and hurt performance.',
    ],
  },
  {
    id: 8,
    icon: <BarChartIcon />,
    title: 'How do I read the analytics?',
    answer: [
      'The Analytics page can look overwhelming at first, but it all follows a simple funnel logic. Here is how to read it:',
      'The advertising funnel:',
      '\u2022 Impressions -- How many times your ad was shown. Think of this as foot traffic past your store.',
      '\u2022 Clicks -- How many people were interested enough to click. Like people stopping to look in your store window.',
      '\u2022 Conversions -- How many people took the desired action (purchase, sign-up). Like people actually buying something.',
      'Key metrics explained:',
      'CTR (Click-Through Rate) = Clicks / Impressions x 100',
      '\u2022 Good CTR: 2-5% (varies by industry). Below 1% means your ad is not compelling enough.',
      'CPC (Cost Per Click) = Total Spend / Clicks',
      '\u2022 Lower is better. Compare against industry benchmarks.',
      'CPA (Cost Per Acquisition) = Total Spend / Conversions',
      '\u2022 The key question: Is your CPA less than the profit you make per sale?',
      'ROAS (Return on Ad Spend) = Revenue / Ad Spend',
      '\u2022 Above 3x is generally good for most businesses.',
      'What "good numbers" look like (general benchmarks):',
      '\u2022 CTR: 2-5% is solid, above 5% is excellent',
      '\u2022 CPC: Under $2 for most industries',
      '\u2022 Conversion Rate: 2-5% of clicks becoming customers',
      '\u2022 ROAS: 3x or higher',
      'Reading the funnel on the Analytics page: Look for where the biggest drop-off happens. If you have high impressions but low clicks, your ad creative needs work. If you have high clicks but low conversions, your landing page or offer needs improvement.',
    ],
  },
];

// ── Mock AI Responses ─────────────────────────────────────────────────────────
const mockResponses = {
  start: `Great question! Here's how to get started with Glimmora Reach:

1. **Explore the Dashboard** -- Start by visiting the Dashboard to see an overview of all your campaign metrics at a glance. It's your command center.

2. **Create Your First Campaign** -- Head to Campaigns > Create Campaign. Choose an objective (Awareness, Traffic, or Conversions), set a small daily budget ($10-20 to start), define your target audience, and upload your ad creatives.

3. **Set Up Targeting** -- Visit the Targeting page to define who should see your ads. Start broad (e.g., ages 25-55, interests related to your product) and narrow down as you collect data.

4. **Connect Platforms** -- Go to Placements to connect Glimmora Reach, Google Ads, Meta, or LinkedIn. This lets you manage all your ads from one place.

5. **Monitor & Optimize** -- Check your Analytics page daily for the first week. Look at CTR, CPC, and conversions. Pause anything with a CTR below 1% and double down on what works.

**Pro tip:** Don't try to be perfect on day one. The best advertisers run small tests, learn from the data, and iterate. Your first campaign is a learning experience!`,

  bidding: `Let me break down how bidding works in digital advertising:

**What is ad bidding?**
Every time someone loads a webpage or app, an instant auction happens (in milliseconds!) to decide which ad to show. You're competing with other advertisers for that ad spot.

**Bidding strategies:**

- **Manual CPC Bidding** -- You set the maximum you'll pay per click. Good for control but requires constant monitoring. Start with $1-2 per click and adjust based on results.

- **Automated Bidding** -- The platform adjusts your bids automatically to get the best results within your budget. Recommended for beginners since the algorithm learns and optimizes for you.

- **Target CPA Bidding** -- You tell the platform your desired cost per acquisition (e.g., "I want each sign-up to cost $15 or less") and it optimizes bids to hit that target.

- **Target ROAS Bidding** -- You set a desired return on ad spend (e.g., 3x) and the platform bids to achieve that ratio.

**Which should you choose?**
Start with automated bidding. It lets the platform's machine learning handle the complexity while you focus on your creative and targeting strategy.`,

  budget: `Here's a practical guide to setting your advertising budget:

**For absolute beginners:**
Start with $10-30 per day. This gives the platform enough data to learn and optimize without risking too much. Run this test budget for at least 7-14 days before making big changes.

**Budget allocation framework:**
- **60-70%** on your primary platform (where your audience lives)
- **20-30%** on a secondary platform for comparison
- **10%** on experimental campaigns or new audiences

**Daily vs. Lifetime budgets:**
- Use **daily budgets** for ongoing campaigns -- it ensures consistent daily delivery
- Use **lifetime budgets** for promotions with fixed end dates -- the platform optimizes spending across the full period

**The scaling playbook:**
1. Week 1-2: Test with small budget ($10-20/day)
2. Week 3-4: Increase budget by 20% on winning campaigns
3. Month 2+: Scale winners to $50-100/day, cut losers
4. Never increase budget more than 20-30% at once

**Red flags to watch:**
- CPA suddenly doubles? Pause and investigate
- Spending budget but no conversions? Review targeting
- One platform eating all budget with poor results? Redistribute

Remember: It's better to spend $20/day profitably than $200/day at a loss!`,

  targeting: `Here's everything you need to know about audience targeting:

**The targeting layers (from broad to specific):**

1. **Demographics** -- Age, gender, income, education, job title. Start here as your foundation. Example: Women 25-45, household income $50K+

2. **Interests** -- What people care about. The platform tracks pages liked, content engaged with, and topics followed. Example: Fitness, healthy cooking, yoga

3. **Behaviors** -- What people actually do. Recent purchases, travel habits, device usage. Example: Online shoppers, frequent travelers

4. **Location** -- From countries down to zip codes. You can even target a radius around a specific address. Example: Within 15 miles of downtown Chicago

5. **Lookalike Audiences** -- Upload your customer list and the platform finds similar people. This is often the highest-performing targeting method.

**Targeting do's and don'ts:**
- DO start with a broader audience (500K-2M people) and let the algorithm find the best performers
- DON'T over-narrow from day one (targeting 5,000 people with 10 interest filters = expensive and limited)
- DO use A/B testing to compare different audience segments
- DO exclude existing customers from acquisition campaigns

**The sweet spot:** An audience of 500K to 2M people with 3-5 well-chosen interest or demographic filters. This gives the platform enough room to optimize while staying relevant.`,

  platform: `Here's a comparison of the major advertising platforms:

**Glimmora Reach -- Your internal ad engine**
- Glimmora Reach is the platform's native ad network
- Runs ads across Glimmora-owned inventory and partner properties
- Full control over targeting, bidding, and placement
- Always connected -- no external OAuth needed
- Best for: Direct campaign control, internal inventory, partner network

**Google Ads -- Best for intent-based marketing**
- People are actively searching for what you offer
- Average CPC: $1-3 (varies by industry)
- Best for: E-commerce, local services, B2B, high-intent keywords
- Ad formats: Search, Display, YouTube, Shopping
- Pro: Highest intent -- people are looking for solutions NOW
- Con: Can be expensive in competitive industries

**Meta (Facebook & Instagram) -- Best for discovery and visual products**
- People discover your product while browsing
- Average CPM: $7-12
- Best for: E-commerce, apps, visual brands, community building
- Ad formats: Image, video, carousel, Stories, Reels, Messenger
- Pro: Massive reach, excellent targeting, great for visual products
- Con: Users aren't actively looking to buy (lower intent)

**LinkedIn -- Best for B2B and professional audiences**
- Reach professionals by job title, company, and industry
- Average CPC: $5-12 (higher but more qualified)
- Best for: B2B SaaS, recruiting, professional services, consulting
- Ad formats: Sponsored content, InMail, text ads
- Pro: Unmatched B2B targeting by company size, role, and industry
- Con: Highest cost per click, smaller audience

**Quick decision matrix:**
- Want full control with no external setup? Start with **Glimmora Reach**
- Selling to consumers? Start with **Meta**
- Selling to businesses? Start with **LinkedIn**
- People already search for your product? Start with **Google**
- Have a visual product? **Meta + Google Shopping**`,

  creative: `Here are the best practices for creating effective ad creatives:

**The anatomy of a great ad:**

1. **Attention-grabbing visual** -- You have 1-2 seconds to stop the scroll. Use bold colors, faces, or unexpected imagery. Avoid stock photos that look generic.

2. **Clear headline** -- State the benefit, not the feature. Instead of "Our software has 50 integrations," say "Connect all your tools in 5 minutes."

3. **Compelling copy** -- Address a pain point, present your solution, include social proof. Keep it concise -- most people won't read more than 2-3 sentences.

4. **Strong call-to-action (CTA)** -- Tell people exactly what to do: "Shop Now," "Get Started Free," "Book a Demo." Make the next step obvious.

**Creative best practices by format:**
- **Images:** High contrast, minimal text (under 20%), one clear focal point
- **Videos:** Hook in first 3 seconds, design for sound-off viewing (use captions), keep under 30 seconds for most platforms
- **Carousel:** Tell a story across slides, or showcase multiple products

**A/B testing your creatives:**
- Always test at least 3 different creatives per campaign
- Change ONE element at a time (headline, image, or CTA)
- Run each test for at least 5-7 days with enough budget
- Kill the losers, scale the winners, then test new variations

**Common mistakes to avoid:**
- Using too much text on images (especially on Meta)
- Not having a clear CTA
- Making the ad about your brand instead of the customer's problem
- Using the same creative across all platforms (each has different best practices)`,

  analytics: `Here's your guide to understanding the analytics in Glimmora Reach:

**The Analytics Page Breakdown:**

1. **Conversion Funnel** (top section)
   - Shows: Impressions > Clicks > Conversions
   - What to look for: Where's the biggest drop-off?
   - High impressions, low clicks = Your ad creative needs improvement
   - High clicks, low conversions = Your landing page or offer needs work

2. **Performance Over Time** (line chart)
   - Shows daily trends in impressions, clicks, and conversions
   - What to look for: Upward trends, sudden drops, day-of-week patterns
   - Sudden drops could mean budget exhaustion, ad fatigue, or platform issues

3. **Platform Comparison** (table)
   - Compare performance across Glimmora Reach, Google, Meta, LinkedIn
   - Focus on ROAS and CPA columns -- these tell you which platform is most profitable
   - Shift budget toward the platform with the best ROAS

4. **Attribution Models**
   - Last Click: Gives all credit to the last ad clicked before conversion
   - First Click: Credits the first ad that introduced the customer
   - Linear: Splits credit equally across all touchpoints
   - Which to use: Start with Last Click (simplest), then explore others as you get more sophisticated

**Key benchmarks to aim for:**
- CTR: 2-5% (above 5% is exceptional)
- CPC: Under $2 for most industries
- Conversion Rate: 2-5% of clicks
- ROAS: 3x+ is healthy, 5x+ is great
- CPA: Depends on your product, but should be less than your profit per sale

**Weekly analytics routine:** Every Monday, check last week's performance. Look at total spend, conversions, and ROAS. Pause anything below 1.5x ROAS. Increase budget by 15-20% on anything above 4x ROAS.`,

  optimize: `Here are smart strategies to optimize your campaign budget:

**Budget optimization framework:**

1. **Analyze current performance** -- Check ROAS across all campaigns. Any campaign below 2x ROAS is a candidate for budget reduction or pausing.

2. **Reallocate to winners** -- Take budget from underperforming campaigns and shift it to your top performers. A campaign with 5x ROAS deserves more budget than one with 1.5x.

3. **Dayparting** -- Review when your conversions happen. If 80% of sales come between 9am-6pm, reduce or pause spending during off-hours to stretch your budget further.

4. **Platform optimization** -- Compare CPA across platforms. If Google gives you $12 CPA and Meta gives you $25 CPA for the same product, shift budget to Google.

5. **Audience refinement** -- Narrow your audience to the segments with the highest conversion rates. Remove demographics or interests that generate clicks but not conversions.

**Quick wins for budget optimization:**
- Pause any ad set with 0 conversions after spending 3x your target CPA
- Increase budget by 20% on campaigns with ROAS above 4x
- Use automated bidding to let the platform optimize in real-time
- Set up conversion tracking to ensure data accuracy
- Review search term reports (Google) to add negative keywords

**The 80/20 rule:** Typically, 20% of your campaigns drive 80% of results. Find that 20% and invest heavily in them.`,

  creativeIdeas: `Here are creative ideas to inspire your next campaign:

**By campaign objective:**

**Awareness campaigns:**
- Behind-the-scenes brand story videos (30-60 seconds)
- Eye-catching infographics with surprising industry stats
- User-generated content compilations
- "Did you know?" carousel posts
- Brand mission/values spotlight

**Consideration campaigns:**
- Product comparison guides (you vs. alternatives)
- Customer testimonial videos with real results
- Interactive polls or quizzes about pain points
- "Day in the life" content showing product usage
- Educational how-to content related to your product

**Conversion campaigns:**
- Limited-time offer with countdown timer
- Before/after transformation showcases
- Social proof: "Join 10,000+ customers" messaging
- Free trial or sample offers
- Bundle deals with clear savings highlighted

**Format-specific ideas:**
- **Video:** Hook in first 3 seconds with a bold question or surprising visual
- **Carousel:** Tell a problem-to-solution story across 4-5 slides
- **Static image:** One bold visual + one clear headline + one CTA
- **Stories/Reels:** Quick, authentic, less polished content performs well

**Pro tip:** Create 3-5 variations of your best-performing ad. Change the headline, swap the image, or try a different CTA. Small tweaks can lead to big performance differences!`,
};

const defaultResponse = `That's a great question! While I don't have a specific answer for that exact topic, here's what I can help you with:

- **Getting Started** -- How to create your first campaign and navigate the platform
- **Bidding Strategies** -- Understanding CPC, CPM, CPA, and automated bidding
- **Budget Planning** -- How much to spend and how to allocate across platforms
- **Audience Targeting** -- Finding the right people for your ads
- **Platform Selection** -- Choosing between Glimmora Reach, Google, Meta, and LinkedIn
- **Creative Best Practices** -- Designing ads that convert
- **Analytics & Reporting** -- Reading your data and optimizing performance
- **ROAS & ROI** -- Understanding your return on investment

I can also take **actions** for you:
- **Create Campaign** -- I'll walk you through creating a new campaign step by step
- **Check Campaign Status** -- I'll pull up a live overview of all your campaigns
- **Optimize Budget** -- I'll share strategies for getting more from your ad spend
- **Generate Creative Ideas** -- I'll brainstorm ad creative concepts for you

Try asking about any of these topics, or click one of the quick-reply buttons below!`;

function getAIResponse(input) {
  const lower = input.toLowerCase();
  if (lower.match(/\b(start|begin|first|getting started|new here|how to start)\b/)) return mockResponses.start;
  if (lower.match(/\b(bid|bidding|cpc|cpm|cpa|auction|cost per)\b/)) return mockResponses.bidding;
  if (lower.match(/\b(budget|spend|money|cost|price|afford|how much)\b/)) return mockResponses.budget;
  if (lower.match(/\b(target|audience|demographic|who|reach|people)\b/)) return mockResponses.targeting;
  if (lower.match(/\b(platform|google|meta|facebook|instagram|linkedin|glimmora|connect|channel)\b/)) return mockResponses.platform;
  if (lower.match(/\b(creative|ad design|image|video|copy|headline|visual|design)\b/)) return mockResponses.creative;
  if (lower.match(/\b(analytics|report|data|metrics|measure|track|roas|roi|return|funnel|performance)\b/)) return mockResponses.analytics;
  if (lower.match(/\b(optimi[zs]e|improve|boost|increase|scale|efficiency)\b/)) return mockResponses.optimize;
  if (lower.match(/\b(idea|inspir|brainstorm|suggest|concept)\b/)) return mockResponses.creativeIdeas;
  return defaultResponse;
}

// ── Quick Reply Chips ─────────────────────────────────────────────────────────
const quickReplies = [
  { label: 'Create Campaign', icon: 'plus', action: true },
  { label: 'Check Campaign Status', icon: 'status', action: true },
  { label: 'Optimize Budget', icon: 'optimize', action: true },
  { label: 'Generate Creative Ideas', icon: 'idea', action: true },
  { label: 'How to start?', icon: null, action: false },
  { label: 'Best practices', icon: null, action: false },
];

// ── Campaign Creation Workflow Steps ──────────────────────────────────────────
const campaignSteps = [
  {
    question: "I'll help you create a campaign! What would you like to name it?",
    field: 'name',
  },
  {
    question: "What's your campaign objective? (Awareness / Consideration / Conversion)",
    field: 'objective',
  },
  {
    question: "What's your daily budget? (e.g., $500)",
    field: 'budget',
  },
  {
    question: 'Which platforms? (Glimmora Reach, Google Ads, Meta, LinkedIn - you can pick multiple)',
    field: 'platforms',
  },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function AIAssistant() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! I'm your Glimmora AI Assistant. I can help you understand advertising concepts, guide you through the platform, or even take actions like creating campaigns. What would you like to do?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationMode, setConversationMode] = useState(null); // null | 'creating_campaign' | 'checking_status' | 'confirming_campaign'
  const [conversationStep, setConversationStep] = useState(0);
  const [conversationData, setConversationData] = useState({});
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const addToast = useToast();
  const { currency } = useAuth();
  const currencySymbol = (CURRENCIES[currency] || CURRENCIES.USD).symbol;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // ── Get step question with dynamic currency ─────────────────────────────────
  const getStepQuestion = (stepIndex) => {
    const step = campaignSteps[stepIndex];
    if (step.field === 'budget') {
      return `What's your daily budget? (e.g., ${currencySymbol}500)`;
    }
    return step.question;
  };

  // ── Add AI message with typing delay ────────────────────────────────────────
  const addAIMessage = (text, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text }]);
      setIsTyping(false);
    }, delay);
  };

  // ── Start the Create Campaign workflow ──────────────────────────────────────
  const startCreateCampaign = () => {
    setConversationMode('creating_campaign');
    setConversationStep(0);
    setConversationData({});
    addAIMessage(getStepQuestion(0));
  };

  // ── Check Campaign Status workflow ──────────────────────────────────────────
  const checkCampaignStatus = async () => {
    setIsTyping(true);
    setMessages((prev) => [...prev, { role: 'user', text: 'Check Campaign Status' }]);
    try {
      const response = await fetchCampaigns();
      const campaigns = response.data?.data || response.data || [];

      const active = campaigns.filter((c) => c.status === 'active').length;
      const paused = campaigns.filter((c) => c.status === 'paused').length;
      const completed = campaigns.filter((c) => c.status === 'completed').length;
      const draft = campaigns.filter(
        (c) => c.status !== 'active' && c.status !== 'paused' && c.status !== 'completed'
      ).length;

      // Find top performer by conversions
      let topPerformer = null;
      if (campaigns.length > 0) {
        topPerformer = campaigns.reduce((best, c) => {
          const conversions = c.conversions || c.metrics?.conversions || 0;
          const bestConversions = best.conversions || best.metrics?.conversions || 0;
          return conversions > bestConversions ? c : best;
        }, campaigns[0]);
      }

      const topName = topPerformer?.name || 'N/A';
      const topConversions =
        topPerformer?.conversions || topPerformer?.metrics?.conversions || 0;
      const topRoas = topPerformer?.roas || topPerformer?.metrics?.roas || 0;

      let statusText = `Here's your campaign overview:\n\n`;
      statusText += `- Active: ${active}\n`;
      statusText += `- Paused: ${paused}\n`;
      statusText += `- Completed: ${completed}\n`;
      if (draft > 0) statusText += `- Draft/Other: ${draft}\n`;
      statusText += `\nTotal campaigns: ${campaigns.length}`;

      if (topPerformer && topConversions > 0) {
        statusText += `\n\nTop performer: **${topName}** with ${topConversions.toLocaleString()} conversions and ${topRoas}x ROAS`;
      }

      statusText += `\n\nWould you like to create a new campaign or need help optimizing an existing one?`;

      setMessages((prev) => [...prev, { role: 'ai', text: statusText }]);
      setIsTyping(false);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'I had trouble fetching your campaign data. Please make sure the backend server is running and try again.',
        },
      ]);
      setIsTyping(false);
    }
  };

  // ── Handle campaign creation confirmation ───────────────────────────────────
  const handleCampaignConfirmation = async (userInput) => {
    const lower = userInput.toLowerCase().trim();
    if (lower === 'yes' || lower === 'y' || lower === 'confirm' || lower === 'create' || lower === 'sure') {
      setConversationMode(null);
      setConversationStep(0);
      setIsTyping(true);

      // Parse budget to a number
      const budgetStr = conversationData.budget || '500';
      const budgetNum = parseFloat(budgetStr.replace(/[^0-9.]/g, '')) || 500;

      // Parse platforms to an array
      const platformsRaw = conversationData.platforms || 'Google Ads';
      const platforms = platformsRaw
        .split(/[,&]+/)
        .map((p) => p.trim())
        .filter(Boolean);

      // Normalize objective
      const objectiveRaw = (conversationData.objective || 'awareness').toLowerCase().trim();
      let objective = 'awareness';
      if (objectiveRaw.includes('consider')) objective = 'consideration';
      else if (objectiveRaw.includes('conver')) objective = 'conversion';

      const payload = {
        name: conversationData.name || 'New AI Campaign',
        objective,
        budgetAmount: budgetNum,
        budgetType: 'daily',
        platforms,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };

      try {
        await createCampaign(payload);
        const successMsg = `Campaign "${conversationData.name}" created successfully! You can view and manage it on the Campaigns page.\n\nHere's what was set up:\n- Name: ${conversationData.name}\n- Objective: ${conversationData.objective}\n- Daily Budget: ${conversationData.budget}\n- Platforms: ${conversationData.platforms}\n- Status: Active\n\nWould you like to create another campaign or need help with something else?`;
        setMessages((prev) => [...prev, { role: 'ai', text: successMsg }]);
        setIsTyping(false);
        addToast(`Campaign "${conversationData.name}" created!`, 'success');
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: `I encountered an issue while creating the campaign. Please make sure the backend server is running and try again. Error: ${err.message || 'Unknown error'}`,
          },
        ]);
        setIsTyping(false);
        addToast('Failed to create campaign', 'error');
      }
      setConversationData({});
    } else if (lower === 'no' || lower === 'n' || lower === 'cancel' || lower === 'nope') {
      setConversationMode(null);
      setConversationStep(0);
      setConversationData({});
      addAIMessage("No problem! Let me know if you'd like to start over or need help with anything else.");
    } else {
      addAIMessage('Please reply with "Yes" to create the campaign or "No" to cancel.');
    }
  };

  // ── Handle campaign creation steps ──────────────────────────────────────────
  const handleCampaignStep = (userInput) => {
    const currentField = campaignSteps[conversationStep].field;
    const updatedData = { ...conversationData, [currentField]: userInput.trim() };
    setConversationData(updatedData);

    const nextStep = conversationStep + 1;

    if (nextStep < campaignSteps.length) {
      // More questions to ask
      setConversationStep(nextStep);
      addAIMessage(getStepQuestion(nextStep));
    } else {
      // All questions answered -- show summary
      setConversationMode('confirming_campaign');
      setConversationStep(0);

      const summary =
        `Here's your campaign summary:\n\n` +
        `- Name: ${updatedData.name}\n` +
        `- Objective: ${updatedData.objective}\n` +
        `- Budget: ${updatedData.budget}\n` +
        `- Platforms: ${updatedData.platforms}\n\n` +
        `Should I create this campaign? (Yes / No)`;

      addAIMessage(summary);
    }
  };

  // ── Main Send Message handler ───────────────────────────────────────────────
  const sendMessage = (text) => {
    if (!text.trim()) return;
    const trimmed = text.trim();

    // Add user message to chat
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInputValue('');

    // If we're in the middle of a conversation workflow, route accordingly
    if (conversationMode === 'creating_campaign') {
      handleCampaignStep(trimmed);
      return;
    }

    if (conversationMode === 'confirming_campaign') {
      handleCampaignConfirmation(trimmed);
      return;
    }

    // Check for action triggers via keywords
    const lower = trimmed.toLowerCase();

    if (lower.match(/\b(create|new campaign|launch campaign|set up campaign|start campaign|make campaign)\b/)) {
      startCreateCampaign();
      return;
    }

    if (lower.match(/\b(status|check campaign|campaign overview|my campaigns|how are my campaigns)\b/)) {
      // Remove the duplicate user message since checkCampaignStatus adds one
      setMessages((prev) => prev.slice(0, -1));
      checkCampaignStatus();
      return;
    }

    // Default: keyword-matching for general questions
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = getAIResponse(trimmed);
      setMessages((prev) => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  // ── Handle quick-reply chip clicks ──────────────────────────────────────────
  const handleChipClick = (chip) => {
    if (isTyping) return;

    if (chip.label === 'Create Campaign') {
      setMessages((prev) => [...prev, { role: 'user', text: 'Create Campaign' }]);
      startCreateCampaign();
      return;
    }

    if (chip.label === 'Check Campaign Status') {
      checkCampaignStatus();
      return;
    }

    if (chip.label === 'Optimize Budget') {
      setMessages((prev) => [...prev, { role: 'user', text: 'Optimize Budget' }]);
      addAIMessage(mockResponses.optimize, 1000);
      return;
    }

    if (chip.label === 'Generate Creative Ideas') {
      setMessages((prev) => [...prev, { role: 'user', text: 'Generate Creative Ideas' }]);
      addAIMessage(mockResponses.creativeIdeas, 1000);
      return;
    }

    // Non-action chips just send the label as a normal message
    sendMessage(chip.label);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // Determine the current chip icon
  const getChipIcon = (iconName) => {
    switch (iconName) {
      case 'plus':
        return (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        );
      case 'status':
        return (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
          </svg>
        );
      case 'optimize':
        return (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
            />
          </svg>
        );
      case 'idea':
        return (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Active conversation mode indicator text
  const getConversationHint = () => {
    if (conversationMode === 'creating_campaign') {
      return `Step ${conversationStep + 1} of ${campaignSteps.length}: ${campaignSteps[conversationStep]?.field || ''}`;
    }
    if (conversationMode === 'confirming_campaign') {
      return 'Awaiting confirmation...';
    }
    return null;
  };

  const conversationHint = getConversationHint();

  return (
    <div className="min-h-screen">
      {/* ── Section 1: FAQ / Guide ──────────────────────────────────────────── */}
      <div className="mb-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Glimmora AI Assistant</h1>
            <span className="gradient-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
              AI Powered
            </span>
          </div>
          <p className="text-gray-500 text-sm max-w-2xl">
            Your personal guide to mastering ad campaigns. Ask anything, explore common topics below, or let me take actions for you.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className={`bg-white border rounded-lg transition-all duration-200 ${
                expandedFaq === faq.id
                  ? 'border-primary shadow-md'
                  : 'border-gray-200 hover:border-primary-light hover:shadow-sm'
              }`}
            >
              {/* FAQ Header */}
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center gap-3 p-5 text-left cursor-pointer"
              >
                <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                  {faq.icon}
                </div>
                <span className="flex-1 font-semibold text-gray-900 text-sm">{faq.title}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                    expandedFaq === faq.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* FAQ Body */}
              {expandedFaq === faq.id && (
                <div className="px-5 pb-5 animate-fade-in">
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    {faq.answer.map((line, i) => {
                      const isBullet = line.startsWith('\u2022');
                      const isHeading =
                        !isBullet &&
                        i > 0 &&
                        line.length < 80 &&
                        !line.startsWith('\u2022') &&
                        (line.endsWith(':') || line.includes(' -- '));

                      if (isHeading) {
                        return (
                          <p key={i} className="text-sm font-semibold text-primary mt-3">
                            {line}
                          </p>
                        );
                      }
                      if (isBullet) {
                        return (
                          <p key={i} className="text-sm text-gray-600 pl-4">
                            {line}
                          </p>
                        );
                      }
                      return (
                        <p key={i} className="text-sm text-gray-700">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 2: Chat Interface ───────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Chat Header */}
        <div className="gradient-primary px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">Chat with Glimmora AI</h3>
            <p className="text-white/70 text-xs">Ask anything about advertising or take actions</p>
          </div>
          {conversationMode && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-xs font-medium">
                {conversationMode === 'creating_campaign' ? 'Creating Campaign...' : 'Confirming...'}
              </span>
              <button
                onClick={() => {
                  setConversationMode(null);
                  setConversationStep(0);
                  setConversationData({});
                  addAIMessage('Campaign creation cancelled. How else can I help you?');
                }}
                className="text-white/60 hover:text-white text-xs underline cursor-pointer ml-1"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {msg.role === 'ai' && (
                <div className="w-8 h-8 bg-cream rounded-full flex items-center justify-center text-primary flex-shrink-0 mr-2 mt-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                    />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 text-sm whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'gradient-primary text-white rounded-2xl rounded-br-sm'
                    : 'bg-cream border border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0 ml-2 mt-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="w-8 h-8 bg-cream rounded-full flex items-center justify-center text-primary flex-shrink-0 mr-2 mt-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                  />
                </svg>
              </div>
              <div className="bg-cream border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Conversation Step Indicator */}
        {conversationHint && (
          <div className="px-6 py-2 bg-primary/5 border-t border-primary/10 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
            <span className="text-xs text-primary font-medium">{conversationHint}</span>
            {conversationMode === 'creating_campaign' && (
              <div className="flex-1 flex justify-end">
                <div className="flex gap-1">
                  {campaignSteps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i < conversationStep
                          ? 'bg-primary'
                          : i === conversationStep
                          ? 'bg-primary/60 animate-pulse'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Reply Chips */}
        <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap gap-2 bg-white">
          {quickReplies.map((chip) => (
            <button
              key={chip.label}
              onClick={() => handleChipClick(chip)}
              disabled={isTyping}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 ${
                chip.action
                  ? 'text-white bg-primary hover:bg-primary/90 border border-primary'
                  : 'text-primary bg-cream border border-primary/20 hover:bg-primary hover:text-white'
              }`}
            >
              {chip.icon && getChipIcon(chip.icon)}
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              conversationMode === 'creating_campaign'
                ? `Answer: ${campaignSteps[conversationStep]?.field || ''}...`
                : conversationMode === 'confirming_campaign'
                ? 'Type Yes or No...'
                : 'Ask me anything about advertising...'
            }
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:bg-gray-50"
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={isTyping || !inputValue.trim()}
            className="gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>Send</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Icon Components ───────────────────────────────────────────────────────────
function MegaphoneIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"
      />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
      />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.856-2.07a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364l1.757 1.757"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
      />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
      />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    </svg>
  );
}
