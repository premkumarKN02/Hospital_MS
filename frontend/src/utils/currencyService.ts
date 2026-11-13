export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateFromInr: number; // Conversion rate from base currency INR
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rateFromInr: 1.0 },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rateFromInr: 0.012 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rateFromInr: 0.011 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', rateFromInr: 0.044 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rateFromInr: 0.0095 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦', rateFromInr: 0.045 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', rateFromInr: 0.016 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rateFromInr: 0.018 },
];

const CURRENCY_KEY = 'hospital_platform_currency';

export function getActiveCurrency(): CurrencyConfig {
  const saved = localStorage.getItem(CURRENCY_KEY);
  if (saved) {
    const found = SUPPORTED_CURRENCIES.find((c) => c.code === saved);
    if (found) return found;
  }
  return SUPPORTED_CURRENCIES[0];
}

export function setActiveCurrency(code: string): CurrencyConfig {
  const found = SUPPORTED_CURRENCIES.find((c) => c.code === code) || SUPPORTED_CURRENCIES[0];
  localStorage.setItem(CURRENCY_KEY, found.code);
  window.dispatchEvent(new CustomEvent('currencyChange', { detail: found }));
  return found;
}

export function formatCurrency(amountInInr: number, currencyCode?: string): string {
  const currency = currencyCode
    ? SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || getActiveCurrency()
    : getActiveCurrency();

  const converted = amountInInr * currency.rateFromInr;

  // Format with standard localization
  if (currency.code === 'INR') {
    return `₹${converted.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
  return `${currency.symbol} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
