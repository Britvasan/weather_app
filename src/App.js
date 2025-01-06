import { useMemo, useState } from 'react';
import './App.css';
import { FaSearch } from 'react-icons/fa';
import clearImg from '../src/Assets/Clear Sun.png';
import cloudImg from '../src/Assets/Cloud.png';
import humidityImg from '../src/Assets/Humidity.png';
import drizzleImg from '../src/Assets/Drizzle.jpg';
import rainImg from '../src/Assets/Rain.jpg';
import snowImg from '../src/Assets/Snow.jpg';
import windImg from '../src/Assets/Wind.jpg';
import PropTypes from 'prop-types';

const WeatherDetails = ({ icon, temp, city, country, lat, long, humidity, wind }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="Imageicon" />
      </div>
      <div className="temp">{temp}&deg;C </div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className='co-ord'>
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='long'>Longitude</span>
          <span>{long}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityImg} alt="Humidity" className='icon' />
          <div className="data">
            <div className="humidity-percentage">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windImg} alt="wind" className='icon' />
          <div className="data">
            <div className="wind-percentage">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
}

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
};

function App() {
  const [icon, setIcon] = useState(clearImg);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [text, setText] = useState("");
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconsList = useMemo(
    () => ({
      "01d": clearImg,
      "01n": clearImg,
      "02d": cloudImg,
      "02n": cloudImg,
      "03n": drizzleImg,
      "03d": drizzleImg,
      "04n": drizzleImg,
      "04d": drizzleImg,
      "09d": rainImg,
      "09n": rainImg,
      "10d": rainImg,
      "13d": snowImg,
      "13n": snowImg,
    }),
    []
  );

  const fetchData = async () => {
    setLoading(true);
    const API_KEY = "589d05df7c4e18d8a27269169faaa26d";
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${API_KEY}&units=Metric`;

    try {
      const response = await fetch(URL);
      const data = await response.json();
      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLong(data.coord.lon);

      const weatherIcon = data.weather[0].icon;
      setIcon(weatherIconsList[weatherIcon] || clearImg);
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError("An error occurred while fetching the data!");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          className="cityInput"
          placeholder="Enter a city Name"
          onChange={handleCity}
          value={text}
          onKeyDown={handleEnterKey}
        />
        <button className="search-icon" onClick={() => fetchData()}>
          <FaSearch />
        </button>
      </div>

      {loading && <div className="loading-msg">Loading...</div>}
      {error && <div className="error-msg">{error}</div>}
      {cityNotFound && <div className="city-not-found">City not found</div>}

      {!loading && !cityNotFound && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          long={long}
          humidity={humidity}
          wind={wind}
        />
      )}
      <p className="copyright">
        Work Done By <span>Britvasan R</span>
      </p>
    </div>
  );
}

export default App;
