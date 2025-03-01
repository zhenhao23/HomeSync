import React from 'react';
import { FaArrowLeft, FaBed, FaCouch, FaUtensils } from 'react-icons/fa';
import './UserDevices.css';

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
    { name: "Living Room Light", location: "Living Room", icon: <FaCouch size={24} /> },
    { name: "Bedroom AC", location: `${user.name}'s Bedroom`, icon: <FaBed size={24} /> },
    { name: "Kitchen Light", location: "Kitchen", icon: <FaUtensils size={24} /> }
  ];

  return (
    <div className="user-devices">
      {/* Header Section */}
      <div className="header">
        <FaArrowLeft className="back-icon" onClick={onBack} />
        <h2>Manage Users</h2>
      </div>

      {/* Content Container */}
      <div className="content-container">
        {/* User Profile Section */}
        <div className="user-profile">
          <div className="profile-image">
            <img src={user.profilePic} alt={user.name} />
          </div>
          <h3>{user.name}</h3>
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