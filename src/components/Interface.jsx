import { useContext } from "react"
import { degToDir, dewPointFahrenheit, kToF } from "../libs/conversions"
import Searchbar from "./Searchbar"
import rainJpg from "../images/rain.jpg"
import Chart from "./Chart"
import ForecastPeriods from "./ForecastPeriods"
import { Context, InterfaceLayoutContext } from "./WeatherContext"

const icon = (weatherIcon, size) => `https://openweathermap.org/img/wn/${weatherIcon}${size}.png`

const Interface = () => {
  const { current, locationLine, showMap, setShowMap } = useContext(Context)
  const { mobileRainBackdrop, hideMapToggle } = useContext(InterfaceLayoutContext)
  return (
    <div
      className={mobileRainBackdrop ? "interface interface--mobile-rain" : "interface"}
      style={mobileRainBackdrop ? { backgroundImage: `url(${rainJpg})` } : undefined}
    >
      <div className="drag-handle" />
      <Searchbar />
      <div className="weather-overview">
        <div id="current" className="current-weather">
          <div className="location-info">
            <p className="location-text">{locationLine}</p>
          </div>
          <div className="main-weather">
            <img className="main-icon" src={icon(current.weather[0].icon, "@4x")} alt="weather" />
            <h1 className="current-weather-desc">
              {current.weather[0].description
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
                .join(" ")}
            </h1>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-heading">
                <p className="stat-label">Temperature</p>
              </div>
              <p className="stat-value">{kToF(current.main.temp)}°F</p>
            </div>
            <div className="stat-card">
              <div className="stat-heading justify-end">
                <p className="stat-label">Wind</p>
              </div>
              <p className="stat-value text-right">
                {degToDir(current.wind.deg)} {Math.round(current.wind.speed)} mph
              </p>
            </div>
            <div className="stat-card">
              <div className="stat-heading">
                <p className="stat-label">Dew Point</p>
              </div>
              <p className="stat-value">
                {current.main.dew_point != null
                  ? `${kToF(current.main.dew_point)}°F`
                  : `${dewPointFahrenheit(current.main.temp, current.main.humidity)}°F`}
              </p>
            </div>
            <div className="stat-card">
              <div className="stat-heading justify-end">
                <p className="stat-label">Air Pressure</p>
              </div>
              <p className="stat-value text-right">{current.main.pressure} mb</p>
            </div>
          </div>
        </div>
        {!hideMapToggle ? (
          <button type="button" className="button" onClick={() => setShowMap((prev) => !prev)} aria-pressed={showMap}>
            {showMap ? "5-Day Forecast" : "Weather Map"}
          </button>
        ) : null}
      </div>
      <div className="lg:hidden w-full flex flex-col gap-8">
        <Chart />
        <div className="flex flex-wrap gap-4">        
          <ForecastPeriods />
        </div>
      </div>
    </div>
  )
}

export default Interface
