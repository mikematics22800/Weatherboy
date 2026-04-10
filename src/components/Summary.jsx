import { useMemo } from "react"
import { buildMeteorologistFiveDaySummary } from "../utils/forecastSummary"

/**
 * @param {Object} props
 * @param {object | null | undefined} props.forecast — raw OpenWeather 5-day /forecast JSON
 */
export default function Summary({ forecast }) {
  const text = useMemo(
    () => buildMeteorologistFiveDaySummary(forecast),
    [forecast]
  )

  if (!text) {
    return null
  }

  return (
    <section className="forecast-summary" aria-label="Five-day forecast summary">
      <div className="forecast-summary__text">
        <h2 className="forecast-summary__title">5-Day Forecast Summary</h2>
        <hr className="my-2"/>
        <p>{text}</p>
      </div>
    </section>
  )
}
