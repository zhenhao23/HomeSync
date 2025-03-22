import { BsSunrise, BsCloudRain } from "react-icons/bs";
import { IoLeafOutline } from "react-icons/io5";
import { Zap, Sliders, Upload, Download } from "lucide-react"; 
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
  

  // New state for download confirmation dialog
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);

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


  // Function to handle share button click
  const handleShareClick = () => {
    setShowDownloadConfirm(true);
  };

  // Function to handle download confirmation
  const handleDownloadConfirm = () => {
    console.log("Downloading energy report...");
    
    // Get the currently active data based on the selected tab
    const data = 
      activeYieldTab === "today" 
        ? energyFlowData.today 
        : activeYieldTab === "monthly" 
          ? energyFlowData.monthly 
          : energyFlowData.total;

    // Create a CSV content string
    const csvContent = `
     Type,${activeYieldTab === "today" ? "Daily (kWh)" : activeYieldTab === "monthly" ? "Monthly (kWh)" : "Annual (kWh)"}
     PV,${data.pv}
     Imported,${data.imported}
     Exported,${data.exported}
     Load,${data.load}
     Yield,${data.yield}
   `.trim();

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `energy_report_${activeYieldTab}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setShowDownloadConfirm(false);
  };

  // Function to handle download cancellation
  const handleDownloadCancel = () => {
    setShowDownloadConfirm(false);
  };

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
  // const updateEnergyUsage = (value: any) => {
  //   setEnergyUsage(value);
  // };

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
    // const currentData = 
    //   activeYieldTab === "today" 
    //     ? energyFlowData.today 
    //     : activeYieldTab === "monthly" 
    //       ? energyFlowData.monthly 
    //       : energyFlowData.total;
    
    return (
      <div className="energy-flow-panel">
        <div className="energy-flow-header">
          <h2 className="header-energy-flow">Energy Flow</h2>
          <button className="upload-button" onClick={handleShareClick}>
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

        {/* Download confirmation dialog */}
          {showDownloadConfirm && (
            <div className="download-confirm-overlay">
              <div className="download-confirm-dialog">
                <h3 >Download Energy Report</h3>
                <p >Do you want to download the energy report?</p>
                <div className="dialog-buttons">
                  <button onClick={handleDownloadCancel}>Cancel</button>
                  <button
                    onClick={handleDownloadConfirm}
                    className="confirm-button"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          )}
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
                <EnergyFlowPanel />
              
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