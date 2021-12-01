import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [countries, setCountries] = useState([]);
  const [displayCountries, setDisplayCountries] = useState([]);
  const [input, setInput] = useState('');
  const [detailCountry, setDetailCountry] = useState();
  const [weather, setWeather] = useState();
  const api_key = process.env.REACT_APP_API_KEY

  const inputHandler = (val) => {
    setInput(val)
    if(val.length === 0){
      setDisplayCountries([])
      setDetailCountry()
      setWeather()
    } else {
      let filteredCountries = countries.filter((c) => c.name.common.toLowerCase().includes(val.toLowerCase()))
      if(filteredCountries.length === 1){
        setDetailCountry(filteredCountries[0])
      } else {
        setDetailCountry()
        setWeather()
      }
      setDisplayCountries(filteredCountries)
    }
  }

  useEffect(() =>{
    axios.get('https://restcountries.com/v3.1/all').then(response => {
        setCountries(response.data);
  })
  }, [])

  useEffect(() =>{
    if(detailCountry){
      console.log("api called")
    axios.get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${detailCountry.name.common}`).then(response => {
        setWeather({city : response.data.location.name, temperature: response.data.current.temperature, windSpeed: response.data.current.wind_speed, windDir: response.data.current.wind_dir, img: response.data.current.weather_icons[0]})
    }).catch((error) => {
        console.log(error);
    });
    }
  }, [detailCountry])

  const displayCountryDetails = (country) => {
    return (
    <div>
      <h2>{country.name.common}</h2>
      <span>capital {country.capital}</span> <br/>
      <span>population {country.population}</span>
      <h1>languages</h1>
      <ul>
        {(Object.values(country.languages)).map((lang) => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt="flag"></img>
    </div> 
    )
  }

  const displayWeather = (country) => (
    country && country.city && 
      <div>
        <h2>Weather in {country.city}</h2><br/>
        <span><b>temperature </b> {country.temperature} celsius </span><br/>
        <img src={country.img} alt=""></img><br/>
        <span><b>wind </b> {country.windSpeed} mph direction {country.windDir} </span>
      </div>
  )

  const renderCountryList = () => (
    <div>
      <label>find countries </label>
      <input onChange={(e) => inputHandler(e.target.value)} value={input}></input>
      <div>
        {displayCountries.length !== 1 && (displayCountries.length <= 10 ? displayCountries.map((c) => <div key={c.name.common}> {c.name.common} <button onClick={() => setDetailCountry(c)}>show</button></div>) : <div>Too many matches, specify another filter</div> )}
        {detailCountry ? displayCountryDetails(detailCountry) : null}
        {weather ? displayWeather(weather) : null}
      </div>
    </div>
  )

  return (
    renderCountryList()
  );
}

export default App;
