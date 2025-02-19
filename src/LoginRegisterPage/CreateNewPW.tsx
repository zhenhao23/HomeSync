import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Create.css"; // Import Password CSS
import Logo from "../assets/logo.svg"; // HomeSync Logo
import Password from "../assets/password.svg";
import { FaArrowLeft } from "react-icons/fa"; // Back Arrow Icon

const CreateNewPW: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="signin-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft size={20} />
      </button>

      {/* Top Section with HomeSync Logo */}
      <div className="signin-logo-container">
        <div className="signin-logo-bg">
          <div className="signin-logo-inner">
            <img src={Logo} alt="HomeSync Logo" className="signin-logo-img" />
          </div>
        </div>
      </div>
      <h4 className="signin-logo-text">Create New Password</h4>

      {/* Heading */}
      {/* {/* Password Illustration */}
      <div className="image-container">
        <img src={Password} alt="Password Illustration" className="image" />
      </div>

      {/* Input Fields */}
      <div className="input-container">
        <label>New Password</label>
        <input
          type="Password"
          placeholder="New Password"
          className="input-box"
        />

        <label>Re-enter Password</label>
        <input
          type="Password"
          placeholder="Re-Enter Password"
          className="input-box"
        />
      </div>

      {/* Send Button */}
      <button className="login-btn">Reset Password</button>
    </div>
  );
};

export default CreateNewPW;
