import React from "react";
import "./Warning.css";

interface WarningProps {
  title: string;
  message: string;
}

const Warning: React.FC<WarningProps> = ({ title, message }) => {
  return (
    <div className="warning-container">
      <div
        className="p-3 mb-3 d-flex justify-content-between flex-column"
        style={{
          backgroundColor: "#ecedeb",
          borderRadius: "16px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
          width: "calc(100% - 15%)",
        }}
      >
        <h6 className="text-danger fw-bold">{title}</h6>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Warning;
