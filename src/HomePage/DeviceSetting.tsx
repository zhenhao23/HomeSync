import { FaExclamationCircle } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { Device, Icon, Room } from "./HomePage";
import airConditionerIcon from "../assets/devicesSettingIcon/air-conditioner.svg";
import smartLockIcon from "../assets/devicesSettingIcon/smart-lock.svg";
import fanIcon from "../assets/devicesSettingIcon/fan.svg";
import TVIcon from "../assets/devicesSettingIcon/tv.svg";
import speakerIcon from "../assets/devicesSettingIcon/speaker.svg";
import fridgeIcon from "../assets/devicesSettingIcon/fridge.svg";
import doorBellIcon from "../assets/devicesSettingIcon/door-bell.svg";
import smokeDetectorIcon from "../assets/devicesSettingIcon/smoke-detector.svg";
import robotVacuumIcon from "../assets/devicesSettingIcon/robot-vacuum.svg";
import lampIcon from "../assets/devicesSettingIcon/lamp.svg";
import sprinklerIcon from "../assets/devicesSettingIcon/sprinkler.svg";
import petfeederIcon from "../assets/devicesSettingIcon/cooker.svg";
import { useState } from "react";
import "./DeviceSetting.css";

interface DeviceSettingProps {
  addSelectDevice: Device | null;
  setRoomsState: React.Dispatch<React.SetStateAction<Room[]>>;
  getRoom: () => Room;
  setActiveContent: (content: string) => void;
  devicesState: Device[];
  setDevicesState: React.Dispatch<React.SetStateAction<Device[]>>;
}

