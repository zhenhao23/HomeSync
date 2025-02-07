import React, { useState, useRef, useEffect } from "react";
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
} from "recharts";
import { useNavigate } from "react-router-dom";

// Types for our data
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

const PieChartComponent: React.FC<{ data: EnergyData }> = ({ data }) => {
  const navigate = useNavigate();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF69B4"];

  return (
    <div
      className="container-fluid"
      style={{ transform: "translateX(0%) translateY(24%)" }}
    >
      {/* Header */}
      <div className="row mb-0 ms-3">
        <div className="col-6 p-0">
          <div style={{ color: "white" }}>
            <div className="fs-5 mb-1">
              <b>Energy Usage</b>
            </div>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-link text-white p-0 text-decoration-none d-flex align-items-center"
                style={{ fontSize: "12px", background: "transparent" }}
              >
                <FaChevronDown size={10} className="me-2" />
                <span>This Week</span>
              </button>
            </div>
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

const LineChartComponent: React.FC<{ data: EnergyData }> = ({ data }) => {
  const navigate = useNavigate();

  // Calculate the domain for Y-axis based on the data
  const maxTotal = Math.ceil(Math.max(...data.dailyTotals.map((d) => d.total)));
  const yAxisTicks = [
    0,
    Math.round(maxTotal / 3),
    Math.round((maxTotal * 2) / 3),
    Math.round(maxTotal),
  ];

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
            <div className="d-flex align-items-center">
              <button
                className="btn btn-link text-white p-0 text-decoration-none d-flex align-items-center"
                style={{ fontSize: "12px", background: "transparent" }}
              >
                <FaChevronDown size={10} className="me-2" />
                <span>This Week</span>
              </button>
            </div>
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
              data={data.dailyTotals}
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
              />
              <YAxis
                stroke="white"
                tick={{ fill: "white" }}
                ticks={yAxisTicks}
                domain={[0, maxTotal]}
                style={{ color: "white", fontSize: "12px" }}
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

const SwipeableCharts: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [energyData, setEnergyData] = useState<EnergyData>({
    deviceTotals: [],
    dailyTotals: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/devices/energy/aggregated"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch energy data");
        }
        const data = await response.json();
        setEnergyData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSwipeLeft = () => {
    setActiveIndex((current) => (current + 1) % 2);
  };

  const handleSwipeRight = () => {
    setActiveIndex((current) => (current - 1 + 2) % 2);
  };

  const swipeHandlers = useSwipe(handleSwipeLeft, handleSwipeRight);

  if (isLoading) {
    return <div className="text-center text-white p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-white p-4">Error: {error}</div>;
  }

  const charts = [
    { component: PieChartComponent, id: "pie" },
    { component: LineChartComponent, id: "line" },
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
        {charts.map(({ component: ChartComponent, id }) => (
          <div
            key={id}
            className="w-100 flex-shrink-0"
            style={{ minWidth: "100%" }}
          >
            <ChartComponent data={energyData} />
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
