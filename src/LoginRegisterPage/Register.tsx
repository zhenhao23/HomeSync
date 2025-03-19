import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  // createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../backend/firebase/config/firebaseConfig";
import "./Register.css";
import Logo from "../assets/logo.svg";
import GoogleLogo from "../assets/Google.svg";
import { FaArrowLeft } from "react-icons/fa";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Don't create Firebase user yet - just collect the information

      // Send only email to backend to generate OTP
      const response = await fetch(
        "https://homesync-production.up.railway.app/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            firstName,
          }),
        }
      );

      const responseData = await response.json();
      console.log("Send OTP response:", responseData);

      if (!response.ok) {
        const errorMessage =
          responseData.details ||
          responseData.error ||
          "Failed to send verification code";
        throw new Error(errorMessage);
      }

      // Store user registration data in localStorage for later account creation
      localStorage.setItem(
        "pendingRegistration",
        JSON.stringify({
          email,
          firstName,
          lastName,
          password,
          role: "user",
          registrationMethod: "email",
        })
      );

      // Store email for OTP verification page
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userFirstName", firstName);

      console.log("OTP sent, proceeding to verification");
      navigate("/otp-ver");
    } catch (error: any) {
      console.error("Full error details:", error);

      // Error handling
      if (error.message.includes("already registered")) {
        setError(
          "This email is already registered. Please use a different email."
        );
      } else {
        setError(error.message || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Similar update for handleGoogleRegister
  const handleGoogleRegister = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if email is already registered
      const checkResponse = await fetch(
        "https://homesync-production.up.railway.app/auth/check-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
          }),
        }
      );

      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        if (checkData.error === "Email already registered") {
          throw new Error(
            "This email is already registered. Please sign in instead."
          );
        } else {
          throw new Error(checkData.error || "Failed to check email");
        }
      }

      // Extract name parts from displayName
      const nameParts = user.displayName?.split(" ") || ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Send OTP for Google users too
      const response = await fetch(
        "https://homesync-production.up.railway.app/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            firstName: firstName,
          }),
        }
      );

      const responseData = await response.json();
      console.log("Google OTP response:", responseData);

      if (!response.ok) {
        const errorMessage =
          responseData.details ||
          responseData.error ||
          "Failed to send verification code";
        throw new Error(errorMessage);
      }

      // Store Google user data for later use
      localStorage.setItem(
        "pendingRegistration",
        JSON.stringify({
          email: user.email,
          firstName,
          lastName,
          googleUser: true,
          googleUid: user.uid,
          role: "user",
          registrationMethod: "google",
        })
      );

      // Store info for OTP verification page
      localStorage.setItem("userEmail", user.email || "");
      localStorage.setItem("userFirstName", firstName);

      console.log("Google OTP sent, proceeding to verification");
      navigate("/otp-ver");
    } catch (error: any) {
      console.error("Google Registration Error:", error);
      setError(error.message || "Google registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Back Button */}
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
        disabled={isLoading}
      >
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

      {/* Title & Subtitle */}
      <div className="register-content">
        <h1 className="register-title">Welcome to HomeSync</h1>
        <p className="register-subtitle">Get started with Smarter Living.</p>
      </div>

      {/* Error Message */}
      {error && (
        <p
          className="error-message"
          style={{ color: "red", textAlign: "center" }}
        >
          {error}
        </p>
      )}

      {/* Input Fields */}
      <form onSubmit={handleEmailRegister} className="input-container">
        <label>First Name</label>
        <input
          type="text"
          placeholder="Enter your first name"
          className="input-box"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          disabled={isLoading}
        />

        <label>Last Name</label>
        <input
          type="text"
          placeholder="Enter your last name"
          className="input-box"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          disabled={isLoading}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="input-box"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
        />

        {/* Create Account Button */}
        <button
          type="submit"
          className="create-account-btn"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Divider */}
      <div className="divider2">or Register with</div>

      {/* Google Register Button */}
      <button
        onClick={handleGoogleRegister}
        className="google-btn"
        disabled={isLoading}
      >
        <img src={GoogleLogo} alt="Google Logo" className="google-icon" />
        {isLoading ? "Processing..." : "Continue with Google"}
      </button>

      {/* Sign In Link */}
      <p className="signup-link">
        Already Have an Account?{" "}
        <a
          onClick={() => navigate("/signin")}
          style={{ pointerEvents: isLoading ? "none" : "auto" }}
        >
          Sign In
        </a>
      </p>
    </div>
  );
};

export default Register;
