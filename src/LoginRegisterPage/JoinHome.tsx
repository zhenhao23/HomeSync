import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/config";
import WelcomeBackground from "./WelcomeBackground";
import Logo from "../assets/logo.svg";
import OTPImage from "../assets/otp.svg";
import "./OTP.css";

const JoinHome: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

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

  // Function to handle code verification and account creation
  const handleVerifyClick = async () => {
    const invitationCode = code.join("");

    if (invitationCode.length !== 4) {
      setError("Please enter a valid 4-digit invitation code.");
      return;
    }

    setError("");
    setSuccess("");
    setIsProcessing(true);

    try {
      // Get the pending registration data
      const pendingRegistrationStr = localStorage.getItem(
        "pendingRegistration"
      );

      if (!pendingRegistrationStr) {
        throw new Error(
          "Registration information missing. Please register again."
        );
      }

      const pendingRegistration = JSON.parse(pendingRegistrationStr);

      // Create Firebase user based on registration method
      let userCredential;
      let idToken;

      // Handle email registration
      if (pendingRegistration.registrationMethod === "email") {
        // Create Firebase user
        userCredential = await createUserWithEmailAndPassword(
          auth,
          pendingRegistration.email,
          pendingRegistration.password
        );

        // Get Firebase ID token
        idToken = await userCredential.user.getIdToken();

        // Add Firebase UID to the registration data
        pendingRegistration.firebaseUid = userCredential.user.uid;
      }
      // Handle Google registration
      else if (pendingRegistration.registrationMethod === "google") {
        // For Google users, we need to use the existing UID
        const currentUser = auth.currentUser;

        if (!currentUser) {
          // Try to sign in with Google again
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          idToken = await result.user.getIdToken();
          pendingRegistration.firebaseUid = result.user.uid;
        } else {
          // Get Firebase ID token
          idToken = await currentUser.getIdToken();
          pendingRegistration.firebaseUid = pendingRegistration.googleUid;
        }
      }

      // Ensure we have a valid token
      if (!idToken) {
        throw new Error("Failed to retrieve authentication token");
      }

      // Now, complete the registration and join the home
      const response = await fetch(
        "https://homesync-production.up.railway.app/auth/join-home-with-registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            ...pendingRegistration,
            invitationCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join home");
      }

      // Store authentication token
      localStorage.setItem("authToken", idToken);

      // Store home ID if available
      if (data.homeId) {
        localStorage.setItem("currentHomeId", data.homeId.toString());
      }

      // Show success message
      setSuccess("Successfully joined the home!");

      // Clear pending registration
      localStorage.removeItem("pendingRegistration");

      // Force a reset of the Firebase auth token in storage
      // This sometimes helps with stale token issues
      try {
        if (userCredential?.user) {
          const freshToken = await userCredential.user.getIdToken(true);
          localStorage.setItem("authToken", freshToken);
        }
      } catch (tokenError) {
        console.error("Error refreshing token:", tokenError);
        // Continue anyway
      }

      // Navigate to home page after a short delay
      setTimeout(() => {
        // Redirect to login to ensure proper token handling
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Join home error:", error);
      setError(error.message || "Failed to join home");
    } finally {
      setIsProcessing(false);
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
        <h4 className="signin-logo-text">Join a Smart Home</h4>

        <div className="image-container">
          <img src={OTPImage} alt="OTP Illustration" className="image" />
        </div>

        <p className="otp-text">
          Please enter the invitation code provided by the Home Owner.
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
              disabled={isProcessing}
            />
          ))}
        </div>

        <button
          className="verify-button"
          onClick={handleVerifyClick}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Join Home"}
        </button>

        <button
          className="resend-button"
          onClick={() => navigate("/register-role")}
          disabled={isProcessing}
        >
          Go Back
        </button>
      </div>
    </WelcomeBackground>
  );
};

export default JoinHome;
