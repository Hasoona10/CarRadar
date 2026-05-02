// sticky top nav. nothing crazy — just scrolls to sections on the page
// and shows how many cars you've saved

// little helper so i don't repeat this everywhere
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const NAV_LINKS = [
  { id: 'search', label: 'Search' },
  { id: 'listings', label: 'Compare' },
  { id: 'watchlist', label: 'Watchlist' },
];

export default function NavBar({ savedCount, onWatchlistClick }) {
  function handleClick(e, linkId) {
    e.preventDefault();
    if (linkId === 'watchlist') {
      onWatchlistClick();
      return;
    }
    scrollToId(linkId);
  }

  return (
    <nav className="nav" aria-label="Primary">
      <a
        href="#top"
        className="nav__brand"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <span className="nav__logo" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="4.5" />
            <line x1="12" y1="3" x2="12" y2="5.5" />
            <line x1="12" y1="18.5" x2="12" y2="21" />
            <line x1="3" y1="12" x2="5.5" y2="12" />
            <line x1="18.5" y1="12" x2="21" y2="12" />
          </svg>
        </span>
        <span className="nav__name">CarRadar</span>
      </a>

      <ul className="nav__links">
        {NAV_LINKS.map((l) => (
          <li key={l.id}>
            <a
              href={`#${l.id}`}
              className="nav__link"
              onClick={(e) => handleClick(e, l.id)}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav__right">
        <button
          type="button"
          className="nav__saved"
          onClick={onWatchlistClick}
          aria-label={`Watchlist, ${savedCount} saved`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          <span>Saved</span>
          <span className="nav__saved-count">{savedCount}</span>
        </button>
      </div>
    </nav>
  );
}
