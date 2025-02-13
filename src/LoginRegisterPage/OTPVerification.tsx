import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import WelcomeBackground from "./WelcomeBackground";
import Logo from "../assets/logo.svg";
import OTPImage from "../assets/otp.svg";
import "./OTP.css";

const OTPVerification: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]); // Store OTP as an array
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Function to handle OTP input change
  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // Only allow numeric input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input automatically
      if (value && index < 3) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  // Function to handle keydown events (for backspace)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      const newOtp = [...otp];

      // If current input is empty and we're not at the first input, move to previous input
      if (otp[index] === "" && index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        document.getElementById(`otp-input-${index - 1}`)?.focus();
      } else {
        // Clear current input
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Function to handle OTP verification
  const handleVerifyClick = () => {
    if (otp.join("").length === 4) {
      setIsVerified(true);
      alert("OTP Verified!");
    } else {
      alert("Please enter a valid 4-digit OTP.");
    }
  };

  // Function to handle resend OTP action
  const handleResendClick = () => {
    alert("OTP resent to your email.");
  };

  return (
    <WelcomeBackground>
      <div className="otp-container">
        <div className="signin-logo-container">
          <div className="signin-logo-bg">
            <div className="signin-logo-inner">
              <img src={Logo} alt="HomeSync Logo" className="signin-logo-img" />
            </div>
          </div>
        </div>
        <h4 className="signin-logo-text">OTP Verification</h4>

        <div className="image-container">
          <img src={OTPImage} alt="OTP Illustration" className="image" />
        </div>

        <p className="otp-text">
          Please enter the verification code sent to your email.
        </p>

        <div className="otp-inputs">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength={1}
              className="otp-input"
              value={value}
              onChange={(e) => handleOTPChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button
          className="verify-button"
          onClick={() => {
            handleVerifyClick();
            navigate("/register-role");
          }}
        >
          Verify
        </button>

        <button className="resend-button" onClick={handleResendClick}>
          Resend Code
        </button>

        {isVerified && <p className="verification-message">OTP Verified!</p>}
      </div>
    </WelcomeBackground>
  );
};

export default OTPVerification;
