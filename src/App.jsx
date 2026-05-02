// main App component.
// i'm keeping all the shared state here for now (filters, saved list, compare list etc)
// kinda big file — could break it up with Context later if it grows

import { useEffect, useMemo, useRef, useState } from 'react';
import { listings } from './data/listings.js';
import { getDealScore, getDealStatus } from './utils/dealUtils.js';
import NavBar from './components/NavBar.jsx';
import MissionPanel from './components/MissionPanel.jsx';
import BestDealCard from './components/BestDealCard.jsx';
import MarketplaceStrip from './components/MarketplaceStrip.jsx';
import ListingList from './components/ListingList.jsx';
import CompareTray from './components/CompareTray.jsx';
import CompareModal from './components/CompareModal.jsx';
import ListingModal from './components/ListingModal.jsx';
import ScanOverlay, { SCAN_MARKETPLACES } from './components/ScanOverlay.jsx';
import './App.css';

// timing for the fake marketplace scan animation (ms)
const SCAN_STEP_MS = 500;
const SCAN_FINISH_DELAY_MS = 800;

// localStorage key for the saved listings watchlist
const STORAGE_KEY = 'carradar_saved_listings';
// max cars you can have in the compare tray at once
const COMPARE_LIMIT = 3;

// default starting state for the filters
const defaultFilters = {
  searchQuery: '',
  maxPrice: '15000',
  maxMileage: '',
  marketplace: 'All Marketplaces',
  dealStatus: 'All Deals',
  sortBy: 'Best Deal',
};

// pull saved listing ids out of localStorage on first load.
// wrapping in try/catch because if the stored JSON is bad this would crash
function loadSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// smush the year/make/model/trim into one string so the search input
// can match anything (e.g. "honda accord 2019" OR just "accord")
function listingSearchBlob(l) {
  return `${l.year} ${l.make} ${l.model} ${l.trim}`.toLowerCase();
}

// big filter + sort function. runs on every filter change.
// TODO: maybe move to its own file if i add more filters
function applyFiltersAndSort(all, filters, showSavedOnly, savedIds) {
  const q = filters.searchQuery.trim().toLowerCase();
  const maxPrice = filters.maxPrice !== '' ? Number(filters.maxPrice) : null;
  const maxMileage =
    filters.maxMileage !== '' ? Number(filters.maxMileage) : null;

  let result = all;

  if (showSavedOnly) {
    result = result.filter((l) => savedIds.includes(l.id));
  }

  if (q) {
    result = result.filter((l) => listingSearchBlob(l).includes(q));
  }

  if (maxPrice !== null && !Number.isNaN(maxPrice)) {
    result = result.filter((l) => l.price <= maxPrice);
  }

  if (maxMileage !== null && !Number.isNaN(maxMileage)) {
    result = result.filter((l) => l.mileage <= maxMileage);
  }

  if (filters.marketplace !== 'All Marketplaces') {
    result = result.filter((l) => l.source === filters.marketplace);
  }

  if (filters.dealStatus !== 'All Deals') {
    result = result.filter(
      (l) =>
        getDealStatus(l.price, l.estimatedMarketValue) === filters.dealStatus,
    );
  }

  const sorted = [...result];

  switch (filters.sortBy) {
    case 'Lowest Price':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'Lowest Mileage':
      sorted.sort((a, b) => a.mileage - b.mileage);
      break;
    case 'Closest Distance':
      sorted.sort((a, b) => a.distance - b.distance);
      break;
    case 'Newest Year':
      sorted.sort((a, b) => b.year - a.year);
      break;
    case 'Best Deal':
    default:
      sorted.sort(
        (a, b) =>
          getDealScore(b.price, b.estimatedMarketValue) -
          getDealScore(a.price, a.estimatedMarketValue),
      );
      break;
  }

  return sorted;
}

