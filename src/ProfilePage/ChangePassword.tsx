import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "./ChangePassword.css";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

// Debug log to check if environment variables are loaded
console.log("API URL:", import.meta.env.VITE_API_URL);

interface ChangePasswordProps {
  onBack: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onBack }) => {
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth(); // Get the authentication token function from your auth context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Get the authentication token
      const token = await getToken();

      // Use a fallback value for the API URL
      const apiBaseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      // Call the API to change the password
      await axios.put(
        `${apiBaseUrl}/api/users/change-password`,
        { newPassword: passwordData.newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Password changed successfully!");
      setPasswordData({ newPassword: "", confirmPassword: "" });

      // After 2 seconds, go back
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="cp-container-fluid p-3 pb-2">
        <div className="cp-row align-items-center cp-mb-3">
          <div className="cp-col-4 text-start">
            <button className="cp-btn p-0" onClick={onBack}>
              <FaArrowLeft />
            </button>
          </div>
          <div className="cp-col-4 text-center">
            <h3 className="cp-header-change-password">Change Password</h3>
          </div>
          <div className="cp-col-4" />
        </div>
      </div>

      <div className="cp-content-container">
        <form onSubmit={handleSubmit} className="cp-password-form">
          {error && <div className="cp-alert cp-alert-danger">{error}</div>}
          {success && (
            <div className="cp-alert cp-alert-success">{success}</div>
          )}

          <div className="cp-form-group">
            <label>New Password:</label>
            <input
              type="password"
              className="cp-form-control"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              disabled={isLoading}
            />
          </div>

          <div className="cp-form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              className="cp-form-control"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="cp-btn cp-btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
