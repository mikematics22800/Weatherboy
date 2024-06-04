import { CircularProgress } from "@mui/material"
import { useState } from "react"
import { useEffect } from "react"

function App() {

  const [lat, setLat] = useState(null)
  const [lon, setLon] = useState(null)
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)

  const owmApiKey = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const getCoords = () => {
    navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
      setLat(latitude)
      setLon(longitude)
    })
  }

  const fetchCurrentWeather = async (lat, lon) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${owmApiKey}`)
      const data = await response.json();
      console.log(data)
      setCurrent(data)
    } catch(err) {
      console.log(err)
    }
  }

  const fetchWeatherForecast = async (lat, lon) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${owmApiKey}`)
      const data = await response.json();
      console.log(data)
      setForecast(data)
    } catch(err) {
      console.log(err)
    }
  }

  const fetchTimeZone = async (coords, timestamp) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${coords}&timestamp=${timestamp}&key=${mapsApiKey}`)
      const data = await response.json();
      console.log(data)
      return json
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getCoords()
  })

  useEffect(() => {
    if (lat && lon) {
      fetchCurrentWeather(lat, lon)
      fetchWeatherForecast(lat, lon)
    }
  }, [lat, lon])

  useEffect(() => {

  }, [lat, lon])

  return (
    <div id="page">
      <header>WeatherWatch</header>
      <div id="main">
        <div id="search">
          <input placeholder="Enter city or zip code..."/>
          <button>Search</button>
        </div>
        {current && forecast ? (
          <div id="weather">
            <div id="current">
              <h1>Currently at {forecast.city.name}, {forecast.city.country}</h1>
              <h2>Temperature: </h2>
              <h2>Wind: </h2>
              <h2>Humidity: </h2>
            </div>
            <div id="forecast">
              <h1>Five Day Forecast</h1>
              <div>

              </div>
            </div>
          </div>
        ) : (
          <div id="loader">
            <CircularProgress size={"10rem"}/>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
