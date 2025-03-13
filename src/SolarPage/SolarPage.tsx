import { BsSunrise, BsCloudRain } from "react-icons/bs";
import { IoLeafOutline } from "react-icons/io5";
import { Zap, Sliders, Upload } from "lucide-react"; 
import { useState, useEffect } from "react";
import { FaHome, FaBolt, FaSun, FaUser } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import EnergyFlowComponent from "./EnergyFlowPage"; 
import "./SolarPage.css";

// Window size hook
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

// Navigation items
interface NavItem {
  id: string;
  icon: JSX.Element;
  label: string;
  path: string;
}

const SolarPage: React.FC = () => {
  // Navigation related states
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname;
  
  // Original states from SolarPage
  const [energyUsage, setEnergyUsage] = useState(80);
  const [currentPower, setCurrentPower] = useState(850);
  const [weather, setWeather] = useState({
    condition: "Light Rain to Few Clouds",
    sunrise: "05:59",
    sunset: "17:56",
  });
  const [environmental] = useState({
    trees: 0.36,
    coalSaved: 259.6,
    co2Saved: 647.053,
  });
  const [estimateGeneration] = useState(1000);
  const [showEnergyFlow, setShowEnergyFlow] = useState(false);
  const [activeYieldTab, setActiveYieldTab] = useState("today");

  // Energy flow data
  const [energyFlowData] = useState({
    today: {
      yield: 22.7,
      pv: 7.93,
      grid: 7.17,
      load: 4.7,
      exported: 18.6,
      imported: 0.6,
      home: 0.76
    },
    monthly: {
      yield: 631,
      pv: 631,
      grid: 365.4,
      load: 545.5,
      exported: 450.9,
      imported: 365.4
    },
    total: {
      yield: 649,
      pv: 649,
      grid: 403.8,
      load: 601.6,
      exported: 451.2,
      imported: 403.8
    }
  });

  // Get window size for responsive layout
  const { width } = useWindowSize();
  const isLaptop = width >= 1440;

  const radius = 120;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  // This will now properly use the dynamic value from state
  const offset = circumference - (energyUsage / 100) * circumference;

  // Navigation items
  const navItems: NavItem[] = [
    {
      id: "home",
      icon: <FaHome size={20} />,
      label: "Home",
      path: "/home",
    },
    {
      id: "energy",
      icon: <FaBolt size={20} />,
      label: "Usage",
      path: "/energy",
    },
    {
      id: "solar",
      icon: <FaSun size={20} />,
      label: "Solar",
      path: "/solar",
    },
    {
      id: "profile",
      icon: <FaUser size={20} />,
      label: "Profile",
      path: "/profile",
    },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  // Check if the current path is either "/energy" or "/energy-limit"
  const isEnergyActive =
    activeTab === "/energy" || activeTab === "/energy-limit";

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
      // Don't override the current value with default on error
    }
  };

  // Added function to manually update energy usage
  const updateEnergyUsage = (value: any) => {
    setEnergyUsage(value);
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
      // Keep default values
    }
  };

  // If energy flow page is showing in mobile view, render that instead
  if (!isLaptop && showEnergyFlow) {
    return (
      <>
        <EnergyFlowComponent onBack={() => setShowEnergyFlow(false)} />
        <nav className="fixed-bottom px-3 py-2 bottom-navbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`btn flex-grow-0 nav-button ${
                (item.path === "/energy" ? isEnergyActive : activeTab === item.path)
                  ? "active"
                  : ""
              }`}
              style={{
                padding: (
                  item.path === "/energy" ? isEnergyActive : activeTab === item.path
                )
                  ? "0 20px"
                  : "0 12px",
                minWidth: (
                  item.path === "/energy" ? isEnergyActive : activeTab === item.path
                )
                  ? "110px"
                  : "auto",
              }}
            >
              <div className="d-flex align-items-center">
                {item.icon}
                {(isLaptop ||
                  (item.path === "/energy"
                    ? isEnergyActive
                    : activeTab === item.path)) && (
                  <span className="ms-2 fw-medium nav-label">{item.label}</span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </>
    );
  }

  // Component for the circular progress that's used in both views
  const CircularProgress = () => (
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
          <p className="energy-usages">Energy Usages</p>
          <h2 className="energy-percent">{energyUsage}%</h2>
          <p className="energy-usages">{currentPower} kW</p>
        </div>
        <div className="progress-icon">
          <Zap className="icon" />
        </div>
      </div>
    </div>
  );

  // Component for weather section that's used in both views
  const WeatherSection = () => (
    <>
      <h5 className="weather-prediction">Weather Prediction (today)</h5>
      <div className="weather-section">
        <div className="weather-item">
          <BsCloudRain size={24} />
          <div>
            <h4 className="weather-header">Weather</h4>
            <p className="energy-usages">{weather.condition}</p>
          </div>
        </div>
        <div className="weather-item">
          <BsSunrise size={24} />
          <div>
            <h4 className="weather-header">Sunrise & Sunset</h4>
            <p className="energy-usages">
              {weather.sunrise}/{weather.sunset}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  // Component for environmental benefits section that's used in both views
  const EnvironmentalBenefits = () => (
    <>
      <h5 className="weather-prediction">Environmental Benefits</h5>
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
    </>
  );

  // Energy Flow Panel Component
  const EnergyFlowPanel = () => {
    const currentData = 
      activeYieldTab === "today" 
        ? energyFlowData.today 
        : activeYieldTab === "monthly" 
          ? energyFlowData.monthly 
          : energyFlowData.total;
    
    return (
      <div className="energy-flow-panel">
        <div className="energy-flow-header">
          <h2 className="header-energy-flow">Energy Flow</h2>
          <button className="upload-button">
            <Upload size={20} />
          </button>
        </div>
        
        <div className="yield-tabs">
          <button 
            className={`yield-tab ${activeYieldTab === "today" ? "active" : ""}`}
            onClick={() => setActiveYieldTab("today")}
          >
            Today Yield
            <span className="yield-value">{energyFlowData.today.yield} kWh</span>
          </button>
          <button 
            className={`yield-tab ${activeYieldTab === "monthly" ? "active" : ""}`}
            onClick={() => setActiveYieldTab("monthly")}
          >
            Monthly Yield
            <span className="yield-value">{energyFlowData.monthly.yield} kWh</span>
          </button>
          <button 
            className={`yield-tab ${activeYieldTab === "total" ? "active" : ""}`}
            onClick={() => setActiveYieldTab("total")}
          >
            Total Yield
            <span className="yield-value">{energyFlowData.total.yield} kWh</span>
          </button>
        </div>
        
        <div className="energy-flow-diagram">
  <div className="flow-diagram-content">
    
    {/* Line Graph replacing the arrows */}
   {/* Line Graph with real kWh values, clear labels and legend */}
<svg className="energy-flow-graph" width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="none">
  {/* Define gradients */}
  <defs>
    <linearGradient id="pvGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#f8b500" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#f8b500" stopOpacity="0.4" />
    </linearGradient>
    <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#4682B4" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#4682B4" stopOpacity="0.4" />
    </linearGradient>
    <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#e74c3c" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#e74c3c" stopOpacity="0.4" />
    </linearGradient>
  </defs>
  
  {/* Graph Legend */}
  <g className="graph-legend">
    <rect x="70" y="5" width="160" height="24" rx="4" ry="4" fill="rgba(255,255,255,0.9)" stroke="#eee" strokeWidth="1" />
    
    {/* PV Legend Item */}
    <g transform="translate(80, 17)">
      <line x1="0" y1="0" x2="15" y2="0" stroke="#f8b500" strokeWidth="3" />
      <text x="20" y="4" fontSize="10" fill="#1d3a57">PV Generation</text>
    </g>
    
    {/* Grid Legend Item */}
    <g transform="translate(150, 17)">
      <line x1="0" y1="0" x2="15" y2="0" stroke="#4682B4" strokeWidth="3" />
      <text x="20" y="4" fontSize="10" fill="#1d3a57">Grid</text>
    </g>
    
    {/* Home Legend Item */}
    <g transform="translate(195, 17)">
      <line x1="0" y1="0" x2="15" y2="0" stroke="#e74c3c" strokeWidth="3" />
      <text x="20" y="4" fontSize="10" fill="#1d3a57">Home</text>
    </g>
  </g>
  
  {/* Y-axis labels based on actual kWh values */}
  <g className="y-axis-labels">
    <rect x="0" y="15" width="35" height="15" fill="rgba(255,255,255,0.7)" rx="2" ry="2" />
    <text x="5" y="25" className="y-axis-label">{Math.max(currentData.pv, currentData.imported, currentData.exported, currentData.load).toFixed(1)} kWh</text>
    
    <rect x="0" y="65" width="35" height="15" fill="rgba(255,255,255,0.7)" rx="2" ry="2" />
    <text x="5" y="75" className="y-axis-label">{(Math.max(currentData.pv, currentData.imported, currentData.exported, currentData.load) * 0.75).toFixed(1)} kWh</text>
    
    <rect x="0" y="115" width="35" height="15" fill="rgba(255,255,255,0.7)" rx="2" ry="2" />
    <text x="5" y="125" className="y-axis-label">{(Math.max(currentData.pv, currentData.imported, currentData.exported, currentData.load) * 0.5).toFixed(1)} kWh</text>
    
    <rect x="0" y="165" width="35" height="15" fill="rgba(255,255,255,0.7)" rx="2" ry="2" />
    <text x="5" y="175" className="y-axis-label">{(Math.max(currentData.pv, currentData.imported, currentData.exported, currentData.load) * 0.25).toFixed(1)} kWh</text>
  </g>
  
  {/* Grid lines */}
  <g className="grid-lines">
    <line x1="40" y1="25" x2="300" y2="25" stroke="#eee" strokeWidth="1" strokeDasharray="5,5" />
    <line x1="40" y1="75" x2="300" y2="75" stroke="#eee" strokeWidth="1" strokeDasharray="5,5" />
    <line x1="40" y1="125" x2="300" y2="125" stroke="#eee" strokeWidth="1" strokeDasharray="5,5" />
    <line x1="40" y1="175" x2="300" y2="175" stroke="#eee" strokeWidth="1" strokeDasharray="5,5" />
  </g>
  
  {/* Calculate y-position based on actual kWh values */}
  {(() => {
    const maxValue = Math.max(currentData.pv, currentData.imported, currentData.exported, currentData.load);
    
    // Function to convert kWh value to y-position (0kWh = bottom, maxkWh = top)
    const getYPosition = (value: number) => {
      // 175 is bottom position, 25 is top position
      return 175 - ((value / maxValue) * 150);
    };
    
    // We'll use these dummy points to simulate a day curve for PV
    const pvPoints = [
      {time: 40, value: 0}, // 00:00
      {time: 65, value: 0}, // 02:00 
      {time: 90, value: currentData.pv * 0.1}, // 04:00
      {time: 115, value: currentData.pv * 0.3}, // 06:00
      {time: 140, value: currentData.pv * 0.6}, // 08:00
      {time: 165, value: currentData.pv * 0.8}, // 10:00
      {time: 190, value: currentData.pv * 1.0}, // 12:00
      {time: 215, value: currentData.pv * 0.9}, // 14:00
      {time: 240, value: currentData.pv * 0.7}, // 16:00
      {time: 265, value: currentData.pv * 0.4}, // 18:00
      {time: 290, value: currentData.pv * 0.1}, // 20:00
      {time: 300, value: 0}, // 22:00
    ];
    
    // Consumption is more stable throughout the day
    const loadPoints = [
      {time: 40, value: currentData.load * 0.3}, // 00:00
      {time: 65, value: currentData.load * 0.2}, // 02:00
      {time: 90, value: currentData.load * 0.3}, // 04:00
      {time: 115, value: currentData.load * 0.5}, // 06:00
      {time: 140, value: currentData.load * 0.7}, // 08:00
      {time: 165, value: currentData.load * 0.6}, // 10:00
      {time: 190, value: currentData.load * 0.5}, // 12:00
      {time: 215, value: currentData.load * 0.6}, // 14:00
      {time: 240, value: currentData.load * 0.8}, // 16:00
      {time: 265, value: currentData.load * 1.0}, // 18:00
      {time: 290, value: currentData.load * 0.9}, // 20:00
      {time: 300, value: currentData.load * 0.6}, // 22:00
    ];
    
    // Grid import tends to be used when PV isn't generating
    const importPoints = [
      {time: 40, value: currentData.imported * 0.8}, // 00:00
      {time: 65, value: currentData.imported * 0.9}, // 02:00
      {time: 90, value: currentData.imported * 0.7}, // 04:00
      {time: 115, value: currentData.imported * 0.5}, // 06:00
      {time: 140, value: currentData.imported * 0.3}, // 08:00
      {time: 165, value: currentData.imported * 0.1}, // 10:00
      {time: 190, value: currentData.imported * 0.05}, // 12:00
      {time: 215, value: currentData.imported * 0.1}, // 14:00
      {time: 240, value: currentData.imported * 0.2}, // 16:00
      {time: 265, value: currentData.imported * 0.4}, // 18:00
      {time: 290, value: currentData.imported * 0.6}, // 20:00
      {time: 300, value: currentData.imported * 0.8}, // 22:00
    ];
    
    // Format the points into SVG path strings
    const pvPathD = pvPoints.map((point, i) => 
      (i === 0 ? 'M' : 'L') + point.time + ',' + getYPosition(point.value)
    ).join(' ');
    
    const loadPathD = loadPoints.map((point, i) => 
      (i === 0 ? 'M' : 'L') + point.time + ',' + getYPosition(point.value)
    ).join(' ');
    
    const importPathD = importPoints.map((point, i) => 
      (i === 0 ? 'M' : 'L') + point.time + ',' + getYPosition(point.value)
    ).join(' ');
    
    // Select peak values for labels
    const pvPeak = pvPoints.reduce((max, point) => point.value > max.value ? point : max, pvPoints[0]);
    const loadPeak = loadPoints.reduce((max, point) => point.value > max.value ? point : max, loadPoints[0]);
    const importPeak = importPoints.reduce((max, point) => point.value > max.value ? point : max, importPoints[0]);
    
    return (
      <>
        {/* PV Generation Line */}
        <path 
          d={pvPathD}
          className="pv-line"
          strokeDasharray={currentData.pv > 0 ? "none" : "3,3"}
        />
        
        {/* PV Generation Area */}
        <path 
          d={pvPathD + ' L300,175 L40,175 Z'} 
          className="pv-area"
          style={{opacity: currentData.pv > 0 ? 0.3 : 0.1}}
        />
        
        {/* Grid Import Line */}
        <path 
          d={importPathD}
          className="grid-line"
          strokeDasharray={currentData.imported > 0 ? "none" : "3,3"}
        />
        
        {/* Grid Import Area */}
        <path 
          d={importPathD + ' L300,175 L40,175 Z'} 
          className="grid-area"
          style={{opacity: currentData.imported > 0 ? 0.2 : 0.1}}
        />
        
        {/* Home Consumption */}
        <path 
          d={loadPathD}
          className="home-line"
        />
        
        {/* Value labels for peaks */}
        {/* PV Peak Label */}
        <g transform={`translate(${pvPeak.time}, ${getYPosition(pvPeak.value) - 15})`}>
          <rect x="-20" y="-10" width="45" height="15" className="value-label-bg" />
          <text x="0" y="0" className="value-label" textAnchor="middle">{pvPeak.value.toFixed(1)} kW</text>
        </g>
        
        {/* Home Peak Label */}
        <g transform={`translate(${loadPeak.time}, ${getYPosition(loadPeak.value) - 15})`}>
          <rect x="-20" y="-10" width="45" height="15" className="value-label-bg" />
          <text x="0" y="0" className="value-label" textAnchor="middle">{loadPeak.value.toFixed(1)} kW</text>
        </g>
        
        {/* Grid Import Peak Label */}
        <g transform={`translate(${importPeak.time}, ${getYPosition(importPeak.value) - 15})`}>
          <rect x="-20" y="-10" width="45" height="15" className="value-label-bg" />
          <text x="0" y="0" className="value-label" textAnchor="middle">{importPeak.value.toFixed(1)} kW</text>
        </g>
      </>
    ); })()}
  {/* Time labels */}
  <text x="5" y="195" fontSize="10" fill="#888">00:00</text>
  <text x="75" y="195" fontSize="10" fill="#888">06:00</text>
  <text x="150" y="195" fontSize="10" fill="#888">12:00</text>
  <text x="225" y="195" fontSize="10" fill="#888">18:00</text>
  <text x="285" y="195" fontSize="10" fill="#888">24:00</text>
</svg>
  </div>
</div>
        
        <div className="energy-flow-table">
          <div className="flow-period-tabs">
            <button className={`period-tab ${activeYieldTab === "today" ? "active" : ""}`} onClick={() => setActiveYieldTab("today")}>Daily</button>
            <button className={`period-tab ${activeYieldTab === "monthly" ? "active" : ""}`} onClick={() => setActiveYieldTab("monthly")}>Monthly</button>
            <button className={`period-tab ${activeYieldTab === "total" ? "active" : ""}`} onClick={() => setActiveYieldTab("total")}>Annual</button>
          </div>
          
          <div className="flow-data-rows">
            <div className="flow-data-row">
              <div className="data-label">
                <span className="color-indicator pv"></span>
                <span>PV Generation</span>
                <span className="info-icon">ⓘ</span>
              </div>
              <div className="data-value">{energyFlowData.today.pv} kWh</div>
              <div className="data-value">{energyFlowData.monthly.pv} kWh</div>
              <div className="data-value">{energyFlowData.total.pv} kWh</div>
            </div>
            
            <div className="flow-data-row">
              <div className="data-label">
                <span className="color-indicator imported"></span>
                <span>Imported</span>
                <span className="info-icon">ⓘ</span>
              </div>
              <div className="data-value">{energyFlowData.today.imported} kWh</div>
              <div className="data-value">{energyFlowData.monthly.imported} kWh</div>
              <div className="data-value">{energyFlowData.total.imported} kWh</div>
            </div>
            
            <div className="flow-data-row">
              <div className="data-label">
                <span className="color-indicator exported"></span>
                <span>Exported</span>
                <span className="info-icon">ⓘ</span>
              </div>
              <div className="data-value">{energyFlowData.today.exported} kWh</div>
              <div className="data-value">{energyFlowData.monthly.exported} kWh</div>
              <div className="data-value">{energyFlowData.total.exported} kWh</div>
            </div>
            
            <div className="flow-data-row">
              <div className="data-label">
                <span className="color-indicator load"></span>
                <span>Home Consumption</span>
                <span className="info-icon">ⓘ</span>
              </div>
              <div className="data-value">{energyFlowData.today.load} kWh</div>
              <div className="data-value">{energyFlowData.monthly.load} kWh</div>
              <div className="data-value">{energyFlowData.total.load} kWh</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isLaptop ? (
        // Laptop view with both panels and the navigation bar
        <>
          {/* Navigation Bar for laptop view */}
          <nav className="fixed-bottom px-3 py-2 bottom-navbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`btn flex-grow-0 nav-button ${
                  (item.path === "/energy" ? isEnergyActive : activeTab === item.path)
                    ? "active"
                    : ""
                }`}
                style={{
                  padding: (
                    item.path === "/energy" ? isEnergyActive : activeTab === item.path
                  )
                    ? "0 20px"
                    : "0 12px",
                  minWidth: (
                    item.path === "/energy" ? isEnergyActive : activeTab === item.path
                  )
                    ? "110px"
                    : "auto",
                }}
              >
                <div className="d-flex align-items-center">
                  {item.icon}
                  {(isLaptop ||
                    (item.path === "/energy"
                      ? isEnergyActive
                      : activeTab === item.path)) && (
                    <span className="ms-2 fw-medium nav-label">{item.label}</span>
                  )}
                </div>
              </button>
            ))}
          </nav>
          
          {/* Solar page content */}
          <div className="solar-container-laptop">
            <div className="solar-content-wrapper">
              {/* Left Panel - Solar Energy Status */}
              <div className="solar-left-panel">
                <div className="header-wrapper-laptop">
                  <h2 className="solar-heading3">Solar Energy Status</h2>
                </div>
                
                {/* Energy Usage Circular Progress */}
                <CircularProgress />
                
                <div className="weather-benefits-container">
                  {/* Weather Section */}
                  <div className="laptop-weather-section">
                    <WeatherSection />
                  </div>
                  
                  {/* Estimated Generation */}
                  <div className="estimate-generation-laptop">
                    <p className="estimation">Estimate Generation: {estimateGeneration} kW</p>
                  </div>
                  
                  {/* Environmental Benefits */}
                  <div className="laptop-benefits-section">
                    <EnvironmentalBenefits />
                  </div>
                </div>
              </div>
              
              {/* Right Panel - Energy Flow */}
              <div className="solar-right-panel">
                <EnergyFlowPanel />
              </div>
            </div>
          </div>
        </>
      ) : (
        // Mobile view with navigation bar
        <>
          <div className="solar-container">
            {/* Solar Energy Heading */}
            <div className="header-wrapper">
              <h2 className="solar-heading">Solar Energy Status</h2>
              <button
                className="status-button"
                onClick={() => setShowEnergyFlow(true)}
                aria-label="Show Energy Flow"
              >
                <Sliders className="filter-icon" stroke="#1d3a57" size={24} />
              </button>
            </div>

            {/* Energy Usage Circular Progress */}
            <CircularProgress />

            {/* Main Container (white card) */}
            <div className="info-container">
              {/* Weather Section */}
              <WeatherSection />

              {/* Estimated Generation */}
              <div className="estimate-generation">
                <p className="estimation">Estimate Generation: {estimateGeneration} kW</p>
              </div>

              {/* Environmental Benefits */}
              <EnvironmentalBenefits />
            </div>

            {/* Home Indicator */}
            <div className="home-indicator"></div>
          </div>
          
          {/* Bottom Navigation Bar */}
          {/* <nav className="fixed-bottom px-3 py-2 bottom-navbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`btn flex-grow-0 nav-button ${
                  (item.path === "/energy" ? isEnergyActive : activeTab === item.path)
                    ? "active"
                    : ""
                }`}
                style={{
                  padding: (
                    item.path === "/energy" ? isEnergyActive : activeTab === item.path
                  )
                    ? "0 20px"
                    : "0 12px",
                  minWidth: (
                    item.path === "/energy" ? isEnergyActive : activeTab === item.path
                  )
                    ? "110px"
                    : "auto",
                }}
              >
                <div className="d-flex align-items-center">
                  {item.icon}
                  {(isLaptop ||
                    (item.path === "/energy"
                      ? isEnergyActive
                      : activeTab === item.path)) && (
                    <span className="ms-2 fw-medium nav-label">{item.label}</span>
                  )}
                </div>
              </button>
            ))}
          </nav> */}
        </>
      )}
    </>
  );
};

export default SolarPage;