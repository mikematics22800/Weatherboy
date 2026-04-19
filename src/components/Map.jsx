'use client';

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Context } from "./WeatherContext";
import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ClimateLayers, { DEFAULT_CLIMATE_LAYERS } from "./Layers";

const OWM_OVERLAY_TILES = [
  ["clouds", "clouds_new"],
  ["precip", "precip_new"],
  ["temp", "temp_new"],
  ["wind", "wind_new"],
  ["pressure", "pressure_new"],
];

const CITY_FOCUS_ZOOM = 11;

const locationPinIcon = L.divIcon({
  className: "map-location-marker",
  html:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="28" height="36" aria-hidden="true">' +
    '<path fill="#2563eb" stroke="#fff" stroke-width="1.25" d="M12 1C6.92 1 3 4.92 3 10c0 6.2 9 21 9 21s9-14.8 9-21C21 4.92 17.08 1 12 1z"/>' +
    '<circle cx="12" cy="10" r="3.25" fill="#fff"/></svg>',
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -32],
});

function parseCoords(lat, lon) {
  if (lat == null || lon == null) return null;
  const la = Number(lat);
  const lo = Number(lon);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
  return [la, lo];
}

function MapViewSync({ lat, lon }) {
  const map = useMap();
  const coordRef = useRef({ lat, lon });
  coordRef.current = { lat, lon };

  useEffect(() => {
    let alive = true;
    let debounceTimer = 0;

    const tryFlyToSelection = () => {
      if (!alive) return;
      const pos = parseCoords(coordRef.current.lat, coordRef.current.lon);
      if (!pos) return;
      map.invalidateSize({ animate: false });
      const sz = map.getSize();
      if (!sz?.x || !sz?.y) return;
      map.flyTo(pos, CITY_FOCUS_ZOOM, { duration: 0.75 });
    };

    const scheduleTry = () => {
      clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(tryFlyToSelection, 100);
    };

    const runWhenSized = () => {
      requestAnimationFrame(tryFlyToSelection);
    };

    map.whenReady(runWhenSized);

    const el = map.getContainer();
    const ro = new ResizeObserver(scheduleTry);
    ro.observe(el);

    return () => {
      alive = false;
      clearTimeout(debounceTimer);
      ro.disconnect();
    };
  }, [lat, lon, map]);

  return null;
}

function LocationMarker({ lat, lon }) {
  const position = useMemo(() => parseCoords(lat, lon), [lat, lon]);
  if (!position) return null;
  return <Marker position={position} icon={locationPinIcon} />;
}

const Map = () => {
  const { lat, lon } = useContext(Context);
  const id = import.meta.env.VITE_OWM_KEY ?? import.meta.env.NEXT_PUBLIC_OWM_KEY;

  const [layers, setLayers] = useState(() => ({ ...DEFAULT_CLIMATE_LAYERS }));

  const initialViewRef = useRef(null);
  if (initialViewRef.current === null) {
    const pos = parseCoords(lat, lon);
    initialViewRef.current = {
      center: pos ?? [30, -60],
      zoom: pos ? CITY_FOCUS_ZOOM : 4,
    };
  }
  const { center: mapCenter, zoom: mapZoom } = initialViewRef.current;

  return (
    <div className="map">
      <div className="map-controls-container">
        <ClimateLayers layers={layers} setLayers={setLayers} />
      </div>

      <MapContainer
        className="h-full w-full"
        maxBounds={[[90, 180], [-90, -180]]}
        center={mapCenter}
        maxZoom={15}
        minZoom={3}
        zoom={mapZoom}
      >
        <MapViewSync lat={lat} lon={lon} />
        <LocationMarker lat={lat} lon={lon} />
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {OWM_OVERLAY_TILES.map(
          ([stateKey, tileId]) =>
            layers[stateKey] && (
              <TileLayer
                key={stateKey}
                url={`https://tile.openweathermap.org/map/${tileId}/{z}/{x}/{y}.png?appid=${id}`}
              />
            )
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
