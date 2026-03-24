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
      <p className="forecast-summary__text">{text}</p>
    </section>
  )
}
