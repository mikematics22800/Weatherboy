import { useState } from 'react'
import { LoadScript, Autocomplete } from "@react-google-maps/api"
import { mapsApiKey } from '../apis';
import { Search } from '@mui/icons-material'

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
            <input placeholder="Enter a city..."/>
            <Search/>
          </div>
        </Autocomplete>
      </LoadScript>
      <button type='submit'>Search</button>
    </form>
  )
}

export default Searchbar