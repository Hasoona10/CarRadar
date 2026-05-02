// fake car "photo" — i didn't want to find/host real images for every car
// so i just draw a gradient + silhouette + label. guarantees the image always
// matches the title text on the card.
//
// colors are kinda based on the brand (honda red, tesla dark, ford blue, etc)
// i just eyeballed these

const MAKE_THEME = {
  Honda: { from: '#dc2626', to: '#7f1d1d' },
  Toyota: { from: '#2563eb', to: '#1e3a8a' },
  BMW: { from: '#0ea5e9', to: '#0c4a6e' },
  Lexus: { from: '#475569', to: '#0f172a' },
  Tesla: { from: '#111827', to: '#374151' },
  Mazda: { from: '#b91c1c', to: '#450a0a' },
  Ford: { from: '#1d4ed8', to: '#172554' },
  Acura: { from: '#334155', to: '#0f172a' },
  Nissan: { from: '#9f1239', to: '#500724' },
  Hyundai: { from: '#475569', to: '#1e293b' },
  Subaru: { from: '#15803d', to: '#052e16' },
};

// special cases — everything else just uses the generic sedan shape
const BODY_BY_MODEL = {
  Mustang: 'coupe',
  Outback: 'wagon',
};

function resolveBody(listing) {
  return BODY_BY_MODEL[listing.model] || 'sedan';
}

// SVG paths for each body style. i drew these by hand in an svg editor —
// definitely not perfect but they read as "car" at card size
function Silhouette({ body }) {
  if (body === 'coupe') {
    return (
      <path
        d="M30 78 C30 64 46 56 66 54 L100 34 C108 28 120 25 134 25 L200 25 C214 25 225 30 232 40 L252 62 L280 66 C296 68 306 76 306 86 L306 98 C306 105 301 110 294 110 L272 110 C266 110 261 105 261 99 L261 96 L97 96 L97 99 C97 105 92 110 86 110 L60 110 C54 110 49 105 49 99 L49 96 L38 96 C34 96 30 93 30 89 Z"
        fill="rgba(255, 255, 255, 0.16)"
      />
    );
  }
  if (body === 'wagon') {
    return (
      <path
        d="M28 82 C28 68 42 60 62 58 L90 38 C98 32 110 29 124 29 L248 29 C260 29 270 34 276 43 L290 64 L308 68 C322 70 332 78 332 88 L332 100 C332 107 327 112 320 112 L300 112 C294 112 289 107 289 101 L289 98 L101 98 L101 101 C101 107 96 112 90 112 L66 112 C60 112 55 107 55 101 L55 98 L42 98 C36 98 28 95 28 91 Z"
        fill="rgba(255, 255, 255, 0.16)"
      />
    );
  }
  return (
    <path
      d="M32 82 C32 66 50 58 72 56 L108 38 C118 32 132 29 150 29 L224 29 C238 29 250 34 258 44 L278 66 L306 70 C322 72 334 82 334 92 L334 104 C334 111 329 116 322 116 L296 116 C290 116 285 111 285 105 L285 102 L105 102 L105 105 C105 111 100 116 94 116 L68 116 C62 116 57 111 57 105 L57 102 L46 102 C40 102 32 99 32 95 Z"
      fill="rgba(255, 255, 255, 0.16)"
    />
  );
}

export default function CarImage({ listing, variant = 'full' }) {
  const theme = MAKE_THEME[listing.make] || {
    from: '#334155',
    to: '#0f172a',
  };
  const body = resolveBody(listing);
  const ariaLabel = `${listing.year} ${listing.make} ${listing.model} ${listing.trim}`;

  return (
    <div
      className={`car-image car-image--${variant}`}
      style={{
        background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <div className="car-image__grid" aria-hidden="true" />
      <svg
        className="car-image__svg"
        viewBox="0 0 360 140"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <Silhouette body={body} />
        <circle cx="94" cy="102" r="11" fill="rgba(255,255,255,0.22)" />
        <circle cx="94" cy="102" r="5" fill="rgba(15,23,42,0.4)" />
        <circle cx="278" cy="102" r="11" fill="rgba(255,255,255,0.22)" />
        <circle cx="278" cy="102" r="5" fill="rgba(15,23,42,0.4)" />
      </svg>
      {variant === 'full' && (
        <div className="car-image__label">
          <span className="car-image__year">{listing.year}</span>
          <span className="car-image__name">
            {listing.make} {listing.model}
          </span>
          <span className="car-image__trim">{listing.trim}</span>
        </div>
      )}
    </div>
  );
}
