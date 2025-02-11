import { FaExclamationCircle } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { Icon } from "./HomePage";

interface DeviceSettingProps {
    handleBackToAddDevice: () => void;
    devName: string | null;
    devNameAlert: boolean;
    setDevName: (devName: string | null) => void;
    icons: Icon[];
    selectedIcon: { image: string; title: string } | null;
    handleIconClick: (icon: { image: string; title: string }) => void;
    iconAlert: boolean;
    handleAddDevice: () => void;
}

const DeviceSetting: React.FC<DeviceSettingProps> = ({handleBackToAddDevice, devName, devNameAlert, setDevName, icons, selectedIcon, handleIconClick, iconAlert, handleAddDevice }) => {
  return (
    <>
      {/* Container for Back Button and Title, button */}
      <div
        className="d-flex justify-content-between"
        style={{ width: "100%", position: "relative", top: "60px" }}
      >
        {/* Back Button */}
        <div
          onClick={handleBackToAddDevice}
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

        {/* Room Title */}
        <div className="d-flex col-12 justify-content-center text-center">
          {/* Display the title normally when not in edit mode */}
          <h3
            className="fw-bold"
            style={{ color: "#FFFFFF", fontSize: "1.5rem" }}
          >
            Device Settings
          </h3>
        </div>
      </div>

      {/* White container */}
      <div
        className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column overflow-auto"
        style={{
          top: "13%",
          height: "100%",
          borderRadius: "18px",
        }}
      >
        <div className="pb-2 p-3" style={{ width: "100vw" }}>
          <div className="text-left pb-3 container-fluid"></div>
          <div className="container-fluid">
            <p
              className="mb-3 fw-normal"
              style={{ color: "#204160", fontSize: "18px" }}
            >
              Name:
            </p>
            <div className="d-flex justify-content-center">
              <div
                style={{
                  position: "relative",
                  width: "80vw",
                }}
              >
                <input
                  type="text"
                  placeholder="Enter a name for your device"
                  style={{
                    backgroundColor: "#eeeeee",
                    borderRadius: "10px",
                    width: "80vw",
                    height: "40px",
                    boxShadow: "inset 3px 3px 2px rgba(0, 0, 0, 0.1)",
                    textAlign: "left",
                    paddingLeft: "15px",
                    fontSize: "17px",
                    border: "2px solid",
                    borderColor: !devName && devNameAlert ? "red" : "#eeeeee",
                  }}
                  onChange={(e) => setDevName(e.target.value)}
                />
                {devNameAlert && !devName && (
                  <FaExclamationCircle
                    color="red"
                    size={20}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="pt-3 container-fluid">
            <span
              className="mb-3 fw-normal"
              style={{ color: "#204160", fontSize: "18px" }}
            >
              Icon:
            </span>
            <div>
              <div className="d-flex flex-wrap justify-content-start">
                {icons.map((icon, index) => (
                  <div
                    key={index}
                    className="col-3"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="p-3 text-center mt-4"
                      style={{
                        backgroundColor:
                          selectedIcon?.title === icon.title
                            ? "#d9d9d9"
                            : "#f5f5f5",
                        borderRadius: "50%",
                        maxWidth: "calc(100% - 20%)",
                        maxHeight: "calc(100% - 20%)",
                      }}
                      onClick={() => handleIconClick(icon)}
                    >
                      <img
                        src={icon.image}
                        alt={icon.title}
                        className="img-fluid"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {!selectedIcon && iconAlert ? (
                <div
                  className="p-1 mt-1"
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <span style={{ color: "red", fontSize: "15px" }}>
                    Please select a device type!
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              height: "calc(100% - 50%)",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <button
              className="btn p-2 px-5"
              style={{
                backgroundColor: "#204160",
                color: "white",
                borderRadius: "12px",
                cursor: "pointer",
              }}
              onClick={handleAddDevice}
            >
              <h6>Confirm</h6>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceSetting;
