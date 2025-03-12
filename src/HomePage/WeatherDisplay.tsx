import Vector4 from "../assets/weather/Vector4.svg";
import Vector5 from "../assets/weather/Vector5.svg";
import Vector6 from "../assets/weather/Vector6.svg";
import "./WeatherDisplay.css";

const WeatherDisplay: React.FC = () => {
  return (
    <div className="weather-container">
      {/* Weather Vectors */}
      <div className="weather-icons">
        {/* Sun Beam */}
        <img
          src={Vector6}
          alt="Weather Vector 6"
          className="img-fluid vector-sunbeam"
        />
        {/* Sun */}
        <img
          src={Vector5}
          alt="Weather Vector 5"
          className="img-fluid vector-sun"
        />
        {/* Cloud */}
        <img
          src={Vector4}
          alt="Weather Vector 4"
          className="img-fluid vector-cloud"
        />
      </div>
      {/* Weather Content */}
      <div className="d-flex flex-column text-white p-2 weather-content">
        <div className="weather-date">
          <p className="m-0">Nov 6, 2024 9:41 am</p>
        </div>
        <div className="weather-condition">
          <p className="m-0">
            <b>Cloudy</b>
          </p>
        </div>
        <div className="weather-location">
          <p className="m-0">Putrajaya, Malaysia</p>
        </div>
      </div>
      <div className="d-flex flex-column text-white p-2 weather-temp">
        <div>
          <p className="m-0">
            <b>24°C</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
