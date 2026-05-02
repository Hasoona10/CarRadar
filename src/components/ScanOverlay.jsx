// fake "scanning marketplaces" overlay that shows up when you click
// Run Marketplace Scan. just for the look — not actually hitting anything.
// App.jsx drives the step/done state with setTimeouts.

export const SCAN_MARKETPLACES = [
  'Facebook Marketplace',
  'OfferUp',
  'Craigslist',
  'Autotrader',
  'Cars.com',
  'CarGurus',
];

const INITIALS = {
  'Facebook Marketplace': 'FB',
  OfferUp: 'OU',
  Craigslist: 'CL',
  Autotrader: 'AT',
  'Cars.com': 'C',
  CarGurus: 'CG',
};

// returns one of 3 states for a marketplace row at a given step:
//   'done'     -> already indexed
//   'scanning' -> currently scanning this one
//   'pending'  -> hasn't started yet
function statusFor(index, step, done) {
  if (done) return 'done';
  if (index < step) return 'done';
  if (index === step) return 'scanning';
  return 'pending';
}

export default function ScanOverlay({
  active,
  step,
  done,
  foundCount,
  onCancel,
}) {
  if (!active) return null;

  const total = SCAN_MARKETPLACES.length;
  const progress = done
    ? 100
    : Math.min(100, Math.round((step / total) * 100));

  return (
    <div
      className="scan-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Scanning marketplaces"
    >
      <div className="scan-card card-surface">
        <div className="scan-card__head">
          <span className="scan-card__eyebrow">
            <span className="scan-card__pulse" aria-hidden="true" />
            Live marketplace scan
          </span>
          <h2 className="scan-card__title">
            {done
              ? 'Scan complete'
              : 'Scanning marketplaces for your next car…'}
          </h2>
          <p className="scan-card__sub">
            {done
              ? `Pulled ${foundCount} listings across ${total} marketplaces.`
              : 'Checking price, mileage, and market value in real time.'}
          </p>
        </div>

        <div
          className="scan-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="scan-progress__bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="scan-progress__meta">
          <span>
            {done ? total : step} of {total} marketplaces
          </span>
          <span>{progress}%</span>
        </div>

        <ul className="scan-list">
          {SCAN_MARKETPLACES.map((name, i) => {
            const s = statusFor(i, step, done);
            return (
              <li key={name} className={`scan-row scan-row--${s}`}>
                <span className="scan-row__avatar" aria-hidden="true">
                  {INITIALS[name]}
                </span>
                <span className="scan-row__name">{name}</span>
                <span className="scan-row__status">
                  {s === 'done' && (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Indexed
                    </>
                  )}
                  {s === 'scanning' && (
                    <>
                      <span className="scan-spinner" aria-hidden="true" />
                      Scanning…
                    </>
                  )}
                  {s === 'pending' && <span>Queued</span>}
                </span>
              </li>
            );
          })}
        </ul>

        {!done && (
          <button
            type="button"
            className="btn btn-ghost btn-sm scan-card__cancel"
            onClick={onCancel}
          >
            Cancel scan
          </button>
        )}
      </div>
    </div>
  );
}
