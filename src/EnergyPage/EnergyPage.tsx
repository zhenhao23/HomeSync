import React, { useEffect, useState } from "react";
import { FaPlus, FaCaretUp, FaCaretDown } from "react-icons/fa";
import SwipeableCharts from "./SwipeableCharts";
import LampImage from "../assets/devices/lamp.svg";
import AirCondImage from "../assets/devices/aircond1.svg";
import PetFeederImage from "../assets/devices/petfeeder.svg";
import IrrigationImage from "../assets/devices/irrigation.svg";

type TimeRange = "week" | "month" | "year";

interface DeviceTotal {
  name: string;
  type: string;
  room: string;
  value: number;
  activeHours: number;
  previousValue: number;
  previousActiveHours: number;
}

interface AggregatedData {
  deviceTotals: DeviceTotal[];
  dailyTotals: Array<{
    day: string;
    total: number;
  }>;
}

interface ProcessedDevice {
  image: string;
  title: string;
  usage: string;
  room: string;
  hours: string;
  trend: number;
}

const EnergyPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>({
    deviceTotals: [],
    dailyTotals: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deviceImages: { [key: string]: string } = {
    light: LampImage,
    aircond: AirCondImage,
    petfeeder: PetFeederImage,
    irrigation: IrrigationImage,
  };

  const processDeviceData = (devices: DeviceTotal[]): ProcessedDevice[] => {
    return devices.map((device) => {
      const trend = device.previousValue
        ? ((device.value - device.previousValue) / device.previousValue) * 100
        : 0;

      return {
        image: deviceImages[device.type] || LampImage,
        title: device.name,
        usage: `${device.value.toFixed(0)} kWh`,
        room: device.room,
        hours: `${Math.round(device.activeHours)} hours`,
        trend: Number(trend.toFixed(1)),
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Get the auth token from localStorage (assuming your app stores it there)
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `http://localhost:5000/api/devices/energy/aggregated?timeRange=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch aggregated data");
        }

        const data = await response.json();
        console.log(`Received ${timeRange} data:`, data.deviceTotals);
        setAggregatedData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-danger">Error: {error}</div>;
  }

  const processedDevices = processDeviceData(aggregatedData.deviceTotals);

  return (
    <>
      <SwipeableCharts
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        energyData={aggregatedData}
      />
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
                  {processedDevices.length}
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

        <div
          className="container-fluid overflow-auto px-4"
          style={{
            height: "calc(100% - 430px)",
          }}
        >
          <div className="row g-3 pb-5">
            {processedDevices.map((device, index) => (
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
                    <div className="col-2 ps-3">
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
                    <div className="col-6 ps-5">
                      <h6 className="mb-0">{device.title}</h6>
                      {/* <div className="text-muted small mb-0">{device.room}</div> */}
                      <div className="text-muted small">{device.hours}</div>
                    </div>
                    <div className="col-4 text-end d-flex flex-column align-items-end ps-0">
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

export default EnergyPage;
