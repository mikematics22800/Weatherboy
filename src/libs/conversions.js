export const kToF = (k) => {
  const f = Math.round((k - 273.15) * 9/5 + 32)
  return f
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

export const getTime = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let meridiem = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const time = `${hours}:${minutes} ${meridiem}`;
  return time;
}
