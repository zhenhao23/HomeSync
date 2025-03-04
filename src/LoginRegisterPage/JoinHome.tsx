import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import WelcomeBackground from "./WelcomeBackground";
import Logo from "../assets/logo.svg";
import OTPImage from "../assets/otp.svg";
import "./OTP.css";

const JoinHome: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [code, setCode] = useState<string[]>(["", "", "", ""]); // Store code as an array
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Function to handle code input change
  const handleCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 3) {
        document.getElementById(`code-input-${index + 1}`)?.focus();
      }
    }
  };

  // Function to handle keydown events (for backspace)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      const newCode = [...code];

      if (code[index] === "" && index > 0) {
        newCode[index - 1] = "";
        setCode(newCode);
        document.getElementById(`code-input-${index - 1}`)?.focus();
      } else {
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  // Function to handle code verification
  const handleVerifyClick = () => {
    if (code.join("").length === 4) {
      setIsVerified(true);
      alert("Code Verified!");
    } else {
      alert("Please enter a valid 4-digit Code.");
    }
  };

  // Function to handle resend code action
  const handleResendClick = () => {
    alert("Code resent to your email.");
  };

  return (
    <WelcomeBackground>
      <div className="otp-container">
        {/* HomeSync Logo */}
        <div className="logo-container">
          <div className="logo-bg">
            <div className="logo-inner">
              <img src={Logo} alt="Logo" className="logo-img" />
            </div>
          </div>
        </div>
        <h4 className="signin-logo-text">Join a Smart Home</h4>

        <div className="image-container">
          <img src={OTPImage} alt="OTP Illustration" className="image" />
        </div>

        <p className="otp-text">
          Please enter the code sent by the Home Owner.
        </p>

        <div className="otp-inputs">
          {code.map((value, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength={1}
              className="otp-input"
              value={value}
              onChange={(e) => handleCodeChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button
          className="verify-button"
          onClick={() => {
            handleVerifyClick();
            navigate("/home");
          }}
        >
          Join
        </button>

        <button className="resend-button" onClick={handleResendClick}>
          Resend Code
        </button>

        {isVerified && <p className="verification-message">Code Verified!</p>}
      </div>
    </WelcomeBackground>
  );
};

export default JoinHome;
