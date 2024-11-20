import React, { ReactNode } from "react";
import { FaBell } from "react-icons/fa";
import Vector1 from "./assets/clouds/Vector1.svg";
import Vector2 from "./assets/clouds/Vector2.svg";
import Vector3 from "./assets/clouds/Vector3.svg";
import Vector4 from "./assets/clouds/Vector4.svg";
import Logo from "./assets/logo.svg";

interface BackgroundProps {
  children: ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 overflow-hidden"
      style={{
        backgroundColor: "#204160",
      }}
    >
      {/* Clouds */}
      <img
        src={Vector3}
        alt="Cloud Vector 3"
        className="position-absolute top-0 start-0 w-250 opacity-50"
        style={{ transform: "translateX(-16%) translateY(-10%)" }}
      />
      <img
        src={Vector1}
        alt="Cloud Vector 1"
        className="position-absolute top-0 start-0 w-250 opacity-75"
        style={{ transform: "translateX(-16%) translateY(90%)" }}
      />
      <img
        src={Vector4}
        alt="Cloud Vector 4"
        className="position-absolute top-0 end-0 w-250 opacity-50"
        style={{ transform: "translateX(14%) translateY(-10%)" }}
      />
      <img
        src={Vector2}
        alt="Cloud Vector 2"
        className="position-absolute top-0 end-0 w-250 opacity-75"
        style={{ transform: "translateX(14%) translateY(33%)" }}
      />

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

      {/* App Content */}
      <div className="position-relative h-100 overflow-auto">{children}</div>
    </div>
  );
};

export default Background;
