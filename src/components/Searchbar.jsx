import { useState, useContext, useRef, useCallback } from 'react'
import { Context } from "./WeatherContext"
import { Autocomplete } from '@react-google-maps/api'
import { Search, LocationOn } from '@mui/icons-material'

const Searchbar = () => {
  const autocompleteRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const { setLat, setLon, mapsReady } = useContext(Context)

  const onPlaceChanged = useCallback(() => {
    const ac = autocompleteRef.current
    if (!ac) return
    const place = ac.getPlace()
    const loc = place?.geometry?.location
    if (!loc) return
    setLat(loc.lat())
    setLon(loc.lng())
  }, [setLat, setLon])

  const searchbarClass = `searchbar ${isFocused ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`

  if (!mapsReady) {
    return (
      <div className="w-full flex justify-center">
        <div className={searchbarClass}>
          <LocationOn className="shrink-0 text-blue-600 ml-4 text-xl" />
          <input
            disabled
            placeholder="Initializing..."
            className="flex-1"
          />
          <Search className="shrink-0 text-gray-400 text-xl" />
        </div>
      </div>
    )
  }

  return (
    <Autocomplete
      types={['(cities)']}
      fields={['geometry']}
      onLoad={(ac) => {
        autocompleteRef.current = ac
      }}
      onUnmount={() => {
        autocompleteRef.current = null
      }}
      onPlaceChanged={onPlaceChanged}
      className="w-full flex justify-center"
    >
      <div className={searchbarClass}>
        <LocationOn className="shrink-0 text-blue-600 ml-4 text-xl" />
        <input
          placeholder="Search for a city…"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1"
        />
        <Search className="shrink-0 text-xl text-gray-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer" />
      </div>
    </Autocomplete>
  )
}

export default Searchbar
