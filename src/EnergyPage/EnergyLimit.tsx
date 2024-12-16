import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import EnergyLimitImage from "../assets/energy/energylimit.svg";

const EnergyLimit: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBackClick = () => {
    // Navigate back to the previous page (Energy Page)
    navigate(-1);
  };

  return (
    <>
      <div
        className="container-fluid position-relative"
        style={{ transform: "translateX(2%) translateY(260%)" }}
      >
        <IoIosArrowBack
          size={24}
          color="white"
          style={{ cursor: "pointer" }}
          onClick={handleBackClick}
        />
      </div>
      <div
        className="container-fluid text-center position-relative"
        style={{ transform: "translateX(0%) translateY(60%)" }}
      >
        <h2 className="mb-3" style={{ color: "white" }}>
          <b>Energy Limit</b>
        </h2>
        <img
          src={EnergyLimitImage}
          alt="Energy Limit"
          className="img-fluid mx-auto d-block"
        />
      </div>
      <div
        className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column align-items-center"
        style={{
          top: "40%",
          height: "100%",
          borderRadius: "18px",
          paddingTop: "2rem",
        }}
      >
        <div className="text-center mb-4">
          <h3 className="fw-bold" style={{ color: "#204160" }}>
            Set Energy Usage Limit
          </h3>
          <p className="text-muted">Save energy, Save Earth, Save Humanity!</p>
        </div>

        <div className="dropdown mb-5">
          <button
            className="btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              backgroundColor: "white",
              border: "1px solid #6c757d",
              color: "#6c757d",
            }}
          >
            {selectedPeriod || "Select Type"}
          </button>
          <ul className="dropdown-menu">
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => setSelectedPeriod("This Week")}
              >
                This Week
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => setSelectedPeriod("This Month")}
              >
                This Month
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => setSelectedPeriod("This Year")}
              >
                This Year
              </a>
            </li>
          </ul>
        </div>

        <div className="input-group mb-2" style={{ width: "200px" }}>
          <input
            type="number"
            className="form-control"
            placeholder="Enter value"
            aria-describedby="kwh-addon"
          />
          <span className="input-group-text" id="kwh-addon">
            kWh
          </span>
        </div>

        <p
          className="text-center text-muted mb-5"
          style={{ width: "300px", fontSize: "0.8rem" }}
        >
          Example: 5000 kWh
        </p>

        <button
          className="btn p-2 px-5"
          style={{
            backgroundColor: "#204160",
            color: "white",
            borderRadius: "12px",
          }}
        >
          Start
        </button>
      </div>
    </>
  );
};

export default EnergyLimit;
