import React, { useState, useEffect } from "react";
import { ArrowLeft, Share2, Info, Download } from "lucide-react";
import "./EnergyFlowPage.css";
import { useNavigate } from "react-router-dom";

interface EnergyData {
  pv: {
    daily: number;
    monthly: number;
    annual: number;
    current: number;
  };
  imported: {
    daily: number;
    monthly: number;
    annual: number;
    current: number;
  };
  exported: {
    daily: number;
    monthly: number;
    annual: number;
    current: number;
  };
  load: {
    daily: number;
    monthly: number;
    annual: number;
    current: number;
  };
}

interface EnergyFlowPageProps {
  onBack: () => void;
}

const EnergyFlowPage: React.FC<EnergyFlowPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add homeId state
  const [homeId, setHomeId] = useState<number | null>(null);

  const [energyData, setEnergyData] = useState<EnergyData>({
    pv: {
      daily: 0,
      monthly: 0,
      annual: 0,
      current: 0,
    },
    imported: {
      daily: 0,
      monthly: 0,
      annual: 0,
      current: 0,
    },
    exported: {
      daily: 0,
      monthly: 0,
      annual: 0,
      current: 0,
    },
    load: {
      daily: 0,
      monthly: 0,
      annual: 0,
      current: 0,
    },
  });

  // States for tooltips
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // State for download confirmation dialog
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);

  // Definitions for tooltips
  const definitions = {
    pv: "Photovoltaic (PV) - Energy generated by your solar panels from sunlight.",
    imported:
      "Imported - Energy taken from the grid when your solar panels and battery (if any) don't produce enough power.",
    exported:
      "Exported - Excess energy sent back to the grid when your solar panels produce more than you use.",
    load: "Load - The total amount of electricity your home is consuming.",
  };

  useEffect(() => {
    // Get the current homeId from localStorage
    const storedHomeId = localStorage.getItem("currentHomeId");

    if (!storedHomeId) {
      console.error("No home ID found in localStorage");
      setError("No home selected. Please select a home first.");
      return;
    }

    setHomeId(parseInt(storedHomeId));
  }, []);

  // Fetch energy data from API when homeId is available
  useEffect(() => {
    if (homeId) {
      fetchEnergyFlowData();
    }
  }, [homeId]);

  // New function to fetch energy flow data with auth token
  const fetchEnergyFlowData = async () => {
    if (!homeId) return;

    try {
      setLoading(true);
      setError(null);

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
          `http://localhost:5000/api/solar/energy-flow/${homeId}`,
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
          `http://localhost:5000/api/solar/debug/energy-flow/${homeId}`
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

      // Transform the API response to match our component's data structure
      const transformedData: EnergyData = {
        pv: {
          daily: Number(data.today.pvGeneration) || 0,
          monthly: Number(data.monthly.pvGeneration) || 0,
          annual: Number(data.total.pvGeneration) || 0,
          current: 0, // Current value not provided by API
        },
        imported: {
          daily: Number(data.today.importedEnergy) || 0,
          monthly: Number(data.monthly.importedEnergy) || 0,
          annual: Number(data.total.importedEnergy) || 0,
          current: 0,
        },
        exported: {
          daily: Number(data.today.exportedEnergy) || 0,
          monthly: Number(data.monthly.exportedEnergy) || 0,
          annual: Number(data.total.exportedEnergy) || 0,
          current: 0,
        },
        load: {
          daily: Number(data.today.loadEnergy) || 0,
          monthly: Number(data.monthly.loadEnergy) || 0,
          annual: Number(data.total.loadEnergy) || 0,
          current: 0,
        },
      };

      setEnergyData(transformedData);
    } catch (error) {
      console.error("Error fetching energy flow data:", error);
      setError("Failed to load energy data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle info icon click
  const handleInfoClick = (type: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setActiveTooltip(activeTooltip === type ? null : type);
  };

  // Function to handle share button click
  const handleShareClick = () => {
    setShowDownloadConfirm(true);
  };

  // Function to handle download confirmation
  const handleDownloadConfirm = () => {
    // Create a simple CSV
    const csvContent = `
     Type,Daily (kWh),Monthly (kWh),Annual (kWh)
     PV,${energyData.pv.daily},${energyData.pv.monthly},${energyData.pv.annual}
     Imported,${energyData.imported.daily},${energyData.imported.monthly},${energyData.imported.annual}
     Exported,${energyData.exported.daily},${energyData.exported.monthly},${energyData.exported.annual}
     Load,${energyData.load.daily},${energyData.load.monthly},${energyData.load.annual}
   `.trim();

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "energy_report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setShowDownloadConfirm(false);
  };

  // Function to handle download cancellation
  const handleDownloadCancel = () => {
    setShowDownloadConfirm(false);
  };

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

  return (
    <div className="energy-flow-container">
      <header className="flow-header">
        <button onClick={onBack} className="ef-back-button">
          <ArrowLeft size={24} />
          <span>Back</span>
        </button>
        <h1 className="energy-flow">Energy Flow</h1>
        <button className="ef-share-button" onClick={handleShareClick}>
          <Share2 size={24} />
        </button>
      </header>

      {loading && (
        <div className="loading-indicator">Loading energy data...</div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="content-wrapper">
        <div className="yield-summary">
          <div className="yield-item">
            <span className="yield-label">Today Yield</span>
            <strong className="yield-value">
              {energyData.pv.daily.toFixed(1)}
            </strong>
            <span className="yield-unit">kWh</span>
          </div>
          <div className="yield-item">
            <span className="yield-label">Monthly Yield</span>
            <strong className="yield-value">
              {energyData.pv.monthly.toFixed(1)}
            </strong>
            <span className="yield-unit">kWh</span>
          </div>
          <div className="yield-item">
            <span className="yield-label">Total Yield</span>
            <strong className="yield-value">
              {energyData.pv.annual.toFixed(1)}
            </strong>
            <span className="yield-unit">kWh</span>
          </div>
        </div>

        <div className="energy-stats">
          <div className="stat-row">
            <div className="stat-label">
              <span className="color-indicator pv"></span>
              <span>PV:</span>
              <button
                className="info-button"
                onClick={(e) => handleInfoClick("pv", e)}
              >
                <Info size={16} />
              </button>
              {activeTooltip === "pv" && (
                <div className="tooltip">{definitions.pv}</div>
              )}
            </div>
            <div className="stat-values">
              <span>{energyData.pv.daily.toFixed(1)}kWh</span>
              <span>{energyData.pv.monthly.toFixed(1)}kWh</span>
              <span>{energyData.pv.annual.toFixed(1)}kWh</span>
            </div>
          </div>
          <div className="stat-row">
            <div className="stat-label">
              <span className="color-indicator imported"></span>
              <span>Imported:</span>
              <button
                className="info-button"
                onClick={(e) => handleInfoClick("imported", e)}
              >
                <Info size={16} />
              </button>
              {activeTooltip === "imported" && (
                <div className="tooltip">{definitions.imported}</div>
              )}
            </div>
            <div className="stat-values">
              <span>{energyData.imported.daily.toFixed(1)}kWh</span>
              <span>{energyData.imported.monthly.toFixed(1)}kWh</span>
              <span>{energyData.imported.annual.toFixed(1)}kWh</span>
            </div>
          </div>
          <div className="stat-row">
            <div className="stat-label">
              <span className="color-indicator exported"></span>
              <span>Exported:</span>
              <button
                className="info-button"
                onClick={(e) => handleInfoClick("exported", e)}
              >
                <Info size={16} />
              </button>
              {activeTooltip === "exported" && (
                <div className="tooltip">{definitions.exported}</div>
              )}
            </div>
            <div className="stat-values">
              <span>{energyData.exported.daily.toFixed(1)}kWh</span>
              <span>{energyData.exported.monthly.toFixed(1)}kWh</span>
              <span>{energyData.exported.annual.toFixed(1)}kWh</span>
            </div>
          </div>
          <div className="stat-row">
            <div className="stat-label">
              <span className="color-indicator load"></span>
              <span>Load:</span>
              <button
                className="info-button"
                onClick={(e) => handleInfoClick("load", e)}
              >
                <Info size={16} />
              </button>
              {activeTooltip === "load" && (
                <div className="tooltip">{definitions.load}</div>
              )}
            </div>
            <div className="stat-values">
              <span>{energyData.load.daily.toFixed(1)}kWh</span>
              <span>{energyData.load.monthly.toFixed(1)}kWh</span>
              <span>{energyData.load.annual.toFixed(1)}kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download confirmation dialog */}
      {showDownloadConfirm && (
        <div className="download-confirm-overlay">
          <div className="download-confirm-dialog">
            <h3>Download Energy Report</h3>
            <p>Do you want to download the energy report?</p>
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

export default EnergyFlowPage;
