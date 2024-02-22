import { useEffect, useState } from 'react'
import axios from 'axios'

const WeatherInformation = ({country}) => {
  const [weather, setWeather] = useState(null)
  useEffect(() => {
    const api_key = import.meta.env.VITE_SOME_KEY
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}`)
    .then(response => {
      setWeather(response.data)
    })
  }, [])
  if (weather === null) return null
  return (
    <div>
      <h3>Weather in {country.capital[0]}</h3>
      <p>temperature {(weather.main.temp - 273.5).toFixed(2)} Celsius</p>
      <img alt="weather icon" src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const LanguageList = ({languages}) => {
  return (
    <ul>
      {Object.entries(languages).map(([abb, name]) => (
        <li key={abb}>{name}</li>
      ))}
    </ul>
  )
}

const DisplayInformation = ({country}) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <LanguageList languages={country.languages}/>
      <img src={country.flags.png} alt='flag' height='auto' width='auto' />
      <WeatherInformation country={country}/>
    </div>
  )
}

const Display = ({country}) => {
  const [visible, setVisible] = useState(false)
  const handleClick = () => {
    setVisible(!visible)
  }
  return (
      <p>
        {country.name.common} <button onClick={handleClick}>show</button>
        {visible && <DisplayInformation key={country.name.common} country={country}/>}
      </p>

  )
}

const Filter = ({searchbar, countries}) => {
  let filtered
  if (searchbar.length > 0) {
    filtered = countries.filter((country) => {
    return country.name.common.toLowerCase().includes(searchbar.toLowerCase())
    })
  } else {
    filtered = countries
  }
  if (filtered.length > 10) {
    return ('Too many matches, specify another filter')
  } else if (filtered.length === 1) {
    return <DisplayInformation key={filtered[0].name.common} country={filtered[0]}/>
  } else {
    return (filtered.map((country) => <Display key ={country.name.common} country={country}/>))
  }
}

const App = () => {
  const[searchbar, setSearchbar] = useState('')
  const[countries, setCountries] = useState([])
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
const handleSearchbarChange = (event) => {
  setSearchbar(event.target.value)
}
return (
  <div>
    <form>
    <b>find countries <input value={searchbar} onChange={handleSearchbarChange} /> </b>
    </form>
    <div>
      <Filter keY={countries.id} searchbar = {searchbar} countries = {countries}/>
    </div>
  </div>
)

}

export default App
