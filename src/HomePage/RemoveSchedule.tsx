import { Schedule } from "./DeviceSmartFeature";

interface RemoveScheduleProps {
  handleCancel: () => void;
  handleConfirm: (f: Schedule) => void;
  removeSchedule: Schedule | null;
}

const RemoveScheduleModal: React.FC<RemoveScheduleProps> = ({
  handleCancel,
  handleConfirm,
  removeSchedule,
}) => {
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
        <h4 style={{ color: "#000000", fontSize: "20px" }}>Remove Schedule</h4>
        <div className="pb-2">
          <span
            style={{
              fontSize: "15px",
              color: "#000000",
            }}
          >
            Are you sure you want to remove this schedule?
          </span>
        </div>
        <div
          style={{
            borderTop: "1px solid #979797",
            width: "100%",
          }}
        ></div>
        <div className="p-1 d-flex justify-content-around">
          <button
            onClick={handleCancel}
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
            onClick={() => {
              if (removeSchedule) {
                handleConfirm(removeSchedule); // Ensuring removeSchedule is not null
              }
            }}
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
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveScheduleModal;
