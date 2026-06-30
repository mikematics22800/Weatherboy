import { createContext } from "react"

export const Context = createContext()

/** Layout flags for desktop vs mobile `Interface` (two instances on screen). */
export const InterfaceLayoutContext = createContext({
  mobileRainBackdrop: false,
  mobileSheet: false,
})
