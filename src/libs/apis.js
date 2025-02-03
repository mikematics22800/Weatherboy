const owmApiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY

export const fetchCurrentWeather = async (lat, lon) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${owmApiKey}`)
    const data = await response.json();
    return data
  } catch(err) {
    console.log(err)
  }
}

export const fetchWeatherForecast = async (lat, lon) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${owmApiKey}`)
    const data = await response.json();
    return data
  } catch(err) {
    console.log(err)
  }
}