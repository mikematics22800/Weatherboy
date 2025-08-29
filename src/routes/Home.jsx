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
      <div className="period-card" key={i}>
        <div className="period-header">
          <p className="period-day">{getDay(date)}</p>
          <p className="period-time">{getTime(date)}-{getTime(date3HrsLater)}</p>
        </div>
        <div className="period-weather">
          <div className="weather-main">
            <p className="weather-desc">{period.weather[0].description.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</p>
            <img className="weather-icon" src={icon(period.weather[0].icon, '@4x')} alt="weather"/>
          </div>
          <div className="weather-details">
            <div className="detail-row">
              <span className="detail-label">High</span>
              <span className="detail-value">{kToF(period.main.temp_max)}°F</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Low</span>
              <span className="detail-value">{kToF(period.main.temp_min)}°F</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{period.main.humidity}%</span>
            </div>
          </div>
        </div>
      </div>
    )
  })

  return (
    <div id="home" style={{backgroundImage: `url(${rain})`}}>
      <div className="overlay"/>
        <Searchbar/>
        
        {current && forecast ? (
          <div id="weather"> 
            <div id="current" className="current-weather">
              <div className="location-info">
                <p className="location-text">{current.name}, {current.sys.country}</p>
                <p className="weather-summary">{current.weather[0].description.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</p>
              </div>
              
              <div className="main-weather">
                <img className="main-icon" src={icon(current.weather[0].icon, '@4x')} alt="weather"/>
                <div className="temperature-display">
                  <span className="temp-value">{kToF(current.main.temp)}°</span>
                  <span className="temp-unit">F</span>
                </div>
              </div>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🌡️</div>
                  <div className="stat-content">
                    <p className="stat-label">Feels Like</p>
                    <p className="stat-value">{kToF(current.main.feels_like)}°F</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💨</div>
                  <div className="stat-content">
                    <p className="stat-label">Wind</p>
                    <p className="stat-value">{degToDir(current.wind.deg)} {Math.round(current.wind.speed)} mph</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💧</div>
                  <div className="stat-content">
                    <p className="stat-label">Humidity</p>
                    <p className="stat-value">{current.main.humidity}%</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <p className="stat-label">Pressure</p>
                    <p className="stat-value">{current.main.pressure} mb</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div id="forecast" className="forecast-section">
              <h2 className="forecast-title">5-Day Forecast</h2>
              <div className="forecast-container">
                <div className="forecast-scroll">
                  {periods}
                </div>
              </div>
              <div className="chart-container">
                <TempChart/>
              </div>
            </div>
          </div>
        ) : (
          <div id="loader" className="loading-container">
            <CircularProgress size={"5rem"} className="loading-spinner"/>
            <p className="loading-text">Loading weather data...</p>
          </div>
        )}
    </div>
  )
}

export default Home
