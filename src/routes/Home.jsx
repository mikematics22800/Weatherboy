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
        <div className="flex items-center justify-between">
         <h2>{getTime(date)} - {getTime(date3HrsLater)}</h2>
          <img className="w-16 h-16" src={icon(period.weather[0].icon, '@4x')}/>
        </div>
        <div className="flex flex-col gap-1">
          <h2>{period.weather[0].description.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</h2>
          <div className="flex justify-between">
            <h2>High/Low</h2>
            <h2>{kToF(period.main.temp_max)}/{kToF(period.main.temp_min)}°F</h2>
          </div>
          <div className="flex justify-between">
            <h2>Humidity</h2>
            <h2>{period.main.humidity}%</h2>
          </div>
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
            <div className="flex items-center justify-between">
              <h1>Currently at {current.name}, {current.sys.country}</h1>
              <img className="h-40 w-40" src={icon(current.weather[0].icon, '@4x')}/>
            </div>
            <div className="flex flex-wrap sm:gap-4 gap-2 w-full justify-between items-center">
              <h2>{current.weather[0].description.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</h2>
              <h2>Temperature {kToF(current.main.temp)}°F</h2>
              <h2>Wind {degToDir(current.wind.deg)} at {Math.round(current.wind.speed)} mph</h2>
              <h2>Humidity {current.main.humidity}%</h2>
              <h2>Heat Index {kToF(current.main.feels_like)}°F</h2>
              <h2>Air Pressure {current.main.pressure} mb</h2>
            </div>
          </div>
          <div id="forecast">
            <h1>Five Day Forecast for {forecast.city.name}, {forecast.city.country}</h1>
            <div className="w-full bg-[skyblue] p-5 rounded-lg">
              <TempChart/>
            </div>
            <div id="periods">
              {periods}
            </div>
          </div>
        </div>
      ) : (
        <div id="loader">
          <CircularProgress size={"5rem"}/>
        </div>
      )}
    </div>
  )
}

export default Home
