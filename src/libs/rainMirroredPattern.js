import rainJpg from "../images/rain.jpg"

let cached = null
let promise = null

/** Two-row tile: normal, then vertically mirrored — repeats seamlessly on repeat-y. */
export function ensureRainMirroredPattern() {
  if (cached) return Promise.resolve(cached)
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const w = img.naturalWidth
        const h = img.naturalHeight
        const canvas = document.createElement("canvas")
        canvas.width = w
        canvas.height = h * 2
        const ctx = canvas.getContext("2d")

        ctx.drawImage(img, 0, 0, w, h)

        ctx.save()
        ctx.translate(0, h * 2)
        ctx.scale(1, -1)
        ctx.drawImage(img, 0, 0, w, h)
        ctx.restore()

        cached = canvas.toDataURL("image/jpeg", 0.92)
        resolve(cached)
      }
      img.onerror = reject
      img.src = rainJpg
    })
  }
  return promise
}
