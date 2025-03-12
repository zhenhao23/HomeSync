import React from "react";
import { FaBell } from "react-icons/fa";
import "./LogoNotif.css";

interface LogoNotifProps {
  setActiveContent: (content: string) => void;
}

const Background: React.FC<LogoNotifProps> = ({ setActiveContent }) => {
  return (
    <>
      {/* Notification Button */}
      <div className="notif-container">
        <div className="notification-button">
          <div
            className="rounded-circle notification-icon"
            onClick={() => setActiveContent("viewNotification")}
          >
            <FaBell color="#204160" size={18} />
            {/* Red Dot Notification */}
            {true && (
              <span className="bg-danger rounded-circle notification-dot"></span>
            )}
          </div>
          <span className="notification-text">Notifications</span>
        </div>
      </div>
    </>
  );
};

export default Background;
