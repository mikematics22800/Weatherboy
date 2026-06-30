'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Context } from './WeatherContext';
import { locationPinDataUrl } from '../libs/mapUtils';
import { loadCesium } from '../libs/loadCesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

const OWM_OVERLAY_TILES = [
  ['clouds', 'clouds_new'],
  ['precip', 'precip_new'],
  ['temp', 'temp_new'],
  ['wind', 'wind_new'],
  ['pressure', 'pressure_new'],
];

const CITY_FOCUS_ZOOM = 11;

const leafletZoomToDistance = (zoom) => 100_000_000 / 2 ** zoom;

const GLOBE_MIN_ZOOM_DISTANCE = leafletZoomToDistance(10);
const GLOBE_MAX_ZOOM_DISTANCE = leafletZoomToDistance(3);
const GLOBE_MAX_ZOOM_DISTANCE_MOBILE = GLOBE_MAX_ZOOM_DISTANCE * 2;
const GLOBE_INITIAL_HEIGHT = leafletZoomToDistance(4);
const LOCATION_ENTITY_ID = 'weather-location';

const isMobileViewport = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches;

const isOverGlobe = (viewer, Cesium, position) => {
  const ray = viewer.camera.getPickRay(position);
  if (!ray) return false;
  return Cesium.defined(viewer.scene.globe.pick(ray, viewer.scene));
};

const Globe = ({ layers }) => {
  const { lat, lon } = useContext(Context);
  const owmKey = import.meta.env.VITE_OWM_KEY ?? import.meta.env.NEXT_PUBLIC_OWM_KEY;

  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const cesiumRef = useRef(null);
  const overlayLayersRef = useRef([]);
  const hasFlownRef = useRef(false);

  const [viewerReady, setViewerReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let isDragging = false;
    let clickHandler = null;

    const initViewer = async () => {
      const Cesium = await loadCesium();
      if (cancelled || !containerRef.current) return;

      cesiumRef.current = Cesium;

      const viewer = new Cesium.Viewer(container, {
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        selectionIndicator: false,
        infoBox: false,
        terrain: undefined,
        skyBox: false,
        skyAtmosphere: false,
        contextOptions: {
          webgl: {
            alpha: true,
          },
        },
        baseLayer: new Cesium.ImageryLayer(
          new Cesium.UrlTemplateImageryProvider({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            credit: 'OpenStreetMap contributors',
          }),
        ),
      });

      viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
      viewer.scene.globe.enableLighting = false;
      viewer.cesiumWidget.canvas.style.background = 'transparent';
      viewer.cesiumWidget.canvas.style.cursor = 'default';

      const cameraController = viewer.scene.screenSpaceCameraController;
      cameraController.minimumZoomDistance = GLOBE_MIN_ZOOM_DISTANCE;
      cameraController.maximumZoomDistance = isMobileViewport()
        ? GLOBE_MAX_ZOOM_DISTANCE_MOBILE
        : GLOBE_MAX_ZOOM_DISTANCE;
      cameraController.enableRotate = false;
      cameraController.enableTranslate = false;
      cameraController.enableTilt = false;

      const updateInteractionState = (position) => {
        const onGlobe = isOverGlobe(viewer, Cesium, position);

        cameraController.enableRotate = onGlobe;
        cameraController.enableTranslate = onGlobe;
        cameraController.enableTilt = onGlobe;

        viewer.cesiumWidget.canvas.style.cursor = onGlobe
          ? isDragging
            ? 'grabbing'
            : 'grab'
          : 'default';
      };

      viewer.cesiumWidget.creditContainer.classList.add('cesium-credit-hidden');

      const initialLon = lon != null ? Number(lon) : -60;
      const initialLat = lat != null ? Number(lat) : 30;
      const initialHeight =
        lat != null && lon != null
          ? leafletZoomToDistance(CITY_FOCUS_ZOOM)
          : GLOBE_INITIAL_HEIGHT;

      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(initialLon, initialLat, initialHeight),
      });

      clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      clickHandler.setInputAction((movement) => {
        if (!isDragging) {
          updateInteractionState(movement.endPosition);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      clickHandler.setInputAction((movement) => {
        if (isOverGlobe(viewer, Cesium, movement.position)) {
          isDragging = true;
          viewer.cesiumWidget.canvas.style.cursor = 'grabbing';
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
      clickHandler.setInputAction((movement) => {
        isDragging = false;
        updateInteractionState(movement.position);
      }, Cesium.ScreenSpaceEventType.LEFT_UP);

      viewerRef.current = viewer;
      setViewerReady(true);
    };

    initViewer();

    return () => {
      cancelled = true;
      setViewerReady(false);
      clickHandler?.destroy();
      overlayLayersRef.current = [];
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
      viewerRef.current = null;
      cesiumRef.current = null;
      hasFlownRef.current = false;
    };
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    const Cesium = cesiumRef.current;
    if (!viewerReady || !viewer || !Cesium || viewer.isDestroyed()) return;

    overlayLayersRef.current.forEach((layer) => {
      viewer.imageryLayers.remove(layer, false);
    });
    overlayLayersRef.current = [];

    if (!owmKey) return;

    OWM_OVERLAY_TILES.forEach(([stateKey, tileId]) => {
      if (!layers[stateKey]) return;

      const layer = viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: `https://tile.openweathermap.org/map/${tileId}/{z}/{x}/{y}.png?appid=${owmKey}`,
        }),
      );
      layer.alpha = 0.65;
      overlayLayersRef.current.push(layer);
    });
  }, [viewerReady, layers, owmKey]);

  useEffect(() => {
    const viewer = viewerRef.current;
    const Cesium = cesiumRef.current;
    if (!viewerReady || !viewer || !Cesium || viewer.isDestroyed()) return;
    if (lat == null || lon == null) return;

    const la = Number(lat);
    const lo = Number(lon);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) return;

    const existing = viewer.entities.getById(LOCATION_ENTITY_ID);
    if (existing) {
      viewer.entities.remove(existing);
    }

    viewer.entities.add({
      id: LOCATION_ENTITY_ID,
      position: Cesium.Cartesian3.fromDegrees(lo, la),
      billboard: {
        image: locationPinDataUrl,
        width: 28,
        height: 36,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
  }, [lat, lon, viewerReady]);

  useEffect(() => {
    const viewer = viewerRef.current;
    const Cesium = cesiumRef.current;
    if (!viewerReady || !viewer || !Cesium || viewer.isDestroyed()) return;
    if (lat == null || lon == null) return;

    const la = Number(lat);
    const lo = Number(lon);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) return;

    if (!hasFlownRef.current) {
      hasFlownRef.current = true;
      return;
    }

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lo, la, leafletZoomToDistance(CITY_FOCUS_ZOOM)),
      duration: 0.75,
    });
  }, [lat, lon, viewerReady]);

  return (
    <div className="map relative">
      <div ref={containerRef} className="h-full w-full" />
      {!viewerReady && (
        <div className="globe-loading-overlay loading-container bg-blue-800/50">
          <CircularProgress size="5rem" className="loading-spinner" />
        </div>
      )}
    </div>
  );
};

export default Globe;
