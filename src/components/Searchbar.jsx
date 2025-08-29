import { useState, useContext } from 'react'
import { Context } from '../routes/Root'
import { Autocomplete, LoadScript } from "@react-google-maps/api"
import { Search, LocationOn } from '@mui/icons-material'

const Searchbar = () => {
  const [location, setLocation] = useState(null)
  const [isFocused, setIsFocused] = useState(false)
  const { setLat, setLon } = useContext(Context)

  const submit = () => {
    if (location) {
      setLat(location.getPlace().geometry.location.lat())
      setLon(location.getPlace().geometry.location.lng())
      console.log(location)
    }
  }

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={['places']}
    >
      <Autocomplete 
        types={['(cities)']}
        onLoad={(e) => {setLocation(e)}}
        onPlaceChanged={submit}
        className='w-full flex justify-center'
      >
        <div className={`searchbar ${isFocused ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}>
          <LocationOn className="text-blue-600 ml-4 text-xl" />
          <input 
            placeholder="Search for a city..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1"
          />
          <Search className="text-gray-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer"/>
        </div>
      </Autocomplete>
    </LoadScript>
  )
}

export default Searchbar