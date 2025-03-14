import { Device, Room } from "./HomePage";
import "./RemoveModal.css";

interface RemoveModalProps {
  removeWhat: string;
  removeItem: Device | Room | null;
  handleRemove: () => void;
  handleCancel: () => void;
}

const RemoveModal: React.FC<RemoveModalProps> = ({
  removeWhat,
  removeItem,
  handleRemove,
  handleCancel,
}) => {
  if (!removeItem) return null; // Ensure remove'Type' is not null

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
      <div className="remove-room-container">
        <h4 className="remove-room-title">
          Remove {removeWhat.charAt(0).toUpperCase() + removeWhat.slice(1)}
        </h4>
        <div className="pb-2">
          <span className="remove-room-message">
            Are you sure you want to remove this {removeWhat}?
          </span>
        </div>

        <div
          className="horizontal-line"
          style={{
            borderTop: "1px solid #979797",
            width: "100%",
          }}
        ></div>

        <div className="p-1 d-flex justify-content-around remove-room-button-div">
          <button className="remove-room-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <div
            style={{
              borderLeft: "1px solid #979797",
              height: "40px",
            }}
          ></div>
          <button className="remove-room-confirm" onClick={handleRemove}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveModal;
