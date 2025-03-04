import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
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

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          role: "user",
          password,
          firebaseUid: userCredential.user.uid,
        }),
      });

      const responseData = await response.json();
      console.log("Full server response:", responseData);

      if (!response.ok) {
        // More descriptive error handling
        const errorMessage =
          responseData.details ||
          responseData.error ||
          "Failed to register user in database";
        throw new Error(errorMessage);
      }

      console.log("User registered:", userCredential.user);
      navigate("/otp-ver");
    } catch (error: any) {
      console.error("Full error details:", error);

      // Check if it's a Firebase email in use error
      if (error.code === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please use a different email."
        );
      } else {
        setError(error.message || "Registration failed");
      }
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send Google user details to your backend
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          firebaseUid: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register user in database");
      }

      console.log("Google registration successful:", user);
      navigate("/otp-ver");
    } catch (error: any) {
      console.error("Google Registration Error:", error);
      setError(error.message || "Google registration failed");
    }
  };

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
        />

        <label>Last Name</label>
        <input
          type="text"
          placeholder="Enter your last name"
          className="input-box"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
        />

        {/* Create Account Button */}
        <button type="submit" className="create-account-btn">
          Create Account
        </button>
      </form>

      {/* Divider */}
      <div className="divider">or Register with</div>

      {/* Google Register Button */}
      <button onClick={handleGoogleRegister} className="google-btn">
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
