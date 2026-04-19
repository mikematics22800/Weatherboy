import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import TempChart from "./TempChart"
import { kToF, getTime, getDay, dewPointFahrenheit } from "../libs/conversions"

const icon = (weatherIcon, size) => `https://openweathermap.org/img/wn/${weatherIcon}${size}.png`

/** Same intro key as last run → skip stagger (e.g. Map/Metrics remount, React Strict Mode 2nd pass). */
let lastForecastCardsIntroKey = null

const Metrics = ({ forecast, introKey }) => {
  const forecastScrollRef = useRef(null)

  useLayoutEffect(() => {
    const root = forecastScrollRef.current
    if (!root || !forecast?.list?.length || !introKey) return

    const cards = root.querySelectorAll(".period-card")
    if (!cards.length) return

    const skipIntro = lastForecastCardsIntroKey === introKey
    if (!skipIntro) {
      lastForecastCardsIntroKey = introKey
    }

    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (reducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0 })
        return
      }
      if (skipIntro) {
        gsap.set(cards, { opacity: 1, y: 0 })
        return
      }
      gsap.fromTo(
        cards,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.26,
          ease: "power2.out",
          stagger: { each: 0.028, from: "start" },
          overwrite: "auto",
        }
      )
    }, root)

    return () => ctx.revert()
  }, [introKey])

  const periods = forecast?.list.map((period, i) => {
    const date = new Date(period.dt * 1000)
    const date3HrsLater = new Date((period.dt + 10800) * 1000)
    return (
      <div className="period-card" key={i}>
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
              <span className="detail-value">{kToF(period.main.temp)}°F</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Dew Point</span>
              <span className="detail-value">
                {dewPointFahrenheit(period.main.temp, period.main.humidity)}°F
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
  })

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8">
      <div className="chart-container">
        <TempChart />
      </div>

      <div id="forecast" className="forecast-section">
        <div className="forecast-container">
          <div className="forecast-scroll" ref={forecastScrollRef}>
            {periods}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Metrics
