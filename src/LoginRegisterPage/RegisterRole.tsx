import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../backend/firebase/config/firebaseConfig";
import "./RegisterRole.css";
import Logo from "../assets/logo.svg";
import OwnerIcon from "../assets/homeowner.svg";
import DwellerIcon from "../assets/homedweller.svg";
import { FaArrowLeft } from "react-icons/fa";

const RegisterRole: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"owner" | "dweller" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNextClick = async () => {
    setIsLoading(true);
    setError("");

    try {
      const pendingRegistrationStr = localStorage.getItem(
        "pendingRegistration"
      );

      if (!pendingRegistrationStr) {
        throw new Error(
          "Registration information missing. Please register again."
        );
      }

      const pendingRegistration = JSON.parse(pendingRegistrationStr);

      // Add the selected role to the registration data
      pendingRegistration.role = selectedRole;

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
          throw new Error("Google authentication lost. Please try again.");
        }

        // Get Firebase ID token
        idToken = await currentUser.getIdToken();
        pendingRegistration.firebaseUid = pendingRegistration.googleUid;
      }

      // Now, complete the registration with the backend
      const response = await fetch(
        "https://homesync-production.up.railway.app/auth/complete-registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(pendingRegistration),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete registration");
      }

      // Store authentication token
      if (idToken) {
        localStorage.setItem("authToken", idToken);
      } else {
        throw new Error("Failed to retrieve authentication token");
      }

      // Store any other necessary user data
      if (data.homeId) {
        localStorage.setItem("currentHomeId", data.homeId.toString());
      }

      // Navigate based on selected role
      if (selectedRole === "owner") {
        navigate("/home");
      } else if (selectedRole === "dweller") {
        navigate("/join-home");
      }
    } catch (error: any) {
      console.error("Role selection error:", error);
      setError(error.message || "Failed to complete registration");
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

      {/* Title */}
      <h1 className="register-title">Welcome to HomeSync!</h1>
      <p className="register-subtitle">Please Select Your Role</p>

      {/* Error message */}
      {error && (
        <p
          className="error-message"
          style={{ color: "red", textAlign: "center" }}
        >
          {error}
        </p>
      )}

      {/* Role Selection */}
      <div className="role-selection">
        {/* Home Owner Option */}
        <div
          className={`role-card ${selectedRole === "owner" ? "selected" : ""}`}
          onClick={() => !isLoading && setSelectedRole("owner")}
        >
          <img src={OwnerIcon} alt="Home Owner" className="role-icon" />
          <div className="role-info">
            <h3>Home Owner</h3>
            <p>Full Device Access (Admin)</p>
          </div>
          <div className="role-indicator"></div>
        </div>

        {/* Home Dweller Option */}
        <div
          className={`role-card ${
            selectedRole === "dweller" ? "selected" : ""
          }`}
          onClick={() => !isLoading && setSelectedRole("dweller")}
        >
          <img src={DwellerIcon} alt="Home Dweller" className="role-icon" />
          <div className="role-info">
            <h3>Home Dweller</h3>
            <p>Limited Device Access (Member)</p>
          </div>
          <div className="role-indicator"></div>
        </div>
      </div>

      {/* Next Button */}
      <button
        className="next-btn"
        disabled={!selectedRole || isLoading}
        onClick={handleNextClick}
      >
        {isLoading ? "Setting Up Your Account..." : "Next"}
      </button>
    </div>
  );
};

export default RegisterRole;
