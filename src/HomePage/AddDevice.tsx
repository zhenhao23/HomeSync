import { FaSync } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { Device } from "./HomePage";
import { useState } from "react";
import petfeederIcon from "../assets/devicesSettingIcon/cooker.svg";
import managePetfeeder from "../assets/manageDevice/petfeeder.svg";
import airCondIcon from "../assets/viewDeviceStatus/aircond3.svg";
import manageAircond from "../assets/manageDevice/aircond2.svg";
import lampIcon from "../assets/devicesSettingIcon/lamp.svg";
import manageLamp from "../assets/manageDevice/light.svg";

interface AddDeviceProps {
  addSelectDevice: Device | null;
  setAddSelectDevice: React.Dispatch<React.SetStateAction<Device | null>>;
  setActiveContent: (content: string) => void;
}

const AddDevice: React.FC<AddDeviceProps> = ({
  addSelectDevice,
  setAddSelectDevice,
  setActiveContent,
}) => {
  // Predefined devices for adding
  const addDevice: Device[] = [
    {
      device_id: 0,
      room_id: 0,
      image: petfeederIcon,
      title: "Pet Feeder 02134",
      deviceType: "petfeeder",
      status: false,
      swiped: false,
      devData: {
        iconImage: managePetfeeder,
        percentage: 60,
        celsius: 0,
      },
      content: {
        feature: "Every Monday",
        smartFeature: "8:00am",
        toggle1: false,
        featurePeriod: "Daily",
        featureDetail: "8:00am, 12:00pm, 7:00pm",
        toggle2: false,
      },
    },
    {
      device_id: 1,
      room_id: 1,
      image: airCondIcon,
      title: "Air Conditioner 31837",
      deviceType: "aircond",
      status: false,
      swiped: false,
      devData: {
        iconImage: manageAircond,
        percentage: 0,
        celsius: 24,
      },
      content: {
        feature: "Auto AirCond",
        smartFeature: "Turn on when room temp > 25°C",
        toggle1: false,
        featurePeriod: "Daily",
        featureDetail: "9:00pm to 4:00am",
        toggle2: false,
      },
    },
    {
      device_id: 2,
      room_id: 1,
      image: lampIcon,
      title: "Lights 1221",
      deviceType: "light",
      status: false,
      swiped: false,
      devData: {
        iconImage: manageLamp,
        percentage: 40,
        celsius: 0,
      },
      content: {
        feature: "Auto Lighting",
        smartFeature: "Infrared Detection",
        toggle1: false,
        featurePeriod: "Daily",
        featureDetail: "8:00pm to 7:00am",
        toggle2: false,
      },
    },
  ];

  // state to track if it shall spin or not for the bluetooth icon connect
  const [isSpinning, setIsSpinning] = useState(false);

  // function to spin the bluetooth icon connect
  const handleSpinClick = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 2000);
  };

  // function to handle adding new device
  const handleDeviceSelect = (device: Device) => {
    setAddSelectDevice(device); // Set selected device
  };

  // state to track the device to connect in add device page
  const [connectDevice, setConnectDevice] = useState(false);

  // function to handle if user click to connect on a device in add device page
  const handleConnectClick = (activeContent: string) => {
    if (!addSelectDevice) {
      // Show error message if no device is selected
      setConnectDevice(true);
    } else {
      handleButtonClick(activeContent); // Change the active content to device settings
    }
  };

  // Handle button click to set active content
  const handleButtonClick = (content: string) => {
    if (content === "viewDeviceStatus") {
      setConnectDevice(false); // Reset connectDevice when navigating back
    }
    setActiveContent(content); // Set the content based on the clicked button
  };

  return (
    <>
      {/* Container for Back Button and Title, button */}
      <div
        className="d-flex justify-content-between"
        style={{ width: "100%", position: "relative", top: "60px" }}
      >
        {/* Back Button */}
        <div
          onClick={() => {
            setAddSelectDevice(null);
            handleButtonClick("viewDeviceStatus");
          }}
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
