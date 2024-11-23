import React, { ReactNode } from "react";

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
      {/* App Content */}
      <div className="position-relative h-100 overflow-auto">{children}</div>
    </div>
  );
};

export default Background;
