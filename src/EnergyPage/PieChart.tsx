import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { FaChevronDown } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";

const Background: React.FC = () => {
  const data = [
    { name: "Lamp", value: 1000 },
    { name: "Air Cond", value: 700 },
    { name: "Pet Feeder", value: 300 },
    { name: "Irrigation", value: 400 },
    { name: "Home Security", value: 1200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF69B4"];

  return (
    <div
      className="container-fluid"
      style={{ transform: "translateX(0%) translateY(28%)" }}
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

      <div className="row align-items-center">
        {/* Left side - Pie Chart */}
        <div className="col-6 p-0">
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Right side - Categories List */}
        <div className="col-6 p-0">
          <div className="list-group bg-transparent">
            {data.map((item, index) => (
              <div
                style={{
                  color: "white",
                  fontSize: "12px",
                }}
                key={`category-${index}`}
                className="list-group-item d-flex justify-content-between align-items-center border-0 bg-transparent"
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
                  {item.value} Kw/h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Background;
