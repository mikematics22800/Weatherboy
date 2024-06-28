import { useContext } from "react"
import { Context } from "./Root"
import { CircularProgress } from "@mui/material"
import { degToDir, kToF, getTime } from "../libs/conversions"
import Searchbar from "../components/Searchbar"
import TempChart from "../components/TempChart"

function Home() {

  const icon = (icon, size) => {
    return `https://openweathermap.org/img/wn/${icon}${size}.png`
  }

  const { current, forecast } = useContext(Context);

  const periods = forecast?.list.map((period, i) => {
    const date = new Date(period.dt * 1000)
    const date3HrsLater = new Date((period.dt + 10800) * 1000)
    return (
      <div className="period" key={i}>
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
    <div id="home">
      <Searchbar/>
      {current && forecast ? (
        <div id="weather">
          <div id="current">
            <h1>Currently at {current.name}, {current.sys.country}</h1>
            <div className="flex items-center">
              <img src={icon(current.weather[0].icon, '@2x')}/>
              <h2>{current.weather[0].description.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</h2>
            </div>
            <div className="flex flex-wrap sm:gap-4 gap-2">
              <h2>Temperature: {kToF(current.main.temp)}°F</h2>
              <h2>Wind: {degToDir(current.wind.deg)} at {Math.round(current.wind.speed)} mph</h2>
              <h2>Humidity: {current.main.humidity}%</h2>
              <h2>Heat Index: {kToF(current.main.feels_like)}°F</h2>
              <h2>Air Pressure: {current.main.pressure} mb</h2>
            </div>
          </div>
          <div id="forecast">
            <h1>Five Day Forecast for {forecast.city.name}, {forecast.city.country}</h1>
            <TempChart forecast={forecast}/>
            <div id="periods">
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
  )
}

export default Home
