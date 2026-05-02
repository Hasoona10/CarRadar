// the main card for each listing in the results grid.
// shows the car image, price, deal badge, stats, red flags, and the 3 buttons

import {
  calculateSavings,
  calculateSavingsPercent,
  dealBadgeClass,
  formatMileage,
  formatMoney,
  getDealScore,
  getDealStatus,
} from '../utils/dealUtils.js';
import CarImage from './CarImage.jsx';

export default function ListingCard({
  listing,
  isSaved,
  isCompared,
  compareFull,
  onToggleSave,
  onToggleCompare,
  onViewDetails,
}) {
  // calculating all the deal info up front so the JSX below stays cleaner
  const status = getDealStatus(listing.price, listing.estimatedMarketValue);
  const savings = calculateSavings(listing.price, listing.estimatedMarketValue);
  const savingsPct = calculateSavingsPercent(
    listing.price,
    listing.estimatedMarketValue,
  );
  const score = getDealScore(listing.price, listing.estimatedMarketValue);
  const savingsPositive = savings > 0;

  // only disable compare button if tray is full AND this card isn't already in it
  const compareDisabled = !isCompared && compareFull;

  return (
    <article className={`intel-card card-surface ${isCompared ? 'intel-card--compared' : ''}`}>
      <div className="intel-card__image-wrap">
        <CarImage listing={listing} />
        <div className="intel-card__overlay">
          <span className="source-badge">{listing.source}</span>
          <span className={`deal-badge ${dealBadgeClass(status)}`}>{status}</span>
        </div>
        <span className="intel-card__score" title="Deal score (0–100)">
          <span className="intel-card__score-value">{score}</span>
          <span className="intel-card__score-label">score</span>
        </span>
      </div>

      <div className="intel-card__body">
        <div className="intel-card__title-row">
          <h3 className="intel-card__title">
            {listing.year} {listing.make} {listing.model}
          </h3>
          <p className="intel-card__trim">{listing.trim}</p>
        </div>

        <div className="intel-card__price-row">
          <p className="intel-card__price">{formatMoney(listing.price)}</p>
          <p
            className={`intel-card__savings ${
              savingsPositive ? 'text-savings' : 'text-over'
            }`}
          >
            {savingsPositive ? '↓' : '↑'} {formatMoney(Math.abs(savings))}
            <span className="intel-card__savings-pct">
              {' '}
              ({savingsPositive ? '-' : '+'}
              {Math.abs(savingsPct).toFixed(1)}%)
            </span>
          </p>
        </div>

        <dl className="intel-card__stats">
          <div>
            <dt>Mileage</dt>
            <dd>{formatMileage(listing.mileage)}</dd>
          </div>
          <div>
            <dt>Market value</dt>
            <dd>{formatMoney(listing.estimatedMarketValue)}</dd>
          </div>
          <div>
            <dt>Distance</dt>
            <dd>{listing.distance} mi</dd>
          </div>
          <div>
            <dt>Seller</dt>
            <dd>{listing.sellerType}</dd>
          </div>
        </dl>

        {listing.redFlags.length > 0 && (
          <div className="intel-card__flags" title={listing.redFlags.join(' · ')}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span>
              {listing.redFlags.length} red flag
              {listing.redFlags.length > 1 ? 's' : ''} ·{' '}
              <span className="intel-card__flags-text">
                {listing.redFlags[0]}
              </span>
            </span>
          </div>
        )}

        <div className="intel-card__location">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 21s-7-6.6-7-12a7 7 0 1114 0c0 5.4-7 12-7 12z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span>{listing.location}</span>
        </div>

        <div className="intel-card__actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onViewDetails(listing)}
          >
            Details
          </button>
          <button
            type="button"
            className={`btn ${isCompared ? 'btn-compare-active' : 'btn-secondary'}`}
            onClick={() => onToggleCompare(listing.id)}
            disabled={compareDisabled}
            title={compareDisabled ? 'Compare tray full (max 3)' : undefined}
          >
            {isCompared ? 'In Compare' : 'Compare'}
          </button>
          <button
            type="button"
            className={`btn ${isSaved ? 'btn-saved' : 'btn-ghost'}`}
            onClick={() => onToggleSave(listing.id)}
            aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
            title={isSaved ? 'Saved to watchlist' : 'Save listing'}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={isSaved ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
