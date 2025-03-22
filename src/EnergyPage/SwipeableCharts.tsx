import React, { useEffect, useState, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ReferenceLine, // Add this import at the top with the other recharts imports
} from "recharts";
import { useNavigate } from "react-router-dom";

type TimeRange = "week" | "month" | "year";

interface EnergyData {
  deviceTotals: Array<{
    name: string;
    value: number;
  }>;
  dailyTotals: Array<{
    day: string;
    total: number;
  }>;
}

interface SwipeableChartsProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  energyData: EnergyData;
}

const TimeRangeDropdown: React.FC<{
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  showToday?: boolean;
}> = ({ timeRange, setTimeRange, showToday = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  const timeRangeDisplay = {
    week: "This Week",
    month: "This Month",
    year: "This Year",
  };

  const options = showToday
    ? (Object.keys(timeRangeDisplay) as TimeRange[])
    : (["week", "month", "year"] as TimeRange[]);

  return (
    <div className="dropdown">
      <button
        className="btn btn-link text-white p-0 text-decoration-none d-flex align-items-center"
        style={{ fontSize: "12px", background: "transparent" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaChevronDown size={10} className="me-2" />
        <span>{timeRangeDisplay[timeRange]}</span>
      </button>
      {isOpen && (
        <div
          className="dropdown-menu show"
          style={{
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            marginTop: "8px",
          }}
        >
          {options.map((range) => (
            <button
              key={range}
              className="dropdown-item text-white"
              style={{ fontSize: "12px", padding: "4px 12px" }}
              onClick={() => {
                setTimeRange(range);
                setIsOpen(false);
              }}
            >
              {timeRangeDisplay[range]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom hook for swipe detection
const useSwipe = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipeLeft();
    } else if (isRightSwipe) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

// Update PieChartComponent
const PieChartComponent: React.FC<{
  data: EnergyData;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}> = ({ data, timeRange, setTimeRange }) => {
  const navigate = useNavigate();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF69B4"];

  return (
    <div
      className="container-fluid"
      style={{ transform: "translateX(0%) translateY(24%)" }}
    >
      <div className="row mb-0 ms-3">
        <div className="col-6 p-0">
          <div style={{ color: "white" }}>
            <div className="fs-5 mb-1">
              <b>Energy Usage</b>
            </div>
            <TimeRangeDropdown
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          </div>
        </div>

        <div className="col-6 p-0 d-flex align-items-center justify-content-end">
          <button
            className="btn rounded-circle p-2 me-4 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "white",
              width: "32px",
              height: "32px",
              boxShadow: "3px 3px 4px rgba(0, 0, 0, 1)",
            }}
            onClick={() => navigate("/energy-limit")}
          >
            <IoFilterSharp style={{ color: "black" }} size={16} />
          </button>
        </div>
      </div>

      <div className="row align-items-center mb-0">
        <div className="col-6 p-0">
          <RechartsPieChart width={200} height={200}>
            <Pie
              data={data.deviceTotals}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.deviceTotals.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </div>

        <div className="col-6 p-0">
          <div className="list-group bg-transparent">
            {data.deviceTotals.map((item, index) => (
              <div
                key={`category-${index}`}
                className="list-group-item d-flex justify-content-between align-items-center border-0 bg-transparent"
                style={{ color: "white", fontSize: "12px" }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="me-2"
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: COLORS[index % COLORS.length],
                      borderRadius: "4px",
                    }}
                  />
                  {item.name}
                </div>
                <span
                  style={{
                    color: "white",
                    fontSize: "10px",
                    fontWeight: "100",
                  }}
                >
                  {item.value.toFixed(0)} kWh
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this helper function before LineChartComponent
const transformChartData = (
  data: EnergyData["dailyTotals"],
  timeRange: TimeRange
) => {
  if (!data || data.length === 0) return [];

  if (timeRange === "week") {
    // For week: show current day on right, then past 6 days (7 days total)
    const today = new Date();
    const days: string[] = [];
    const dayTotals: Record<string, number> = {};

    // Initialize all days of the week with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      days.push(dayName);
      dayTotals[dayName] = 0;
    }

    // Fill in existing data
    data.forEach((item) => {
      if (days.includes(item.day)) {
        dayTotals[item.day] = item.total;
      }
    });

    // Return in correct order (oldest to newest, left to right)
    return days.map((day) => ({
      day,
      total: dayTotals[day],
    }));
  }

  if (timeRange === "month") {
    // For month: show current week on right, then past 3 weeks
    const today = new Date();

    // Add this log to see what data is coming from the API
    // console.log("Raw month data from API:", data);

    const currentWeek = Math.ceil(today.getDate() / 7);
    const weekTotals: Record<string, number> = {};
    const weeks: string[] = [];

    // Use data directly from the backend since we now have proper week numbers
    // Just ensure we have the 4 weeks we expect, or create empty weeks if needed
    if (data && data.length > 0) {
      // The backend now sends the correct week numbers, so we can use them directly
      data.forEach((item) => {
        weeks.push(item.day);
        weekTotals[item.day] = item.total;
      });
    } else {
      // Fallback if no data is available
      for (let i = 3; i >= 0; i--) {
        const weekNum = Math.max(
          1,
          currentWeek - i > 0 ? currentWeek - i : currentWeek - i + 4
        );
        const weekLabel = `Week ${weekNum}`;
        weeks.push(weekLabel);
        weekTotals[weekLabel] = 0;
      }
    }

    // Return in correct order (oldest to newest, left to right)
    return weeks.map((week) => ({
      day: week,
      total: weekTotals[week],
    }));
  }

  // In transformChartData function in SwipeableCharts.tsx
  if (timeRange === "year") {
    // The data should already be properly formatted from the backend
    // Just use it directly if it exists, or display empty data if not

    // console.log("Raw year data from API:", data);

    if (!data || data.length === 0) {
      // If no data, create empty placeholder data for all 12 months
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      return monthNames.map((month) => ({
        day: month,
        total: 0,
      }));
    }

    // Use the data directly from the backend
    return data;
  }

  return data;
};

const LineChartComponent: React.FC<{
  data: EnergyData;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}> = ({ data, timeRange, setTimeRange }) => {
  const navigate = useNavigate();
  const [energyLimit, setEnergyLimit] = useState<number>(120000); // Default value

  // Fetch the energy limit
  useEffect(() => {
    const fetchEnergyLimit = async () => {
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem("authToken");
        const homeId = localStorage.getItem("currentHomeId");

        if (!token || !homeId) {
          console.error("Token or homeId not found");
          return;
        }

        const response = await fetch(
          `https://homesync-production.up.railway.app/api/energy-limit/${homeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          let limitValue = Number(data.energyLimit);

          // Store the base weekly limit
          setEnergyLimit(limitValue);
        }
      } catch (error) {
        console.error("Error fetching energy limit:", error);
      }
    };

    fetchEnergyLimit();
  }, []);

  // Calculate the displayed energy limit based on the time range
  const getDisplayedEnergyLimit = () => {
    if (timeRange === "week") {
      return energyLimit; // Weekly limit stays the same
    } else if (timeRange === "month") {
      return energyLimit * 4; // Monthly limit is 4x weekly
    } else if (timeRange === "year") {
      return energyLimit * 4 * 12; // Yearly limit is 48x weekly
    }
    return energyLimit; // Default fallback
  };

  // Get the scaled energy limit value
  const displayedEnergyLimit = getDisplayedEnergyLimit();

  // Transform the data to handle historical view correctly
  const transformedData = transformChartData(data.dailyTotals, timeRange);

  // Create nice Y-axis values
  const generateNiceYAxisTicks = (data: any[]) => {
    // Get max value from data
    const maxValue = Math.max(
      ...[...data.map((d) => d.total || 0), displayedEnergyLimit]
    );

    if (maxValue === 0) return [0, 25, 50, 75, 100]; // Default for empty data

    // Determine appropriate rounding based on magnitude
    let roundTo = 1;
    if (maxValue >= 1000000) roundTo = 100000; // Millions: round to 100,000s
    else if (maxValue >= 100000)
      roundTo = 10000; // Hundreds of thousands: round to 10,000s
    else if (maxValue >= 10000)
      roundTo = 1000; // Tens of thousands: round to 1,000s
    else if (maxValue >= 1000) roundTo = 100; // Thousands: round to 100s
    else if (maxValue >= 100) roundTo = 10; // Hundreds: round to 10s

    // Calculate nice maximum (round up to next multiple of roundTo)
    const niceMax = Math.ceil(maxValue / roundTo) * roundTo;

    // Create four evenly spaced ticks
    return [0, Math.round(niceMax / 3), Math.round((niceMax * 2) / 3), niceMax];
  };

  // Format display values - FIXED to always return string
  const formatYAxisTick = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString(); // Always return string
  };

  const yAxisTicks = generateNiceYAxisTicks(transformedData);

  return (
    <div
      className="container-fluid"
      style={{ transform: "translateX(0%) translateY(22%)" }}
    >
      <div className="row mb-0 ms-3">
        <div className="col-6 p-0">
          <div style={{ color: "white" }}>
            <div className="fs-5 mb-1">
              <b>Energy Usage</b>
            </div>
            <TimeRangeDropdown
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              showToday={false}
            />
          </div>
        </div>

        <div className="col-6 p-0 d-flex align-items-center justify-content-end">
          <button
            className="btn rounded-circle p-2 me-4 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "white",
              width: "32px",
              height: "32px",
              boxShadow: "3px 3px 4px rgba(0, 0, 0, 1)",
            }}
            onClick={() => navigate("/energy-limit")}
          >
            <IoFilterSharp style={{ color: "black" }} size={16} />
          </button>
        </div>
      </div>

      <div
        className="row"
        style={{ transform: "translateX(-4%) translateY(0%)" }}
      >
        <div className="col-12 p-0 mb-0 ms-5">
          <span style={{ color: "white", fontSize: "11px" }}>kWh</span>
        </div>

        <div className="col-12 p-0" style={{ height: "180px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={transformedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="day"
                stroke="white"
                tick={{ fill: "white" }}
                style={{ color: "white", fontSize: "12px" }}
                interval={timeRange === "year" ? 0 : 0}
                angle={timeRange === "year" ? -45 : 0}
                textAnchor={timeRange === "year" ? "end" : "middle"}
                height={timeRange === "year" ? 50 : 30}
              />
              <YAxis
                stroke="white"
                tick={{ fill: "white" }}
                ticks={yAxisTicks}
                domain={[0, yAxisTicks[yAxisTicks.length - 1]]}
                style={{ color: "white", fontSize: "12px" }}
                tickFormatter={formatYAxisTick}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "none",
                  color: "white",
                }}
                formatter={(value: number) => [
                  `${value.toFixed(2)} kWh`,
                  "Total Usage",
                ]}
              />
              {/* Updated ReferenceLine with scaled energy limit */}
              <ReferenceLine
                y={displayedEnergyLimit}
                label={{
                  value: "Energy Limit",
                  position: "insideTopRight",
                  fill: "#FF5252",
                  fontSize: 12,
                }}
                stroke="#FF5252"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#B3E59F"
                strokeWidth={3}
                dot={{ fill: "#B3E59F", r: 4 }}
                activeDot={{ r: 8 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const SwipeableCharts: React.FC<SwipeableChartsProps> = ({
  timeRange,
  setTimeRange,
  energyData,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSwipeLeft = () => {
    setActiveIndex((current) => (current + 1) % 2);
  };

  const handleSwipeRight = () => {
    setActiveIndex((current) => (current - 1 + 2) % 2);
  };

  const swipeHandlers = useSwipe(handleSwipeLeft, handleSwipeRight);

  const charts = [
    {
      component: PieChartComponent,
      id: "pie",
      props: { data: energyData, timeRange, setTimeRange },
    },
    {
      component: LineChartComponent,
      id: "line",
      props: { data: energyData, timeRange, setTimeRange },
    },
  ];

  return (
    <div
      {...swipeHandlers}
      className="position-relative"
      style={{
        touchAction: "pan-y pinch-zoom",
        height: "380px",
        overflow: "hidden",
      }}
    >
      <div
        className="d-flex"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {charts.map(({ component: ChartComponent, id, props }) => (
          <div
            key={id}
            className="w-100 flex-shrink-0"
            style={{ minWidth: "100%" }}
          >
            <ChartComponent {...props} />
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          gap: "8px",
        }}
      >
        {charts.map((_, index) => (
          <div
            key={index}
            className="rounded-circle"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor:
                index === activeIndex ? "white" : "rgba(255, 255, 255, 0.3)",
              transition: "background-color 0.3s ease-in-out",
              cursor: "pointer",
            }}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SwipeableCharts;
