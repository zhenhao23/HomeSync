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
import "./AddDevice.css";

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
      title: "PawSync Pet Feeder 02134",
      deviceType: "petfeeder",
      status: false,
      swiped: false,
      devData: {
        id: 0,
        iconImage: managePetfeeder,
        percentage: 60,
        celsius: 0,
        waterFlow: 0,
      },
      content: [
        {
          feature_id: 0,
          feature: "Every Monday",
          label: "9:00am",
          status: false,
          isUserAdded: true,
        },
        {
          feature_id: 1,
          feature: "Daily",
          label: "8:00am, 12:00pm, 7:00pm",
          status: false,
          isUserAdded: true,
        },
      ],
    },
    {
      device_id: 1,
      room_id: 1,
      image: airCondIcon,
      title: "Daikin Air Conditioner 31837",
      deviceType: "aircond",
      status: false,
      swiped: false,
      devData: {
        id: 1,
        iconImage: manageAircond,
        percentage: 0,
        celsius: 24,
        waterFlow: 0,
      },
      content: [
        {
          feature_id: 2,
          feature: "Auto Air Cond",
          label: "Turn on when room temp > 25°C",
          status: false,
          isUserAdded: false,
        },
        {
          feature_id: 3,
          feature: "Daily",
          label: "9:00am to 4:00pm",
          status: false,
          isUserAdded: true,
        },
      ],
    },
    {
      device_id: 2,
      room_id: 1,
      image: lampIcon,
      title: "Philips Lights 1221",
      deviceType: "light",
      status: false,
      swiped: false,
      devData: {
        id: 2,
        iconImage: manageLamp,
        percentage: 40,
        celsius: 0,
        waterFlow: 0,
      },
      content: [
        {
          feature_id: 4,
          feature: "Auto Lighting",
          label: "Infrared Detection",
          status: false,
          isUserAdded: false,
        },
        {
          feature_id: 5,
          feature: "Daily",
          label: "8:00am to 7:00pm",
          status: false,
          isUserAdded: true,
        },
      ],
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
      <div className="add-device-background">
        <div className="add-device-laptop">
          <div className="add-device-header">
            {/* Back Button */}
            <div
              className="add-device-back"
              onClick={() => {
                setAddSelectDevice(null);
                handleButtonClick("viewDeviceStatus");
              }}
            >
              <IoIosArrowBack size={20} className="add-device-arrow" />
              <span className="add-device-word">Back</span>
            </div>

            {/* Room Title */}
            <div className="d-flex col-12 justify-content-center text-center">
              {/* Display the title normally when not in edit mode */}
              <h3 className="fw-bold add-device-title">Add Device</h3>
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
                className="btn p-2 d-flex align-items-center justify-content-center sync-button"
                onClick={handleSpinClick}
              >
                <FaSync
                  color="#748188"
                  className={isSpinning ? "spinning" : ""}
                />
              </button>
            </div>
          </div>

          {/* White container */}
          <div className="d-flex flex-column devices-list">
            {addDevice.map((device, index) => (
              <div
                key={index}
                style={{ marginTop: index === 0 ? "30px" : "0" }}
              >
                <div className="d-flex justify-content-between">
                  <div className="col-8 add-device-word-title">
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
            <div className="connect-div">
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
                  className="add-device-connect"
                  onClick={() => handleConnectClick("deviceSetting")}
                >
                  <h6>Connect</h6>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDevice;
