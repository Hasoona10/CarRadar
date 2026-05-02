// full details modal that opens when you click "Details" on a card.
// shows everything: full stats, deal explanation, notes, red flags,
// and the fake "Open Marketplace Listing" button.

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

// longer date format just for the modal (full weekday + month)
function formatLongDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function dealExplanation(status, savingsPct) {
  if (status === 'Great Deal') {
    return `This listing is at least 10% below the estimated market value (about ${savingsPct.toFixed(1)}% below), which CarRadar flags as a Great Deal for buyers.`;
  }
  if (status === 'Fair Deal') {
    return `The price is within a typical range — between about 10% below and 5% above estimated market value (here about ${savingsPct.toFixed(1)}% vs market).`;
  }
  return `The asking price is more than 5% above the estimated market value (about ${Math.abs(savingsPct).toFixed(1)}% over). Compare similar listings before committing.`;
}

export default function ListingModal({ listing, onClose }) {
  if (!listing) return null;

  const status = getDealStatus(listing.price, listing.estimatedMarketValue);
  const savings = calculateSavings(listing.price, listing.estimatedMarketValue);
  const savingsPct = calculateSavingsPercent(
    listing.price,
    listing.estimatedMarketValue,
  );
  const score = getDealScore(listing.price, listing.estimatedMarketValue);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-modal-title"
      onClick={onClose}
    >
      <div
        className="listing-modal card-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>
        <div className="listing-modal__hero">
          <CarImage listing={listing} />
          <div className="listing-modal__overlay">
            <span className="source-badge">{listing.source}</span>
            <span className={`deal-badge ${dealBadgeClass(status)}`}>{status}</span>
          </div>
        </div>
        <div className="listing-modal__content">
          <h2 id="listing-modal-title" className="listing-modal__title">
            {listing.year} {listing.make} {listing.model}{' '}
            <span className="listing-modal__trim">{listing.trim}</span>
          </h2>
          <p className="listing-modal__price">{formatMoney(listing.price)}</p>
          <p className="listing-modal__savings">
            {savings > 0 ? '↓ Saves ' : '↑ Over market by '}
            {formatMoney(Math.abs(savings))} ({savingsPct >= 0 ? '+' : ''}
            {savingsPct.toFixed(1)}%) · Score {score}/100
          </p>

          <dl className="listing-modal__details">
            <div className="listing-modal__row">
              <dt>Mileage</dt>
              <dd>{formatMileage(listing.mileage)}</dd>
            </div>
            <div className="listing-modal__row">
              <dt>Location</dt>
              <dd>
                {listing.location} ({listing.distance} mi away)
              </dd>
            </div>
            <div className="listing-modal__row">
              <dt>Seller type</dt>
              <dd>{listing.sellerType}</dd>
            </div>
            <div className="listing-modal__row">
              <dt>Estimated market value</dt>
              <dd>{formatMoney(listing.estimatedMarketValue)}</dd>
            </div>
            <div className="listing-modal__row">
              <dt>Posted</dt>
              <dd>{formatLongDate(listing.postedDate)}</dd>
            </div>
          </dl>

          <section className="listing-modal__section">
            <h3 className="listing-modal__section-title">Deal insight</h3>
            <p className="listing-modal__text">
              {dealExplanation(status, savingsPct)}
            </p>
          </section>

          <section className="listing-modal__section">
            <h3 className="listing-modal__section-title">Seller notes</h3>
            <p className="listing-modal__text">{listing.notes}</p>
          </section>

          <section className="listing-modal__section">
            <h3 className="listing-modal__section-title">Red flags</h3>
            {listing.redFlags.length === 0 ? (
              <p className="listing-modal__text listing-modal__text--muted">
                None flagged for this listing.
              </p>
            ) : (
              <ul className="listing-modal__list">
                {listing.redFlags.map((flag) => (
                  <li key={flag}>{flag}</li>
                ))}
              </ul>
            )}
          </section>

          <a className="btn btn-primary listing-modal__external" href="#">
            Open Marketplace Listing
          </a>
        </div>
      </div>
    </div>
  );
}
