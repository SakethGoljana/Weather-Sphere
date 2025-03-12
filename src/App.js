import { Oval } from "react-loader-spinner";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFrown } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function WeatherApp() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });

  const [manaliWeather, setManaliWeather] = useState(null);
  const [citiesWeather, setCitiesWeather] = useState([]);

  const API_KEY = "f00c38e0279b7bc85480c3fe775d518c";
  const CITIES = ["Delhi", "Hyderabad", "Jalandhar"];

  const fetchWeather = async (city) => {
    const url = "https://api.openweathermap.org/data/2.5/weather";
    try {
      const res = await axios.get(url, {
        params: {
          q: city,
          units: "metric",
          appid: API_KEY,
        },
      });
      return res.data;
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      const manaliData = await fetchWeather("Manali");
      setManaliWeather(manaliData);

      const cityData = await Promise.all(CITIES.map((city) => fetchWeather(city)));
      setCitiesWeather(cityData);
    };
    fetchDefaultWeather();
  }, []);

  const searchWeather = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setInput("");
      setWeather({ ...weather, loading: true });

      const data = await fetchWeather(input);
      if (data) {
        setWeather({ data, loading: false, error: false });
      } else {
        setWeather({ ...weather, data: {}, error: true });
      }
    }
  };

  return (
    <div className="App">
      <video autoPlay muted loop className="background-video">
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <h1 className="app-name">Weather Sphere 🌍</h1>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            className="city-search"
            placeholder="Search city weather..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyPress={searchWeather}
          />
        </div>
      </div>

      {/* Default Weather for Manali */}
      {manaliWeather && (
        <div className="weather-card">
          <h2>Manali, India</h2>
          <img
            src={`https://openweathermap.org/img/wn/${manaliWeather.weather[0].icon}@2x.png`}
            alt={manaliWeather.weather[0].description}
          />
          <p>{Math.round(manaliWeather.main.temp)}°C</p>
          <p>{manaliWeather.weather[0].description.toUpperCase()}</p>
        </div>
      )}

      {/* Weather for Fixed Cities */}
      <div className="cities-section">
        {citiesWeather.map((cityWeather, index) =>
          cityWeather ? (
            <div key={index} className="weather-card">
              <h2>{cityWeather.name}</h2>
              <img
                src={`https://openweathermap.org/img/wn/${cityWeather.weather[0].icon}@2x.png`}
                alt={cityWeather.weather[0].description}
              />
              <p>{Math.round(cityWeather.main.temp)}°C</p>
              <p>{cityWeather.weather[0].description.toUpperCase()}</p>
            </div>
          ) : null
        )}
      </div>

      {/* Searched City Weather */}
      {weather.loading && <Oval color="white" height={50} width={50} />}
      {weather.error && (
        <p className="error-message">
          <FontAwesomeIcon icon={faFrown} /> City not found
        </p>
      )}
      {weather.data.main && (
        <div className="weather-card">
          <h2>
            {weather.data.name}, {weather.data.sys.country}
          </h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
            alt={weather.data.weather[0].description}
          />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>{weather.data.weather[0].description.toUpperCase()}</p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
