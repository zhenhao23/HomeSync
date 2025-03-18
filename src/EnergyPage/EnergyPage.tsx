import React, { useState, useEffect } from 'react';
import { FaPlus, FaCaretUp, FaCaretDown, FaDownload, FaUpload } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { Sliders, Download } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import "./EpLaptop.css";
// Import your device images and other assets
import LampImage from "../assets/devices/lamp.svg";
import AirCondImage from "../assets/devices/aircond1.svg";
import PetFeederImage from "../assets/devices/petfeeder.svg";
import IrrigationImage from "../assets/devices/irrigation.svg";
import SecurityImage from "../assets/devices/security.svg";
import EnergyLimitImage from "../assets/energy/energylimit.svg";
import SwipeableCharts from './SwipeableCharts';

const EnergyPage = () => {
  // Window size hook for responsive design
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

  const isLaptop = windowSize.width >= 1440;
  const [energyUsage, setEnergyUsage] = useState(80);
  const [activeYieldTab, setActiveYieldTab] = useState("today");
  const [energyLimitType, setEnergyLimitType] = useState("Select Type");
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);

  // Device data
  const devices = [
    {
      image: LampImage,
      title: "Lamp",
      usage: "1000 Kw/h",
      room: "Bedroom",
      hours: "20 hours",
      trend: 11.2,
    },
    {
      image: AirCondImage,
      title: "Air Cond",
      usage: "1000 Kw/h",
      room: "Bedroom",
      hours: "12 hours",
      trend: -10.2,
    },
    {
      image: IrrigationImage,
      title: "Irrigation",
      usage: "22 Kb/s",
      room: "Garden",
      hours: "3 Hours",
      trend: -20.2,
    },
    {
      image: PetFeederImage,
      title: "Pet Feeder",
      usage: "22 Kb/s",
      room: "Living Room",
      hours: "3 Hours",
      trend: -10.2,
    },
    {
      image: SecurityImage,
      title: "Home Security",
      usage: "1000 Kw/h",
      room: "Living Room",
      hours: "12 hours",
      trend: -100.2,
    },
  ];

  // Chart data
  const lineData = [
    { day: "Mon", total: 100 },
    { day: "Tue", total: 200 },
    { day: "Wed", total: 150 },
    { day: "Thu", total: 100 },
    { day: "Fri", total: 200 },
    { day: "Sat", total: 250 },
    { day: "Sun", total: 200 },
  ];

  // Updated pie data to match the mobile view data
  const pieData = [
    { name: "Lamp", value: 1000 },
    { name: "Air Cond", value: 700 },
    { name: "Pet Feeder", value: 300 },
    { name: "Irrigation", value: 400 },
    { name: "Home Security", value: 1200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF69B4"];

  // Function to handle download report button click
  const handleDownloadClick = () => {
    setShowDownloadConfirm(true);
  };

  // Function to handle download confirmation
  const handleDownloadConfirm = () => {
    console.log("Downloading energy report...");
    
    // Create a CSV content string with device energy usage data
    const csvContent = `
     Device,Room,Usage,Hours,Trend
     ${devices.map(device => `${device.title},${device.room},${device.usage},${device.hours},${device.trend}%`).join('\n')}
     
     Energy Usage Summary (Weekly):
     ${pieData.map(item => `${item.name},${item.value} kW/h`).join('\n')}
     
     Daily Energy Usage:
     ${lineData.map(item => `${item.day},${item.total} kW/h`).join('\n')}
   `.trim();

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "energy_usage_report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setShowDownloadConfirm(false);
  };

  // Function to handle download cancellation
  const handleDownloadCancel = () => {
    setShowDownloadConfirm(false);
  };

  if (!isLaptop) {
    return (
      <>
        <SwipeableCharts />
        <div
          className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column"
          style={{
            top: "40%",
            height: "100%",
            borderRadius: "18px",
          }}
        >
          <div className="container-fluid p-3 pb-2">
            <div className="row align-items-center mb-3">
              <div className="col-4 text-start">
                <h5 className="mb-0 ms-3">
                  Total{" "}
                  <span
                    className="px-2"
                    style={{
                      backgroundColor: "#4C7380",
                      borderRadius: "4px",
                      color: "white",
                      fontSize: "16px",
                      paddingBottom: "2px",
                      paddingTop: "2px",
                    }}
                  >
                    5
                  </span>
                </h5>
              </div>
              <div className="col-4 text-center"></div>
              <div className="col-4 text-end d-flex justify-content-end">
                <button
                  className="me-2 btn rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "#204160",
                    width: "30px",
                    height: "30px",
                  }}
                >
                  <FaPlus color="white" />
                </button>
              </div>
            </div>
          </div>

          {/* Devices List */}
          <div
            className="container-fluid overflow-auto px-4"
            style={{
              height: "calc(100% - 430px)",
            }}
          >
            <div className="row g-3 pb-5">
              {devices.map((device, index) => (
                <div key={index} className="col-12 mt-3">
                  <div
                    className="p-3"
                    style={{
                      backgroundColor: "#D8E4E8",
                      borderRadius: "8px",
                      height: "100%",
                    }}
                  >
                    <div className="row align-items-center">
                      <div className="col-3">
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: "white",
                            borderRadius: "100%",
                            padding: "15px",
                            height: "60px",
                            width: "60px",
                          }}
                        >
                          <img
                            src={device.image}
                            alt={device.title}
                            className="img-fluid"
                            style={{ maxHeight: "30px" }}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <h6 className="mb-0">{device.title}</h6>
                        <div className="text-muted small mb-0">{device.room}</div>
                        <div className="text-muted small">{device.hours}</div>
                      </div>
                      <div className="col-3 text-end d-flex flex-column align-items-end ps-0">
                        <div className="mb-1" style={{ fontSize: "14px" }}>
                          {device.usage}
                        </div>
                        <div className="d-flex align-items-center">
                          {device.trend > 0 ? (
                            <FaCaretUp
                              className="me-1"
                              style={{ color: "#4CAF50" }}
                            />
                          ) : (
                            <FaCaretDown
                              className="me-1"
                              style={{ color: "#FF5252" }}
                            />
                          )}
                          <small
                            style={{
                              color: device.trend > 0 ? "#4CAF50" : "#FF5252",
                            }}
                          >
                            {Math.abs(device.trend)}%
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }; 
  // Laptop view
  return (
    <div className="dashboard-container">
      {/* Left Panel - Energy Usage Charts */}
      <div className="energy-usage-panel">
          {/* Line Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h2 className="chart-title">Energy Usage</h2>
              <div className="chart-subtitle">
                <BsChevronDown size={10} className="me-2" />
                <span>This Week</span>
              </div>
            </div>
            <div className="wattage-display">2500 watt</div>
            <div className="chart-container">
              <div className="chart-label">kW/h</div>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="day" 
                    stroke="white" 
                    tick={{ fill: "white" }} 
                    style={{ fontSize: "12px" }} 
                  />
                  <YAxis 
                    stroke="white" 
                    tick={{ fill: "white" }} 
                    ticks={[0, 100, 200, 300]} 
                    domain={[0, 300]} 
                    style={{ fontSize: "12px" }} 
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "none",
                      color: "white",
                    }}
                    formatter={(value) => [`${value} kW/h`, "Total Usage"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#B3E59F"
                    strokeWidth={3}
                    dot={{ fill: "#B3E59F", r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Updated to match mobile view */}
          <div className="pie-chart-card">
            <div className="chart-header">
              <h2 className="chart-title">Device Usage</h2>
              <div className="chart-subtitle">
                <BsChevronDown size={10} className="me-2" />
                <span>This Week</span>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="60%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      border: "none",
                      color: "white",
                    }}
                    formatter={(value) => [`${value} kW/h`, "Usage"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                {pieData.map((entry, index) => (
                  <div key={`legend-${index}`} className="chart-data-row">
                    <div className="legend-item">
                      <div 
                        className="legend-color" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span>{entry.name}</span>
                    </div>
                    <span>{entry.value} kW/h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      {/* Middle Panel - Devices List */}
      <div className="devices-panel">
        <div className="devices-header">
          <h2>
            My Devices <span className="device-count">{devices.length}</span>
          </h2>
          <button className="add-device-btn">
            <FaPlus />
          </button>
        </div>
        <div className="devices-list">
          {devices.map((device, index) => (
            <div key={index} className="device-item">
              <div className="device-icon">
                <img src={device.image} alt={device.title} width="40" />
              </div>
              <div className="device-details">
                <div className="device-title">{device.title}</div>
                <div className="device-meta">{device.room} · {device.hours}</div>
              </div>
              <div className="device-usage">
                <div className="usage-value">{device.usage}</div>
                <div className={`usage-trend ${device.trend > 0 ? 'trend-up' : 'trend-down'}`}>
                  {device.trend > 0 ? <FaCaretUp /> : <FaCaretDown />}
                  {Math.abs(device.trend)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Sidebar */}
      <div className="right-sidebar">
        {/* Download Energy Data Card */}
        <div className="download-card">
          <h3 className="download-title">Download Energy Data</h3>
          <div className="pdf-icon">
            <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0H10C4.5 0 0 4.5 0 10V90C0 95.5 4.5 100 10 100H70C75.5 100 80 95.5 80 90V30L50 0Z" fill="#E2E5E7"/>
              <path d="M50 0V20C50 25.5 54.5 30 60 30H80L50 0Z" fill="#B0B7BD"/>
              <path d="M80 30L65 15V30H80Z" fill="#CAD1D8"/>
              <rect x="10" y="40" width="60" height="50" rx="5" fill="#F15642"/>
              <path d="M20 65H60V70H20V65Z" fill="white"/>
              <path d="M20 55H60V60H20V55Z" fill="white"/>
              <path d="M20 75H40V80H20V75Z" fill="white"/>
            </svg>
          </div>
          <button onClick={handleDownloadClick} className="download-button">
            <FaDownload size={14} />
            <span className="ms-2">Download Report</span>
          </button>
        </div>

        {/* Energy Limit Card */}
        <div className="limit-card">
          <h3 className="limit-title">Energy Limit</h3>
          <div className="limit-image">
            <img src={EnergyLimitImage} alt="Energy Limit" width="100" />
          </div>
          <p className="limit-text">Set your energy consumption limit here</p>
          <div className="limit-controls">
            <select 
              className="type-select"
              value={energyLimitType}
              onChange={(e) => setEnergyLimitType(e.target.value)}
            >
              <option value="Select Type">Select Type</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <div className="limit-input-group">
              <input type="number" className="limit-input" placeholder="Enter limit" />
              <span className="limit-unit">kW/h</span>
            </div>
            <p className="limit-help">System will notify you when energy reaches limit</p>
            <button className="edit-button">
              <Sliders size={16} className="me-2" />
              Set Limit
            </button>
          </div>
        </div>
      </div>

      {/* Download confirmation dialog */}
      {showDownloadConfirm && (
        <div className="download-confirm-overlay">
          <div className="download-confirm-dialog">
            <h3>Download Energy Report</h3>
            <p>Do you want to download the energy usage report for all devices?</p>
            <div className="dialog-buttons">
              <button onClick={handleDownloadCancel} className="cancel-button">Cancel</button>
              <button onClick={handleDownloadConfirm} className="confirm-button">
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

export default EnergyPage;

// import React, { useEffect, useState } from "react";
// import { FaPlus, FaCaretUp, FaCaretDown } from "react-icons/fa";
// import SwipeableCharts from "./SwipeableCharts";
// import LampImage from "../assets/devices/lamp.svg";
// import AirCondImage from "../assets/devices/aircond1.svg";
// import PetFeederImage from "../assets/devices/petfeeder.svg";
// import IrrigationImage from "../assets/devices/irrigation.svg";
// import SecurityImage from "../assets/devices/security.svg";

// interface EnergyBreakdown {
//   device: {
//     displayName: string;
//     type: string;
//     room: {
//       name: string;
//     };
//   };
//   energyUsed: number;
//   activeHours: number;
//   timestamp: string;
// }

// interface ProcessedDevice {
//   image: string;
//   title: string;
//   usage: string;
//   room: string;
//   hours: string;
//   trend: number;
// }

// const EnergyPage: React.FC = () => {
//   const [devices, setDevices] = useState<ProcessedDevice[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const deviceImages: { [key: string]: string } = {
//     LIGHT: LampImage,
//     AC: AirCondImage,
//     PET_FEEDER: PetFeederImage,
//     IRRIGATION: IrrigationImage,
//     SECURITY: SecurityImage,
//   };

//   const processEnergyData = (rawData: EnergyBreakdown[]): ProcessedDevice[] => {
//     // Group breakdowns by device
//     const deviceGroups = rawData.reduce((acc, entry) => {
//       const key = entry.device.displayName;
//       if (!acc[key]) {
//         acc[key] = [];
//       }
//       acc[key].push(entry);
//       return acc;
//     }, {} as Record<string, EnergyBreakdown[]>);

//     return Object.entries(deviceGroups).map(([deviceName, entries]) => {
//       const sortedEntries = entries.sort(
//         (a, b) =>
//           new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//       );

//       const latestEntry = sortedEntries[0];
//       const previousEntry = sortedEntries[1];

//       const todayEnergy = Number(latestEntry.energyUsed) / 1000; // Convert to kWh
//       const yesterdayEnergy = previousEntry
//         ? Number(previousEntry.energyUsed) / 1000
//         : 0;

//       const trend = previousEntry
//         ? ((todayEnergy - yesterdayEnergy) / yesterdayEnergy) * 100
//         : 0;

//       return {
//         image: deviceImages[latestEntry.device.type] || SecurityImage,
//         title: deviceName,
//         usage: `${todayEnergy.toFixed(1)} kWh`,
//         room: latestEntry.device.room.name,
//         hours: `${Math.round(latestEntry.activeHours)} hours`,
//         trend: Number(trend.toFixed(1)),
//       };
//     });
//   };

//   useEffect(() => {
//     const fetchEnergyData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(
//           "http://localhost:5000/api/devices/energy/breakdown"
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch energy breakdown");
//         }
//         const data: EnergyBreakdown[] = await response.json();
//         setDevices(processEnergyData(data));
//         setError(null);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchEnergyData();
//   }, []);

//   if (isLoading) {
//     return <div className="text-center p-4">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center p-4 text-danger">Error: {error}</div>;
//   }

//   return (
//     <>
//       <SwipeableCharts />
//       <div
//         className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column"
//         style={{
//           top: "40%",
//           height: "100%",
//           borderRadius: "18px",
//         }}
//       >
//         <div className="container-fluid p-3 pb-2">
//           <div className="row align-items-center mb-3">
//             <div className="col-4 text-start">
//               <h5 className="mb-0 ms-3">
//                 Total{" "}
//                 <span
//                   className="px-2"
//                   style={{
//                     backgroundColor: "#4C7380",
//                     borderRadius: "4px",
//                     color: "white",
//                     fontSize: "16px",
//                     paddingBottom: "2px",
//                     paddingTop: "2px",
//                   }}
//                 >
//                   {devices.length}
//                 </span>
//               </h5>
//             </div>
//             <div className="col-4 text-center"></div>
//             <div className="col-4 text-end d-flex justify-content-end">
//               <button
//                 className="me-2 btn rounded-circle p-2 d-flex align-items-center justify-content-center"
//                 style={{
//                   backgroundColor: "#204160",
//                   width: "30px",
//                   height: "30px",
//                 }}
//               >
//                 <FaPlus color="white" />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div
//           className="container-fluid overflow-auto px-4"
//           style={{
//             height: "calc(100% - 430px)",
//           }}
//         >
//           <div className="row g-3 pb-5">
//             {devices.map((device, index) => (
//               <div key={index} className="col-12 mt-3">
//                 <div
//                   className="p-3"
//                   style={{
//                     backgroundColor: "#D8E4E8",
//                     borderRadius: "8px",
//                     height: "100%",
//                   }}
//                 >
//                   <div className="row align-items-center">
//                     <div className="col-3">
//                       <div
//                         className="d-flex align-items-center justify-content-center"
//                         style={{
//                           backgroundColor: "white",
//                           borderRadius: "100%",
//                           padding: "15px",
//                           height: "60px",
//                           width: "60px",
//                         }}
//                       >
//                         <img
//                           src={device.image}
//                           alt={device.title}
//                           className="img-fluid"
//                           style={{ maxHeight: "30px" }}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-6">
//                       <h6 className="mb-0">{device.title}</h6>
//                       <div className="text-muted small mb-0">{device.room}</div>
//                       <div className="text-muted small">{device.hours}</div>
//                     </div>
//                     <div className="col-3 text-end d-flex flex-column align-items-end ps-0">
//                       <div className="mb-1" style={{ fontSize: "14px" }}>
//                         {device.usage}
//                       </div>
//                       <div className="d-flex align-items-center">
//                         {device.trend > 0 ? (
//                           <FaCaretUp
//                             className="me-1"
//                             style={{ color: "#4CAF50" }}
//                           />
//                         ) : (
//                           <FaCaretDown
//                             className="me-1"
//                             style={{ color: "#FF5252" }}
//                           />
//                         )}
//                         <small
//                           style={{
//                             color: device.trend > 0 ? "#4CAF50" : "#FF5252",
//                           }}
//                         >
//                           {Math.abs(device.trend)}%
//                         </small>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EnergyPage;
