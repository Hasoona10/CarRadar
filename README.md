# CarRadar

My final project for CPSC 349 — Web Front-End Engineering.

CarRadar is a React + Vite single-page app that simulates comparing used-car listings across six marketplaces (Facebook Marketplace, OfferUp, Craigslist, Autotrader, Cars.com, and CarGurus) in one place.

The project spec said to keep it frontend-only with mock data, so there's no backend, no real API calls, and no scraping. Everything runs in the browser.

## What it does

- Search listings by make / model / year
- Filter by max price, max mileage, marketplace, seller type, and deal status
- Sort by best deal, lowest price, lowest mileage, closest distance, or newest year
- A deal score for every listing (Great Deal / Fair Deal / Overpriced) based on price vs estimated market value
- Save cars to a watchlist that persists in `localStorage`
- Side-by-side compare for up to 3 cars at once
- Red flag alerts on listings (high mileage, CVT concerns, etc.)
- Fake "marketplace scan" animation to show what a real multi-source scan might look like

## Tech stack

- React 19
- Vite
- Plain JavaScript (no TypeScript)
- Plain CSS (no Tailwind / component libraries)
- `localStorage` for persistence

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in a browser.

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  App.jsx            main component — holds the shared state
  App.css            all styles
  index.css          base styles + css variables
  data/
    listings.js      mock listings (30 cars)
  utils/
    dealUtils.js     pure helpers for deal scoring + formatting
  components/
    NavBar.jsx
    MissionPanel.jsx       search + filters
    BestDealCard.jsx       highlights the top deal in the hero
    MarketplaceStrip.jsx   per-source chips with counts
    ListingList.jsx
    ListingCard.jsx
    ListingModal.jsx       full details popup
    BuyerInsights.jsx      side panel stats
    CompareTray.jsx        bottom tray that holds up to 3 cars
    CompareModal.jsx       side-by-side comparison table
    ScanOverlay.jsx        fake scanning animation
    CarImage.jsx           svg illustration used instead of real photos
```

## Notes

- All listings are in `src/data/listings.js`. I made up roughly 30 of them to have enough variety for filters and sorts to actually do something.
- The deal-scoring formula is in `src/utils/dealUtils.js`.
- Images are drawn as SVGs (in `CarImage.jsx`) because I didn't want to deal with finding a real photo that matches every car. Each make gets its own color gradient.
- No auth, no backend, no network calls anywhere.

## License

MIT
