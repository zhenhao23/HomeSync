import React, { useState } from "react";
import { FaHome, FaBolt, FaSun, FaUser } from "react-icons/fa";

interface NavItem {
  id: string;
  icon: JSX.Element;
  label: string;
  path: string;
}

const BottomNavbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");

  const navItems: NavItem[] = [
    {
      id: "home",
      icon: <FaHome size={20} />,
      label: "Home",
      path: "/",
    },
    {
      id: "energy",
      icon: <FaBolt size={20} />,
      label: "Energy",
      path: "/energy",
    },
    {
      id: "solar",
      icon: <FaSun size={20} />,
      label: "Solar",
      path: "/solar",
    },
    {
      id: "profile",
      icon: <FaUser size={20} />,
      label: "Profile",
      path: "/profile",
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    // Add your navigation logic here
  };

  return (
    <nav
      className="fixed-bottom d-flex justify-content-around align-items-center py-2"
      style={{ backgroundColor: "#204160" }}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavClick(item.id)}
          className={`btn d-flex align-items-center ${
            activeTab === item.id ? "active" : ""
          }`}
          style={{
            backgroundColor: "#ffffff",
            color: "#204160",
            borderRadius: "8px",
            height: "40px",
            padding: activeTab === item.id ? "0 16px" : "0 12px",
            transition: "all 0.3s ease",
            minWidth: activeTab === item.id ? "110px" : "auto",
          }}
        >
          <div className="d-flex align-items-center">
            {item.icon}
            {activeTab === item.id && (
              <span className="ms-2 fw-medium" style={{ fontSize: "14px" }}>
                {item.label}
              </span>
            )}
          </div>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavbar;
