let loadPromise = null;

export function loadCesium() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Cesium can only load in the browser'));
  }

  if (window.Cesium) {
    return Promise.resolve(window.Cesium);
  }

  if (!loadPromise) {
    const base = import.meta.env.BASE_URL;
    window.CESIUM_BASE_URL = `${base}cesium/`;
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${base}cesium/Cesium.js`;
      script.async = true;
      script.onload = () => {
        if (window.Cesium) {
          resolve(window.Cesium);
          return;
        }
        reject(new Error('Cesium failed to initialize'));
      };
      script.onerror = () => reject(new Error(`Failed to load ${base}cesium/Cesium.js`));
      document.head.appendChild(script);
    });
  }

  return loadPromise;
}
