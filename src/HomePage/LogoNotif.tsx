import React from "react";
import { FaBell } from "react-icons/fa";
import Logo from "../assets/logo.svg";

const Background: React.FC = () => {
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 overflow-hidden">
      {/* Notification Button */}
      <div
        className="position-absolute top-0 end-0 m-3"
        style={{ zIndex: 20, transform: "translateX(-30%) translateY(140%)" }}
      >
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "white",
            width: "35px",
            height: "35px",
            cursor: "pointer",
            boxShadow: "3px 3px 4px rgba(0, 0, 0, 1)", // Shadow to bottom right
          }}
        >
          <FaBell color="#204160" size={18} />
        </div>
      </div>

      {/* Logo */}
      <div
        className="position-absolute top-0 start-50 translate-middle-x"
        style={{ zIndex: 20 }}
      >
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            border: "1px dotted white",
            backgroundColor: "transparent",
            width: "67px",
            height: "67px",
            marginTop: "30px",
          }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "#D3C1A3",
              width: "55px",
              height: "55px",
            }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "white",
                width: "45px",
                height: "45px",
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                className="img-fluid"
                style={{
                  maxWidth: "75%",
                  maxHeight: "75%",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Background;
