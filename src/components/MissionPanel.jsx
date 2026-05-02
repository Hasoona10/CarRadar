// search + filters panel (left side of the hero).
// all the inputs live here. when anything changes i call onChange with
// the new filters object so App can update its state.

const DEAL_OPTIONS = ['All Deals', 'Great Deal', 'Fair Deal', 'Overpriced'];

const SORT_OPTIONS = [
  'Best Deal',
  'Lowest Price',
  'Lowest Mileage',
  'Closest Distance',
  'Newest Year',
];

export default function MissionPanel({
  filters,
  onChange,
  onReset,
  onScan,
  scanning,
}) {
  // generic handler so i don't need a separate one for every input
  function handle(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <section id="search" className="mission card-surface" aria-label="Search mission">
      <div className="mission__header">
        <span className="tag tag--brand">Mission · Live Scan</span>
        <h2 className="mission__title">Find the best deal for your next car</h2>
        <p className="mission__help">
          Searches Facebook Marketplace, OfferUp, Craigslist, Autotrader,
          Cars.com, and CarGurus.
        </p>
      </div>

      <div className="mission__grid">
        <label className="field field--wide">
          <span className="field__label">Make / model / year</span>
          <input
            type="search"
            className="field__input"
            placeholder="e.g. 2019 Honda Accord Sport"
            value={filters.searchQuery}
            onChange={(e) => handle('searchQuery', e.target.value)}
            autoComplete="off"
          />
        </label>

        <label className="field">
          <span className="field__label">Max price</span>
          <input
            type="number"
            className="field__input"
            placeholder="No limit"
            min={0}
            step={500}
            value={filters.maxPrice}
            onChange={(e) => handle('maxPrice', e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">Max mileage</span>
          <input
            type="number"
            className="field__input"
            placeholder="No limit"
            min={0}
            value={filters.maxMileage}
            onChange={(e) => handle('maxMileage', e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">Deal status</span>
          <select
            className="field__input"
            value={filters.dealStatus}
            onChange={(e) => handle('dealStatus', e.target.value)}
          >
            {DEAL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Sort results</span>
          <select
            className="field__input"
            value={filters.sortBy}
            onChange={(e) => handle('sortBy', e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mission__footer">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={onScan}
          disabled={scanning}
          aria-busy={scanning}
        >
          {scanning ? (
            <>
              <span className="scan-spinner scan-spinner--on-primary" aria-hidden="true" />
              Scanning marketplaces…
            </>
          ) : (
            <>
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
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Run Marketplace Scan
            </>
          )}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onReset}
          disabled={scanning}
        >
          Reset filters
        </button>
      </div>
    </section>
  );
}
