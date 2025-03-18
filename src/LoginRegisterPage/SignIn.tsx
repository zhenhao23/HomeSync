import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../backend/firebase/config/firebaseConfig";
import "./SignIn.css";
import Logo from "../assets/logo.svg";
import GoogleLogo from "../assets/Google.svg";
import { FaArrowLeft } from "react-icons/fa";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Inside handleEmailSignIn function
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Firebase email/password sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get Firebase ID token for backend verification
      const idToken = await userCredential.user.getIdToken();

      // Send token to backend for verification and user details
      const response = await fetch(
        "https://homesync-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      if (!response.ok) {
        throw new Error("Login verification failed");
      }

      const userData = await response.json();
      console.log("Logged in user:", userData);

      // Store the token in localStorage
      localStorage.setItem("authToken", idToken);

      // Store the default home ID if available
      if (userData.defaultHomeId) {
        localStorage.setItem(
          "currentHomeId",
          userData.defaultHomeId.toString()
        );
      }

      navigate("/home");
    } catch (error: any) {
      // Error handling...
    }
  };

  // Similarly update the handleGoogleSignIn function with the same home ID storage logic

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);

      // Get Firebase ID token for backend verification
      const idToken = await result.user.getIdToken();

      // Send token to backend for verification and user details
      const response = await fetch(
        "https://homesync-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      if (!response.ok) {
        throw new Error("Login verification failed");
      }

      const userData = await response.json();
      console.log("Google sign-in successful:", userData);

      // Store the token in localStorage
      localStorage.setItem("authToken", idToken);

      // Store the default home ID if available
      if (userData.defaultHomeId) {
        localStorage.setItem(
          "currentHomeId",
          userData.defaultHomeId.toString()
        );
      }

      navigate("/home");
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      setError(error.message || "Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="signin-container" style={{ backgroundColor: "#204160" }}>
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft size={20} />
      </button>

      {/* Top Section with HomeSync Logo */}
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
      <form onSubmit={handleEmailSignIn} className="input-container">
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
        />

        <a onClick={() => navigate("/forgot-pw")} className="forgot-password">
          Forgot Password?
        </a>

        {/* Log In Button */}
        <button type="submit" className="login-btn">
          Log In
        </button>
      </form>

      {/* Divider */}
      <div className="divider1">or Sign In with</div>

      {/* Google Sign-In Button */}
      <button className="google-btn" onClick={handleGoogleSignIn}>
        <img src={GoogleLogo} alt="Google Logo" className="google-icon" />
        Continue with Google
      </button>

      {/* Sign-Up Link */}
      <p className="signup-link">
        Don't have an Account?{" "}
        <a onClick={() => navigate("/register-acc")}>Sign Up</a>
      </p>
    </div>
  );
};

export default SignIn;
