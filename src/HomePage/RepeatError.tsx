
interface RepeatErrorProps {
  handleOk: () => void;
}

const RepeatError: React.FC<RepeatErrorProps> = ({ handleOk }) => {
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
        <h4 style={{ color: "#000000", fontSize: "20px" }}>Error</h4>
        <div className="pb-2">
          <span
            style={{
              fontSize: "15px",
              color: "#000000",
            }}
          >
            Please ensure that a repeat option is selected!
          </span>
        </div>
        <div
          style={{
            borderTop: "1px solid #979797",
            width: "100%",
          }}
        ></div>
        <div className="p-1 d-flex justify-content-center">
          <button
            onClick={handleOk}
            style={{
              backgroundColor: "#ffffff",
              color: "#4285f4",
              border: "none",
              cursor: "pointer",
              fontWeight: "650",
              width: "49vw",
              height: "5vh",
              fontSize: "18px",
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepeatError;
