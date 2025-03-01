import { BsSunrise, BsCloudRain } from "react-icons/bs";
import { IoLeafOutline } from "react-icons/io5";
import { Zap, Sliders } from "lucide-react"; // Added Sliders icon for filter
import { useState, useEffect } from "react";
import EnergyFlowPage from "./EnergyFlowPage"; // Import the EnergyFlowPage
import "./SolarPage.css";

const SolarPage: React.FC = () => {
  const [energyUsage, setEnergyUsage] = useState(25);
  const [currentPower, setCurrentPower] = useState(850);
  const [weather, setWeather] = useState({
    condition: "Light Rain to Few Clouds",
    sunrise: "05:59",
    sunset: "17:56",
  });
  // const [environmental, setEnvironmental] = useState({
  const [environmental] = useState({
    trees: 0.36,
    coalSaved: 259.6,
    co2Saved: 647.053,
  });
  // const [estimateGeneration, setEstimateGeneration] = useState(1000);
  const [estimateGeneration] = useState(1000);
  // Add state for page navigation
  const [showEnergyFlow, setShowEnergyFlow] = useState(false);

  const radius = 120;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (energyUsage / 100) * circumference;

  useEffect(() => {
    fetchSolarData();
    fetchWeatherData();
  }, []);

  const fetchSolarData = async () => {
    try {
      const response = await fetch("https://api.example.com/solar");
      const data = await response.json();
      setEnergyUsage(data.usagePercentage);
      setCurrentPower(data.usageKw);
    } catch (error) {
      console.error("Error fetching solar data:", error);
    }
  };

  const fetchWeatherData = async () => {
    try {
      const response = await fetch("https://api.example.com/weather");
      const data = await response.json();
      setWeather({
        condition: data.weatherCondition,
        sunrise: data.sunrise,
        sunset: data.sunset,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // If energy flow page is showing, render that instead
  if (showEnergyFlow) {
    return <EnergyFlowPage onBack={() => setShowEnergyFlow(false)} />;
  }

  return (
    <div className="solar-container">
      {/* Status Bar */}

      {/* Solar Energy Heading */}
      <div className="header-wrapper">
        <h2 className="solar-heading">Solar Energy Status</h2>
        <button
          className="status-button"
          onClick={() => setShowEnergyFlow(true)} // Add click handler to navigate
          aria-label="Show Energy Flow"
        >
          <Sliders className="filter-icon" stroke="#1d3a57" size={24} />
        </button>
      </div>

      {/* Energy Usage Circular Progress */}
      <div className="solar-progress">
        <div className="progress-wrapper">
          <svg className="progress-circle">
            <circle
              cx="128"
              cy="128"
              r={radius}
              className="background-circle"
              strokeWidth={strokeWidth}
            />
            <circle
              cx="128"
              cy="128"
              r={radius}
              className="progress-bar"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#FFB800" />
                <stop offset="100%" stopColor="#FFCF53" />
              </linearGradient>
            </defs>
          </svg>
          <div className="progress-text">
            <p>Energy Usages</p>
            <h2>{energyUsage}%</h2>
            <p>{currentPower} kW</p>
          </div>
          <div className="progress-icon">
            <Zap className="icon" />
          </div>
        </div>
      </div>

      {/* Main Container (white card) */}
      <div className="info-container">
        {/* Weather Section */}
        <h5>Weather Prediction (today)</h5>
        <div className="weather-section">
          <div className="weather-item">
            <BsCloudRain size={24} />
            <div>
              <h4>Weather</h4>
              <p>{weather.condition}</p>
            </div>
          </div>
          <div className="weather-item">
            <BsSunrise size={24} />
            <div>
              <h4>Sunrise & Sunset</h4>
              <p>
                {weather.sunrise}/{weather.sunset}
              </p>
            </div>
          </div>
        </div>

        {/* Estimated Generation */}
        <div className="estimate-generation">
          <p>Estimate Generation: {estimateGeneration} kW</p>
        </div>

        {/* Environmental Benefits */}
        <h5>Environmental Benefits</h5>
        <div className="env-benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">
              <IoLeafOutline size={24} />
            </div>
            <div className="benefit-details">
              <p className="benefit-title">Equivalent Trees Planted</p>
              <p className="benefit-value">{environmental.trees}</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#f8b500" strokeWidth="2" />
              </svg>
            </div>
            <div className="benefit-details">
              <p className="benefit-title">CO2 Emission Saved</p>
              <p className="benefit-value">{environmental.co2Saved} kg</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#f8b500" strokeWidth="2" />
              </svg>
            </div>
            <div className="benefit-details">
              <p className="benefit-title">Standard Coal Saved</p>
              <p className="benefit-value">{environmental.coalSaved} kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="home-indicator"></div>
    </div>
  );
};

export default SolarPage;
