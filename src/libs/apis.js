const key = import.meta.env.VITE_OWM_KEY

export const fetchCurrentWeather = async (lat, lon) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`)
    const data = await response.json();
    return data
  } catch(err) {
    console.log(err)
  }
}

export const fetchWeatherForecast = async (lat, lon) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`)
    const data = await response.json();
    console.log(data)
    return data
  } catch(err) {
    console.log(err)
  }
}

/** Region label from coordinates (e.g. US state). OpenWeather current weather does not include state. */
export const fetchReverseGeocodeRegion = async (lat, lon) => {
  if (!key) return null
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`
    )
    const data = await response.json()
    const place = Array.isArray(data) ? data[0] : null
    if (!place) return null
    return place.state || place.country || null
  } catch (err) {
    console.log(err)
    return null
  }
}