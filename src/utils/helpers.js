// Currency configuration with exchange rates (mock, approximate)
const CURRENCIES = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar', rate: 1, locale: 'en-US' },
  INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee', rate: 83.5, locale: 'en-IN' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro', rate: 0.92, locale: 'de-DE' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound', rate: 0.79, locale: 'en-GB' },
  JPY: { symbol: '¥', code: 'JPY', name: 'Japanese Yen', rate: 149.5, locale: 'ja-JP' },
  BRL: { symbol: 'R$', code: 'BRL', name: 'Brazilian Real', rate: 4.97, locale: 'pt-BR' },
  AUD: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar', rate: 1.53, locale: 'en-AU' },
  CAD: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar', rate: 1.36, locale: 'en-CA' },
};

export { CURRENCIES };

/**
 * Format a number with commas (e.g., 1234567 -> "1,234,567")
 */
export function formatNumber(num) {
  if (num == null) return '0';
  return num.toLocaleString('en-US');
}

/**
 * Format currency with multi-currency support
 * @param {number} amount - Amount in USD (base currency)
 * @param {string} currencyCode - Currency code (USD, INR, EUR, etc.)
 */
export function formatCurrency(amount, currencyCode = 'USD') {
  if (amount == null) return '$0.00';
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = amount * curr.rate;
  return new Intl.NumberFormat(curr.locale, {
    style: 'currency',
    currency: curr.code,
    maximumFractionDigits: curr.code === 'JPY' ? 0 : 2,
  }).format(converted);
}

/**
 * Format percentage (e.g., 4.523 -> "4.52%")
 */
export function formatPercent(value, decimals = 1) {
  if (value == null) return '0%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with K/M suffixes (e.g., 1234567 -> "1.2M")
 */
export function formatCompact(num) {
  if (num == null) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}

/**
 * Get status color classes
 */
export function getStatusColor(status) {
  const colors = {
    active: 'bg-primary text-white',
    delivering: 'bg-green-400 text-white',
    paused: 'bg-gray-400 text-white',
    completed: 'bg-primary-light text-white',
    pending: 'bg-amber-400 text-white',
    ended: 'bg-red-400 text-white',
    draft: 'bg-gray-300 text-gray-700',
    connected: 'bg-green-400 text-white',
    disconnected: 'bg-red-400 text-white',
  };
  return colors[status] || 'bg-gray-300 text-gray-700';
}

/**
 * Get performance badge color
 */
export function getPerformanceColor(performance) {
  const colors = {
    high: 'bg-green-400 text-white',
    medium: 'bg-amber-400 text-white',
    low: 'bg-red-400 text-white',
  };
  return colors[performance] || 'bg-gray-300 text-gray-700';
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
