import { Collaborator } from "./HomePage";

interface RemoveCollabModalProps {
  removeCollab: Collaborator | null;
  handleCollabCancel: () => void;
  handleRemoveCollab: (collab: Collaborator) => void;
}

const RemoveCollabModal: React.FC<RemoveCollabModalProps> = ({
  removeCollab,
  handleCollabCancel,
  handleRemoveCollab,
}) => {
  if (!removeCollab) return null; // Ensure removeCollab is not null

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
          height: "175px",
          textAlign: "center",
        }}
      >
        <div>
          <img
            style={{ width: "60px", height: "60px" }}
            src={removeCollab?.image}
          ></img>
          <h4 className="p-2" style={{ color: "#000000", fontSize: "18px" }}>
            {removeCollab?.name}
          </h4>
        </div>

        <div
          style={{
            borderTop: "1px solid #979797",
            width: "100%",
          }}
        ></div>
        <div className="p-1 d-flex justify-content-around">
          <button
            style={{
              backgroundColor: "#ffffff",
              color: "#4285f4",
              border: "none",
              cursor: "pointer",
              fontWeight: "650",
              width: "49vw",
              fontSize: "18px",
            }}
            onClick={handleCollabCancel}
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
            onClick={() => handleRemoveCollab(removeCollab)}
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
export default RemoveCollabModal;
