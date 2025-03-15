import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Password.css"; // Import Password CSS
import Logo from "../assets/logo.svg"; // HomeSync Logo
import Password from "../assets/password.svg";
import { FaArrowLeft } from "react-icons/fa"; // Back Arrow Icon
import WelcomeBackground from "./WelcomeBackground";

const ForgotPW: React.FC = () => {
  const navigate = useNavigate();

  return (
    <WelcomeBackground>
      <div className="forgot-container">
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
        <h4 className="forgot-logo-text">Forgot Password?</h4>

        {/* Heading */}
        {/* {/* Password Illustration */}
        <div className="image-container">
          <img src={Password} alt="Password Illustration" className="image" />
        </div>

        {/* Forgot PW Text */}
        <p className="forgot-text">
          Please enter the email address linked to your account.
        </p>

        {/* Input Fields */}
        <div className="input-container">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="input-box"
          />
        </div>

        {/* Send Button */}
        <button onClick={() => navigate("/otp-ver")} className="Send-btn">
          Send Code
        </button>
      </div>
    </WelcomeBackground>
  );
};

export default ForgotPW;
