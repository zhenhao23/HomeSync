import { BsSunrise, BsCloudRain } from "react-icons/bs";
import { IoLeafOutline } from "react-icons/io5";
import { GiCoalPile } from "react-icons/gi";
import { PiFactory } from "react-icons/pi";
import { Zap, Sliders, Upload, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { FaHome, FaBolt, FaSun, FaUser } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import EnergyFlowComponent from "./EnergyFlowPage";
import "./SolarPage.css";
import LogoSmartHome from "../HomePage/LogoSmartHome";
import pdfIcon from "../assets/energy/download-pdf-icon.svg";
import React from "react";

// Window size hook
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
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

// New interfaces for solar data
// interface SolarMetrics {
//   batteryLevel: number;
//   equivalentTrees: number;
//   co2EmissionsSaved: number;
//   standardCoalSaved: number;
//   recordedDate: string;
// }

interface EnergyFlowDetail {
  pvGeneration: number;
  importedEnergy: number;
  exportedEnergy: number;
  loadEnergy: number;
}

interface EnergyFlowData {
  today: EnergyFlowDetail & { yield: number };
  monthly: EnergyFlowDetail & { yield: number };
  total: EnergyFlowDetail & { yield: number };
}

const SolarPage: React.FC = () => {
  // Navigation and redirect
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname;

  // Get home ID from localStorage instead of auth context
  const [homeId, setHomeId] = useState<number | null>(null);

  useEffect(() => {
    // Get the current homeId from localStorage
    const storedHomeId = localStorage.getItem("currentHomeId");

    if (!storedHomeId) {
      console.error("No home ID found in localStorage");
      // You might want to redirect to home selection or show an error
      return;
    }

    setHomeId(parseInt(storedHomeId));
  }, []);

  // Click outside to close active tooltip
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveTooltip(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // New state for download confirmation dialog
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);

  // Original states from SolarPage
  const [energyUsage, setEnergyUsage] = useState(0);
  const [currentPower, setCurrentPower] = useState(850);
  const [weather, setWeather] = useState({
    condition: "Light Rain to Few Clouds",
    sunrise: "05:59",
    sunset: "17:56",
  });
  const [environmental, setEnvironmental] = useState({
    trees: 0.36,
    coalSaved: 259.6,
    co2Saved: 647.053,
  });
  const [estimateGeneration, setEstimateGeneration] = useState(1000);
  const [showEnergyFlow, setShowEnergyFlow] = useState(false);
  const [activeYieldTab, setActiveYieldTab] = useState("today");

  // Add this new state for the animated energy usage value
  const [displayedEnergyUsage, setDisplayedEnergyUsage] = useState(0);

  // Energy flow data
  const [energyFlowData, setEnergyFlowData] = useState<EnergyFlowData>({
    today: {
      yield: 22.7,
      pvGeneration: 7.93,
      importedEnergy: 0.6,
      exportedEnergy: 18.6,
      loadEnergy: 4.7,
    },
    monthly: {
      yield: 631,
      pvGeneration: 631,
      importedEnergy: 365.4,
      exportedEnergy: 450.9,
      loadEnergy: 545.5,
    },
    total: {
      yield: 649,
      pvGeneration: 649,
      importedEnergy: 403.8,
      exportedEnergy: 451.2,
      loadEnergy: 601.6,
    },
  });

  // Get window size for responsive layout
  const { width } = useWindowSize();
  const isLaptop = width >= 1024;

  const radius = 120;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  // This will now properly use the dynamic value from state
  // const offset = circumference - (energyUsage / 100) * circumference;

  // Add new state for animated offset
  const [displayedOffset, setDisplayedOffset] = useState(circumference);

  // States for tooltips
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Definitions for tooltips
  const definitions = {
    pv: "This refers to the technology used in solar panels to convert sunlight into electricity. 'PV' usually means your solar panel system.",
    imported:
      "This is the energy brought in from the grid. When your solar panels aren’t producing enough power, your home draws energy from the utility grid, which is 'imported'.",
    exported:
      "This is the energy sent back to the grid. When your solar panels produce more power than your home is using, the excess is 'exported' to the grid, which might earn you credits depending on your utility plan.",
    load: "This term refers to the total energy demand or consumption of your home at a given moment. It’s the amount of power your appliances and devices are drawing.",
  };

  // Function to handle info icon click
  const handleInfoClick = (type: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setActiveTooltip(type);
    console.log(activeTooltip);
  };

  // Update the animation effect to use easing
  useEffect(() => {
    // Only animate if the target value is different from current display value
    if (energyUsage !== displayedEnergyUsage) {
      // Define animation duration and steps
      const duration = 2000; // 2 seconds (slightly longer for better easing effect)
      const interval = 16; // Update every 16ms for smoother animation (60fps)
      // const steps = duration / interval;

      // Calculate target offset
      const targetOffset = circumference - (energyUsage / 100) * circumference;

      // Start time for easing calculation
      const startTime = Date.now();
      const initialUsage = displayedEnergyUsage;
      const initialOffset = displayedOffset;
      const usageDiff = energyUsage - initialUsage;
      const offsetDiff = targetOffset - initialOffset;

      const timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Apply easing function (ease-out cubic)
        // This slows down the animation as it approaches the target value
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        const newUsage = initialUsage + usageDiff * easedProgress;
        const newOffset = initialOffset + offsetDiff * easedProgress;

        // Update values
        setDisplayedEnergyUsage(Math.round(newUsage));
        setDisplayedOffset(newOffset);

        // Clear interval when done
        if (progress >= 1) {
          clearInterval(timer);
          setDisplayedEnergyUsage(energyUsage);
          setDisplayedOffset(targetOffset);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [energyUsage, circumference]);

  // Replace the offset calculation to use the animated value
  // const offset = circumference - (energyUsage / 100) * circumference;

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

  // Only fetch data when homeId is available
  useEffect(() => {
    if (homeId) {
      fetchSolarMetrics();
      fetchEnergyFlowData();
      fetchWeatherData();
    }
  }, [homeId]);

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
     Type,${
       activeYieldTab === "today"
         ? "Daily (kWh)"
         : activeYieldTab === "monthly"
         ? "Monthly (kWh)"
         : "Annual (kWh)"
     }
     PV,${data.pvGeneration}
     Imported,${data.importedEnergy}
     Exported,${data.exportedEnergy}
     Load,${data.loadEnergy}
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

  // Updated fetchSolarData function to fetch from our API with auth token
  const fetchSolarMetrics = async () => {
    if (!homeId) return;

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No authentication token found");
        navigate("/signin");
        return;
      }

      // First try the authenticated endpoint
      let response;
      try {
        response = await fetch(
          `https://homesync-production.up.railway.app/api/solar/metrics/${homeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        // If that fails, try the debug endpoint
        console.log("Falling back to debug endpoint");
        response = await fetch(
          `https://homesync-production.up.railway.app/api/solar/debug/metrics/${homeId}`
        );
      }

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to sign in page if unauthorized
          navigate("/signin");
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Update states with data from API
      setCurrentPower(Math.round(Number(data.batteryLevel) * 10) || 0); // Convert to kW
      setEnergyUsage(Math.round(Number(data.batteryLevel)) || 0); // Use as percentage

      // Update environmental benefits
      setEnvironmental({
        trees: Number(data.equivalentTrees) || 0,
        coalSaved: Number(data.standardCoalSaved) || 0,
        co2Saved: Number(data.co2EmissionsSaved) || 0,
      });

      // Set estimate generation (can be derived from battery level or set directly)
      setEstimateGeneration(Math.round(Number(data.batteryLevel) * 20) || 0);
    } catch (error) {
      console.error("Error fetching solar metrics:", error);
      // Keep the default values on error
    }
  };

  // New function to fetch energy flow data with auth token
  const fetchEnergyFlowData = async () => {
    if (!homeId) return;

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No authentication token found");
        navigate("/signin");
        return;
      }

      // First try the authenticated endpoint
      let response;
      try {
        response = await fetch(
          `https://homesync-production.up.railway.app/api/solar/energy-flow/${homeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        // If that fails, try the debug endpoint
        console.log("Falling back to debug endpoint");
        response = await fetch(
          `https://homesync-production.up.railway.app/api/solar/debug/energy-flow/${homeId}`
        );
      }

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to sign in page if unauthorized
          navigate("/signin");
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Make sure all values are properly converted to numbers
      const processedData: EnergyFlowData = {
        today: {
          yield: Number(data.today.pvGeneration) || 0,
          pvGeneration: Number(data.today.pvGeneration) || 0,
          importedEnergy: Number(data.today.importedEnergy) || 0,
          exportedEnergy: Number(data.today.exportedEnergy) || 0,
          loadEnergy: Number(data.today.loadEnergy) || 0,
        },
        monthly: {
          yield: Number(data.monthly.pvGeneration) || 0,
          pvGeneration: Number(data.monthly.pvGeneration) || 0,
          importedEnergy: Number(data.monthly.importedEnergy) || 0,
          exportedEnergy: Number(data.monthly.exportedEnergy) || 0,
          loadEnergy: Number(data.monthly.loadEnergy) || 0,
        },
        total: {
          yield: Number(data.total.pvGeneration) || 0,
          pvGeneration: Number(data.total.pvGeneration) || 0,
          importedEnergy: Number(data.total.importedEnergy) || 0,
          exportedEnergy: Number(data.total.exportedEnergy) || 0,
          loadEnergy: Number(data.total.loadEnergy) || 0,
        },
      };

      setEnergyFlowData(processedData);
    } catch (error) {
      console.error("Error fetching energy flow data:", error);
      // Keep the default values on error
    }
  };

  // Keep the existing weather API fetch function
  const fetchWeatherData = async () => {
    try {
      // For now we'll just use static weather data
      // In a real app, you'd call a weather API here
      setWeather({
        condition: "Light Rain to Few Clouds",
        sunrise: "05:59",
        sunset: "17:56",
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // Keep default values
    }
  };

  // Rest of your component stays the same...

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
                (
                  item.path === "/energy"
                    ? isEnergyActive
                    : activeTab === item.path
                )
                  ? "active"
                  : ""
              }`}
              style={{
                padding: (
                  item.path === "/energy"
                    ? isEnergyActive
                    : activeTab === item.path
                )
                  ? "0 20px"
                  : "0 12px",
                minWidth: (
                  item.path === "/energy"
                    ? isEnergyActive
                    : activeTab === item.path
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
        <svg
          className="progress-circle"
          viewBox="0 0 256 256"
          width="100%"
          height="100%"
        >
          {/* Background and progress circles */}
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
            strokeDashoffset={displayedOffset}
          />
          {/* Add a yellow background circle for text with linear gradient */}
          <circle
            cx="128"
            cy="128"
            r="100"
            fill="url(#textBackgroundGradient)"
            opacity="1"
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
            <linearGradient
              id="textBackgroundGradient"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#FFB00F" />
              <stop offset="100%" stopColor="#FFD602" />
            </linearGradient>
          </defs>
        </svg>
        <div className="progress-text">
          <p className="energy-usages">Solar Battery</p>
          <h2 className="energy-percent">{displayedEnergyUsage}%</h2>
          <p className="energy-usages">{currentPower} kW</p>
        </div>
        <div className="progress-icon" onClick={() => setShowEnergyFlow(true)}>
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
  const EnvironmentalBenefits = () => {
    // Helper function to safely format numbers
    const formatNumber = (value: any, decimals: number = 1): string => {
      if (value === null || value === undefined || isNaN(Number(value))) {
        return "0.0"; // Default value if not a valid number
      }
      return Number(value).toFixed(decimals);
    };

    return (
      <>
        <h5 className="weather-prediction">Environmental Benefits</h5>
        <div className="env-benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">
              <IoLeafOutline size={24} />
            </div>
            <div className="benefit-details">
              <p className="benefit-title">Equivalent Trees Planted</p>
              <p className="benefit-value">
                {formatNumber(environmental.trees)}
              </p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <PiFactory size={24} /> {/* CO2 emissions icon */}
            </div>
            <div className="benefit-details">
              <p className="benefit-title">CO2 Emission Saved</p>
              <p className="benefit-value">
                {formatNumber(environmental.co2Saved)} kg
              </p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <GiCoalPile size={24} /> {/* Coal icon */}
            </div>
            <div className="benefit-details">
              <p className="benefit-title">Standard Coal Saved</p>
              <p className="benefit-value">
                {formatNumber(environmental.coalSaved)} kg
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Update your EnergyFlowPanel component to use the new field names
  const EnergyFlowPanel = () => {
    // const currentData =
    //   activeYieldTab === "today"
    //     ? energyFlowData.today
    //     : activeYieldTab === "monthly"
    //     ? energyFlowData.monthly
    //     : energyFlowData.total;

    return (
      <div className="energy-flow-panel">
        {/* Same structure as before but update field references */}
        <div className="energy-flow-header">
          <h3
            className="fw-bold"
            style={{ color: "#FFFFFF", fontSize: "1.5rem" }}
          >
            Energy Flow
          </h3>
          <button className="upload-button" onClick={handleShareClick}>
            <Upload size={18} />
          </button>
        </div>

        <div className="yield-tabs">
          {/* Update to use new field names */}
          <button
            className={`yield-tab ${
              activeYieldTab === "today" ? "active" : ""
            }`}
            onClick={() => setActiveYieldTab("today")}
          >
            Today Yield
            <span className="yield-value">
              {energyFlowData.today.yield.toFixed(1)} kWh
            </span>
          </button>
          <button
            className={`yield-tab ${
              activeYieldTab === "monthly" ? "active" : ""
            }`}
            onClick={() => setActiveYieldTab("monthly")}
          >
            Monthly Yield
            <span className="yield-value">
              {energyFlowData.monthly.yield.toFixed(1)} kWh
            </span>
          </button>
          <button
            className={`yield-tab ${
              activeYieldTab === "total" ? "active" : ""
            }`}
            onClick={() => setActiveYieldTab("total")}
          >
            Total Yield
            <span className="yield-value">
              {energyFlowData.total.yield.toFixed(1)} kWh
            </span>
          </button>
        </div>

        <div className="energy-flow-table">
          <div className="flow-period-tabs">
            <button
              className={`period-tab ${
                activeYieldTab === "today" ? "active" : ""
              }`}
              onClick={() => setActiveYieldTab("today")}
            >
              Daily
            </button>
            <button
              className={`period-tab ${
                activeYieldTab === "monthly" ? "active" : ""
              }`}
              onClick={() => setActiveYieldTab("monthly")}
            >
              Monthly
            </button>
            <button
              className={`period-tab ${
                activeYieldTab === "total" ? "active" : ""
              }`}
              onClick={() => setActiveYieldTab("total")}
            >
              Annual
            </button>
          </div>

          <div className="flow-data-rows">
            <div className="flow-data-row">
              <div className="data-label">
                <span className="color-indicator pv"></span>
                <span>PV Generation</span>
                <span
                  className="info-icon"
                  onClick={(e) => handleInfoClick("PV (Photovoltaic)", e)}
                >
                  ⓘ
                </span>
              </div>
              <div className="data-value">
                {energyFlowData.today.pvGeneration.toFixed(2)} kWh
              </div>
              <div className="data-value">
                {energyFlowData.monthly.pvGeneration.toFixed(1)} kWh
              </div>
              <div className="data-value">
                {energyFlowData.total.pvGeneration.toFixed(1)} kWh
              </div>
            </div>

            <div className="flow-data-row">
              <div className="data-label">
                <span className="color-indicator imported"></span>
                <span>Imported</span>
                <span
                  className="info-icon"
                  onClick={(e) => handleInfoClick("Imported", e)}
                >
                  ⓘ
                </span>
              </div>
              <div className="data-value">
                {energyFlowData.today.importedEnergy.toFixed(2)} kWh
              </div>
              <div className="data-value">
                {energyFlowData.monthly.importedEnergy.toFixed(1)} kWh
              </div>
              <div className="data-value">
                {energyFlowData.total.importedEnergy.toFixed(1)} kWh
              </div>
            </div>

            <div className="flow-data-row">
              <div className="data-label">
                <span className="color-indicator exported"></span>
                <span>Exported</span>
                <span
                  className="info-icon"
                  onClick={(e) => handleInfoClick("Exported", e)}
                >
                  ⓘ
                </span>
              </div>
              <div className="data-value">
                {energyFlowData.today.exportedEnergy.toFixed(2)} kWh
              </div>
              <div className="data-value">
                {energyFlowData.monthly.exportedEnergy.toFixed(1)} kWh
              </div>
              <div className="data-value">
                {energyFlowData.total.exportedEnergy.toFixed(1)} kWh
              </div>
            </div>

            <div className="flow-data-row">
              <div className="data-label">
                <span className="color-indicator load"></span>
                <span>Load</span>
                <span
                  className="info-icon"
                  onClick={(e) => handleInfoClick("Load", e)}
                >
                  ⓘ
                </span>
              </div>
              <div className="data-value">
                {energyFlowData.today.loadEnergy.toFixed(2)} kWh
              </div>
              <div className="data-value">
                {energyFlowData.monthly.loadEnergy.toFixed(1)} kWh
              </div>
              <div className="data-value">
                {energyFlowData.total.loadEnergy.toFixed(1)} kWh
              </div>
            </div>
          </div>
        </div>

        {/* Download confirmation dialog */}
        {showDownloadConfirm && (
          <div className="download-confirm-overlay">
            <div className="download-confirm-dialog text-center">
              <h3>Download Energy Report</h3>
              <img src={pdfIcon}></img>
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
          <div
            className="d-flex align-items-center px-5 mt-3"
            style={{ position: "absolute" }}
          >
            <div className="m-3">
              <LogoSmartHome />
            </div>
            <h3 className="homesync-title">HomeSync</h3>
          </div>
          {/* Navigation Bar for laptop view */}
          <nav className="fixed-bottom px-3 py-2 bottom-navbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`btn flex-grow-0 nav-button ${
                  (
                    item.path === "/energy"
                      ? isEnergyActive
                      : activeTab === item.path
                  )
                    ? "active"
                    : ""
                }`}
                style={{
                  padding: (
                    item.path === "/energy"
                      ? isEnergyActive
                      : activeTab === item.path
                  )
                    ? "0 20px"
                    : "0 12px",
                  minWidth: (
                    item.path === "/energy"
                      ? isEnergyActive
                      : activeTab === item.path
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
                    <span className="ms-2 fw-medium nav-label">
                      {item.label}
                    </span>
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
                <h3
                  className="fw-bold"
                  style={{ color: "#FFFFFF", fontSize: "1.5rem" }}
                >
                  Solar Energy Status
                </h3>

                {/* Energy Usage Circular Progress */}
                <CircularProgress />

                <div className="weather-benefits-container">
                  {/* Weather Section */}
                  <div className="laptop-weather-section">
                    <WeatherSection />
                  </div>

                  {/* Estimated Generation */}
                  <div className="estimate-generation-laptop">
                    <p className="estimation">
                      Estimate Generation: {estimateGeneration} kW
                    </p>
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
          <div
            className="solar-container"
            style={{
              height: "100vh",
              overflow: "hidden", // Prevent the whole container from scrolling
              position: "relative", // Add positioning context
            }}
          >
            {/* Solar Energy Heading */}
            <div className="header-wrapper">
              <div className="header-spacer"></div>
              <h3
                className="fw-bold me-2"
                style={{ color: "#FFFFFF", fontSize: "1.5rem" }}
              >
                Solar Energy Status
              </h3>
              <button
                className="btn rounded-circle p-2 d-flex align-items-center justify-content-center filter-button"
                onClick={() => setShowEnergyFlow(true)}
              >
                <Sliders className="filter-icon" stroke="black" size={16} />
              </button>
            </div>
            {/* Energy Usage Circular Progress */}
            <CircularProgress />
            <div
              className="info-container container-fluid px-0"
              style={{
                position: "absolute", // Position absolutely
                bottom: 0, // Attach to bottom
                left: 0, // Attach to left
                right: 0, // Attach to right
                height: "calc(100% - 410px)",
                borderRadius: "30px 30px 0 0",
                backgroundColor: "white",
                overflowY: "auto", // Allow vertical scrolling within this container
                // paddingBottom: "80px", // Add extra padding for bottom navbar
              }}
            >
              <div className="px-4" style={{ height: "calc(100% - 120px)" }}>
                <div className="overflow-auto" style={{ height: "100%" }}>
                  {/* Weather Section */}
                  <WeatherSection />

                  {/* Estimated Generation */}
                  <div className="estimate-generation">
                    <p className="estimation ps-0">
                      Estimate Generation: {estimateGeneration} kW
                    </p>
                  </div>

                  {/* Environmental Benefits */}
                  <EnvironmentalBenefits />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTooltip === "PV (Photovoltaic)" && (
        <div className="download-confirm-overlay">
          <div className="download-confirm-dialog">
            <h3>{activeTooltip}</h3>
            <div style={{ fontWeight: "400" }}>{definitions.pv}</div>
          </div>
        </div>
      )}
      {activeTooltip === "Imported" && (
        <div className="download-confirm-overlay">
          <div className="download-confirm-dialog">
            <h3>{activeTooltip}</h3>
            <div style={{ fontWeight: "400" }}>{definitions.imported}</div>
          </div>
        </div>
      )}
      {activeTooltip === "Exported" && (
        <div className="download-confirm-overlay">
          <div className="download-confirm-dialog">
            <h3>{activeTooltip}</h3>
            <div style={{ fontWeight: "400" }}>{definitions.exported}</div>
          </div>
        </div>
      )}
      {activeTooltip === "Load" && (
        <div className="download-confirm-overlay">
          <div className="download-confirm-dialog">
            <h3>{activeTooltip}</h3>
            <div style={{ fontWeight: "400" }}>{definitions.load}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default SolarPage;
