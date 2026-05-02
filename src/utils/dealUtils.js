// helpers for figuring out if a listing is a good deal or not
// these are plain functions so i can reuse them from any component

// how much cheaper the listing is vs market value
// positive = saving money, negative = paying more than market
export function calculateSavings(price, estimatedMarketValue) {
  return estimatedMarketValue - price;
}

// same thing but as a percent. guarding against divide by zero just in case
export function calculateSavingsPercent(price, estimatedMarketValue) {
  if (!estimatedMarketValue || estimatedMarketValue <= 0) {
    return 0;
  }
  return ((estimatedMarketValue - price) / estimatedMarketValue) * 100;
}

// deal rules from the project spec:
//   great deal  -> at least 10% below market
//   fair deal   -> between 10% below and 5% above
//   overpriced  -> more than 5% above
export function getDealStatus(price, estimatedMarketValue) {
  const pct = calculateSavingsPercent(price, estimatedMarketValue);
  if (pct >= 10) return 'Great Deal';
  if (pct >= -5) return 'Fair Deal';
  return 'Overpriced';
}

// 0-100 score, higher = better deal
// i map the savings % onto 0-100 and clamp so it can't go outside
export function getDealScore(price, estimatedMarketValue) {
  const pct = calculateSavingsPercent(price, estimatedMarketValue);
  const raw = 50 + pct * 2.5;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

// ---- formatters ----
// making one Intl formatter up here so i don't make a new one every render
const moneyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatMoney(n) {
  if (n == null || Number.isNaN(n)) return '—';
  return moneyFmt.format(n);
}

export function formatMileage(n) {
  if (n == null || Number.isNaN(n)) return '—';
  return `${n.toLocaleString()} mi`;
}

// had to add the T12:00:00 part because otherwise JS parses it as UTC
// and the date would show as the day before in some timezones
export function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

// just a small helper so cards/modal pick the right css class
export function dealBadgeClass(status) {
  if (status === 'Great Deal') return 'deal-badge--great';
  if (status === 'Fair Deal') return 'deal-badge--fair';
  return 'deal-badge--overpriced';
}
