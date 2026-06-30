import { useContext, useLayoutEffect, useRef } from "react"
import { Context } from "./WeatherContext"
import gsap from "gsap"
import Chart from "./Chart"
import ForecastPeriods from "./ForecastPeriods"

/** Same intro key as last run → skip stagger (e.g. Map/Metrics remount, React Strict Mode 2nd pass). */
let lastForecastCardsIntroKey = null

const Forecast = () => {
  const { forecast, forecastCardsIntroKey: introKey } = useContext(Context)
  const forecastScrollRef = useRef(null)

  useLayoutEffect(() => {
    const root = forecastScrollRef.current
    if (!root || !forecast?.list?.length || !introKey) return

    const cards = root.querySelectorAll(".period-card")
    if (!cards.length) return

    const skipIntro = lastForecastCardsIntroKey === introKey
    if (!skipIntro) {
      lastForecastCardsIntroKey = introKey
    }

    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (reducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0 })
        return
      }
      if (skipIntro) {
        gsap.set(cards, { opacity: 1, y: 0 })
        return
      }
      gsap.fromTo(
        cards,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.26,
          ease: "power2.out",
          stagger: { each: 0.028, from: "start" },
          overwrite: "auto",
        }
      )
    }, root)

    return () => ctx.revert()
  }, [introKey])

  return (
    <div className="charts-container">
      <div className="p-4 sm:p-8 flex flex-col gap-8">
        <Chart />
        <div id="forecast" className="forecast-section">
            <div className="forecast-container">
              <ForecastPeriods ref={forecastScrollRef} />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Forecast
