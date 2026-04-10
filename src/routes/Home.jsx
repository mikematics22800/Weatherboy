import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import gsap from "gsap"
import { Context } from "./Root"
import { CircularProgress } from "@mui/material"
import Air from "@mui/icons-material/Air"
import ArrowDownward from "@mui/icons-material/ArrowDownward"
import Thermostat from "@mui/icons-material/Thermostat"
import WaterDrop from "@mui/icons-material/WaterDrop"
import { degToDir, kToF, getTime, getDay } from "../libs/conversions"
import Searchbar from "../components/Searchbar"
import TempChart from "../components/TempChart"
import Summary from "../components/Summary"
import { fetchReverseGeocodeRegion } from "../libs/apis"
import { Compress } from "@mui/icons-material"

function Home() {
  const scopeRef = useRef(null)
  const [regionLabel, setRegionLabel] = useState(null)

  const icon = (icon, size) => {
    return `https://openweathermap.org/img/wn/${icon}${size}.png`
  }

  const { current, forecast } = useContext(Context)

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

  useLayoutEffect(() => {
    const root = scopeRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      if (animationKey) {
        const mm = gsap.matchMedia()

        const clearAnimatedProps = () => {
          gsap.set(
            ".home-search-wrap, .current-weather, .location-info > *, .main-weather .main-icon, .stat-card, .forecast-scroll .period-card, .chart-container, .forecast-summary-block",
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
            periodX = 24,
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

          tl.from(
            ".home-search-wrap",
            { y: searchY, opacity: 0, duration: d("search", 0.5) },
            t
          )
          tl.fromTo(
            ".current-weather",
            { autoAlpha: 0, y: currentY, scale: currentScale },
            { autoAlpha: 1, y: 0, scale: 1, duration: currentDur },
            t
          )
          tl.from(
            ".location-info > *",
            { y: locY, opacity: 0, duration: d("location", 0.4) },
            t
          )
          tl.from(
            ".main-weather .main-icon",
            {
              scale: 0,
              rotation: iconRot,
              opacity: 0,
              duration: d("icon", 0.55),
              ease: iconTweenEase,
            },
            t
          )
          tl.from(
            ".stat-card",
            { y: cardY, opacity: 0, duration: d("stats", 0.38) },
            t
          )
          tl.fromTo(
            ".forecast-scroll .period-card",
            { x: periodX, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: d("periods", 0.42) },
            t
          )
          tl.fromTo(
            ".forecast-summary-block",
            { y: 12, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: d("summarySlot", 0.4) },
            t
          )
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
            mobile:
              "(prefers-reduced-motion: no-preference) and (max-width: 639px)",
            desktop:
              "(prefers-reduced-motion: no-preference) and (min-width: 640px)",
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
                periodX: 10,
                chartY: 10,
                durations: {
                  search: 0.22,
                  current: 0.28,
                  location: 0.18,
                  icon: 0.24,
                  stats: 0.18,
                  summarySlot: 0.18,
                  periods: 0.22,
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
                periodX: 16,
                chartY: 18,
                durations: {
                  search: 0.42,
                  current: 0.52,
                  location: 0.32,
                  icon: 0.45,
                  stats: 0.3,
                  summarySlot: 0.32,
                  periods: 0.34,
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
          gsap.fromTo(
            ".loading-spinner",
            { opacity: 0.85 },
            { opacity: 1, duration: 0.35, ease: "none" }
          )
          gsap.from(".loading-text", {
            opacity: 0,
            duration: 0.25,
            ease: "power1.out",
          })
        })

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(
            ".loading-spinner",
            { opacity: 0.75, scale: 0.94 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.1,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            }
          )
          gsap.from(".loading-text", {
            y: 8,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          })
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

  const periods = forecast?.list.map((period, i) => {
    const date = new Date(period.dt * 1000)
    const date3HrsLater = new Date((period.dt + 10800) * 1000)
    return (
      <div className="period-card" key={i}>
        <div className="period-header">
          <p className="period-day">{getDay(date)}</p>
          <p className="period-time">{getTime(date)}-{getTime(date3HrsLater)}</p>
        </div>
        <div className="period-weather">
          <div className="weather-main">
            <p className="weather-desc">{period.weather[0].description.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</p>
            <img className="weather-icon" src={icon(period.weather[0].icon, '@4x')} alt="weather"/>
          </div>
          <div className="weather-details">
            <div className="detail-row">
              <span className="detail-label">High</span>
              <span className="detail-value">{kToF(period.main.temp_max)}°F</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Low</span>
              <span className="detail-value">{kToF(period.main.temp_min)}°F</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{period.main.humidity}%</span>
            </div>
          </div>
        </div>
      </div>
    )
  })

  return (
    <div id="home" ref={scopeRef} className="home-root">
      <div className="overlay" aria-hidden />
      <div className="home-search-wrap">
        <Searchbar />
      </div>
      {current && forecast ? (
        <div id="weather" className="home-weather">
          <div className="home-weather-inner">
            <div className="home-current-summary-pair">
              <div className="home-current-summary-cell">
                <div id="current" className="current-weather">
                  <div className="location-info">
                    <p className="location-text">{locationLine}</p>
                  </div>
                  <div className="main-weather">
                    <img className="main-icon" src={icon(current.weather[0].icon, '@4x')} alt="weather"/>
                    <h1 className="current-weather-desc">{current.weather[0].description.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</h1>
                  </div>

                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-heading">
                        <p className="stat-label">Temperature</p>
                        <Thermostat className="stat-metric-icon" aria-hidden />
                      </div>
                      <p className="stat-value">{kToF(current.main.temp)}°F</p>
                    </div>
                    <div className="stat-card">
                      <div className="stat-heading">
                        <p className="stat-label">Wind</p>
                        <Air className="stat-metric-icon" aria-hidden />
                      </div>
                      <p className="stat-value">{degToDir(current.wind.deg)} {Math.round(current.wind.speed)} mph</p>
                    </div>
                    <div className="stat-card">
                      <div className="stat-heading">
                        <p className="stat-label">Humidity</p>
                        <WaterDrop className="stat-metric-icon" aria-hidden />
                      </div>
                      <p className="stat-value">{current.main.humidity}%</p>
                    </div>
                    <div className="stat-card">
                      <div className="stat-heading">
                        <p className="stat-label">Air Pressure</p>
                        <Compress className="stat-metric-icon" aria-hidden />
                      </div>
                      <p className="stat-value">{current.main.pressure} mb</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="home-current-summary-cell">
                <div className="forecast-summary-block">
                  <Summary forecast={forecast} />
                </div>
              </div>
            </div>

            <div id="forecast" className="forecast-section">
              <div className="forecast-container">
                <div className="forecast-scroll">
                  {periods}
                </div>
              </div>
            </div>

            <div className="chart-container">
              <TempChart/>
            </div>
          </div>
        </div>
      ) : (
          <div id="loader" className="loading-container">
            <CircularProgress size="5rem" className="loading-spinner" />
            <p className="loading-text">Loading…</p>
          </div>
        )}
    </div>
  )
}

export default Home
