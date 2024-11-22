import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaChevronDown } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";

const Background: React.FC = () => {
  const data = [
    {
      day: "Mon",
      total: 100,
    },
    {
      day: "Tue",
      total: 200,
    },
    {
      day: "Wed",
      total: 150,
    },
    {
      day: "Thu",
      total: 100,
    },
    {
      day: "Fri",
      total: 200,
    },
    {
      day: "Sat",
      total: 250,
    },
    {
      day: "Sun",
      total: 200,
    },
  ];

  return (
    <div
      className="container-fluid"
      style={{ transform: "translateX(0%) translateY(22%)" }}
    >
      {/* Header */}
      <div className="row mb-0 ms-3">
        {/* Left side of header */}
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

        {/* Right side of header */}
        <div className="col-6 p-0 d-flex align-items-center justify-content-end">
          <button
            className="btn rounded-circle p-2 me-4 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "white",
              width: "32px",
              height: "32px",
              boxShadow: "3px 3px 4px rgba(0, 0, 0, 1)",
            }}
          >
            <IoFilterSharp style={{ color: "black" }} size={16} />
          </button>
        </div>
      </div>

      <div
        className="row"
        style={{ transform: "translateX(-4%) translateY(0%)" }}
      >
        {/* Unit Label */}
        <div className="col-12 p-0 mb-0 ms-5">
          <span style={{ color: "white", fontSize: "11px" }}>kW/h</span>
        </div>

        {/* Line Chart */}
        <div className="col-12 p-0" style={{ height: "180px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
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
                ticks={[0, 100, 200, 300]}
                domain={[0, 300]}
                style={{ color: "white", fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "none",
                  color: "white",
                }}
                formatter={(value: number) => [`${value} kW/h`, "Total Usage"]}
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

        {/* Pagination Dots */}
        <div className="col-12 p-0 d-flex justify-content-center mt-0 ms-3">
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              }}
            />
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "white",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Background;
