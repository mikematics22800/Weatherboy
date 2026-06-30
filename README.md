# Weatherboy

A responsive weather web app with live conditions, a 5-day forecast, interactive charts, and map overlays — including a toggle between a 2D Leaflet map and a 3D Cesium globe.

**Live demo:** [https://mikematics22800.github.io/Weatherboy/](https://mikematics22800.github.io/Weatherboy/)

![Weatherboy](src/images/umbrella.png)

---

## Features

### Current conditions
- Detects your location via the browser Geolocation API (falls back to Washington, D.C.)
- City search powered by Google Places Autocomplete
- Displays temperature, wind direction/speed, dew point, and air pressure
- Reverse geocoding for state/region labels via OpenWeatherMap

### Forecast & charts
- 5-day forecast in 3-hour intervals
- Scrollable forecast cards with temperature, dew point, and pressure per period
- Dual-axis line chart for temperature, dew point, and air pressure over time
- Toggle between °F and °C on the chart

### Weather map
- **2D map** — Leaflet with OpenStreetMap base tiles
- **3D globe** — Cesium with click-to-fly navigation
- Toggleable OpenWeatherMap overlay layers:
  - Air pressure
  - Clouds
  - Precipitation
  - Temperature
  - Wind
- Location pin synced to the selected city/coordinates

### UI & experience
- Desktop layout: weather panel + map/forecast side by side
- Mobile layout: full-screen map with a draggable bottom sheet for weather details
- GSAP entrance animations (respects `prefers-reduced-motion`)
- Installable **Progressive Web App** (PWA) with offline shell caching

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [React 19](https://react.dev/) |
| Build tool | [Vite 5](https://vitejs.dev/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/), [Emotion](https://emotion.sh/) |
| UI components | [Material UI (MUI) 5](https://mui.com/) |
| Charts | [Chart.js 4](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) |
| 2D maps | [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) |
| 3D globe | [CesiumJS](https://cesium.com/platform/cesiumjs/) |
| Animations | [GSAP 3](https://gsap.com/) |
| Weather data | [OpenWeatherMap API](https://openweathermap.org/api) |
| Place search | [Google Maps Places API](https://developers.google.com/maps/documentation/javascript/places) |
| PWA | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) |
| Deployment | [gh-pages](https://github.com/tschaub/gh-pages) → GitHub Pages |

---

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- **npm** 9+
- API keys (free tiers available):
  - [OpenWeatherMap API key](https://home.openweathermap.org/api_keys) — weather data and map tile overlays
  - [Google Maps JavaScript API key](https://developers.google.com/maps/documentation/javascript/get-api-key) — city search autocomplete (enable **Places API** and **Maps JavaScript API**)

---

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/mikematics22800/Weatherboy.git
cd Weatherboy
```

### 2. Install dependencies

```bash
npm install
```

This runs a `postinstall` script that copies Cesium build assets from `node_modules` into `public/cesium/`.

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_OWM_KEY=your_openweathermap_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_OWM_KEY` | Yes | OpenWeatherMap API key for current weather, forecast, reverse geocoding, and map overlays |
| `VITE_GOOGLE_MAPS_API_KEY` | Yes | Google Maps key for Places Autocomplete in the search bar |

> **Note:** Never commit `.env` to version control. Vite exposes only variables prefixed with `VITE_` to the client bundle — treat both keys as public-facing and restrict them by HTTP referrer in each provider's dashboard.

### 4. Start the dev server

```bash
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

### 5. Build for production

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Copy Cesium assets and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint on `.js` / `.jsx` files |
| `npm run deploy` | Build and publish `dist/` to GitHub Pages |

---

## Deployment

The app is configured for GitHub Pages with base path `/Weatherboy/` (see `vite.config.js`).

```bash
npm run deploy
```

This runs `predeploy` (build) then pushes `dist/` to the `gh-pages` branch. Ensure your GitHub repository settings serve Pages from that branch.

To deploy elsewhere, update the `base` option in `vite.config.js` and the PWA `start_url` / `scope` in the same file.

---

## Project structure

```
Weatherboy/
├── index.html              # App entry HTML
├── vite.config.js          # Vite, PWA, and base-path config
├── scripts/
│   └── copy-cesium.mjs     # Copies Cesium assets to public/cesium
├── public/
│   ├── cesium/             # Cesium workers & assets (generated on install)
│   └── umbrella.png        # Favicon and PWA icon
└── src/
    ├── main.jsx            # React root + PWA service worker registration
    ├── index.css           # Global styles and Tailwind directives
    ├── components/
    │   ├── App.jsx           # Root layout, geolocation, data fetching, nav
    │   ├── Interface.jsx     # Current weather panel + mobile bottom sheet
    │   ├── Searchbar.jsx     # Google Places city search
    │   ├── Chart.jsx         # Temperature / dew point / pressure chart
    │   ├── Forecast.jsx      # Desktop forecast view
    │   ├── ForecastPeriods.jsx
    │   ├── ForecastPeriod.jsx
    │   ├── Map.jsx           # Leaflet map + globe toggle + layer controls
    │   ├── Globe.jsx         # Cesium 3D globe
    │   ├── Layers.jsx        # Climate overlay layer panel
    │   ├── WeatherContext.jsx
    │   └── hooks/
    │       └── useMobileSheetDrag.js
    ├── libs/
    │   ├── apis.js           # OpenWeatherMap fetch helpers
    │   ├── conversions.js    # Kelvin/°F/°C, wind direction, date formatting
    │   ├── loadCesium.js     # Dynamic Cesium loader
    │   ├── mapUtils.js       # Shared map utilities
    │   └── rainMirroredPattern.js
    └── images/
        └── umbrella.png
```

---

## How it works

### Data flow

1. On load, the app requests the user's coordinates via `navigator.geolocation`.
2. Coordinates are sent to OpenWeatherMap for **current weather** (`/data/2.5/weather`) and **5-day forecast** (`/data/2.5/forecast`).
3. A reverse geocode call (`/geo/1.0/reverse`) resolves the state/region label for the location line.
4. Selecting a city in the search bar updates `lat` / `lon` in React context, which re-fetches weather and recenters the map.

### Map overlays

OpenWeatherMap tile layers are composited on top of the base map:

```
https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={VITE_OWM_KEY}
```

Available layers: `clouds_new`, `precip_new`, `temp_new`, `wind_new`, `pressure_new`.

### Responsive layouts

| Viewport | Layout |
|----------|--------|
| **Desktop** (`≥640px`) | Nav toggles between Weather Map and 5-Day Forecast; weather panel and map/forecast share the viewport |
| **Mobile** (`<640px`) | Full-screen map with a draggable bottom sheet containing weather details, chart, and forecast cards |

---

## API reference (external)

| Service | Endpoint | Used for |
|---------|----------|----------|
| OpenWeatherMap | `GET /data/2.5/weather` | Current conditions |
| OpenWeatherMap | `GET /data/2.5/forecast` | 5-day / 3-hour forecast |
| OpenWeatherMap | `GET /geo/1.0/reverse` | State/region from coordinates |
| OpenWeatherMap | `GET /map/{layer}/{z}/{x}/{y}.png` | Map tile overlays |
| Google Maps | Places Autocomplete | City search |
| OpenStreetMap | `tile.openstreetmap.org` | Base map tiles |

---

## Browser support

- Modern evergreen browsers with WebGL support (required for the Cesium globe)
- Geolocation permission improves the default experience but is not strictly required (fallback coordinates are used on denial)
- PWA install is supported on Chromium-based browsers and Safari (iOS 16.4+)

---

## Troubleshooting

| Issue | Likely cause | Fix |
|-------|--------------|-----|
| Blank weather data | Missing or invalid `VITE_OWM_KEY` | Add key to `.env` and restart dev server |
| Search bar stuck on "Initializing…" | Missing or invalid Google Maps key | Add `VITE_GOOGLE_MAPS_API_KEY`; enable Places + Maps JS APIs |
| Globe does not load | Cesium assets missing | Run `npm install` or `node scripts/copy-cesium.mjs` |
| Map overlays not visible | OWM key lacks map layer access | Verify your OpenWeatherMap plan includes map tiles |
| Broken assets after deploy | Wrong `base` path | Ensure `base: "/Weatherboy/"` matches your GitHub repo name |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-change`)
3. Commit your changes
4. Push and open a pull request

Please run `npm run lint` before submitting.

---

## License

No license file is included yet. All rights reserved by the repository owner unless stated otherwise.

---

## Acknowledgments

- Weather data and map tiles by [OpenWeatherMap](https://openweathermap.org/)
- Base map tiles © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- 3D globe powered by [CesiumJS](https://cesium.com/)
