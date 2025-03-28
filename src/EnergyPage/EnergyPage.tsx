import React, { useEffect, useState, useCallback } from "react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import SwipeableCharts from "./SwipeableCharts";
import LampImage from "../assets/devices/lamp.svg";
import AirCondImage from "../assets/devices/aircond1.svg";
import PetFeederImage from "../assets/devices/petfeeder.svg";
import IrrigationImage from "../assets/devices/irrigation.svg";
import styles from "./EnergyPage.module.css"; // Import the CSS module

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

const ResponsiveUI: React.FC<{
  timeRange: TimeRange;
  setTimeRange: (newTimeRange: TimeRange) => void;
  energyData: AggregatedData;
}> = ({ timeRange, setTimeRange, energyData }) => {
  return (
    <>
      <div
        style={{
          width: "90%",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          height: "100%",
          borderRadius: "30px",
          margin: "8% 5%",
        }}
      >
        <div
          style={{
            width: "40%",
            height: "60%",
            position: "absolute",
            marginTop: "6%",
            marginLeft: "5%",
            backgroundColor: "#204160",
            borderRadius: "30px",
          }}
        >
          <SwipeableCharts
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            energyData={energyData}
          />
        </div>
      </div>
    </>
  );
};

const EnergyPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  // Initialize with placeholder skeleton data to prevent blank screen
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>({
    deviceTotals: Array(4).fill({
      name: "Loading...",
      type: "light",
      room: "Room",
      value: 0,
      activeHours: 0,
      previousValue: 0,
      previousActiveHours: 0,
    }),
    dailyTotals: [],
  });

  // const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const deviceImages: { [key: string]: string } = {
    light: LampImage,
    aircond: AirCondImage,
    petfeeder: PetFeederImage,
    irrigation: IrrigationImage,
  };

  // Add cache for different time ranges
  const [cachedData, setCachedData] = useState<
    Record<TimeRange, AggregatedData | null>
  >({
    week: null,
    month: null,
    year: null,
  });

  // Modified setTimeRange function
  const handleTimeRangeChange = useCallback(
    (newTimeRange: TimeRange) => {
      setTimeRange(newTimeRange);

      // If we have cached data, use it immediately while fetching fresh data
      if (cachedData[newTimeRange]) {
        setAggregatedData(cachedData[newTimeRange]!);
      }
    },
    [cachedData]
  );

  // Function to fetch data for a specific time range
  const fetchDataForRange = async (
    range: TimeRange
  ): Promise<AggregatedData | null> => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `https://homesync-production.up.railway.app/api/devices/energy/aggregated?timeRange=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${range} data`);
      }

      const data = await response.json();
      console.log(`Received ${range} data:`, data.deviceTotals);

      return data;
    } catch (err) {
      console.error(`Error fetching ${range} data:`, err);
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    }
  };

  // Function to preload all time ranges
  const preloadAllTimeRanges = async () => {
    // Already showing skeleton data, so no need to set loading

    // First fetch the current timeRange
    const currentRangeData = await fetchDataForRange(timeRange);

    if (currentRangeData) {
      setAggregatedData(currentRangeData);
      setCachedData((prev) => ({
        ...prev,
        [timeRange]: currentRangeData,
      }));
    }

    // Then fetch the other ranges in the background
    const otherRanges = ["week", "month", "year"].filter(
      (r) => r !== timeRange
    ) as TimeRange[];

    // Use Promise.all to fetch other ranges in parallel
    const results = await Promise.all(
      otherRanges.map(async (range) => {
        const data = await fetchDataForRange(range);
        return { range, data };
      })
    );

    // Update the cache with all results
    const newCache = { ...cachedData };
    results.forEach(({ range, data }) => {
      if (data) {
        newCache[range] = data;
      }
    });

    setCachedData(newCache);
    // setIsLoading(false);
    setIsInitialLoad(false);
  };

  // Effect to handle initial loading of all data - use a more stable approach
  useEffect(() => {
    if (isInitialLoad) {
      preloadAllTimeRanges();
    }
  }, [isInitialLoad]);

  // Effect for subsequent fetches when timeRange changes (refreshing data)
  useEffect(() => {
    if (!isInitialLoad) {
      const fetchSingleRange = async () => {
        // Don't show loading indicator for cached data
        if (!cachedData[timeRange]) {
          // Instead of full loading state, just update current data
          // This prevents the UI from disappearing
        }

        const data = await fetchDataForRange(timeRange);

        if (data) {
          setAggregatedData(data);
          setCachedData((prev) => ({
            ...prev,
            [timeRange]: data,
          }));
        }

        // setIsLoading(false);
      };

      fetchSingleRange();
    }
  }, [timeRange, isInitialLoad]);

  const processDeviceData = (devices: DeviceTotal[]): ProcessedDevice[] => {
    return devices.map((device) => {
      const trend = device.previousValue
        ? ((device.value - device.previousValue) / device.previousValue) * 100
        : 0;

      return {
        image: deviceImages[device.type] || LampImage,
        title: device.name,
        usage: `${(device.value / 1000).toFixed(1)} kWh`,
        room: device.room,
        hours: `${Math.round(device.activeHours)} hours`,
        trend: Number(trend.toFixed(1)),
      };
    });
  };

  // Never show empty loading state - only skeleton data
  // const showLoadingState = isLoading && !cachedData[timeRange];

  // if (showLoadingState) {
  //  return <div className="text-center p-4">Loading...</div>;
  // }

  if (error) {
    return <div className="text-center p-4 text-danger">Error: {error}</div>;
  }

  const processedDevices = processDeviceData(aggregatedData.deviceTotals);

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

  // Get window size for responsive layout
  const { width } = useWindowSize();
  const isLaptop = width >= 1024;

  return (
    <>
      {isLaptop ? (
        <>
          <ResponsiveUI
            timeRange={timeRange}
            setTimeRange={handleTimeRangeChange}
            energyData={aggregatedData}
          />
          <div
            className={styles.slidingPanel}
            style={{
              backgroundColor: "#204160",
              width: "35%",
              marginTop: "-160px",
              height: "80%",
              borderRadius: "30px 30px 0 0",
              marginLeft: "22%",
            }}
          >
            <div className="container-fluid p-3 pb-0">
              <div className="row align-items-center mb-3">
                <div className="col-4 text-start p-3">
                  <h5 className="mb-0 ms-3" style={{ color: "#ffffff" }}>
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
              </div>
            </div>

            <div className={"container-fluid px-4"} style={{ height: "90%" }}>
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
      ) : (
        <>
          <SwipeableCharts
            timeRange={timeRange}
            setTimeRange={handleTimeRangeChange}
            energyData={aggregatedData}
          />
          <div className={styles.slidingPanel}>
            <div className="container-fluid p-3 pb-0">
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
              </div>
            </div>

            <div className={`container-fluid px-4 ${styles.deviceContainer}`}>
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
      )}
    </>
  );
};

export default EnergyPage;
