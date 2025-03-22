import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./AccessRequest.css";

interface AccessRequestProps {
  requestId: number;
  image: string;
  person: string;
  requestItem: string;
  handleRemoveRequest: (id: number) => void;
}

const AccessRequest: React.FC<AccessRequestProps> = ({
  requestId,
  image,
  person,
  requestItem,
  handleRemoveRequest,
}) => {
  return (
    <div className="mb-1 access-request-container">
      <div className="p-3 mb-3 d-flex justify-content-between align-items-center flex-row notif-items">
        <img style={{ width: "50px", height: "50px" }} src={image}></img>
        <div className="ms-3 me-2 d-inline-flex justify-content-center align-items-center">
          <span className="request-word">
            {person} has requested to access{" "}
            <span className="fw-bold">{requestItem}</span>
          </span>
        </div>

        <div className="d-flex ms-1 justify-content-around align-items-center col-3">
          <FaCheckCircle
            color="green"
            size={32}
            onClick={() => handleRemoveRequest(requestId)}
          />
          <FaTimesCircle
            color="red"
            size={32}
            onClick={() => handleRemoveRequest(requestId)}
          />
        </div>
      </div>
    </div>
  );
};

export default AccessRequest;
