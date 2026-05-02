// fixed tray at the bottom. shows up when you click Compare on a card
// and goes away when cleared. max 3 cars.

import CarImage from './CarImage.jsx';

export default function CompareTray({
  compareListings,
  onRemove,
  onClear,
  onOpen,
}) {
  // don't render anything if tray is empty
  if (compareListings.length === 0) return null;

  const slots = [0, 1, 2];
  const canCompare = compareListings.length >= 2;

  return (
    <div className="tray" role="region" aria-label="Compare tray">
      <div className="tray__inner">
        <div className="tray__info">
          <span className="tray__label">Compare tray</span>
          <span className="tray__count">
            {compareListings.length} of 3 selected
          </span>
        </div>

        <div className="tray__slots">
          {slots.map((i) => {
            const listing = compareListings[i];
            if (!listing) {
              return (
                <div key={i} className="tray__slot tray__slot--empty">
                  <span>Empty slot</span>
                </div>
              );
            }
            return (
              <div key={listing.id} className="tray__slot">
                <div className="tray__thumb">
                  <CarImage listing={listing} variant="thumb" />
                </div>
                <div className="tray__slot-meta">
                  <span className="tray__slot-title">
                    {listing.year} {listing.make} {listing.model}
                  </span>
                  <span className="tray__slot-sub">{listing.source}</span>
                </div>
                <button
                  type="button"
                  className="tray__remove"
                  onClick={() => onRemove(listing.id)}
                  aria-label={`Remove ${listing.year} ${listing.make} ${listing.model} from compare`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        <div className="tray__actions">
          <button type="button" className="btn btn-ghost" onClick={onClear}>
            Clear
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpen}
            disabled={!canCompare}
            title={canCompare ? undefined : 'Select at least 2 cars'}
          >
            Compare selected
          </button>
        </div>
      </div>
    </div>
  );
}
