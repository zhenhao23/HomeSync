import React, { useState } from "react";
import { ArrowLeft, Share2, Info, Download } from "lucide-react";
import "./EnergyFlowPage.css";
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
  const [energyData, setEnergyData] = React.useState<EnergyData>({
    pv: {
      daily: 22.7,
      monthly: 631,
      annual: 649,
      current: 7.93,
    },
    imported: {
      daily: 0.6,
      monthly: 365.4,
      annual: 403.8,
      current: 0,
    },
    exported: {
      daily: 18.6,
      monthly: 450.9,
      annual: 451.2,
      current: 7.17,
    },
    load: {
      daily: 4.7,
      monthly: 545.5,
      annual: 601.5,
      current: 0.76,
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

  const fetchEnergyData = async () => {
    try {
      const response = await fetch("https://api.example.com/energy-flow");
      const data = await response.json();
      setEnergyData(data);
    } catch (error) {
      console.error("Error fetching energy flow data:", error);
    }
  };

  React.useEffect(() => {
    fetchEnergyData();
    const interval = setInterval(fetchEnergyData, 60000);
    return () => clearInterval(interval);
  }, []);

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
    // Handle the actual download here
    console.log("Downloading energy report...");
    // You would implement the actual download functionality here
    // For example, generate a PDF or CSV file with the energy data

    // Example: creating a simple CSV
    const csvContent = `
     Type,Daily (kWh),Monthly (kWh),Annual (kWh),Current (kW)
     PV,${energyData.pv.daily},${energyData.pv.monthly},${energyData.pv.annual},${energyData.pv.current}
     Imported,${energyData.imported.daily},${energyData.imported.monthly},${energyData.imported.annual},${energyData.imported.current}
     Exported,${energyData.exported.daily},${energyData.exported.monthly},${energyData.exported.annual},${energyData.exported.current}
     Load,${energyData.load.daily},${energyData.load.monthly},${energyData.load.annual},${energyData.load.current}
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
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={24} />
          <span>Back</span>
        </button>
        <h1>Energy Flow</h1>
        <button className="share-button" onClick={handleShareClick}>
          <Share2 size={24} />
        </button>
      </header>

      <div className="content-wrapper">
        <div className="yield-summary">
          <div className="yield-item">
            <span className="yield-label">Today Yield</span>
            <strong className="yield-value">{energyData.pv.daily}</strong>
            <span className="yield-unit">kWh</span>
          </div>
          <div className="yield-item">
            <span className="yield-label">Monthly Yield</span>
            <strong className="yield-value">{energyData.pv.monthly}</strong>
            <span className="yield-unit">kWh</span>
          </div>
          <div className="yield-item">
            <span className="yield-label">Total Yield</span>
            <strong className="yield-value">{energyData.pv.annual}</strong>
            <span className="yield-unit">kWh</span>
          </div>
        </div>

        <div className="flow-diagram">
          <div className="node pv-node" style={{ top: "60px", left: "15%" }}>
            <div
              className="node-circle"
              style={{ border: "3px solid #ffe100" }}
            >
              <div className="node-icon">
                {/* Replace emoji with SVG icon that looks like the one in the image */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3V4M5.5 6.5L6.5 7.5M18.5 6.5L17.5 7.5M6 12H4M20 12H18"
                    stroke="#444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 7C9.5 7 8 8.5 8 11.5C8 13 9 15 11 15L13 15C15 15 16 13 16 11.5C16 8.5 14.5 7 12 7Z"
                    stroke="#444"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M9 15L8 18M15 15L16 18"
                    stroke="#444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="node-value">{energyData.pv.current}kW</span>
            </div>
            <span className="node-label">PV</span>
          </div>

          <div className="node grid-node" style={{ top: "60px", right: "15%" }}>
            <div
              className="node-circle"
              style={{ border: "3px solid #4a90e2" }}
            >
              <div className="node-icon">
                {/* Replace emoji with SVG that looks like a power pole */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3V21"
                    stroke="#444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 6L16 6"
                    stroke="#444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 10L17 10"
                    stroke="#444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 14L18 14"
                    stroke="#444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="node-value">
                {energyData.exported.current}kW
              </span>
            </div>
            <span className="node-label">Grid</span>
          </div>

          <div
            className="node battery-node"
            style={{ top: "150px", left: "50%", transform: "translateX(-50%)" }}
          >
            <div
              className="node-circle"
              style={{ border: "3px solid #ff9800" }}
            >
              <div className="node-icon">
                {/* Replace emoji with actual battery icon that matches the image */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="6"
                    y="7"
                    width="12"
                    height="14"
                    rx="1"
                    stroke="#444"
                    strokeWidth="1.5"
                  />
                  <path d="M10 3H14V7H10V3Z" stroke="#444" strokeWidth="1.5" />
                  <path
                    d="M9 12L15 12"
                    stroke="#444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9 16L15 16"
                    stroke="#444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="node home-node"
            style={{ bottom: "20px", right: "15%" }}
          >
            <div
              className="node-circle"
              style={{ border: "3px solid #ffbb80" }}
            >
              <div className="node-icon">
                {/* Replace emoji with house icon that matches the image */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 10L12 4L20 10"
                    stroke="#444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 10V18C6 18.5523 6.44772 19 7 19H17C17.5523 19 18 18.5523 18 18V10"
                    stroke="#444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9 14H15"
                    stroke="#444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 12V16"
                    stroke="#444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="node-value">{energyData.load.current}kW</span>
            </div>
            <span className="node-label">Home</span>
          </div>

          <svg className="flow-arrows" viewBox="0 0 400 300">
            {/* Updated paths with more precise coordinates to match image */}
            <path
              d="M100,90 C140,90 170,110 190,150"
              className="flow-path pv-to-battery"
              style={{ stroke: "#ffe100" }}
            />
            <path
              d="M210,150 C230,110 260,90 300,90"
              className="flow-path battery-to-grid"
              style={{ stroke: "#4a90e2" }}
            />
            <path
              d="M200,180 C200,230 260,250 300,250"
              className="flow-path battery-to-home"
              style={{ stroke: "#ffbb80" }}
            />

            <defs>
              {/* Updated color for yellow arrow for PV */}
              <marker
                id="arrow-yellow"
                markerWidth="8"
                markerHeight="8"
                refX="8"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#ffe100" />
              </marker>

              {/* Updated color for blue arrow for Grid */}
              <marker
                id="arrow-blue"
                markerWidth="8"
                markerHeight="8"
                refX="8"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#4a90e2" />
              </marker>

              {/* Updated color for orange arrow for Home */}
              <marker
                id="arrow-orange"
                markerWidth="8"
                markerHeight="8"
                refX="8"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#ffbb80" />
              </marker>
            </defs>
          </svg>
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
              <span>{energyData.pv.daily}kWh</span>
              <span>{energyData.pv.monthly}kWh</span>
              <span>{energyData.pv.annual}kWh</span>
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
              <span>{energyData.imported.daily}kWh</span>
              <span>{energyData.imported.monthly}kWh</span>
              <span>{energyData.imported.annual}kWh</span>
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
              <span>{energyData.exported.daily}kWh</span>
              <span>{energyData.exported.monthly}kWh</span>
              <span>{energyData.exported.annual}kWh</span>
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
              <span>{energyData.load.daily}kWh</span>
              <span>{energyData.load.monthly}kWh</span>
              <span>{energyData.load.annual}kWh</span>
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
