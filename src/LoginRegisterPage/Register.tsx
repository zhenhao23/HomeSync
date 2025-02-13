import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "./Register.css"; // Use the same Register.css
import Logo from "../assets/logo.svg"; // HomeSync Logo
import GoogleLogo from "../assets/Google.svg"; // Google Logo
import { FaArrowLeft } from "react-icons/fa"; // Back Arrow Icon

const Register: React.FC = () => {
  const navigate = useNavigate();

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
      <h4 className="logo-text">HomeSync</h4>

      {/* Title & Subtitle (Added Margin to Push Down) */}
      <div className="register-content">
        <h1 className="register-title">Welcome to HomeSync</h1>
        <p className="register-subtitle">Get started with Smarter Living.</p>
      </div>

      {/* Input Fields */}
      <div className="input-container">
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          className="input-box"
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="input-box"
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="input-box"
        />
      </div>

      {/* Create Account Button */}
      <button
        className="create-account-btn"
        // onClick={() => console.log("Account Created")}
        onClick={() => navigate("/register-role")}
      >
        Create Account
      </button>

      {/* Divider */}
      <div className="divider">or Register with</div>

      {/* Google Register Button */}
      <button onClick={() => navigate("/register-role")} className="google-btn">
        <img src={GoogleLogo} alt="Google Logo" className="google-icon" />
        Continue with Google
      </button>

      {/* Sign In Link */}
      <p className="signup-link">
        Already Have an Account?{" "}
        <a onClick={() => navigate("/signin")}>Sign In</a>
      </p>
    </div>
  );
};

export default Register;