const DeviceSetting: React.FC<DeviceSettingProps> = ({
  addSelectDevice,
  setRoomsState,
  getRoom,
  setActiveContent,
  devicesState,
  setDevicesState,
}) => {
  // List of available device icons
  const icons: Icon[] = [
    { image: lampIcon, title: "Lamp" },
    { image: airConditionerIcon, title: "Air Conditioner" },
    { image: sprinklerIcon, title: "Sprinkler" },
    { image: petfeederIcon, title: "Cooker" },
    { image: smartLockIcon, title: "Smart Lock" },
    { image: fanIcon, title: "Fan" },
    { image: TVIcon, title: "TV" },
    { image: speakerIcon, title: "Speaker" },
    { image: fridgeIcon, title: "Fridge" },
    { image: doorBellIcon, title: "Door Bell" },
    { image: smokeDetectorIcon, title: "Smoke Detector" },
    { image: robotVacuumIcon, title: "Robot Vacuum" },
  ];

  // function to handle back to add device page
  const handleBackToAddDevice = () => {
    setActiveContent("addDevice");
    // to ensure the flow of homepage when navigate back
    setDevNameAlert(false);
    setDeviceIconAlert(false);
    setSelectedDeviceIcon(null);
    setDevName(null);
  };

  // State to track the device name input from user in add device page
  const [devName, setDevName] = useState<string | null>(null);
  // state to check the icon is selected by user in add device page (error handling)
  const [deviceIconAlert, setDeviceIconAlert] = useState(false);
  // state to check the device name is inputed by user (error handling)
  const [devNameAlert, setDevNameAlert] = useState(false);

  // State to track the selected icon in add device page
  const [selectedDeviceIcon, setSelectedDeviceIcon] = useState<{
    image: string;
    title: string;
  } | null>(null);

  // State to track if to display icon text label when user clicked on a device
  const [isIconTextVisible, setIconTextVisible] = useState(false);

  // Handle click on an icon
  const handleDeviceIconClick = (icon: { image: string; title: string }) => {
    setSelectedDeviceIcon(icon);
    setIconTextVisible(false); // Reset the visibility before the new swipe-in animation
    setTimeout(() => {
      setIconTextVisible(true); // Trigger the swipe-in animation
    }, 150); // Adjust this timeout based on your animation duration
  };

  // function to handle if user wants to add device
  const handleAddDevice = () => {
    // Case when no device is selected
    if (!addSelectDevice) {
      // Handle case if no device is selected
      return;
    }

    // case of no selected device icon and device name inout by user
    if (selectedDeviceIcon === null && !devName?.trim()) {
      setDevNameAlert(true);
      setDeviceIconAlert(true);
      return;
    }

    // case if user didn't input device name
    if (!devName?.trim()) {
      setDevNameAlert(true);
      return;
    }

    // case if user didn't select device icon
    if (selectedDeviceIcon === null) {
      setDeviceIconAlert(true);
      return;
    }

    // Calculate the next device_id for adding a new device
    const nextDeviceId =
      devicesState.length > 0
        ? Math.max(...devicesState.map((device) => device.device_id)) + 1
        : 0; // Start from 0 if no devices exist

    // Create a new device object with the current room ID
    const newDevice = {
      ...addSelectDevice,
      room_id: getRoom().id, // Assign the current room ID
      device_id: nextDeviceId,
    };

    // Add the new device to the devices state
    const updatedDevicesState = [...devicesState, newDevice];

    // Update the room state count
    setRoomsState((prevRoomsState) =>
      prevRoomsState.map((room) =>
        room.id === getRoom().id ? { ...room, devices: room.devices + 1 } : room
      )
    );

    setDevName(null); // Reset the dev name input
    setSelectedDeviceIcon(null); // Reset selected icon
    setDevNameAlert(false); // Reset dev Alert to false state
    setDeviceIconAlert(false); // Reset icon alert to false state

    // Update the devicesState with the new device
    setDevicesState(updatedDevicesState);
    // Navigate back to view device status page
    setActiveContent("viewDeviceStatus");
  };

  return (
    <>
      <div className="device-setting-background">
        <div className="device-setting-laptop">
          {/* Container for Back Button and Title, button */}
          <div className="device-setting-header">
            {/* Back Button */}
            <div
              onClick={handleBackToAddDevice}
              style={{
                padding: "8px 15px",
                cursor: "pointer",
                position: "absolute",
              }}
            >
              <IoIosArrowBack className="device-setting-arrow" size={22} />
              <span className="device-setting-back">Back</span>
            </div>

            {/* Room Title */}
            <div className="col-12 text-center">
              {/* Display the title normally when not in edit mode */}
              <h3 className="fw-bold device-setting-title">Device Settings</h3>
            </div>
          </div>

          {/* White container */}
          <div className="pb-2 p-3 device-setting-content">
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
                  }}
                >
                  <input
                    className="device-setting-input"
                    type="text"
                    placeholder="Enter a name for your device"
                    style={{
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

              <div
                className="d-flex align-items-center"
                style={{
                  overflow: "hidden",
                  marginTop: "-7%",
                  position: "absolute",
                  right: "0",
                  width: "145px",
                  height: "45px",
                }}
              >
                <div
                  className="d-flex justify-content-start align-items-center ps-3"
                  style={{
                    position: "absolute",
                    right: "0",
                    marginLeft: "auto",
                    width: "135px",
                    height: "35px",
                    backgroundColor: "#204160",
                    borderTopLeftRadius: "18px",
                    borderBottomLeftRadius: "18px",
                    transition: "transform 0.15s ease-in-out",
                    transform: isIconTextVisible
                      ? "translateX(0)"
                      : "translateX(105%)",
                    boxShadow: `0 0 3px 3px rgba(255, 255, 255, 0.4) inset,
                  0 0 2px 2px rgba(0, 0, 0, 0.3)`,
                  }}
                >
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "15px",
                    }}
                  >
                    {selectedDeviceIcon?.title}
                  </span>
                </div>
              </div>
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
                            selectedDeviceIcon?.title === icon.title
                              ? "#d9d9d9"
                              : "#f5f5f5",
                          borderRadius: "50%",
                          maxWidth: "calc(100% - 20%)",
                          maxHeight: "calc(100% - 20%)",
                        }}
                        onClick={() => handleDeviceIconClick(icon)}
                      >
                        <img
                          src={icon.image}
                          alt={icon.title}
                          className="img-fluid device-setting-img"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {!selectedDeviceIcon && deviceIconAlert ? (
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
            <div className="device-setting-confirm">
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
      </div>
    </>
  );
};

export default DeviceSetting;
