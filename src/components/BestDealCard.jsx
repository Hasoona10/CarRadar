// highlights the single best deal on the right side of the hero.
// shows big price, savings, deal score, and a View Best Deal button.

import {
  calculateSavings,
  calculateSavingsPercent,
  dealBadgeClass,
  formatMoney,
  getDealScore,
  getDealStatus,
} from '../utils/dealUtils.js';

export default function BestDealCard({ listing, onViewDetails }) {
  // if nothing matches the filters, show an empty-state message instead
  if (!listing) {
    return (
      <aside className="best-deal best-deal--empty card-surface" aria-label="Best deal">
        <span className="tag tag--muted">No best deal yet</span>
        <h3 className="best-deal__empty-title">Adjust your mission</h3>
        <p className="best-deal__empty-text">
          No listings match the current filters. Try widening your search or
          resetting filters to see the strongest deal across all marketplaces.
        </p>
      </aside>
    );
  }

  const status = getDealStatus(listing.price, listing.estimatedMarketValue);
  const savings = calculateSavings(listing.price, listing.estimatedMarketValue);
  const savingsPct = calculateSavingsPercent(
    listing.price,
    listing.estimatedMarketValue,
  );
  const score = getDealScore(listing.price, listing.estimatedMarketValue);

  return (
    <aside className="best-deal card-surface" aria-label="Featured best deal">
      <div className="best-deal__top">
        <span className="tag tag--brand">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="12 2 15 9 22 9.5 16.5 14 18 21 12 17.5 6 21 7.5 14 2 9.5 9 9 12 2" />
          </svg>
          Best deal found
        </span>
        <span className={`deal-badge ${dealBadgeClass(status)}`}>{status}</span>
      </div>

      <p className="best-deal__source">{listing.source}</p>
      <h3 className="best-deal__title">
        {listing.year} {listing.make} {listing.model}{' '}
        <span className="best-deal__trim">{listing.trim}</span>
      </h3>

      <div className="best-deal__price-row">
        <p className="best-deal__price">{formatMoney(listing.price)}</p>
        <p className="best-deal__savings">
          Save {formatMoney(Math.max(0, savings))}
          <span className="best-deal__savings-pct">
            {' '}
            ({savingsPct >= 0 ? '+' : ''}
            {savingsPct.toFixed(1)}%)
          </span>
        </p>
      </div>

      <ul className="best-deal__stats">
        <li>
          <span className="best-deal__stat-label">Score</span>
          <span className="best-deal__stat-value best-deal__stat-value--accent">
            {score}/100
          </span>
        </li>
        <li>
          <span className="best-deal__stat-label">Distance</span>
          <span className="best-deal__stat-value">{listing.distance} mi</span>
        </li>
        <li>
          <span className="best-deal__stat-label">Market value</span>
          <span className="best-deal__stat-value">
            {formatMoney(listing.estimatedMarketValue)}
          </span>
        </li>
      </ul>

      <button
        type="button"
        className="btn btn-primary best-deal__cta"
        onClick={() => onViewDetails(listing)}
      >
        View Best Deal
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </aside>
  );
}
