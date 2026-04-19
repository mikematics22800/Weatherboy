# Weatherboy

A React + Vite weather dashboard that uses your browser location (or a fallback), [OpenWeather](https://openweathermap.org/) for current conditions and forecasts, [Google Places](https://developers.google.com/maps/documentation/places/web-service) for city search, and an interactive map with optional OpenWeather map overlays.

**Live site:** [GitHub Pages](https://mikematics22800.github.io/weatherboy) (see [Deployment](#deployment) if your fork uses a different repository name.)

---

## Features

- **Geolocation** — On load, requests the device position; if denied or unavailable, defaults to Washington, D.C.
- **Current conditions** — Temperature (°F), wind (direction + mph), dew point, pressure, and OpenWeather icons with short descriptions.
- **Location line** — City name plus region when reverse geocoding succeeds (OpenWeather Geo 1.0).
- **City search** — Google Maps JavaScript API **Places Autocomplete** restricted to cities; selecting a place updates coordinates and refetches weather.
- **Map vs forecast** — Toggle between a **Leaflet** map (OpenStreetMap base + optional OWM layers: clouds, precipitation, wind, pressure, temperature) and a **5-day / 3-hour** forecast view with **Chart.js** temperature sparkline-style chart.
- **Motion** — [GSAP](https://greensock.com/gsap/) timelines for load and data transitions, with shorter animations when `prefers-reduced-motion: reduce` is set.

---

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 18, [MUI](https://mui.com/) (icons, form controls), [Emotion](https://emotion.sh/) |
| Build | [Vite](https://vitejs.dev/) 5, `@vitejs/plugin-react` |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + `src/index.css` |
| Maps (search) | [`@react-google-maps/api`](https://github.com/JustFlyIt/react-google-maps-api) (`useLoadScript`, `Autocomplete`, Places library) |
| Map view | [`react-leaflet`](https://react-leaflet.js.org/) + [Leaflet](https://leafletjs.com/) |
| Charts | [`react-chartjs-2`](https://react-chartjs-2.js.org/) |
| Animation | [GSAP](https://greensock.com/gsap/) |
| Weather APIs | OpenWeather **Current**, **5 Day / 3 Hour Forecast**, **Geo reverse**, **Map tiles** |

The entry point is `src/main.jsx`, which mounts `src/components/App.jsx`.

---

## Prerequisites

- **Node.js** 18+ recommended (Vite 5 aligns with current LTS).
- Accounts / keys:
  - [OpenWeather API key](https://openweathermap.org/api) (free tier is enough for development within rate limits).
  - [Google Cloud](https://console.cloud.google.com/) project with **Maps JavaScript API** and **Places API** enabled, and an API key restricted appropriately for your domain(s).

---

## Environment variables

Create a `.env` file in the project root (Vite only exposes variables prefixed with `VITE_`):

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_OWM_KEY` | **Yes** (for real data) | OpenWeather `appid` for weather, forecast, geo reverse, and map tile layers. |
| `VITE_GOOGLE_MAPS_API_KEY` | **Yes** (for search) | Google Maps JS API key; used by `useLoadScript` and Places Autocomplete. |

Example:

```env
VITE_OWM_KEY=your_openweather_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

`Map.jsx` also accepts `NEXT_PUBLIC_OWM_KEY` as a fallback for the tile `appid` only; prefer `VITE_OWM_KEY` in Vite projects.

---

## Getting started

```bash
git clone https://github.com/<your-username>/Weatherboy.git
cd Weatherboy
npm install
```

Add `.env` as above, then:

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Allow location when prompted for the best first-run experience.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR. |
| `npm run build` | Production build to `dist/`. |
| `npm run preview` | Serve `dist/` locally to verify the build. |
| `npm run lint` | ESLint on `.js` / `.jsx`. |
| `npm run deploy` | Runs `predeploy` (`npm run build`) then publishes `dist/` with [gh-pages](https://www.npmjs.com/package/gh-pages). |

---

## Deployment (GitHub Pages)

`package.json` includes:

```json
"homepage": "https://mikematics22800.github.io/weatherboy",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist --dotfiles -m \"Deploy: GitHub Pages\""
```

`vite.config.js` sets:

```js
base: "/Weatherboy/"
```

For GitHub Pages **project sites**, `base` must match the repository path segment (case-sensitive in the URL path). If your repo is named `weatherboy` (all lowercase), set `base` to `"/weatherboy/"` and align `homepage` with `https://<user>.github.io/weatherboy/`. After adjusting, rebuild and redeploy.

Restrict your Google Maps key to your GitHub Pages origin (and `http://localhost:5173` for local dev).

---

## Project layout

```
src/
  components/
    App.jsx          # Context, geolocation, weather fetch, GSAP page transitions, layout shell
    Interface.jsx    # Search + current stats + map/forecast toggle
    Searchbar.jsx    # Google Places Autocomplete → setLat / setLon
    Map.jsx          # Leaflet map, OSM tiles, OWM overlay toggles
    LiveLayers.jsx   # Overlay layer checkboxes (MUI)
    Forecast.jsx     # 5-day cards + chart (default export used as "Metrics" in App)
    TempChart.jsx    # Chart.js temperature series
  libs/
    apis.js          # OpenWeather fetch helpers
    conversions.js   # Units, time labels, wind direction, dew point helpers
  index.css          # Global + component-oriented styles
  main.jsx           # React root
```

---

## API usage summary

- **Current weather** — `GET /data/2.5/weather?lat=&lon=&appid=`
- **Forecast** — `GET /data/2.5/forecast?lat=&lon=&appid=`
- **Reverse geocode (region)** — `GET /geo/1.0/reverse?lat=&lon=&limit=1&appid=`
- **Map tiles** — `https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=`

All of the above use the same OpenWeather key where applicable.

---

## Troubleshooting

- **Blank map or build errors mentioning Leaflet** — The map is implemented with `react-leaflet` and `leaflet`. If those packages are missing from your install, add them:  
  `npm install leaflet react-leaflet`
- **Search stuck on "Initializing…"** — Check `VITE_GOOGLE_MAPS_API_KEY`, billing/API enablement, and HTTP referrer restrictions on the key.
- **No weather data** — Verify `VITE_OWM_KEY` and that the OpenWeather key is active; watch the browser network tab for 401/429 responses.
- **Wrong asset paths on GitHub Pages** — Mismatched `vite.config.js` `base` and repo name usually causes 404s on JS/CSS; fix `base`, rebuild, and redeploy.

---

## Contributing

Issues and pull requests are welcome. Run `npm run lint` before submitting changes.

---

## Acknowledgments

- Weather data and map tiles: [OpenWeather](https://openweathermap.org/)
- Basemap tiles: [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- Search: [Google Maps Platform](https://developers.google.com/maps)
