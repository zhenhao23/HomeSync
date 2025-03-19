import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeBackground from "./WelcomeBackground";
import Logo from "../assets/logo.svg";
import OTPImage from "../assets/otp.svg";
import "./OTP.css";

const OTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // Get user email from localStorage to display on the page
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    } else {
      // If no email is found, redirect back to register
      navigate("/register");
    }
  }, [navigate]);

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
  const handleVerifyClick = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      setError("Please enter a valid 4-digit OTP.");
      return;
    }

    setError("");
    setSuccess("");
    setIsVerifying(true);

    try {
      const pendingRegistration = localStorage.getItem("pendingRegistration");

      if (!pendingRegistration) {
        throw new Error(
          "Registration information missing. Please register again."
        );
      }

      const userData = JSON.parse(pendingRegistration);

      const response = await fetch(
        "https://homesync-production.up.railway.app/auth/verify-otp-only",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            otp: otpValue,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      // Set success message
      setSuccess("Email verified successfully!");

      // Navigate to role selection after a short delay
      setTimeout(() => {
        navigate("/register-role");
      }, 1500);
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setError(error.message || "Failed to verify OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  // Update resend OTP function as well
  const handleResendClick = async () => {
    setError("");
    setSuccess("");
    setIsResending(true);

    try {
      const userEmail = localStorage.getItem("userEmail");
      const firstName = localStorage.getItem("userFirstName");

      if (!userEmail || !firstName) {
        throw new Error("User information missing. Please register again.");
      }

      const response = await fetch(
        "https://homesync-production.up.railway.app/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            firstName: firstName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification code");
      }

      setSuccess("Verification code has been resent to your email.");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      setError(error.message || "Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
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
        <h4 className="forgot-logo-text">OTP Verification</h4>

        <div className="image-container">
          <img src={OTPImage} alt="OTP Illustration" className="image" />
        </div>

        <p className="otp-text">
          Please enter the verification code sent to {userEmail || "your email"}
          .
        </p>

        {error && (
          <p className="error-message" style={{ color: "red" }}>
            {error}
          </p>
        )}
        {success && (
          <p className="success-message" style={{ color: "green" }}>
            {success}
          </p>
        )}

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
              disabled={isVerifying || isResending}
            />
          ))}
        </div>

        <button
          className="verify-button"
          onClick={handleVerifyClick}
          disabled={isVerifying || isResending}
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>

        <button
          className="resend-button"
          onClick={handleResendClick}
          disabled={isVerifying || isResending}
        >
          {isResending ? "Sending..." : "Resend Code"}
        </button>
      </div>
    </WelcomeBackground>
  );
};

export default OTPVerification;
