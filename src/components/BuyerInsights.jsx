// little side panel showing some quick stats about the current results:
// best marketplace, avg mileage, common red flags, and a hint about
// what to do next.

import { formatMileage, getDealStatus } from '../utils/dealUtils.js';

// score each marketplace based on how many great/fair deals are on it
// and return the winner. feels a bit hacky but it works
function pickBestMarketplace(listings) {
  if (listings.length === 0) return null;
  const scoreBySource = {};
  listings.forEach((l) => {
    const status = getDealStatus(l.price, l.estimatedMarketValue);
    const weight = status === 'Great Deal' ? 3 : status === 'Fair Deal' ? 1 : 0;
    scoreBySource[l.source] = (scoreBySource[l.source] || 0) + weight;
  });
  const entries = Object.entries(scoreBySource).sort((a, b) => b[1] - a[1]);
  if (!entries.length || entries[0][1] === 0) return null;
  return entries[0][0];
}

// count how often each red flag shows up and return the most common ones
function topRedFlags(listings, limit = 3) {
  const counts = {};
  listings.forEach((l) => {
    l.redFlags.forEach((flag) => {
      counts[flag] = (counts[flag] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([flag, count]) => ({ flag, count }));
}

export default function BuyerInsights({ listings }) {
  const bestMarketplace = pickBestMarketplace(listings);
  const flags = topRedFlags(listings);
  const avgMileage =
    listings.length === 0
      ? 0
      : Math.round(
          listings.reduce((sum, l) => sum + l.mileage, 0) / listings.length,
        );

  return (
    <aside id="insights" className="insights card-surface" aria-label="Buyer insights">
      <div className="insights__head">
        <span className="tag tag--brand">Buyer insights</span>
        <h2 className="insights__title">Today&apos;s signal</h2>
      </div>

      <div className="insights__row">
        <span className="insights__label">Best marketplace</span>
        <span className="insights__value">
          {bestMarketplace ? bestMarketplace : 'No clear leader yet'}
        </span>
      </div>

      <div className="insights__row">
        <span className="insights__label">Average mileage</span>
        <span className="insights__value">{formatMileage(avgMileage)}</span>
      </div>

      <div className="insights__block">
        <span className="insights__label">Common red flags</span>
        {flags.length === 0 ? (
          <p className="insights__muted">
            No red flags detected in the current results.
          </p>
        ) : (
          <ul className="insights__flags">
            {flags.map(({ flag, count }) => (
              <li key={flag}>
                <span className="insights__flag-count">{count}×</span>
                <span className="insights__flag-text">{flag}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="insights__action">
        <span className="insights__action-label">Suggested action</span>
        <p className="insights__action-text">
          Message sellers with listings 10% below market first — they move
          fastest and often have the cleanest history.
        </p>
      </div>
    </aside>
  );
}
