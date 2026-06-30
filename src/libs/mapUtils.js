import { degToDir, dewPointFahrenheit, kToF } from './conversions';

export const locationPinDataUrl = (() => {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="28" height="36">' +
    '<path fill="#2563eb" stroke="#fff" stroke-width="1.25" d="M12 1C6.92 1 3 4.92 3 10c0 6.2 9 21 9 21s9-14.8 9-21C21 4.92 17.08 1 12 1z"/>' +
    '<circle cx="12" cy="10" r="3.25" fill="#fff"/></svg>';
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
})();

export function buildWeatherPopupHtml(current) {
  if (!current) return '';

  const place = current.name?.trim() || 'This location';
  const description = current.weather[0].description
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ');
  const temp = `${kToF(current.main.temp)}°F`;
  const wind = `${degToDir(current.wind.deg)} ${Math.round(current.wind.speed)} mph`;
  const dew =
    current.main.dew_point != null
      ? `${kToF(current.main.dew_point)}°F`
      : `${dewPointFahrenheit(current.main.temp, current.main.humidity)}°F`;

  return (
    `<div class="popup-panel">` +
    `<h1>${place}</h1>` +
    `<ul>` +
    `<li>${description}</li>` +
    `<li>Temperature: ${temp}</li>` +
    `<li>Wind: ${wind}</li>` +
    `<li>Dew Point: ${dew}</li>` +
    `<li>Pressure: ${current.main.pressure} mb</li>` +
    `</ul>` +
    `</div>`
  );
}
