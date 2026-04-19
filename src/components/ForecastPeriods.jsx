import { useContext } from "react"
import ForecastPeriod from "./ForecastPeriod"
import { Context } from "./WeatherContext"

const ForecastPeriods = () => {
  const { forecast } = useContext(Context)
  const list = forecast?.list ?? []
  return list.map((period, i) => <ForecastPeriod key={i} period={period} />)
}

export default ForecastPeriods
