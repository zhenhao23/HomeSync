import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import "./RepeatTime.css";

interface RepeatTimeProps {
  setActiveContent: (content: string) => void;
  hasSelect: boolean;
  setHasSelect: React.Dispatch<React.SetStateAction<boolean>>;
  repeatOption: string;
  setRepeatOption: React.Dispatch<React.SetStateAction<string>>;
  repeatSelections: string[];
}

const RepeatTime: React.FC<RepeatTimeProps> = ({
  setActiveContent,
  hasSelect,
  setHasSelect,
  repeatOption,
  setRepeatOption,
  repeatSelections,
}) => {
  // State to track whether the "Done" button has been clicked
  const [hasClickDone, setHasClickDone] = useState(false);

  // Handle repeat option change
  const handleRepeat = (option: string) => {
    setRepeatOption(option);
    setHasSelect(true);
    setHasClickDone(false);
  };

  // Handle Done button click
  const handleDoneClick = () => {
    setHasClickDone(true); // Mark that the user has clicked done
    if (repeatOption === "") {
      setHasSelect(false); // Show error if no option is selected
    } else {
      setActiveContent("manageDevice");
    }
  };

  return (
    <>
      <div className="repeat-time-background">
        <div className="repeat-time-laptop">
          <div className="repeat-time-header">
            {/* Back Button */}
            <div
              onClick={() => setActiveContent("manageDevice")}
              style={{
                padding: "8px 15px",
                cursor: "pointer",
                position: "absolute",
              }}
            >
              <IoIosArrowBack size={22} className="repeat-time-arrow" />
              <span className="repeat-time-word">Back</span>
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
              <h3 className="fw-bold me-2 repeat-time-title">Repeat</h3>
            </div>
          </div>

          {/* White container  */}
          <div className="d-flex flex-column repeat-time-container">
            {repeatSelections.map((option, index) => (
              <div
                key={index}
                style={{ marginTop: index === 0 ? "30px" : "0" }}
              >
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
                      onChange={() => handleRepeat(option)}
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
                {!hasSelect && hasClickDone ? (
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
        </div>
      </div>
    </>
  );
};

export default RepeatTime;
