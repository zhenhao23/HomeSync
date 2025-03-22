import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import EnergyLimitImage from "../assets/energy/energylimit.svg";

const EnergyLimit: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [energyLimit, setEnergyLimit] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current energy limit when component mounts
    const fetchCurrentLimit = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        const homeId = localStorage.getItem("currentHomeId");

        if (!token || !homeId) {
          setError("Authentication information missing");
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
          let limitValue = parseFloat(data.energyLimit);
          const timeframe = data.timeframe;

          // Set the default period based on timeframe
          let period = "This Week";

          // Convert the energy limit based on timeframe
          if (timeframe === "monthly") {
            limitValue = limitValue * 4; // Weekly to monthly
            period = "This Month";
          } else if (timeframe === "yearly") {
            limitValue = limitValue * (4 * 12); // Weekly to yearly
            period = "This Year";
          }

          // Format the limit nicely
          setEnergyLimit(limitValue.toFixed(0));
          setSelectedPeriod(period);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch energy limit");
        }
      } catch (err) {
        setError("Network error occurred");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentLimit();
  }, []);

  const handleBackClick = () => {
    // Navigate back to the previous page (Energy Page)
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!energyLimit || !selectedPeriod) {
      setError("Please enter an energy limit and select a time period");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem("authToken");
      const homeId = localStorage.getItem("currentHomeId");

      if (!token || !homeId) {
        setError("Authentication information missing");
        return;
      }

      // Process energy limit based on selected period
      let processedLimit = parseFloat(energyLimit);
      let timeframe = "weekly";

      if (selectedPeriod === "This Month") {
        // For monthly, we divide by 4 weeks
        processedLimit = processedLimit / 4;
        timeframe = "monthly";
      } else if (selectedPeriod === "This Year") {
        // For yearly, we divide by 48 weeks (4 weeks * 12 months)
        processedLimit = processedLimit / (4 * 12);
        timeframe = "yearly";
      }

      // Round to 2 decimal places for nice values
      processedLimit = parseFloat(processedLimit.toFixed(2));

      const response = await fetch(
        `https://homesync-production.up.railway.app/api/energy-limit/${homeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            energyLimit: processedLimit,
            timeframe: timeframe,
          }),
        }
      );

      if (response.ok) {
        setSuccess("Energy limit updated successfully!");
        // Optionally navigate back after a delay
        setTimeout(() => navigate(-1), 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update energy limit");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div
            className="alert alert-success"
            role="alert"
            style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              border: "1px solid #c3e6cb",
              borderRadius: "8px",
              padding: "10px 15px",
              fontWeight: "500",
            }}
          >
            {success}
          </div>
        )}

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
            value={energyLimit}
            onChange={(e) => setEnergyLimit(e.target.value)}
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
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Set Limit"}
        </button>
      </div>
    </>
  );
};

export default EnergyLimit;
