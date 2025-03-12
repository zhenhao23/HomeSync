import { useState } from "react";
import TimePickerDropdown from "./TimePickerDropdown";

interface EditTimeModalProps {
  handleTurnOnChange: (time: string) => void;
  handleTurnOffChange: (time: string) => void;
  turnType: "turnOn" | "turnOff";
  toggleEditTime: () => void;
}

const EditTimeModal: React.FC<EditTimeModalProps> = ({
  handleTurnOnChange,
  handleTurnOffChange,
  turnType,
  toggleEditTime,
}) => {
  // Get current time
  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, "0");
  const currentMinute = now.getMinutes().toString().padStart(2, "0");

  const [selectedHour, setSelectedHour] = useState(currentHour);
  const [selectedMinute, setSelectedMinute] = useState(currentMinute);

  const handleCancelEditTime = () => {
    toggleEditTime(); // Close modal
  }

  // Function to confirm edited time
  const handleConfirmEditTime = () => {
    const time = `${selectedHour}:${selectedMinute}`;
    if (turnType === "turnOn") {
      handleTurnOnChange(time);
    } else if (turnType === "turnOff") {
      handleTurnOffChange(time);
    }
    toggleEditTime(); // Close modal
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "200",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
          height: "160px",
          textAlign: "center",
        }}
      >
        <h4 style={{ color: "#000000", fontSize: "20px" }}>Edit Time</h4>
        <div>
          <TimePickerDropdown 
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
          selectedMinute={selectedMinute}
          setSelectedMinute={setSelectedMinute}
          />
        </div>

        <div
          style={{
            borderTop: "1px solid #979797",
            width: "100%",
          }}
        ></div>
        <div className="p-1 d-flex justify-content-around">
          <button
            onClick={handleCancelEditTime}
            style={{
              backgroundColor: "#ffffff",
              color: "#4285f4",
              border: "none",
              cursor: "pointer",
              fontWeight: "650",
              width: "49vw",
              fontSize: "18px",
            }}
          >
            Cancel
          </button>
          <div
            style={{
              borderLeft: "1px solid #979797",
              height: "40px",
            }}
          ></div>
          <button
            onClick={handleConfirmEditTime}
            style={{
              backgroundColor: "#ffffff",
              color: "#f34235",
              border: "none",
              cursor: "pointer",
              fontWeight: "650",
              width: "49vw",
              fontSize: "18px",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTimeModal;
