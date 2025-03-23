import React, { useEffect, useState, useCallback } from "react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import SwipeableCharts from "./SwipeableCharts";
import LampImage from "../assets/devices/lamp.svg";
import AirCondImage from "../assets/devices/aircond1.svg";
import PetFeederImage from "../assets/devices/petfeeder.svg";
import IrrigationImage from "../assets/devices/irrigation.svg";
import EnergyUploadImage from "../assets/energy/energy-upload-button.svg";

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

  // Add a state to track window height
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

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

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures effect runs only on mount and unmount

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

  return (
    <>
      <SwipeableCharts
        timeRange={timeRange}
        setTimeRange={handleTimeRangeChange}
        energyData={aggregatedData}
      />
      <div
        className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column"
        style={{
          top: windowHeight < 700 ? "50%" : windowHeight < 850 ? "40%" : "50%",
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
              <button className="me-2 btn rounded-circle p-1 d-flex align-items-center justify-content-center">
                <img
                  src={EnergyUploadImage}
                  style={{ backgroundColor: "white" }}
                ></img>
              </button>
            </div>
          </div>
        </div>

        <div
          className="container-fluid overflow-auto px-4"
          style={{
            height:
              windowHeight < 700
                ? "calc(100% - 430px)"
                : windowHeight < 850
                ? "calc(100% - 440px)"
                : "calc(100% - 460px)",
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
