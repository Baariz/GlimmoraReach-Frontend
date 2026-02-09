// Client-side mock data for fallback and form options
// MOCK DATA: All data here is hardcoded for demo purposes

export const interestOptions = [
  'Technology', 'E-commerce', 'Online Shopping', 'Business', 'Marketing',
  'SaaS', 'Fashion', 'Beauty', 'Wellness', 'Gaming', 'Mobile Apps',
  'Productivity', 'Food & Dining', 'Travel', 'Finance',
];

export const locationOptions = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
  'Australia', 'Japan', 'Brazil', 'India', 'Mexico',
];

export const objectiveOptions = [
  {
    id: 'awareness',
    title: 'Awareness',
    description: 'Maximize reach and brand visibility across platforms',
    icon: '📢',
  },
  {
    id: 'consideration',
    title: 'Consideration',
    description: 'Drive traffic, engagement, and lead generation',
    icon: '🎯',
  },
  {
    id: 'conversion',
    title: 'Conversion',
    description: 'Optimize for purchases, sign-ups, and conversions',
    icon: '💰',
  },
];

export const biddingStrategies = [
  {
    id: 'CPC',
    title: 'Cost Per Click',
    description: 'Pay only when someone clicks your ad. Best for driving traffic.',
  },
  {
    id: 'CPM',
    title: 'Cost Per Mille',
    description: 'Pay per 1,000 impressions. Best for brand awareness.',
  },
  {
    id: 'CPA',
    title: 'Cost Per Action',
    description: 'Pay when a user completes a specific action. Best for conversions.',
  },
];

export const reportTemplates = [
  {
    id: 'campaign-performance',
    title: 'Campaign Performance Report',
    description: 'Comprehensive overview of all campaign metrics, spend, and ROI across platforms.',
    icon: '📊',
  },
  {
    id: 'platform-comparison',
    title: 'Platform Comparison Report',
    description: 'Side-by-side comparison of Glimmora Reach, Google Ads, Meta, and LinkedIn performance.',
    icon: '📈',
  },
  {
    id: 'creative-performance',
    title: 'Creative Performance Report',
    description: 'Analysis of ad creative effectiveness, CTR, and conversion rates.',
    icon: '🎨',
  },
  {
    id: 'audience-insights',
    title: 'Audience Insights Report',
    description: 'Demographics, interests, and behavioral data of your target audiences.',
    icon: '👥',
  },
];

export const scheduledReports = [
  { id: 1, name: 'Weekly Campaign Summary', frequency: 'Weekly', recipients: 'team@company.com', nextRun: '2025-11-04' },
  { id: 2, name: 'Monthly Platform Report', frequency: 'Monthly', recipients: 'leadership@company.com', nextRun: '2025-12-01' },
  { id: 3, name: 'Daily Spend Alert', frequency: 'Daily', recipients: 'ads@company.com', nextRun: '2025-10-29' },
];
