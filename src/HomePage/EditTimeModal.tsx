interface EditTimeModalProps {
  tempTitle: string;
  setTempTitle: React.Dispatch<React.SetStateAction<string>>;
  handleConfirm: () => void;
  handleCancel: () => void;
}

const EditTitleModal: React.FC<EditTimeModalProps> = ({
  tempTitle,
  setTempTitle,
  handleConfirm,
  handleCancel,
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
        <h4 style={{ color: "#000000", fontSize: "20px" }}>Edit Time</h4>
        <input
          className="mb-3"
          type="text"
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
            border: "none",
            borderRadius: "10px",
            fontSize: "15px",
            color: "#000000",
            backgroundColor: "#eeeeee",
            boxShadow: "inset 4px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />

        <div
          style={{
            borderTop: "1px solid #979797",
            width: "100%",
          }}
        ></div>
        <div className="p-1 d-flex justify-content-around">
          <button
            onClick={handleConfirm}
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
            Confirm
          </button>
          <div
            style={{
              borderLeft: "1px solid #979797",
              height: "40px",
            }}
          ></div>
          <button
            onClick={handleCancel}
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
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTitleModal;
