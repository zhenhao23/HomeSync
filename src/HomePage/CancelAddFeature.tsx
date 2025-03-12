interface CancelAddFeatureProps {
    handleCancelAddFeature: () => void;
    handleDiscardAddFeature: () => void;
}

const CancelAddFeatureModal: React.FC<CancelAddFeatureProps> = ({
    handleCancelAddFeature,
    handleDiscardAddFeature,
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
      <div className="remove-room-container">
        <h4 className="remove-room-title">Cancel Feature</h4>
        <div className="pb-2">
          <span className="remove-room-message">
            Are you sure you want to discard your changes?
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
          <button
            className="remove-room-cancel"
            onClick={handleCancelAddFeature}
            style={{ color: "#4285f4" }}
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
            className="remove-room-confirm"
            onClick={handleDiscardAddFeature}
            style={{ color: "#4285f4" }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelAddFeatureModal;
