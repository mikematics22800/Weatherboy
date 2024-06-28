import { useState } from 'react'
import { Autocomplete } from "@react-google-maps/api"
import { Search } from '@mui/icons-material'

const Searchbar = ({setLat, setLon}) => {
  const [location, setLocation] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    setLat(location.getPlace().geometry.location.lat())
    setLon(location.getPlace().geometry.location.lng())
  }

  return (
    <form id="searchbar" onSubmit={submit}>
      <Autocomplete 
        types={['(cities)']}
        onLoad={(e) => {setLocation(e)}}
      >
        <div className='input-container'>
          <input placeholder="Search for a city..."/>
          <Search/>
        </div>
      </Autocomplete>
    </form>
  )
}

export default Searchbar