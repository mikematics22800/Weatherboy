import { useContext, useMemo, useState } from "react"
import { Context } from "./WeatherContext"
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { dewPointCelsius, dewPointFahrenheit, kToC, kToF } from "../libs/conversions"

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
Chart.defaults.color = "white"

const TEMP_AXIS_RANGE_F = { min: -150, max: 150, step: 50 }
const TEMP_AXIS_RANGE_C = { min: -75, max: 75, step: 25 }
const PRESSURE_AXIS_RANGE = { min: 950, max: 1050, step: 50 }

const TempChart = () => {
  const { forecast } = useContext(Context)
  const [unit, setUnit] = useState("F")
  const useFahrenheit = unit === "F"
  const unitLabel = useFahrenheit ? "°F" : "°C"

  const { data, options } = useMemo(() => {
    const list = forecast?.list ?? []

    const temps = list.map((period) =>
      useFahrenheit ? kToF(period.main.temp) : kToC(period.main.temp)
    )

    const dewPoints = list.map((period) =>
      useFahrenheit
        ? dewPointFahrenheit(period.main.temp, period.main.humidity)
        : dewPointCelsius(period.main.temp, period.main.humidity)
    )

    const pressure = list.map((period) => period.main.pressure)

    const dates = list.map((period) => {
      const date = new Date(period.dt * 1000)
      const day = date.getDate()
      const month = date.getMonth() + 1
      return `${month}/${day}`
    })

    const tempAxisRange = useFahrenheit ? TEMP_AXIS_RANGE_F : TEMP_AXIS_RANGE_C

    return {
      data: {
        labels: dates,
        datasets: [
          {
            label: `Temperature (${unitLabel})`,
            data: temps,
            borderColor: "lime",
            backgroundColor: "white",
            yAxisID: "y",
            pointRadius: 2,
          },
          {
            label: `Dew Point (${unitLabel})`,
            data: dewPoints,
            borderColor: "gold",
            backgroundColor: "white",
            yAxisID: "y",
            pointRadius: 2,
          },
          {
            label: "Air Pressure (mb)",
            data: pressure,
            borderColor: "aqua",
            backgroundColor: "white",
            yAxisID: "y1",
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              color: "white",
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            min: tempAxisRange.min,
            max: tempAxisRange.max,
            ticks: {
              display: true,
              stepSize: tempAxisRange.step,
              callback: (value) => value,
            },
            title: {
              display: false,
            },
            grid: {
              color: "white",
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            min: PRESSURE_AXIS_RANGE.min,
            max: PRESSURE_AXIS_RANGE.max,
            ticks: {
              display: true,
              stepSize: PRESSURE_AXIS_RANGE.step,
              callback: (value) => value,
            },
            title: {
              display: false,
            },
            grid: {
              drawOnChartArea: false,
              color: "white",
            },
          },
        },
      },
    }
  }, [forecast, unitLabel, useFahrenheit])

  return (
    <div className="chart-container">
      <div className="chart-toolbar">
        <div className="chart-unit-toggle nav-buttons">
          <button
            type="button"
            className={`nav-button${useFahrenheit ? " nav-button--selected" : ""}`}
            onClick={() => setUnit("F")}
            aria-pressed={useFahrenheit}
          >
            °F
          </button>
          <button
            type="button"
            className={`nav-button${!useFahrenheit ? " nav-button--selected" : ""}`}
            onClick={() => setUnit("C")}
            aria-pressed={!useFahrenheit}
          >
            °C
          </button>
        </div>
      </div>
      <div className="chart-canvas">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

export default TempChart
