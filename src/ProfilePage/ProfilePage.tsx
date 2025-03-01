import { useState, useEffect } from "react";
import {
  FaBell,
  FaUser,
  FaUsers,
  FaLanguage,
  FaLock,
  FaCamera,
} from "react-icons/fa";
import EditProfilePage from "./EditProfile";
import LanguagesPage from "./Languages";
import ChangePasswordPage from "./ChangePassword";
import ManageUsers from "./ManageUsers";

import "./ProfilePage.css";

const ProfilePage = () => {
  const [currentPage, setCurrentPage] = useState("profile");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profileImage: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setUserData({
          name: data.name,
          email: data.email,
          profileImage: data.profileImage,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "edit-profile":
        return (
          <EditProfilePage
            onBack={() => setCurrentPage("profile")}
            userData={userData}
            setUserData={setUserData}
          />
        );
      case "languages":
        return <LanguagesPage onBack={() => setCurrentPage("profile")} />;
      case "change-password":
        return <ChangePasswordPage onBack={() => setCurrentPage("profile")} />;
      case "manage-users":
        return <ManageUsers onBack={() => setCurrentPage("profile")} />;
      default:
        return (
          <>
            <h1 className="profile-heading">My Profile</h1>
            <div className="profile-content">
              {/* Profile Section */}
              <div className="profile-info">
                <div className="profile-image-container">
                  <div className="profile-image">
                    <FaUser size={40} color="#999" />
                  </div>
                  <div className="camera-icon">
                    <FaCamera size={16} color="#666" />
                  </div>
                </div>
                <div className="user-details">
                  <h2>Alvin</h2>
                  <p>alvin1112@gmail.com</p>
                </div>
              </div>

              {/* Divider Line */}
              <div className="divider" />

              {/* Menu Section */}
              <div className="profile-menu">
                {/* First grey container */}
                <div className="menu-group">
                  <button
                    className="menu-item"
                    onClick={() => setCurrentPage("edit-profile")}
                  >
                    <FaUser className="menu-icon" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    className="menu-item"
                    onClick={() => setCurrentPage("manage-users")}
                  >
                    <FaUsers className="menu-icon" />
                    <span>Manage Users</span>
                  </button>

                  <button
                    className="menu-item"
                    onClick={() => setCurrentPage("languages")}
                  >
                    <FaLanguage className="menu-icon" />
                    <span>Languages</span>
                  </button>

                  <button
                    className="menu-item"
                    onClick={() => setCurrentPage("change-password")}
                  >
                    <FaLock className="menu-icon" />
                    <span>Change Password</span>
                  </button>
                </div>

                {/* Second grey container */}
                <div className="notification-group">
                  <div className="notification-item">
                    <div className="notification-left">
                      <FaBell className="menu-icon" />
                      <span>Notification</span>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };
  return <div className="profile-page">{renderPage()}</div>;
};

export default ProfilePage;
