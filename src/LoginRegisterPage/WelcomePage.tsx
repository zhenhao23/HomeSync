import React from "react";
import { useNavigate } from "react-router-dom"; // 🔹 Import useNavigate
import "./WelcomePage.css"; // Import the common CSS file
import Logo from "../assets/logo.svg";
import Illustration from "../assets/Cool Kids Fresh Air.svg";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate(); // 🔹 Initialize navigation function

  return (
    <div className="welcome-container">
      {/* Top Section with Logo */}
      <div className="top-section">
        {/* HomeSync Logo */}
        <div className="logo-container">
          <div className="logo-bg">
            <div className="logo-inner">
              <img src={Logo} alt="Logo" className="logo-img" />
            </div>
          </div>
        </div>
        <h4 className="logo-text">HomeSync</h4>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        <h1 className="main-title">Effortless Control, Smart Living.</h1>
        <p className="main-description">
          Transform your home with intelligent devices that blend comfort,
          security, and efficiency.
        </p>

        {/* Illustration */}
        <img src={Illustration} alt="Smart Home" className="illustration" />

        {/* Get Started Button with Navigation */}
        <button
          className="get-started-btn"
          onClick={() => navigate("/Welcome2")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
