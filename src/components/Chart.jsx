import { useContext } from 'react';
import { Context } from './App'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { kToF, dewPointFahrenheit } from "../libs/conversions";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
Chart.defaults.color = 'white'; 

const TempChart = () => {
  const { forecast } = useContext(Context)

  const temps = forecast?.list.map((period) => {
    return kToF(period.main.temp)
  })

  const pressure = forecast?.list.map((period) => {
    return period.main.pressure
  })

  const dewPoints = forecast?.list.map((period) => {
    return dewPointFahrenheit(period.main.temp, period.main.humidity)
  })

  const dates = forecast?.list.map((period) => {
    const date = new Date(period.dt * 1000)
    const day = date.getDate()
    const month = date.getMonth() + 1
    return `${month}/${day}`
  })
  
  const data = {
    labels: dates,
    datasets: [
      {
        label: "Temperature (°F)",
        data: temps,
        borderColor: "lime",
        backgroundColor: "white",
        yAxisID: "y",
        pointRadius: 2
      },
      {
        label: "Dew Point (°F)",
        data: dewPoints,
        borderColor: "gold",
        backgroundColor: "white",
        yAxisID: "y",
        pointRadius: 2
      },
      {
        label: "Air Pressure (mb)",
        data: pressure,
        borderColor: "aqua",
        backgroundColor: "white",
        yAxisID: "y1",
        pointRadius: 2
      },
    ]
  }

  const options = {
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
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
      },
    },
  }
  return (
      <Line data={data} options={options}/>
  )
}

export default TempChart