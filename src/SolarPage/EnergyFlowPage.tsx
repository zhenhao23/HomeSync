import React, { useState, useEffect } from "react";
import { Share2, Info, Download } from "lucide-react";
import "./EnergyFlowPage.css";
import { useNavigate } from "react-router-dom";
import pdfIcon2 from "../assets/energy/download-pdf-icon.svg";
import { IoIosArrowBack } from "react-icons/io";

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
    pv: "This refers to the technology used in solar panels to convert sunlight into electricity. 'PV' usually means your solar panel system.",
    imported:
      "This is the energy brought in from the grid. When your solar panels aren’t producing enough power, your home draws energy from the utility grid, which is 'imported'.",
    exported:
      "This is the energy sent back to the grid. When your solar panels produce more power than your home is using, the excess is 'exported' to the grid, which might earn you credits depending on your utility plan.",
    load: "This term refers to the total energy demand or consumption of your home at a given moment. It’s the amount of power your appliances and devices are drawing.",
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
    setActiveTooltip(type);
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
      <div className="flow-header">
        <div
          className="back-button"
          onClick={onBack}
          style={{
            padding: "8px 0px",
            cursor: "pointer",
            position: "absolute",
          }}
        >
          <IoIosArrowBack size={22} color="#FFFFFF" />
          <span
            style={{
              color: "#FFFFFF",
              fontSize: "16px",
            }}
          >
            Back
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3
            className="fw-bold me-3 flow-title"
            style={{ color: "#FFFFFF", fontSize: "1.5rem" }}
          >
            Energy Flow
          </h3>
        </div>
        <button className="ef-share-button" onClick={handleShareClick}>
          <Share2 size={24} />
        </button>
      </div>

      {loading && (
        <></>
        // <div className="loading-indicator">Loading energy data...</div>
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
                onClick={(e) => handleInfoClick("PV (Photovoltaic)", e)}
              >
                <Info size={16} />
              </button>
              {activeTooltip === "PV (Photovoltaic)" && (
                <div className="download-confirm-overlay">
                  <div className="download-confirm-dialog">
                    <h3>{activeTooltip}</h3>
                    <div style={{ fontWeight: "400" }}>{definitions.pv}</div>
                  </div>
                </div>
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
                onClick={(e) => handleInfoClick("Imported", e)}
              >
                <Info size={16} />
              </button>
              {activeTooltip === "Imported" && (
                <div className="download-confirm-overlay">
                  <div className="download-confirm-dialog">
                    <h3>{activeTooltip}</h3>
                    <div style={{ fontWeight: "400" }}>
                      {definitions.imported}
                    </div>
                  </div>
                </div>
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
                onClick={(e) => handleInfoClick("Exported", e)}
              >
                <Info size={16} />
              </button>
              {activeTooltip === "Exported" && (
                <div className="download-confirm-overlay">
                  <div className="download-confirm-dialog">
                    <h3>{activeTooltip}</h3>
                    <div style={{ fontWeight: "400" }}>
                      {definitions.exported}
                    </div>
                  </div>
                </div>
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
                onClick={(e) => handleInfoClick("Load", e)}
              >
                <Info size={16} />
              </button>
              {activeTooltip === "Load" && (
                <div className="download-confirm-overlay">
                  <div className="download-confirm-dialog">
                    <h3>{activeTooltip}</h3>
                    <div style={{ fontWeight: "400" }}>{definitions.load}</div>
                  </div>
                </div>
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
          <div className="download-confirm-dialog text-center">
            <h3>Download Energy Report</h3>
            <img src={pdfIcon2}></img>
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
