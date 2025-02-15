import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

interface RepeatTimeProps {
  setActiveContent: (content: string) => void;
  setAddFeature: () => void;
}

const RepeatTime: React.FC<RepeatTimeProps> = ({
  setActiveContent,
  setAddFeature,
}) => {
  // State for repeat selection
  const [repeatOption, setRepeatOption] = useState("");

  // Available repeat options
  const repeatOptions = ["Never", "Daily", "Weekly"];

  // Handle repeat option change
  const handleRepeatChange = (option: string) => {
    setRepeatOption(option);
    setHasSelect(false);
  };

  // state to track if user select an option
  const [hasSelect, setHasSelect] = useState(false);

  // Handle Done button click
  const handleDoneClick = () => {
    if (!repeatOption) {
      setHasSelect(true); // Show error if no option is selected
      setAddFeature();
    }
  };

  return (
    <>
      <div style={{ position: "relative", top: "60px" }}>
        {/* Back Button */}
        <div
          onClick={() => setActiveContent("manageDevice")}
          style={{
            padding: "8px 15px",
            cursor: "pointer",
            position: "absolute",
          }}
        >
          <IoIosArrowBack size={22} color="#FFFFFF" />
          <span
            style={{
              marginLeft: "8px",
              color: "#FFFFFF",
              fontSize: "16px",
            }}
          >
            Back
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Display the title normally when not in edit mode */}
          <h3
            className="fw-bold me-2"
            style={{ color: "#FFFFFF", fontSize: "1.5rem" }}
          >
            Repeat
          </h3>
        </div>
      </div>

      {/* White container  */}
      <div
        className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column"
        style={{
          top: "13%",
          height: "100%",
          borderRadius: "18px",
        }}
      >
        {repeatOptions.map((option, index) => (
          <div key={index} style={{ marginTop: index === 0 ? "30px" : "0" }}>
            <div className="d-flex justify-content-between">
              <div
                className="col-8"
                style={{
                  marginLeft: "calc(100% - 90%)",
                  fontSize: "18px",
                }}
              >
                {option}
              </div>
              <label className="container col-1">
                <input
                  type="radio"
                  name="repeat-option"
                  checked={repeatOption === option}
                  onChange={() => handleRepeatChange(option)}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div
              style={{
                borderTop: "1px solid #000000",
                margin: "18px 30px",
              }}
            ></div>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            height: "calc(100% - 50%)",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div className="text-center">
            {hasSelect ? (
              <div className="p-4">
                <span style={{ color: "red", fontSize: "15px" }}>
                  Please select a repeat option!
                </span>
              </div>
            ) : (
              ""
            )}
            <button
              className="btn p-2 px-5"
              style={{
                backgroundColor: "#204160",
                color: "white",
                borderRadius: "12px",
                cursor: "pointer",
              }}
              onClick={handleDoneClick}
            >
              <h6>Done</h6>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RepeatTime;