function App() {
  const [filters, setFilters] = useState(defaultFilters);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState(loadSavedIds);
  const [compareIds, setCompareIds] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [detailListing, setDetailListing] = useState(null);
  const [scanActive, setScanActive] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanDone, setScanDone] = useState(false);
  const scanTimers = useRef([]);

  // whenever saved list changes, write it to localStorage so it sticks around
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  // true if any overlay thing is open (modal, compare, or the scan)
  const modalOpen = detailListing || compareOpen || scanActive;

  // handle Escape key + lock body scroll while a modal/overlay is open
  useEffect(() => {
    if (!modalOpen) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') {
        setDetailListing(null);
        setCompareOpen(false);
        if (scanActive && !scanDone) {
          clearScanTimers();
          setScanActive(false);
          setScanStep(0);
        }
      }
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [modalOpen, scanActive, scanDone]);

  // memo-ing the filtered list so we don't redo the filter+sort on every render
  const filteredListings = useMemo(
    () => applyFiltersAndSort(listings, filters, showSavedOnly, savedIds),
    [filters, showSavedOnly, savedIds],
  );

  // the single best deal out of the filtered results (shown in the hero card)
  const bestDealListing = useMemo(() => {
    if (filteredListings.length === 0) return null;
    return [...filteredListings].sort(
      (a, b) =>
        getDealScore(b.price, b.estimatedMarketValue) -
        getDealScore(a.price, a.estimatedMarketValue),
    )[0];
  }, [filteredListings]);

  const compareListings = useMemo(() => {
    return compareIds
      .map((id) => listings.find((l) => l.id === id))
      .filter(Boolean);
  }, [compareIds]);

  function handleResetFilters() {
    setFilters(defaultFilters);
  }

  // keep track of setTimeout ids so we can cancel them if user hits ESC mid-scan
  function clearScanTimers() {
    scanTimers.current.forEach((t) => clearTimeout(t));
    scanTimers.current = [];
  }

  // fires the fake marketplace scan when user clicks "Run Marketplace Scan"
  // not hitting any real API — just stepping through the marketplaces on a timer
  function runScan() {
    if (scanActive) return;
    clearScanTimers();
    setScanActive(true);
    setScanDone(false);
    setScanStep(0);

    const total = SCAN_MARKETPLACES.length;
    for (let i = 1; i <= total; i++) {
      const t = setTimeout(() => setScanStep(i), SCAN_STEP_MS * i);
      scanTimers.current.push(t);
    }

    const completeTimer = setTimeout(() => {
      setScanDone(true);
    }, SCAN_STEP_MS * total);
    scanTimers.current.push(completeTimer);

    const closeTimer = setTimeout(() => {
      setScanActive(false);
      setScanDone(false);
      setScanStep(0);
      const el = document.getElementById('listings');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, SCAN_STEP_MS * total + SCAN_FINISH_DELAY_MS);
    scanTimers.current.push(closeTimer);
  }

  function cancelScan() {
    clearScanTimers();
    setScanActive(false);
    setScanDone(false);
    setScanStep(0);
  }

  // make sure any running timers get cleaned up if the component unmounts
  useEffect(() => {
    return () => clearScanTimers();
  }, []);

  // toggle a listing in the saved watchlist
  function toggleSave(id) {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  // add/remove a car from the compare tray. capped at 3 so the table stays readable
  function toggleCompare(id) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= COMPARE_LIMIT) return prev;
      return [...prev, id];
    });
  }

  function handleWatchlistClick() {
    setShowSavedOnly((v) => !v);
    setTimeout(() => {
      const el = document.getElementById('listings');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  const listingsTitle = showSavedOnly ? 'Saved listings' : 'Matching listings';
  const listingsSubtitle = showSavedOnly
    ? 'Your watchlist — stored locally on this device.'
    : 'Sorted by your current mission parameters.';

  return (
    <div className="app">
      <div id="watchlist" className="app__anchor" aria-hidden="true" />
      <NavBar
        savedCount={savedIds.length}
        onWatchlistClick={handleWatchlistClick}
      />

      <main className="app__main" id="top">
        {showSavedOnly && (
          <div className="saved-banner">
            <span>
              Showing <strong>{savedIds.length}</strong> saved listing
              {savedIds.length === 1 ? '' : 's'} · filters still apply
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowSavedOnly(false)}
            >
              Show all listings
            </button>
          </div>
        )}

        <section className="hero-grid">
          <MissionPanel
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            onScan={runScan}
            scanning={scanActive}
          />
          <BestDealCard
            listing={bestDealListing}
            onViewDetails={setDetailListing}
          />
        </section>

        <MarketplaceStrip
          allListings={listings}
          activeSource={filters.marketplace}
          onSelect={(src) => setFilters((f) => ({ ...f, marketplace: src }))}
        />

        <section className="results-grid">
          <ListingList
            listings={filteredListings}
            savedIds={savedIds}
            compareIds={compareIds}
            onToggleSave={toggleSave}
            onToggleCompare={toggleCompare}
            onViewDetails={setDetailListing}
            title={listingsTitle}
            subtitle={listingsSubtitle}
          />
        </section>
      </main>

      <CompareTray
        compareListings={compareListings}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
        onOpen={() => setCompareOpen(true)}
      />

      {compareOpen && (
        <CompareModal
          listings={compareListings}
          onClose={() => setCompareOpen(false)}
        />
      )}

      {detailListing && (
        <ListingModal
          listing={detailListing}
          onClose={() => setDetailListing(null)}
        />
      )}

      <ScanOverlay
        active={scanActive}
        step={scanStep}
        done={scanDone}
        foundCount={filteredListings.length}
        onCancel={cancelScan}
      />
    </div>
  );
}

export default App;
