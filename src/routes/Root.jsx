import { createContext } from "react"
import { useState, useEffect } from "react"
import { fetchCurrentWeather, fetchWeatherForecast } from "../libs/apis"
import { Link, Outlet } from "react-router-dom"
import { Tooltip } from "@mui/material"
import { Public, Home } from "@mui/icons-material"
import logo from "../images/logo.png"

export const Context = createContext()

const Root = () => {
  const [lat, setLat] = useState(null)
  const [lon, setLon] = useState(null)
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)

  const value = { current, forecast, setLat, setLon }

  const getCoords = () => {
    navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
      setLat(latitude)
      setLon(longitude)
    },
    (error) => {
      setLat(38.9072)
      setLon(-77.0369)
    })
  }

  useEffect(() => {
    getCoords()
  }, [])

  useEffect(() => {
    if (lat && lon) {
      fetchCurrentWeather(lat, lon).then((data) => {
        setCurrent(data)
      })
      fetchWeatherForecast(lat, lon).then((data) => {
        setForecast(data)
      })
    }
  }, [lat, lon])

  return (
    <Context.Provider value={value}>
      <div id="root">
        <nav>
          <div className="sm:flex gap-2 items-center hidden">
            <h1>Weatherboy</h1>
            <img src={logo} alt="logo"/>
          </div>
          <div className="flex items-center gap-20 text-white">
            <Tooltip title="Home" placement="bottom" arrow>
              <Link to="/">
                <Home className='!text-5xl hover:text-[aqua]'/>
              </Link>
            </Tooltip>
            <Tooltip title="Weather Map" placement="bottom" arrow>
              <Link to="map">
                <Public className='!text-5xl hover:text-[aqua]'/>
              </Link>
            </Tooltip>
          </div>
        </nav>
        <Outlet/>
      </div>
    </Context.Provider>
  )
}

export default Root