import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterRole.css";
import Logo from "../assets/logo.svg";
import OwnerIcon from "../assets/homeowner.svg";
import DwellerIcon from "../assets/homedweller.svg";
import { FaArrowLeft } from "react-icons/fa";

const RegisterRole: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"owner" | "dweller" | null>(
    null
  );

  const handleNextClick = () => {
    if (selectedRole === "owner") {
      navigate("/home");
    } else if (selectedRole === "dweller") {
      navigate("/join-home");
    }
  };

  return (
    <div className="register-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft size={20} />
      </button>

      {/* HomeSync Logo */}
      <div className="logo-container">
        <div className="logo-bg">
          <div className="logo-inner">
            <img src={Logo} alt="Logo" className="logo-img" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="register-title">Welcome to HomeSync!</h1>
      <p className="register-subtitle">Please Select Your Role</p>

      {/* Role Selection */}
      <div className="role-selection">
        {/* Home Owner Option */}
        <div
          className={`role-card ${selectedRole === "owner" ? "selected" : ""}`}
          onClick={() => setSelectedRole("owner")}
        >
          <img src={OwnerIcon} alt="Home Owner" className="role-icon" />
          <div className="role-info">
            <h3>Home Owner</h3>
            <p>Full Device Access (Admin)</p>
          </div>
          <div className="role-indicator"></div>
        </div>

        {/* Home Dweller Option */}
        <div
          className={`role-card ${
            selectedRole === "dweller" ? "selected" : ""
          }`}
          onClick={() => setSelectedRole("dweller")}
        >
          <img src={DwellerIcon} alt="Home Dweller" className="role-icon" />
          <div className="role-info">
            <h3>Home Dweller</h3>
            <p>Limited Device Access (Member)</p>
          </div>
          <div className="role-indicator"></div>
        </div>
      </div>

      {/* Next Button */}
      <button
        className="next-btn"
        disabled={!selectedRole}
        onClick={handleNextClick}
      >
        Next
      </button>
    </div>
  );
};

export default RegisterRole;
