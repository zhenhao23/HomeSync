import React from "react";
import Logo from "../assets/logo.svg";
import "./LogoSmartHome.css";

const LogoSmartHome: React.FC = () => {
  return (
    <div className="d-flex justify-content-center logo-div" style={{ zIndex: "20" }}>
      <div className="rounded-circle logo-border">
        <div className="rounded-circle logo-inner">
          <div className="rounded-circle logo-core">
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
  );
};

export default LogoSmartHome;
