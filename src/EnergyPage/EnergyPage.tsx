import React, { useEffect, useState } from "react";
import { FaPlus, FaCaretUp, FaCaretDown } from "react-icons/fa";
import SwipeableCharts from "./SwipeableCharts";
import LampImage from "../assets/devices/lamp.svg";
import AirCondImage from "../assets/devices/aircond1.svg";
import PetFeederImage from "../assets/devices/petfeeder.svg";
import IrrigationImage from "../assets/devices/irrigation.svg";
import SecurityImage from "../assets/devices/security.svg";

interface EnergyBreakdown {
  device: {
    displayName: string;
    type: string;
    room: {
      name: string;
    };
  };
  energyUsed: number;
  activeHours: number;
  timestamp: string;
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
  const [devices, setDevices] = useState<ProcessedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deviceImages: { [key: string]: string } = {
    LIGHT: LampImage,
    AC: AirCondImage,
    PET_FEEDER: PetFeederImage,
    IRRIGATION: IrrigationImage,
    SECURITY: SecurityImage,
  };

  const processEnergyData = (rawData: EnergyBreakdown[]): ProcessedDevice[] => {
    // Group breakdowns by device
    const deviceGroups = rawData.reduce((acc, entry) => {
      const key = entry.device.displayName;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(entry);
      return acc;
    }, {} as Record<string, EnergyBreakdown[]>);

    return Object.entries(deviceGroups).map(([deviceName, entries]) => {
      const sortedEntries = entries.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      const latestEntry = sortedEntries[0];
      const previousEntry = sortedEntries[1];

      const todayEnergy = Number(latestEntry.energyUsed) / 1000; // Convert to kWh
      const yesterdayEnergy = previousEntry
        ? Number(previousEntry.energyUsed) / 1000
        : 0;

      const trend = previousEntry
        ? ((todayEnergy - yesterdayEnergy) / yesterdayEnergy) * 100
        : 0;

      return {
        image: deviceImages[latestEntry.device.type] || SecurityImage,
        title: deviceName,
        usage: `${todayEnergy.toFixed(1)} kWh`,
        room: latestEntry.device.room.name,
        hours: `${Math.round(latestEntry.activeHours)} hours`,
        trend: Number(trend.toFixed(1)),
      };
    });
  };

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/devices/energy/breakdown"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch energy breakdown");
        }
        const data: EnergyBreakdown[] = await response.json();
        setDevices(processEnergyData(data));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnergyData();
  }, []);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-danger">Error: {error}</div>;
  }

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
                  {devices.length}
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

export default EnergyPage;
