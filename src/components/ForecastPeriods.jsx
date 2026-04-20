import { useContext } from "react"
import ForecastPeriod from "./ForecastPeriod"
import { Context } from "./WeatherContext"

const ForecastPeriods = () => {
  const { forecast } = useContext(Context)
  const list = forecast?.list ?? []
  return list.map((period, i) => (
    <div key={i} className="forecast-period-item">
      <ForecastPeriod period={period} />
    </div>
  ))
}

export default ForecastPeriods
