import { FaSync } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { Device } from "./HomePage";

interface AddDeviceProps {
  isSpinning: boolean;
  addDevice: Device[];
  addSelectDevice: Device | null;
  connectDevice: boolean;
  handleButtonClick: (content: string) => void;
  handleSpinClick: () => void;
  handleDeviceSelect: (device: Device) => void;
  handleConnectClick: (activeContent: string) => void;
}

const AddDevice: React.FC<AddDeviceProps> = ({
  isSpinning,
  handleButtonClick,
  addSelectDevice,
  connectDevice,
  handleSpinClick,
  addDevice,
  handleDeviceSelect,
  handleConnectClick,
}) => {
  return (
    <>
      {/* Container for Back Button and Title, button */}
      <div
        className="d-flex justify-content-between"
        style={{ width: "100%", position: "relative", top: "60px" }}
      >
        {/* Back Button */}
        <div
          onClick={() => handleButtonClick("viewDeviceStatus")}
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
            Add Device
          </h3>
        </div>

        {/* button */}
        <div
          style={{
            padding: "6px 25px",
            cursor: "pointer",
            position: "absolute",
            right: "0",
          }}
        >
          <button
            className="btn p-2 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "white",
              width: "30px",
              height: "30px",
              cursor: "pointer",
              borderRadius: "8px",
            }}
            onClick={handleSpinClick}
          >
            <FaSync color="#748188" className={isSpinning ? "spinning" : ""} />
          </button>
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
        {addDevice.map((device, index) => (
          <div key={index} style={{ marginTop: index === 0 ? "30px" : "0" }}>
            <div className="d-flex justify-content-between">
              <div
                className="col-8"
                style={{
                  marginLeft: "calc(100% - 90%)",
                  fontSize: "18px",
                }}
              >
                {device.title}
              </div>
              <label className="container col-1">
                <input
                  type="radio"
                  checked={addSelectDevice?.device_id === device.device_id}
                  onChange={() => handleDeviceSelect(device)}
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
            {!addSelectDevice && connectDevice ? (
              <div className="p-4">
                <span style={{ color: "red", fontSize: "15px" }}>
                  Please select a device to connect!
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
              onClick={() => handleConnectClick("deviceSetting")}
            >
              <h6>Connect</h6>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDevice;
