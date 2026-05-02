// horizontal strip of marketplace "chips" with how many listings each has.
// clicking a chip filters the results to that marketplace.

const MARKETPLACES = [
  'Facebook Marketplace',
  'OfferUp',
  'Craigslist',
  'Autotrader',
  'Cars.com',
  'CarGurus',
];

// short initials for the colored avatar on each chip
const INITIALS = {
  'Facebook Marketplace': 'FB',
  OfferUp: 'OU',
  Craigslist: 'CL',
  Autotrader: 'AT',
  'Cars.com': 'C',
  CarGurus: 'CG',
};

export default function MarketplaceStrip({
  allListings,
  activeSource,
  onSelect,
}) {
  const countsBySource = MARKETPLACES.reduce((acc, src) => {
    acc[src] = allListings.filter((l) => l.source === src).length;
    return acc;
  }, {});

  return (
    <section className="market-strip" aria-label="Marketplace coverage">
      <div className="market-strip__header">
        <h2 className="market-strip__title">Marketplace coverage</h2>
        <p className="market-strip__help">
          Click a source to filter the scan · click again to clear
        </p>
      </div>
      <div className="market-strip__row">
        {MARKETPLACES.map((src) => {
          const active = activeSource === src;
          return (
            <button
              type="button"
              key={src}
              className={`market-chip ${active ? 'market-chip--active' : ''}`}
              onClick={() => onSelect(active ? 'All Marketplaces' : src)}
              aria-pressed={active}
            >
              <span className="market-chip__avatar" aria-hidden="true">
                {INITIALS[src]}
              </span>
              <span className="market-chip__meta">
                <span className="market-chip__name">{src}</span>
                <span className="market-chip__count">
                  {countsBySource[src]} listings
                </span>
              </span>
              <span
                className={`market-chip__dot ${
                  countsBySource[src] > 0 ? 'market-chip__dot--live' : ''
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
