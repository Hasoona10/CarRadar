// grid of listing cards. also handles the empty state when
// nothing matches the filters.

import ListingCard from './ListingCard.jsx';

export default function ListingList({
  listings,
  savedIds,
  compareIds,
  onToggleSave,
  onToggleCompare,
  onViewDetails,
  title,
  subtitle,
}) {
  // once tray is full we pass this down so the button gets disabled
  const compareFull = compareIds.length >= 3;

  return (
    <section id="listings" className="listings" aria-label="Vehicle listings">
      <div className="listings__header">
        <div>
          <h2 className="listings__title">{title}</h2>
          <p className="listings__subtitle">{subtitle}</p>
        </div>
        <span className="listings__count">
          <strong>{listings.length}</strong>
          <span>results</span>
        </span>
      </div>

      {listings.length === 0 ? (
        <div className="empty-state card-surface" role="status">
          <p className="empty-state__title">No listings match your mission.</p>
          <p className="empty-state__hint">
            Try adjusting your search, raising the price cap, or widening the
            marketplace filter.
          </p>
        </div>
      ) : (
        <div className="listings__grid">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isSaved={savedIds.includes(listing.id)}
              isCompared={compareIds.includes(listing.id)}
              compareFull={compareFull}
              onToggleSave={onToggleSave}
              onToggleCompare={onToggleCompare}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </section>
  );
}
