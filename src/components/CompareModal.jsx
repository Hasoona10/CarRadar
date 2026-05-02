// side-by-side compare table that pops up from the tray.
// i'm just defining the rows as an array of {label, render} so i don't
// have to write the same <tr> over and over

import {
  calculateSavings,
  dealBadgeClass,
  formatMileage,
  formatMoney,
  getDealScore,
  getDealStatus,
} from '../utils/dealUtils.js';

export default function CompareModal({ listings, onClose }) {
  const rows = [
    { label: 'Marketplace', render: (l) => l.source },
    { label: 'Price', render: (l) => formatMoney(l.price) },
    { label: 'Mileage', render: (l) => formatMileage(l.mileage) },
    { label: 'Market value', render: (l) => formatMoney(l.estimatedMarketValue) },
    {
      label: 'Savings',
      render: (l) => {
        const s = calculateSavings(l.price, l.estimatedMarketValue);
        const positive = s > 0;
        return (
          <span className={positive ? 'text-savings' : 'text-over'}>
            {positive ? '↓ ' : '↑ '}
            {formatMoney(Math.abs(s))}
          </span>
        );
      },
    },
    { label: 'Distance', render: (l) => `${l.distance} mi` },
    { label: 'Seller', render: (l) => l.sellerType },
    {
      label: 'Deal score',
      render: (l) => `${getDealScore(l.price, l.estimatedMarketValue)}/100`,
    },
    {
      label: 'Deal status',
      render: (l) => {
        const status = getDealStatus(l.price, l.estimatedMarketValue);
        return (
          <span className={`deal-badge ${dealBadgeClass(status)}`}>{status}</span>
        );
      },
    },
  ];

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-title"
      onClick={onClose}
    >
      <div
        className="compare-modal card-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close compare"
        >
          ×
        </button>
        <div className="compare-modal__header">
          <span className="tag tag--brand">Side-by-side compare</span>
          <h2 id="compare-title" className="compare-modal__title">
            Comparing {listings.length} listings
          </h2>
          <p className="compare-modal__help">
            Pick the car that matches your priorities: price, savings, mileage,
            or distance.
          </p>
        </div>

        <div className="compare-modal__scroll">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">Attribute</th>
                {listings.map((l) => (
                  <th key={l.id} scope="col">
                    <span className="compare-table__car">
                      {l.year} {l.make} {l.model}
                    </span>
                    <span className="compare-table__trim">{l.trim}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {listings.map((l) => (
                    <td key={l.id}>{row.render(l)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
