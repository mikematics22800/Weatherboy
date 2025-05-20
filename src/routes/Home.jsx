import { useContext } from "react"
import { Context } from "./Root"
import { CircularProgress } from "@mui/material"
import { degToDir, kToF, getTime, getDay } from "../libs/conversions"
import Searchbar from "../components/Searchbar"
import TempChart from "../components/TempChart"
import rain from "../images/rain.jpg"

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
          <p>{getDay(date)}</p>
          <p>{getTime(date)}-{getTime(date3HrsLater)}</p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <p>{period.weather[0].description.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</p>
            <img className="w-10" src={icon(period.weather[0].icon, '@4x')}/>
          </div>
          <div className="flex justify-between">
            <p>High</p>
            <p>{kToF(period.main.temp_max)}°F</p>
          </div>
          <div className="flex justify-between">
            <p>Low</p>
            <p>{kToF(period.main.temp_min)}°F</p>
          </div>
          <div className="flex justify-between">
            <p>Humidity</p>
            <p>{period.main.humidity}%</p>
          </div>
        </div>
      </div>
    )
  })

  return (
    <div id="home" style={{backgroundImage: `url(${rain})`}}>
      <Searchbar/>
      <div className="fixed top-0 left-0 bg-blue-950 bg-opacity-50 w-screen h-screen"/>
      {current && forecast ? (
        <div id="weather"> 
          <div id="current">
            <div className="flex flex-col items-center">
              <p className="text-center">Currently at {current.name}, {current.sys.country}</p>
              <div className="flex gap-4 items-center">
                <p>{current.weather[0].description.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</p>
                <img className="w-20" src={icon(current.weather[0].icon, '@4x')}/>
              </div>
            </div>
            <div className="stats">
              <div className="stat"><p>Temperature</p><p>{kToF(current.main.temp)}°F</p></div>
              <div className="stat"><p>Wind</p><p>{degToDir(current.wind.deg)} at {Math.round(current.wind.speed)} mph</p></div>
              <div className="stat"><p>Humidity</p><p>{current.main.humidity}%</p></div>
              <div className="stat"><p>Heat Index</p><p>{kToF(current.main.feels_like)}°F</p></div>
              <div className="stat"><p>Air Pressure</p><p>{current.main.pressure} mb</p></div> 
            </div>
          </div>
          <div id="forecast">
            <p className="text-lg text-center">Five Day Forecast</p>
            <div className="overflow-scroll w-full">
              <div id="periods">
                {periods}
              </div>
            </div>
            <div className="chart">
              <TempChart/>
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
