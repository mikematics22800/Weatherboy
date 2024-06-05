import { useState, useEffect } from "react"
import { CircularProgress } from "@mui/material"
import { fetchCurrentWeather, fetchWeatherForecast, fetchTimeZone } from "./apis"
import { degToDir, kToF } from "./conversions"
import Searchbar from "./components/Searchbar"

function App() {

  const [lat, setLat] = useState(null)
  const [lon, setLon] = useState(null)
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)

  const getCoords = () => {
    navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
      setLat(latitude)
      setLon(longitude)
    })
  }

  useEffect(() => {
    getCoords()
  }, [])

  useEffect(() => {
    if (lat && lon) {
      fetchCurrentWeather(lat, lon).then((data) => {
        setCurrent(data)
      })
      fetchWeatherForecast(lat, lon).then((data) => {
        setForecast(data)
      })
    }
  }, [lat, lon])

  return (
    <div id="page">
      <header>WeatherWatch</header>
      <div id="main">
        <Searchbar setLat={setLat} setLon={setLon}/>
        {current && forecast ? (
          <div id="weather">
            <div id="current">
              <h1>Currently at {current.name}, {current.sys.country}</h1>
              <div className="flex gap-1 items-center">
                <img src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`}/>
                <h1>{current.weather[0].description.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</h1>
              </div>
              <div className="flex gap-5">
                <h2>Temperature: {kToF(current.main.temp)} °F</h2>
                <h2>Wind: {degToDir(current.wind.deg)} at {Math.round(current.wind.speed)} mph</h2>
                <h2>Humidity: {current.main.humidity} %</h2>
                <h2>Heat Index: {kToF(current.main.feels_like)} °F</h2>
                <h2>Air Pressure: {current.main.pressure} mb</h2>
              </div>
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
