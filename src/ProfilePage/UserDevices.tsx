import React from "react";
import {
  FaBed,
  FaCouch,
  FaUtensils,
  // FaUser,
} from "react-icons/fa";
import "./UserDevices.css";
// Add these imports
import ProfileImage from "./img1.jpeg";
import AnnaProfilePic from "./anna-profile.avif";
import AdrianProfilePic from "./adrian-profile.avif";
import JoshuaProfilePic from "./joshua-profile.avif";
import LilyProfilePic from "./lily-profile.avif";
import { IoIosArrowBack } from "react-icons/io";

// Add this helper function
const getProfilePicture = (profilePicPath: string) => {
  switch (profilePicPath) {
    case "/img1.jpeg":
      return ProfileImage;
    case "/anna-profile.avif":
      return AnnaProfilePic;
    case "/adrian-profile.avif":
      return AdrianProfilePic;
    case "/joshua-profile.avif":
      return JoshuaProfilePic;
    case "/lily-profile.avif":
      return LilyProfilePic;
    default:
      return ProfileImage;
  }
};

interface UserType {
  id: number;
  name: string;
  profilePic: string;
}

interface UserDevicesProps {
  onBack: () => void;
  user: UserType;
}

const UserDevices: React.FC<UserDevicesProps> = ({ onBack, user }) => {
  const devices = [
    {
      name: "Living Room Light",
      location: "Living Room",
      icon: <FaCouch size={24} />,
    },
    {
      name: "Bedroom AC",
      location: `${user.name}'s Bedroom`,
      icon: <FaBed size={24} />,
    },
    {
      name: "Kitchen Light",
      location: "Kitchen",
      icon: <FaUtensils size={24} />,
    },
  ];

  return (
    <div className="user-devices">
      {/* Header Section */}
      <div className="header">
        {/* <FaArrowLeft className="back-icon" onClick={onBack} /> */}
        <div
          onClick={onBack}
          style={{
            padding: "8px 15px",
            cursor: "pointer",
            position: "absolute",
            left: 0, // Ensures it's on the left
            display: "flex",
            alignItems: "center",
          }}
        >
          <IoIosArrowBack size={22} color="#FFFFFF" />
          <span
            style={{ marginLeft: "8px", color: "#FFFFFF", fontSize: "16px" }}
          >
            Back
          </span>
        </div>
        <h3
          className="fw-bold"
          style={{
            color: "#FFFFFF",
            fontSize: "1.5rem",
            textAlign: "center",
            flex: 1, // Ensures it takes available space
          }}
        >
          Manage Users
        </h3>
      </div>

      {/* Content Container */}
      <div className="content-container">
        {/* User Profile Section */}
        <div className="user-profile">
          <div className="profile-image">
            {user.profilePic ? (
              <img src={getProfilePicture(user.profilePic)} alt={user.name} />
            ) : (
              <div className="default-avatar">{user.name.charAt(0)}</div>
            )}
          </div>
          <h3 className="user-name">{user.name}</h3>
        </div>

        {/* Devices List */}
        <ul className="device-list">
          {devices.map((device, index) => (
            <li key={index} className="device-item">
              <div className="device-icon">{device.icon}</div>
              <div className="device-info">
                <span className="device-location">{device.location}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDevices;
