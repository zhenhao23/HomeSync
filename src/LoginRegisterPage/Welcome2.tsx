import React from "react";
import { useNavigate } from "react-router-dom"; // 🔹 Import useNavigate
import "./WelcomePage.css"; // Reuse the same CSS
import Logo from "../assets/logo.svg";
import Illustration from "../assets/Cool Kids Fresh Air.svg";

const Welcome2: React.FC = () => {
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
        <h1 className="main-title">Welcome Home!</h1>
        <p className="main-description">
          Stay in Sync with Your Home Anytime, Anywhere
        </p>

        {/* Illustration */}
        <img src={Illustration} alt="Smart Home" className="illustration" />

        {/* Sign In Button */}
        <button className="action-btn" onClick={() => navigate("/signin")}>
          Sign In
        </button>

        {/* Register Button */}
        <button
          className="action-btn"
          onClick={() => navigate("/register-acc")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Welcome2;