import { getDay } from "../libs/conversions"
import { kToF } from "../libs/conversions"

function titleCaseWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/**
 * Broadcast-style sky / impacts line from OpenWeather condition text.
 * @param {string} weatherMain
 * @param {string} description
 */
function skyNarrative(weatherMain, description) {
  const d = (description || "").toLowerCase()
  const m = (weatherMain || "").toLowerCase()

  if (m === "thunderstorm" || d.includes("thunderstorm"))
    return "thunderstorms are possible—stay alert for lightning and briefly heavy rain"
  if (d.includes("snow") || m === "snow")
    return "snow is in the forecast; plan for slick spots and reduced visibility"
  if (d.includes("sleet") || d.includes("freezing"))
    return "wintry mix or freezing precipitation could make travel tricky"
  if (d.includes("drizzle") || d === "light rain")
    return "light rain or drizzle is expected on and off"
  if (d.includes("shower") || m === "rain")
    return "scattered to steady rain is likely—keep rain gear handy"
  if (d.includes("rain"))
    return "a wet pattern continues with periods of rain"
  if (d.includes("mist") || d.includes("fog") || d.includes("haze"))
    return "expect patchy fog or haze and lower visibility at times"
  if (d === "clear sky" || (d.includes("clear") && !d.includes("cloud")))
    return "high pressure supports mainly clear skies"
  if (d.includes("few clouds"))
    return "skies stay mostly sunny with just a few passing clouds"
  if (d.includes("scattered clouds"))
    return "you can expect a mix of sun and clouds through the day"
  if (d.includes("broken clouds") || d.includes("overcast"))
    return "clouds hang tough—skies trend mostly cloudy"
  if (d.includes("cloud"))
    return `we're looking at ${titleCaseWords(description).toLowerCase()} conditions overall`

  return `conditions overall favor ${titleCaseWords(description).toLowerCase()}`
}

function localDayKey(dtSec) {
  const d = new Date(dtSec * 1000)
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, "0")
  const da = String(d.getDate()).padStart(2, "0")
  return `${y}-${mo}-${da}`
}

function pickClosestToLocalNoon(items) {
  let best = items[0]
  let bestDist = Infinity
  for (const it of items) {
    const d = new Date(it.dt * 1000)
    const h = d.getHours() + d.getMinutes() / 60
    const dist = Math.abs(h - 12)
    if (dist < bestDist) {
      bestDist = dist
      best = it
    }
  }
  return best
}

/**
 * Group 3-hour OpenWeather `list` entries into up to five local calendar days.
 * @param {Array} list
 */
export function aggregateForecastDays(list) {
  const groups = new Map()
  for (const item of list) {
    const key = localDayKey(item.dt)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(item)
  }

  const keys = [...groups.keys()].sort()
  return keys.slice(0, 5).map((key) => {
    const items = groups.get(key)
    let high = -Infinity
    let low = Infinity
    for (const it of items) {
      high = Math.max(high, kToF(it.main.temp_max))
      low = Math.min(low, kToF(it.main.temp_min))
    }
    const mid = pickClosestToLocalNoon(items)
    const w0 = mid.weather[0]
    return {
      weekday: getDay(new Date(items[0].dt * 1000)),
      high,
      low,
      sky: skyNarrative(w0.main, w0.description),
    }
  })
}

function tempTrendClause(days) {
  if (days.length < 2) return ""
  const first = days[0].high
  const last = days[days.length - 1].high
  if (last - first >= 6)
    return "A warming trend shows up toward the end of the period. "
  if (first - last >= 6)
    return "We trend cooler as the week unfolds. "
  return "Day-to-day temperatures stay in a fairly narrow range. "
}

const highLeadIns = [
  () => "highs top out near",
  () => "afternoon highs peak near",
  () => "we're forecasting highs near",
  () => "temperatures climb to near",
]

const dayOpeners = [
  (w) => `Starting ${w}, `,
  (w) => `On ${w}, `,
  (w) => `${w}, `,
  (w) => `As we get to ${w}, `,
  (w) => `By ${w}, `,
]

/**
 * Fixed-template narrative from raw OpenWeather 5-day /forecast JSON.
 * @param {object | null | undefined} forecast
 * @returns {string | null}
 */
export function buildMeteorologistFiveDaySummary(forecast) {
  const list = forecast?.list
  if (!list?.length) return null

  const city = forecast.city?.name?.trim() || "the area"
  const days = aggregateForecastDays(list)
  if (!days.length) return null

  const trend = tempTrendClause(days)
  const sentences = []

  days.forEach((day, i) => {
    const { weekday, high, low, sky } = day
    const hiPhrase = highLeadIns[i % highLeadIns.length]()
    const openerFn = dayOpeners[Math.min(i, dayOpeners.length - 1)]
    const opener = openerFn(weekday)

    const body = `${opener}${hiPhrase} ${high}°F with overnight lows near ${low}°F; ${sky}.`
    sentences.push(body.replace(/\s+/g, " ").trim())
  })

  return sentences.join(" ")
}
