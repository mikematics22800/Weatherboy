import { useState, useContext } from 'react'
import { Context } from '../routes/Root'
import { Autocomplete } from "@react-google-maps/api"
import { Search } from '@mui/icons-material'

const Searchbar = () => {
  const [location, setLocation] = useState(null)
  const { setLat, setLon } = useContext(Context)

  const submit = () => {
    setLat(location.getPlace().geometry.location.lat())
    setLon(location.getPlace().geometry.location.lng())
    console.log(location)
  }

  return (
    <Autocomplete 
      types={['(cities)']}
      onLoad={(e) => {setLocation(e)}}
      onPlaceChanged={submit}
      className='w-full flex justify-center'
    >
      <div className='searchbar'>
        <input placeholder="Search for a city..."/>
        <Search/>
      </div>
    </Autocomplete>
  )
}

export default Searchbar