import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface AccessRequestProps {
  image: string;
  person: string;
  requestItem: string;
}

const AccessRequest: React.FC<AccessRequestProps> = ({
  image,
  person,
  requestItem,
}) => {
  return (
    <div
      className="mb-1"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <div
        className="p-3 mb-3 d-flex justify-content-between align-items-center flex-row"
        style={{
          backgroundColor: "#ecedeb",
          borderRadius: "16px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
          width: "calc(100% - 15%)",
        }}
      >
        <img style={{ width: "50px", height: "50px" }} src={image}></img>
        <div className="ms-3 me-2 d-inline-flex justify-content-center align-items-center">
          <span>
            {person} has requested to access{" "}
            <span className="fw-bold">{requestItem}</span>
          </span>
        </div>

        <div className="d-flex ms-1 justify-content-around align-items-center col-3">
          <FaCheckCircle color="green" size={32} />
          <FaTimesCircle color="red" size={32} />
        </div>
      </div>
    </div>
  );
};

export default AccessRequest;
