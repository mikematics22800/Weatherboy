import { createContext } from "react"
import { useState, useEffect } from "react"
import { fetchCurrentWeather, fetchWeatherForecast } from "../libs/apis"
import { Outlet } from "react-router-dom"
import { useLoadScript } from "@react-google-maps/api"

export const Context = createContext()

const GOOGLE_MAPS_LIBRARIES = ["places"]

const Root = () => {
  const [lat, setLat] = useState(null)
  const [lon, setLon] = useState(null)
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)

  const { isLoaded: mapsReady } = useLoadScript({
    id: "weatherboy-google-maps",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

  const value = { current, forecast, setLat, setLon, mapsReady }

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
        <Outlet />
      </div>
    </Context.Provider>
  )
}

export default Root