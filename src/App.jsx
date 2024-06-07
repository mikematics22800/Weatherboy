import { useState, useEffect } from "react"
import { CircularProgress } from "@mui/material"
import { fetchCurrentWeather, fetchWeatherForecast } from "./apis"
import { degToDir, kToF, getTime } from "./conversions"
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

  const icon = (icon, size) => {
    return `https://openweathermap.org/img/wn/${icon}${size}.png`
  }

  const periods = forecast?.list.map((period, i) => {
    const date = new Date(period.dt * 1000)
    const date3HrsLater = new Date((period.dt + 10800) * 1000)
    return (
      <div className="bg-blue-950 flex flex-col rounded-md p-5 w-60" key={i}>
        <h2>{getTime(date)} - {getTime(date3HrsLater)}</h2>
        <div className="flex items-center">
          <img src={icon(period.weather[0].icon, '')}/>
          <h2>{period.weather[0].description.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</h2>
        </div>
        <div className="flex flex-col gap-1">
          <h2>Temperature: {kToF(period.main.temp)}°F</h2>
          <h2>Wind: {degToDir(period.wind.deg)} at {Math.round(period.wind.speed)} mph</h2>
          <h2>Humidity: {period.main.humidity}%</h2>
          <h2>Heat Index: {kToF(period.main.feels_like)}°F</h2>
          <h2>Air Pressure: {period.main.pressure} mb</h2>
        </div>
      </div>
    )
  })

  return (
    <div id="page">
      <header>WeatherWatch</header>
      <div id="main">
        <Searchbar setLat={setLat} setLon={setLon}/>
        {current && forecast ? (
          <div id="weather">
            <div id="current">
              <h1>Currently at {current.name}, {current.sys.country}</h1>
              <div className="flex items-center">
                <img src={icon(current.weather[0].icon, '@2x')}/>
                <h1>{current.weather[0].description.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</h1>
              </div>
              <div className="flex flex-wrap gap-5">
                <h2>Temperature: {kToF(current.main.temp)}°F</h2>
                <h2>Wind: {degToDir(current.wind.deg)} at {Math.round(current.wind.speed)} mph</h2>
                <h2>Humidity: {current.main.humidity}%</h2>
                <h2>Heat Index: {kToF(current.main.feels_like)}°F</h2>
                <h2>Air Pressure: {current.main.pressure} mb</h2>
              </div>
            </div>
            <div id="forecast">
              <h1>Five Day Forecast for {forecast.city.name}, {forecast.city.country}</h1>
              <div className="flex flex-wrap gap-5">
                {periods}
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
