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
  fetchData: () => Promise<void>; // Add this property
}

// Function to map front-end device icons to API-compatible type
const mapIconToType = (iconTitle: string): string => {
  const typeMap: { [key: string]: string } = {
    Lamp: "light",
    "Air Conditioner": "aircond",
    Sprinkler: "irrigation",
    "Pet Feeder": "petfeeder", // Change this line from "petfeeder" to match your backend
    Cooker: "petfeeder", // Add this line if "Cooker" is also used for pet feeders
    "Smart Lock": "smart_lock",
    Fan: "fan",
    TV: "tv",
    Speaker: "speaker",
    Fridge: "fridge",
    "Door Bell": "door_bell",
    "Smoke Detector": "smoke_detector",
    "Robot Vacuum": "robot_vacuum",
  };

  return typeMap[iconTitle] || iconTitle.toLowerCase().replace(" ", "_");
};

// API functions
const addDeviceToAPI = async (
  roomId: number,
  displayName: string,
  iconType: string
) => {
  try {
    const type = mapIconToType(iconType);

    // Get auth token from localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("Authentication token not found. Please log in again.");
    }

    const response = await fetch("http://localhost:5000/api/devices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add the authorization header
      },
      body: JSON.stringify({
        roomId,
        displayName,
        type,
        iconType,
        isFavorite: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add device");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding device:", error);
    throw error;
  }
};

const DeviceSetting: React.FC<DeviceSettingProps> = ({
  addSelectDevice,
  setRoomsState,
  getRoom,
  setActiveContent,
  devicesState,
  setDevicesState,
  fetchData,
}) => {
  // List of available device icons
  const icons: Icon[] = [
    { image: lampIcon, title: "Lamp" },
    { image: airConditionerIcon, title: "Air Conditioner" },
    { image: sprinklerIcon, title: "Sprinkler" },
    { image: petfeederIcon, title: "Pet Feeder" },
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
  // State to track API errors
  const [apiError, setApiError] = useState<string | null>(null);

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
  const handleAddDevice = async () => {
    // Reset any previous errors
    setApiError(null);

    // Case when no device is selected
    if (!addSelectDevice) {
      // Handle case if no device is selected
      return;
    }

    // case of no selected device icon and device name input by user
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

    try {
      // Call the API to add the device
      const roomId = getRoom().id;
      const displayName = devName;
      const iconType = selectedDeviceIcon.title;

      console.log("Adding device to API:", {
        roomId,
        displayName,
        iconType,
      });

      const newDeviceFromAPI = await addDeviceToAPI(
        roomId,
        displayName,
        iconType
      );
      console.log("API response:", newDeviceFromAPI);

      // Calculate the next device_id for adding a new device (for frontend)
      const nextDeviceId =
        devicesState.length > 0
          ? Math.max(...devicesState.map((device) => device.device_id)) + 1
          : 0;

      // Create a new device object with the API data
      const newDevice = {
        ...addSelectDevice,
        room_id: roomId,
        device_id: nextDeviceId,
        id: newDeviceFromAPI.id, // Store the API ID
        title: displayName, // Make sure to update these fields to match
        image: selectedDeviceIcon.image, // your frontend model
      };

      // Add the new device to the devices state
      const updatedDevicesState = [...devicesState, newDevice];

      // Update the room state count
      setRoomsState((prevRoomsState) =>
        prevRoomsState.map((room) =>
          room.id === roomId ? { ...room, devices: room.devices + 1 } : room
        )
      );

      // Reset the form
      setDevName(null);
      setSelectedDeviceIcon(null);
      setDevNameAlert(false);
      setDeviceIconAlert(false);

      // Update the devicesState with the new device
      setDevicesState(updatedDevicesState);

      await fetchData(); // Refresh all data from backend

      // Navigate back to view device status page
      setActiveContent("viewDeviceStatus");
    } catch (error) {
      console.error("Failed to add device:", error);
      setApiError(
        error instanceof Error ? error.message : "Failed to add device"
      );
    }
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
