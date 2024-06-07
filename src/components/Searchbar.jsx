import { useState } from 'react'
import { LoadScript, Autocomplete } from "@react-google-maps/api"
import { Search } from '@mui/icons-material'

const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const libraries = ['places'];

const Searchbar = ({setLat, setLon}) => {

  const [location, setLocation] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    setLat(location.getPlace().geometry.location.lat())
    setLon(location.getPlace().geometry.location.lng())
  }

  return (
    <form id="searchbar" onSubmit={submit}>
      <LoadScript googleMapsApiKey={mapsApiKey} libraries={libraries}>
        <Autocomplete 
          types={['(cities)']}
          onLoad={(e) => {setLocation(e)}}
        >
          <div className='input-container'>
            <input placeholder="Search for a City..."/>
            <Search/>
          </div>
        </Autocomplete>
      </LoadScript>
      <button type='submit'>Search</button>
    </form>
  )
}

export default Searchbar