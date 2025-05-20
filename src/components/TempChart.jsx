import { useContext } from 'react';
import { Context } from '../routes/Root'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { kToF } from "../libs/conversions";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
Chart.defaults.color = 'white'; 

const TempChart = () => {
  const { forecast } = useContext(Context)

  const temps = forecast?.list.map((period) => {
    return kToF(period.main.temp)
  })

  const humidity = forecast?.list.map((period) => {
    return period.main.humidity
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
        label: "Humidity (%)",
        data: humidity,
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