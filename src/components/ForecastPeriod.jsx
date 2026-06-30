import { formatDewPointK, formatTempK, getTime, getDay } from "../libs/conversions"

const icon = (weatherIcon, size) => `https://openweathermap.org/img/wn/${weatherIcon}${size}.png`

const ForecastPeriod = ({ period }) => {
  const date = new Date(period.dt * 1000)
  const date3HrsLater = new Date((period.dt + 10800) * 1000)
  return (
    <div className="period-card">
      <div className="period-header">
        <p className="period-day">{getDay(date)}</p>
        <p className="period-time">
          {getTime(date)}-{getTime(date3HrsLater)}
        </p>
      </div>
      <div className="period-weather">
        <div className="weather-main">
          <p className="weather-desc">
            {period.weather[0].description
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
              .join(" ")}
          </p>
          <img className="weather-icon" src={icon(period.weather[0].icon, "@4x")} alt="weather" />
        </div>
        <div className="weather-details">
          <div className="detail-row">
            <span className="detail-label">Temperature</span>
            <span className="detail-value">{formatTempK(period.main.temp)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Dew Point</span>
            <span className="detail-value">
              {formatDewPointK(period.main.temp, period.main.humidity)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Air Pressure</span>
            <span className="detail-value">{period.main.pressure} mb</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForecastPeriod
