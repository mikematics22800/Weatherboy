import { useContext } from "react"
import { Air, Speed, Thermostat, WaterDrop } from "@mui/icons-material"
import { degToDir, formatDewPointK, formatTempK } from "../libs/conversions"
import Searchbar from "./Searchbar"
import Chart from "./Chart"
import ForecastPeriods from "./ForecastPeriods"
import { Context, InterfaceLayoutContext } from "./WeatherContext"
import { useMobileSheetDrag } from "./hooks/useMobileSheetDrag"

const icon = (weatherIcon, size) => `https://openweathermap.org/img/wn/${weatherIcon}${size}.png`

const Interface = () => {
  const { current, locationLine } = useContext(Context)
  const { mobileRainBackdrop, mobileSheet } = useContext(InterfaceLayoutContext)
  const { dragHandleProps, sheetStyle, handleRef, snap } = useMobileSheetDrag(mobileSheet)

  const interfaceBody = (
    <div
      className={mobileRainBackdrop ? "interface interface--mobile-rain" : "interface"}
    >
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
                <Thermostat className="stat-metric-icon" aria-hidden="true" />
                <p className="stat-label">Temperature</p>
              </div>
              <p className="stat-value">{formatTempK(current.main.temp)}</p>
            </div>
            <div className="stat-card">
              <div className="stat-heading">
                <Air className="stat-metric-icon" aria-hidden="true" />
                <p className="stat-label">Wind</p>
              </div>
              <p className="stat-value">
                {degToDir(current.wind.deg)} {Math.round(current.wind.speed)} mph
              </p>
            </div>
            <div className="stat-card">
              <div className="stat-heading">
                <WaterDrop className="stat-metric-icon" aria-hidden="true" />
                <p className="stat-label">Dew Point</p>
              </div>
              <p className="stat-value">
                {current.main.dew_point != null
                  ? formatTempK(current.main.dew_point)
                  : formatDewPointK(current.main.temp, current.main.humidity)}
              </p>
            </div>
            <div className="stat-card">
              <div className="stat-heading">
                <Speed className="stat-metric-icon" aria-hidden="true" />
                <p className="stat-label">Air Pressure</p>
              </div>
              <p className="stat-value">{current.main.pressure} mb</p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden w-full flex flex-col gap-8">
        <Chart />
        <ForecastPeriods />
      </div>
    </div>
  )

  if (mobileSheet) {
    return (
      <div
        className={`interface-sheet${snap === "expanded" ? " interface-sheet--expanded" : ""}`}
        style={sheetStyle}
      >
        <div className="interface-panel">
          <div
            ref={handleRef}
            {...dragHandleProps}
            className={
              mobileRainBackdrop
                ? "drag-handle-container drag-handle-container--rain"
                : "drag-handle-container"
            }
          >
            <div className="drag-handle shrink-0" />
          </div>
          <div className="interface-scroll">
            {interfaceBody}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="interface-scroll">
      <div className="interface-panel">
        {interfaceBody}
      </div>
    </div>
  )
}

export default Interface
