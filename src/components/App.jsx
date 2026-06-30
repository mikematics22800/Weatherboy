import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import gsap from "gsap"
import { CircularProgress } from "@mui/material"
import { useLoadScript } from "@react-google-maps/api"
import { fetchCurrentWeather, fetchWeatherForecast, fetchReverseGeocodeRegion } from "../libs/apis"
import Interface from "./Interface"
import Forecast from "./Forecast"
import Map from "./Map"
import { Context, InterfaceLayoutContext } from "./WeatherContext"
import { ensureRainMirroredPattern } from "../libs/rainMirroredPattern"
import umbrellaImg from "../images/umbrella.png"

const GOOGLE_MAPS_LIBRARIES = ["places"]

const INTERFACE_LAYOUT_DESKTOP = { mobileRainBackdrop: false, mobileSheet: false }
const INTERFACE_LAYOUT_MOBILE = { mobileRainBackdrop: true, mobileSheet: true }

function App() {
  const [lat, setLat] = useState(null)
  const [lon, setLon] = useState(null)
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)
  const scopeRef = useRef(null)
  const [regionLabel, setRegionLabel] = useState(null)
  const [showMap, setShowMap] = useState(true)

  const { isLoaded: mapsReady } = useLoadScript({
    id: "weatherboy-google-maps",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

  useEffect(() => {
    ensureRainMirroredPattern().then((url) => {
      document.documentElement.style.setProperty("--rain-bg", `url("${url}")`)
    })
  }, [])

  useEffect(() => {
    if (!current?.coord) return
    const { lat, lon } = current.coord
    let cancelled = false
    setRegionLabel(null)
    fetchReverseGeocodeRegion(lat, lon).then((label) => {
      if (!cancelled) setRegionLabel(label)
    })
    return () => {
      cancelled = true
    }
  }, [current?.coord?.lat, current?.coord?.lon])

  const locationLine = useMemo(() => {
    if (!current) return ""
    const place = current.name?.trim() || "this location"
    const state = regionLabel ?? current.sys?.country ?? ""
    return state ? `Currently in ${place}, ${state}` : `Currently in ${place}`
  }, [current, regionLabel])

  const animationKey = useMemo(() => {
    if (!current || !forecast) return null
    const cityId = forecast.city?.id ?? forecast.city?.name ?? ""
    return `${current.id}-${cityId}`
  }, [current, forecast])

  const forecastCardsIntroKey = useMemo(() => {
    if (!current || !forecast?.list?.length) return null
    const cityId = forecast.city?.id ?? forecast.city?.name ?? ""
    const list = forecast.list
    const head = list[0].dt
    const tail = list[list.length - 1].dt
    return `${current.id}-${cityId}-${head}-${tail}-${list.length}`
  }, [current, forecast])

  const value = useMemo(
    () => ({
      current,
      forecast,
      setLat,
      setLon,
      mapsReady,
      lat,
      lon,
      locationLine,
      showMap,
      setShowMap,
      forecastCardsIntroKey,
    }),
    [current, forecast, mapsReady, lat, lon, locationLine, showMap, forecastCardsIntroKey]
  )

  useLayoutEffect(() => {
    const root = scopeRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      if (animationKey) {
        const mm = gsap.matchMedia()

        const clearAnimatedProps = () => {
          gsap.set(
            ".searchbar, .current-weather, .location-info > *, .main-weather .main-icon, .stat-card, .chart-container",
            { clearProps: "transform,opacity,visibility" }
          )
        }

        const runDataTimeline = (opts) => {
          const {
            ease = "power3.out",
            searchY = -20,
            currentY = 36,
            currentScale = 0.97,
            locY = 14,
            iconRot = -14,
            cardY = 18,
            chartY = 28,
            durations = {},
            iconTweenEase = ease === "power3.out" ? "back.out(1.35)" : ease,
          } = opts

          const d = (key, fallback) => durations[key] ?? fallback
          const currentDur = d("current", 0.65)
          const t = 0

          const tl = gsap.timeline({
            defaults: { ease },
            onComplete: clearAnimatedProps,
          })

          tl.from(".searchbar", { y: searchY, opacity: 0, duration: d("search", 0.5) }, t)
          tl.fromTo(
            ".current-weather",
            { opacity: 0, y: currentY, scale: currentScale },
            { opacity: 1, y: 0, scale: 1, duration: currentDur },
            t
          )
          tl.from(".location-info > *", { y: locY, opacity: 0, duration: d("location", 0.4) }, t)
          tl.from(
            ".main-weather .main-icon",
            { scale: 0, rotation: iconRot, opacity: 0, duration: d("icon", 0.55), ease: iconTweenEase },
            t
          )
          tl.from(".stat-card", { y: cardY, opacity: 0, duration: d("stats", 0.38) }, t)
          tl.fromTo(
            ".chart-container",
            { y: chartY },
            {
              y: 0,
              duration: d("chart", 0.5),
              onComplete: () => {
                window.dispatchEvent(new Event("resize"))
              },
            },
            t
          )
        }

        mm.add(
          {
            reduced: "(prefers-reduced-motion: reduce)",
            mobile: "(prefers-reduced-motion: no-preference) and (max-width: 639px)",
            desktop: "(prefers-reduced-motion: no-preference) and (min-width: 640px)",
          },
          (context) => {
            if (context.conditions.reduced) {
              runDataTimeline({
                ease: "power2.out",
                searchY: -8,
                currentY: 12,
                currentScale: 1,
                locY: 6,
                iconRot: 0,
                cardY: 8,
                chartY: 10,
                durations: {
                  search: 0.22,
                  current: 0.28,
                  location: 0.18,
                  icon: 0.24,
                  stats: 0.18,
                  chart: 0.26,
                },
              })
              return
            }
            if (context.conditions.mobile) {
              runDataTimeline({
                searchY: -14,
                currentY: 22,
                currentScale: 0.99,
                locY: 10,
                iconRot: -8,
                cardY: 12,
                chartY: 18,
                durations: {
                  search: 0.42,
                  current: 0.52,
                  location: 0.32,
                  icon: 0.45,
                  stats: 0.3,
                  chart: 0.42,
                },
              })
              return
            }
            runDataTimeline({})
          }
        )
      } else {
        const mm = gsap.matchMedia()
        mm.add("(prefers-reduced-motion: reduce)", () => {
          gsap.fromTo(".loading-spinner", { opacity: 0.85 }, { opacity: 1, duration: 0.35, ease: "none" })
          gsap.from(".loading-text", { opacity: 0, duration: 0.25, ease: "power1.out" })
        })

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(
            ".loading-spinner",
            { opacity: 0.75, scale: 0.94 },
            { opacity: 1, scale: 1, duration: 1.1, ease: "sine.inOut", repeat: -1, yoyo: true }
          )
          gsap.from(".loading-text", { y: 8, opacity: 0, duration: 0.5, ease: "power2.out" })
        })
      }
    }, root)

    return () => ctx.revert()
  }, [animationKey])

  useEffect(() => {
    if (!animationKey) return
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"))
      })
    }
    window.addEventListener("resize", onResize, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [animationKey])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setLat(latitude)
        setLon(longitude)
      },
      () => {
        setLat(38.9072)
        setLon(-77.0369)
      }
    )
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
      <div className="app" ref={scopeRef}>
        {current && forecast ? (
          <>
            <nav aria-label="Site header">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl text-white italic font-bold">
                  Weatherboy
                </h1>
                <img src={umbrellaImg} width={40} height={40} alt="" />
              </div>
              <div className="nav-buttons shrink-0">
                <button
                  type="button"
                  className={`font-bold nav-button${showMap ? " nav-button--selected" : ""}`}
                  onClick={() => setShowMap(true)}
                  aria-pressed={showMap}
                >
                  Weather Map
                </button>
                <button
                  type="button"
                  className={`font-bold nav-button${!showMap ? " nav-button--selected" : ""}`}
                  onClick={() => setShowMap(false)}
                  aria-pressed={!showMap}
                >
                  5-Day Forecast
                </button>
              </div>
            </nav>
            <div className="desktop-view">
              <InterfaceLayoutContext.Provider value={INTERFACE_LAYOUT_DESKTOP}>
                <Interface />
              </InterfaceLayoutContext.Provider>
              {showMap ? <Map /> : <Forecast />}
            </div>
            <div className="mobile-view">
              <div className="mobile-map">
                <Map />
              </div>
              <InterfaceLayoutContext.Provider value={INTERFACE_LAYOUT_MOBILE}>
                <Interface />
              </InterfaceLayoutContext.Provider>
            </div>
          </>
        ) : (
          <div id="loader" className="loading-container">
            <CircularProgress size="5rem" className="loading-spinner" />
            <p className="loading-text">Loading...</p>
          </div>
        )}
      </div>
    </Context.Provider>
  )
}

export default App
