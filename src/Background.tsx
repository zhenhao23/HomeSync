import React, { ReactNode } from "react";
import Vector1 from "./assets/clouds/Vector1.svg";
import Vector2 from "./assets/clouds/Vector2.svg";
import Vector3 from "./assets/clouds/Vector3.svg";
import Vector4 from "./assets/clouds/Vector4.svg";

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

      {/* App Content */}
      <div className="position-relative h-100 overflow-auto">{children}</div>
    </div>
  );
};

export default Background;
