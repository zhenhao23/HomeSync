import { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import ProfileImage from "./img1.jpeg"; // Import the local image
import "./EditProfile.css";
import { IoIosArrowBack } from "react-icons/io";

interface EditProfileProps {
  onBack: () => void;
  userData: any;
  setUserData: (data: any) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({
  onBack,
  userData,
  setUserData,
}) => {
  // Split the name into first and last name when component initializes
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: userData.email,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize the form with split name
  useEffect(() => {
    const nameParts = userData.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    setFormData({
      ...formData,
      firstName,
      lastName,
    });
  }, [userData.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Validation
      if (!formData.firstName || !formData.lastName) {
        throw new Error("Both first name and last name are required");
      }

      // Make the API call to update user data
      const response = await fetch(
        "https://homesync-production.up.railway.app/api/users/current",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const result = await response.json();

      // Update the local state with the new data
      setUserData({
        ...userData,
        name: `${result.user.firstName} ${result.user.lastName}`,
      });

      // Go back to profile page
      onBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="ep-container-fluid p-3 pb-2">
        <div style={{ position: "relative", top: "45px", width: "100%" }}>
          {/* Back Button */}
          <div
            onClick={onBack}
            style={{
              cursor: "pointer",
              position: "absolute",
              marginTop: "5px",
            }}
          >
            <IoIosArrowBack size={22} color="#FFFFFF" />
            <span
              style={{
                color: "#FFFFFF",
                fontSize: "16px",
              }}
            >
              Back
            </span>
          </div>

          {/* Room Title */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Display the title normally when not in edit mode */}
            <h3
              className="fw-bold me-2"
              style={{ color: "#FFFFFF", fontSize: "1.5rem" }}
            >
              Edit Profile
            </h3>
          </div>
        </div>

        <div className="ep-col-4" />
      </div>

      <div className="ep-content-container">
        <form onSubmit={handleSubmit} className="ep-edit-profile-form">
          <div className="ep-profile-image-upload">
            <img
              className="ep-profile-image1"
              src={userData.profileImage || ProfileImage}
              alt="Profile"
            />
            <button type="button" className="ep-upload-button">
              <FaCamera />
            </button>
          </div>

          {errorMessage && (
            <div
              className="ep-error-message"
              style={{ color: "red", margin: "10px 0" }}
            >
              {errorMessage}
            </div>
          )}

          <div className="ep-form-group">
            <label>First Name:</label>
            <input
              type="text"
              className="ep-form-control"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
          </div>

          <div className="ep-form-group">
            <label>Last Name:</label>
            <input
              type="text"
              className="ep-form-control"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>

          <div className="ep-save-button-container">
            <button
              type="submit"
              className="ep-btn ep-btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
