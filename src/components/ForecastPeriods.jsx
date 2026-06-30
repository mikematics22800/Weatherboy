import { forwardRef, useContext } from "react"
import ForecastPeriod from "./ForecastPeriod"
import { Context } from "./WeatherContext"

const ForecastPeriods = forwardRef(function ForecastPeriods(_props, ref) {
  const { forecast } = useContext(Context)
  const list = forecast?.list ?? []

  return (
    <div ref={ref} className="forecast-scroll">
      {list.map((period, i) => (
        <div key={i} className="forecast-period-item">
          <ForecastPeriod period={period} />
        </div>
      ))}
    </div>
  )
})

export default ForecastPeriods
