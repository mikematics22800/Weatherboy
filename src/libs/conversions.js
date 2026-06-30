export const kToF = (k) => {
  const f = Math.round((k - 273.15) * 9/5 + 32)
  return f
}

export const kToC = (k) => Math.round(k - 273.15)

/** Format a Kelvin temperature as `X°F/Y°C`. */
export const formatTempK = (k) => `${kToF(k)}°F/${kToC(k)}°C`

/** Dew point in °C from temp (K) and relative humidity (%). */
export const dewPointCelsius = (tempK, rhPercent) => {
  const tempC = tempK - 273.15
  const rh = Math.min(100, Math.max(0.1, rhPercent))
  const a = 17.27
  const b = 237.7
  const gamma = (a * tempC) / (b + tempC) + Math.log(rh / 100)
  const dewC = (b * gamma) / (a - gamma)
  return Math.round(dewC)
}

export const dewPointFahrenheit = (tempK, rhPercent) => {
  const tempC = tempK - 273.15
  const rh = Math.min(100, Math.max(0.1, rhPercent))
  const a = 17.27
  const b = 237.7
  const gamma = (a * tempC) / (b + tempC) + Math.log(rh / 100)
  const dewC = (b * gamma) / (a - gamma)
  return Math.round(dewC * (9 / 5) + 32)
}

/** Format dew point (from temp K + humidity) as `X°F/Y°C`. */
export const formatDewPointK = (tempK, rhPercent) => {
  const f = dewPointFahrenheit(tempK, rhPercent)
  const c = Math.round((f - 32) * (5 / 9))
  return `${f}°F/${c}°C`
}

export const degToDir = (deg) => {
  let dir;
  if (deg >= 348.75 || deg < 11.25) {
      dir = 'N';
  } else if (deg < 33.75) {
      dir = 'NNE';
  } else if (deg < 56.25) {
      dir = 'NE';
  } else if (deg < 78.75) {
      dir = 'ENE';
  } else if (deg < 101.25) {
      dir = 'E';
  } else if (deg < 123.75) {
      dir = 'ESE';
  } else if (deg < 146.25) {
      dir = 'SE';
  } else if (deg < 168.75) {
      dir = 'SSE';
  } else if (deg < 191.25) {
      dir = 'S';
  } else if (deg < 213.75) {
      dir = 'SSW';
  } else if (deg < 236.25) {
      dir = 'SW';
  } else if (deg < 258.75) {
      dir = 'WSW';
  } else if (deg < 281.25) {
      dir = 'W';
  } else if (deg < 303.75) {
      dir = 'WNW';
  } else if (deg < 326.25) {
      dir = 'NW';
  } else {
      dir = 'NNW';
  }
  return dir;
};

export const getDay = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

export const getTime = (date) => {
  let hours = date.getHours();
  let meridiem = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const time = `${hours}${meridiem}`;
  return time;
}
