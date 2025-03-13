import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./SignIn.css"; // Import SignIn CSS
import Logo from "../assets/logo.svg"; // HomeSync Logo
import GoogleLogo from "../assets/Google.svg"; // Google Logo
import { FaArrowLeft } from "react-icons/fa"; // Back Arrow Icon

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="signin-container" style={{ backgroundColor: "#204160" }}>
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft size={20} />
      </button>

      {/* Top Section with HomeSync Logo */}
      {/* HomeSync Logo */}
      <div className="logo-container">
        <div className="logo-bg">
          <div className="logo-inner">
            <img src={Logo} alt="Logo" className="logo-img" />
          </div>
        </div>
      </div>
      <h4 className="logo-text">HomeSync</h4>

      {/* Heading */}
      <h1 className="signin-title">Welcome Back!</h1>
      <p className="signin-subtitle">Sign In to Your Smart Home.</p>

      {/* Input Fields */}
      <div className="input-container">
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

        <a onClick={() => navigate("/forgot-pw")} className="forgot-password">
          Forgot Password?
        </a>
      </div>

      {/* Log In Button */}
      <button onClick={() => navigate("/home")} className="login-btn">
        Log In
      </button>

      {/* Divider */}
      <div className="divider1">or Sign In with</div>

      {/* Google Sign-In Button */}
      <button className="google-btn" onClick={() => navigate("/home")}>
        <img src={GoogleLogo} alt="Google Logo" className="google-icon" />
        Continue with Google
      </button>

      {/* Sign-Up Link */}
      <p className="signup-link">
        Don’t have an Account?{" "}
        <a onClick={() => navigate("/register-acc")}>Sign Up</a>
      </p>
    </div>
  );
};

export default SignIn;
