import { FaMinus, FaPen, FaPlus } from "react-icons/fa";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import { Day, Device, Room } from "./HomePage";
import { useEffect, useState } from "react";
import EditTitleModal from "./EditTitleModal";
import bulbOn from "../assets/manageDevice/bulbOn.svg";
import bulbOff from "../assets/manageDevice/bulbOff.svg";
import foodOff from "../assets/manageDevice/petFoodOff.svg";
import foodOn from "../assets/manageDevice/petFoodOn.svg";
import irrigationOff from "../assets/manageDevice/irrigationOff.svg";
import irrigationOn from "../assets/manageDevice/irrigationOn.svg";
import EditTimeModal from "./EditTimeModal";

interface ManageDeviceProps {
  devType: string | null;
  setActiveContent: (content: string) => void;
  getDevice: () => Device;
  getSelectedDeviceStatus: (roomId: number, deviceId: number) => boolean;
  getRoom: () => Room;
  handleToggle: (roomId: number, deviceId: number) => void;
  setDevicesState: React.Dispatch<React.SetStateAction<Device[]>>;
  getSelectedDeviceToggle: (
    roomId: number,
    deviceId: number,
    toggleKey: "toggle1" | "toggle2"
  ) => boolean;
  setDevice: React.Dispatch<React.SetStateAction<Device>>;
  devicesState: Device[];
  addFeature: boolean;
  handleAddFeature: () => void;
}

const ManageDevice: React.FC<ManageDeviceProps> = ({
  devType,
  setActiveContent,
  getDevice,
  getSelectedDeviceStatus,
  getRoom,
  handleToggle,
  setDevicesState,
  getSelectedDeviceToggle,
  setDevice,
  devicesState,
  addFeature,
  handleAddFeature,
}) => {
  // Add a new function to update device controls via API
  const updateDeviceControl = async (
    deviceId: number,
    controlValue: number,
    controlID: number
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/devices/${deviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            controls: [
              {
                id: controlID, // You may need to make this dynamic based on your application
                currentValue: controlValue.toString(),
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update device control");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating device control:", error);
      throw error;
    }
  };

  // Modify the handler functions to use API
  const handleDecreaseWaterFlow = async () => {
    const currentDevice = getDevice();
    if (currentDevice.devData.waterFlow <= 2) return;

    const newValue = currentDevice.devData.waterFlow - 1;
    const deviceId = currentDevice.device_id;
    const controlID = currentDevice.devData.id; // Get the id from devData

    try {
      await updateDeviceControl(deviceId, newValue, controlID); // Pass the controlID
      // Update local state after successful API call
      setDevicesState((prevDevices) =>
        prevDevices.map((device) =>
          device.device_id === deviceId
            ? {
                ...device,
                devData: {
                  ...device.devData,
                  waterFlow: newValue,
                },
              }
            : device
        )
      );
    } catch (error) {
      console.error("Failed to decrease water flow:", error);
    }
  };

  const handleIncreaseWaterFlow = async () => {
    const currentDevice = getDevice();
    if (currentDevice.devData.waterFlow >= 60) return;

    const newValue = currentDevice.devData.waterFlow + 1;
    const deviceId = currentDevice.device_id;
    const controlID = currentDevice.devData.id; // Get the id from devData

    try {
      await updateDeviceControl(deviceId, newValue, controlID); // Pass the controlID
      // Update local state after successful API call
      setDevicesState((prevDevices) =>
        prevDevices.map((device) =>
          device.device_id === deviceId
            ? {
                ...device,
                devData: {
                  ...device.devData,
                  waterFlow: newValue,
                },
              }
            : device
        )
      );
    } catch (error) {
      console.error("Failed to increase water flow:", error);
    }
  };
  // Update the celsius handlers
  const handleIncreaseCelsius = async () => {
    const currentDevice = getDevice();
    if (currentDevice.devData.celsius >= 30) return;

    const newValue = currentDevice.devData.celsius + 1;
    const deviceId = currentDevice.device_id;
    const controlID = currentDevice.devData.id; // Get the id from devData

    try {
      await updateDeviceControl(deviceId, newValue, controlID); // Pass the controlID
      // Update local state after successful API call
      setDevicesState((prevDevices) =>
        prevDevices.map((device) =>
          device.device_id === deviceId
            ? {
                ...device,
                devData: {
                  ...device.devData,
                  celsius: newValue,
                },
              }
            : device
        )
      );
    } catch (error) {
      console.error("Failed to increase celsius:", error);
    }
  };

  const handleDecreaseCelsius = async () => {
    const currentDevice = getDevice();
    if (currentDevice.devData.celsius <= 14) return;

    const newValue = currentDevice.devData.celsius - 1;
    const deviceId = currentDevice.device_id;
    const controlID = currentDevice.devData.id; // Get the id from devData

    try {
      await updateDeviceControl(deviceId, newValue, controlID); // Pass the controlID
      // Update local state after successful API call
      setDevicesState((prevDevices) =>
        prevDevices.map((device) =>
          device.device_id === deviceId
            ? {
                ...device,
                devData: {
                  ...device.devData,
                  celsius: newValue,
                },
              }
            : device
        )
      );
    } catch (error) {
      console.error("Failed to decrease celsius:", error);
    }
  };

  // Update the handleDecrease and handleIncrease functions
  const handleDecrease = (deviceType: string) => {
    switch (deviceType) {
      case "aircond":
        return () => handleDecreaseCelsius();
      case "irrigation":
        return () => handleDecreaseWaterFlow();
      default:
        return () => {}; // Return an empty function instead of void
    }
  };

  const handleIncrease = (deviceType: string) => {
    switch (deviceType) {
      case "aircond":
        return () => handleIncreaseCelsius();
      case "irrigation":
        return () => handleIncreaseWaterFlow();
      default:
        return () => {}; // Return an empty function instead of void
    }
  };

  // Update the handleSmallCircleClick function to use the API
  const handleSmallCircleClick = async (index: number) => {
    setCirclePosition(smallCircles[index]);
    const newPercentage = mapToPercentage(smallCircles[index]);
    const currentDevice = getDevice(); // Get current device to access its data
    const deviceId = currentDevice.device_id;
    const controlID = currentDevice.devData.id; // Get the id from devData

    try {
      await updateDeviceControl(deviceId, newPercentage, controlID); // Pass the controlID
      // Update local state after successful API call
      setDevicesState((prevDevices) => {
        return prevDevices.map((device) =>
          device.device_id === deviceId
            ? {
                ...device,
                devData: { ...device.devData, percentage: newPercentage },
              }
            : device
        );
      });
    } catch (error) {
      console.error("Failed to update percentage via circle click:", error);
    }
  };

  // Update the touchMove handler for the circle
  const handleTouchMoveCircle = async (e: React.TouchEvent<HTMLDivElement>) => {
    if (dragging) {
      // Get the movement relative to the parent container
      const target = e.target as HTMLElement;
      const parent = target.parentElement as HTMLElement;
      const parentRect = parent.getBoundingClientRect();

      // Movement of the touch from start position
      const moveX = e.touches[0].clientX - startXCircle - 50;

      // Calculate the new position as a percentage of the container's width
      let newPosition = ((moveX + startXCircle) / parentRect.width) * 100;

      // Ensure that the new position is between 14% and 73% (in smallCircles)
      let circlepos = Math.max(
        smallCircles[0],
        Math.min(newPosition, smallCircles[smallCircles.length - 1])
      );
      // Find the closest value in smallCircles to snap to
      circlepos = smallCircles.reduce((prev, curr) =>
        Math.abs(curr - circlepos) < Math.abs(prev - circlepos) ? curr : prev
      );

      // Update the circle position based on the constrained position
      setCirclePosition(circlepos);

      // Update mapped percentage when dragged
      const newPercentage = mapToPercentage(circlepos);
      const currentDevice = getDevice(); // Get current device to access its data
      const deviceId = currentDevice.device_id;
      const controlID = currentDevice.devData.id; // Get the id from devData

      try {
        await updateDeviceControl(deviceId, newPercentage, controlID); // Pass the controlID
        // Update local state after successful API call
        setDevicesState((prevDevices) => {
          return prevDevices.map((device) =>
            device.device_id === deviceId
              ? {
                  ...device,
                  devData: { ...device.devData, percentage: newPercentage },
                }
              : device
          );
        });
      } catch (error) {
        console.error("Failed to update percentage via touch move:", error);
      }
    }
  };

  // state to track if user is editing title
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode or exit mode
  // state to track the temporary title changed
  const [tempTitle, setTempTitle] = useState(getRoom().title); // Temporary title during editing
  // state to track the editing type is a device for modal display
  const [editingType, setEditingType] = useState<string | null>(null);

  // function to handle if user click to edit device title in manageDevice page
  const handleEditDeviceClick = () => {
    setIsEditing(true); // Open the edit modal
    setEditingType("device"); // Set to "device" when editing a device
    setTempTitle(getDevice().title); // Set temp title to the current device title
  };

  // function to get different unit label for different current selected device type
  const getUnitLabel = (deviceType: string): string => {
    switch (deviceType) {
      case "irrigation":
        return "Litre per square meter";
      case "petfeeder":
        return "Amount";
      case "aircond":
        return "Temperature";
      case "light":
        return "Brightness";
      default:
        return "";
    }
  };

  // function to get different unit display for different current selected device type
  const getUnit = (deviceType: string): string => {
    switch (deviceType) {
      case "irrigation":
        return "L/m²";
      case "aircond":
        return "°C";
      case "light":
      case "petfeeder":
        return "%";
      default:
        return "";
    }
  };

  // Starts continuous execution on long press
  const startLongPress = (action: () => void) => {
    action(); // Execute immediately
    const id = setInterval(action, 300); // Execute repeatedly every 300ms
    setIntervalId(id);
  };

  // Stops execution when button is released
  const stopLongPress = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const handleConfirm = async () => {
    const deviceId = getDevice().device_id;

    try {
      // Make API call to update the device title
      const response = await fetch(
        `http://localhost:5000/api/devices/${deviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayName: tempTitle,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update device title");
      }

      // Update local state only after successful API call
      const updatedDeviceTitle = devicesState.map((d) => {
        if (d.device_id === deviceId) {
          return { ...d, title: tempTitle }; // Update device title
        }
        return d;
      });

      setDevicesState(updatedDeviceTitle); // Update the state with the new title for the device

      setDevice((prevDevice) => ({
        ...prevDevice,
        title: tempTitle, // Update the device title
      }));

      setEditingType(null);
      setIsEditing(false); // Exit edit mode after confirming
    } catch (error) {
      console.error("Failed to update device title:", error);
      // Optional: Add error handling logic here (e.g., show error message to user)
    }
  };

  // function to handle cancel if user wants to cancel their action
  const handleCancel = () => {
    setTempTitle(getRoom().title); // Reset temp title to the original room title
    setIsEditing(false); // Exit edit mode
    setEditingType(null);
  };

  // function to confirm edited time
  const handleConfirmEditTime = () => {
    toggleEditTime();
  };

  // function to cancel edited time
  const handleCancelEditTime = () => {
    toggleEditTime();
  };

  // Track the interval ID for device
  const [intervalId, setIntervalId] = useState<any>(null);

  // function to get different intensity label for different current selected device type
  const getIntensityLabel = (deviceType: string): string => {
    switch (deviceType) {
      case "aircond":
      case "light":
        return "Intensity";
      case "irrigation":
        return "Water Intensity";
      case "petfeeder":
        return "Portion";
      default:
        return "";
    }
  };

  // Function to display different intensity icon based on the current device type (i need todo only for light and petfeeder, currently still apply for irrigation)
  const getIntensityIcon = (
    deviceType: string
  ): { on: string; off: string } => {
    const iconMap: { [key: string]: { on: string; off: string } } = {
      petfeeder: {
        on: foodOff,
        off: foodOn,
      },
      light: {
        on: bulbOn,
        off: bulbOff,
      },
      irrigation: {
        on: irrigationOn,
        off: irrigationOff,
      },
    };

    return iconMap[deviceType];
  };

  // Static small circles positions (percentage values)
  const smallCircles = [14, 25.8, 37.6, 49.4, 61.2, 73];

  // Create a position map to map percentage back to smallcircles position
  const positionMap = (perct: number) => {
    const index = Math.min(Math.floor(perct / 20), smallCircles.length - 1); // Mapping to index of small circles
    return smallCircles[index];
  };

  // state to track the current circle position's percentage
  const [circlePosition, setCirclePosition] = useState(
    positionMap(getDevice().devData.percentage)
  ); // Default position (start of progress bar

  // use effect to update the circle position when user swipe for the percentage
  useEffect(() => {
    const devicePercentage = getDevice().devData.percentage;
    const position = positionMap(devicePercentage);
    setCirclePosition(position); // Update position when the percentage changes
  }, [getDevice().devData.percentage]);

  // Map the snapped position to one of the predefined positions
  const percentageMap = smallCircles.reduce((acc, value, index) => {
    const percentage = index * 20; // Mapping to 0, 20, 40, 60, 80, 100
    acc[value] = percentage;
    return acc;
  }, {} as { [key: number]: number });

  // Find the closest percentage based on the snapped position
  const mapToPercentage = (snappedPosition: number): number => {
    // Find the closest value in smallCircles to the snapped position
    const closestValue = smallCircles.reduce((prev, curr) =>
      Math.abs(curr - snappedPosition) < Math.abs(prev - snappedPosition)
        ? curr
        : prev
    );

    // Return the corresponding percentage from the percentageMap
    return percentageMap[closestValue];
  };

  // State for storing the current position of the big circle
  const [dragging, setDragging] = useState(false);
  const [startXCircle, setStartXCircle] = useState(0); // Initial touch position

  // Event handler for when touch starts (touchstart)
  const handleTouchStartCircle = () => {
    setDragging(true);
    // Set to the starting point, then to the latest position when dragged
    setStartXCircle(circlePosition);
  };

  // Event handler for touch end (touchend)
  const handleTouchEndCircle = () => {
    setDragging(false); // End the dragging when touch ends
  };

  // Predefined days
  const days = [
    { name: "Monday", letter: "M" },
    { name: "Tuesday", letter: "T" },
    { name: "Wednesday", letter: "W" },
    { name: "Thursday", letter: "T" },
    { name: "Friday", letter: "F" },
    { name: "Saturday", letter: "S" },
    { name: "Sunday", letter: "S" },
  ];

  // state to track the selected day by user
  const [activeDay, setActiveDay] = useState<Day | null>(null);

  // function to handle day click by user
  const handleDayClick = (day: { name: string; letter: string }) => {
    setActiveDay(day);
  };

  // state to track selected period for smart feature
  const [period, setPeriod] = useState("AM"); // Tracks the selected option
  // state to track if user click to edit time for modal display
  const [isEditTime, setIsEditTime] = useState(false);

  // state to track the toggled period by user (not yet done)
  const toggleTime = (time: string) => {
    setPeriod(time); // Update the selected state
  };

  // state to track the toggled edit time by user (not yet done)
  const toggleEditTime = () => {
    setIsEditTime((prev) => !prev);
  };

  // function to handle if user click to edit time (still doing it)
  const handleEditTimeClick = () => {
    toggleEditTime();
    //setEditingType("time"); // Set to "time" when editing time
    setTempTitle("Edit time"); // Set temp title to the current device title
  };

  // function to handle the toggle of smart feature in manageDevice page
  const handleContentToggle = (
    roomId: number,
    deviceId: number,
    toggleKey: "toggle1" | "toggle2"
  ) => {
    setDevicesState((prevDevicesState) =>
      prevDevicesState.map((d) =>
        d.room_id === roomId && d.device_id === deviceId
          ? {
              ...d,
              content: {
                ...d.content,
                [toggleKey]: !d.content[toggleKey],
              },
            }
          : d
      )
    );
  };

  return (
    <>
      {/* Purple Container */}
      {devType === "light" || "aircond" || "petfeeder" || "irrigation" ? (
        <>
          <div
            style={{
              position: "relative",
              top: "60px",
              height: "calc(100% - 57%)",
            }}
          >
            {/* Back Button */}
            <div
              onClick={() => setActiveContent("viewDeviceStatus")}
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
                {getDevice().title}
              </h3>
              {/* Edit Icon */}
              <FaPen
                className="mb-1"
                size={15}
                color="white"
                onClick={handleEditDeviceClick} // Enable edit mode when clicked
                style={{ cursor: "pointer" }}
              />
            </div>

            {/* Text */}
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-start ms-4 p-2">
                <div className="text-start">
                  <b
                    style={{
                      fontSize: "55px",
                      color: "white",
                      marginRight: "4px",
                    }}
                  >
                    {/* Find the current device from the updated devicesState */}
                    {getDevice().deviceType === "aircond"
                      ? getDevice().devData.celsius
                      : getDevice().deviceType === "irrigation"
                      ? getDevice().devData.waterFlow
                      : getDevice().devData.percentage}
                  </b>
                  <b style={{ fontSize: "30px", color: "white" }}>
                    {getUnit(getDevice().deviceType)}
                  </b>

                  <p
                    className="text-start"
                    style={{
                      fontSize: "20px",
                      color: "white",
                      wordWrap: "break-word",
                      maxWidth: "150px",
                    }}
                  >
                    {getUnitLabel(getDevice().deviceType)}
                  </p>
                </div>
                <div className="text-start">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={getSelectedDeviceStatus(
                        getRoom().id,
                        getDevice().device_id
                      )} // Access the state for the specific device
                      onChange={() => {
                        handleToggle(getRoom().id, getDevice().device_id); // Toggle state for the specific device
                      }}
                    />
                    <span className="slider round"></span>
                    <span className="on-text">ON</span>
                    <span className="off-text">OFF</span>
                  </label>
                </div>
              </div>
              {/* Light */}
              <div className="text-end me-5">
                {/* Glowing effect div */}
                {/* {getSelectedDeviceStatus(
                getRoom().id,
                getDevice().device_id
              ) && <div className="lamp-glow"></div>} */}
                {getSelectedDeviceStatus(
                  getRoom().id,
                  getDevice().device_id
                ) && (
                  <>
                    {getDevice().deviceType === "light" && (
                      <div className="lamp-glow"></div>
                    )}
                    {getDevice().deviceType === "aircond" && (
                      <div className="aircond-glow"></div>
                    )}
                  </>
                )}

                <img
                  src={getDevice().devData.iconImage}
                  alt={"Lamp"}
                  className="img-fluid"
                />
              </div>
            </div>
            <div style={{ width: "90%", margin: "0 auto" }}>
              <hr
                style={{
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* Display button for different device */}
            {getDevice().deviceType === "aircond" ||
            getDevice().deviceType === "irrigation" ? (
              <div className="d-flex justify-content-center align-items-center p-2">
                <button
                  className="me-5 btn p-2 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "#ffffff",
                    width: "70px",
                    height: "50px",
                    borderRadius: "15px",
                  }}
                  onClick={() => handleDecrease(getDevice().deviceType)}
                  disabled={
                    getDevice().devData.celsius === 14 ||
                    getDevice().devData.waterFlow === 2
                  }
                  onTouchStart={() =>
                    startLongPress(handleDecrease(getDevice().deviceType))
                  }
                  onTouchEnd={stopLongPress}
                >
                  <FaMinus color="black" size={"18"} />
                </button>

                <button
                  className="me-2 btn p-2 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "#ffffff",
                    width: "70px",
                    height: "50px",
                    borderRadius: "15px",
                  }}
                  onClick={() => handleIncrease(getDevice().deviceType)}
                  disabled={
                    getDevice().devData.celsius === 30 ||
                    getDevice().devData.waterFlow === 60
                  }
                  onTouchStart={() =>
                    startLongPress(handleIncrease(getDevice().deviceType))
                  }
                  onTouchEnd={stopLongPress}
                >
                  <FaPlus color="black" size={"18"} />
                </button>
              </div>
            ) : (
              <div className="ms-4 me-4">
                <p
                  style={{
                    fontSize: "16px",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {getIntensityLabel(getDevice().deviceType)}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <img src={getIntensityIcon(getDevice().deviceType).off} />

                  {/* Static Small Circles */}
                  {smallCircles.map((pos, index) => (
                    <div
                      key={index}
                      className="small_circle"
                      style={{ marginLeft: `${pos}%` }}
                      onClick={() => handleSmallCircleClick(index)}
                    ></div>
                  ))}

                  {/* Draggable Big Circle */}
                  <div
                    className="big_circle"
                    style={{
                      marginLeft: "3.5%",
                      left: `${circlePosition}%`,
                      cursor: dragging ? "grabbing" : "grab",
                    }}
                    onTouchStart={handleTouchStartCircle}
                    onTouchMove={(e) => handleTouchMoveCircle(e)}
                    onTouchEnd={handleTouchEndCircle}
                  ></div>

                  <div
                    style={{
                      borderTop: "1px solid #cdcdcd",
                      width: "calc(100% - 30%)",
                    }}
                  ></div>

                  <img src={getIntensityIcon(getDevice().deviceType).on} />
                </div>
              </div>
            )}
          </div>
          {/* White container */}
          <div
            className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column overflow-auto"
            style={{
              top: "50%",
              height: "45%",
              borderRadius: "18px",
              paddingBottom: "15%",
            }}
          >
            <div className="d-flex justify-content-between align-items-center p-4">
              <div className="text-start ms-3">
                <h3 className="mb-0 fw-bold" style={{ color: "#204160" }}>
                  Smart Features
                </h3>
              </div>
              <div className="text-end d-flex justify-content-end">
                {addFeature ? (
                  <div
                    className="d-flex justify-content-center align-items-center me-2"
                    style={{
                      backgroundColor: "#204160",
                      color: "#ffffff",
                      borderRadius: "90px",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                      fontWeight: "500",
                      width: "65px",
                      height: "30px",
                      fontSize: "15px",
                    }}
                    onClick={handleAddFeature}
                  >
                    Done
                  </div>
                ) : (
                  <button
                    className="me-2 btn rounded-circle p-2 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#204160",
                      width: "30px",
                      height: "30px",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                    }}
                    onClick={handleAddFeature}
                  >
                    <FaPlus color="white" />
                  </button>
                )}
              </div>
            </div>
            {/* Smart Feature */}
            {addFeature && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100vw",
                }}
              >
                <div
                  className="p-3 mb-4"
                  style={{
                    borderRadius: "14px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    width: "calc(100% - 15%)",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <div className="d-flex justify-content-between col-12">
                    {days.map((day, index) => (
                      <button
                        key={index}
                        className="d-flex justify-content-center fw-bold"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          color:
                            activeDay?.name === day.name
                              ? "#ffffff"
                              : "#204160",
                          backgroundColor:
                            activeDay?.name === day.name
                              ? "#204160"
                              : "#ffffff",
                          border: "1px solid #204160",
                        }}
                        onClick={() => handleDayClick(day)}
                      >
                        {day.letter}
                      </button>
                    ))}
                  </div>
                  {/* Border Container */}
                  <div>
                    <div className="d-flex justify-content-start align-items-center p-1 mt-3">
                      <span
                        className="fw-bold"
                        style={{ color: "#979797", fontSize: "15px" }}
                      >
                        {["aircond", "light"].includes(getDevice().deviceType)
                          ? "Turn On:"
                          : "Slot 1:"}
                      </span>
                      <div
                        className={`ms-2 d-flex justify-content-between align-items-center ${
                          getDevice().deviceType === "irrigation"
                            ? "col-9"
                            : "col-6"
                        }`}
                      >
                        <div
                          className=" d-flex justify-content-center align-items-center fw-bold"
                          style={{
                            borderRadius: "5px",
                            width: "65px",
                            height: "30px",
                            backgroundColor: "#ffffff",
                            border: "1px solid #979797",
                            fontSize: "15px",
                          }}
                          onClick={handleEditTimeClick}
                        >
                          <span>08: 20</span>
                        </div>
                        <div
                          className="d-flex"
                          style={{
                            width: "65px",
                            height: "30px",
                            border: "1px solid #bbbbbb",
                            borderRadius: "5px",
                            backgroundColor: "#d9d9d9",
                          }}
                        >
                          {/* AM Button  */}
                          <button
                            className={`d-flex w-50 justify-content-center align-items-center p-1 me-0 ${
                              period === "AM" ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                period === "AM" ? "#204160" : "#d9d9d9",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              fontSize: "12px",
                              margin: "2px",
                              fontWeight: "600",
                            }}
                            onClick={() => toggleTime("AM")}
                          >
                            AM
                          </button>

                          {/* PM Button  */}
                          <button
                            className={`d-flex w-50 justify-content-center align-items-center p-1 ms-0 ${
                              period === "PM" ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                period === "PM" ? "#204160" : "#d9d9d9",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              fontSize: "12px",
                              margin: "2px",
                              fontWeight: "600",
                            }}
                            onClick={() => toggleTime("PM")}
                          >
                            PM
                          </button>
                        </div>
                        {getDevice().deviceType === "irrigation" && (
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              width: "75px",
                              height: "30px",
                              border: "1px solid #979797",
                              borderRadius: "5px",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            <span style={{ fontSize: "14px" }}>10 mins</span>
                            <IoIosArrowDown size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d-flex justify-content-start align-items-center p-1 mt-1">
                      <span
                        className="fw-bold"
                        style={{ color: "#979797", fontSize: "15px" }}
                      >
                        {["aircond", "light"].includes(getDevice().deviceType)
                          ? "Turn Off:"
                          : "Slot 2:"}
                      </span>
                      <div
                        className={`ms-2 d-flex justify-content-between align-items-center ${
                          getDevice().deviceType === "irrigation"
                            ? "col-9"
                            : "col-6"
                        }`}
                      >
                        <div
                          className="d-flex justify-content-center align-items-center fw-bold"
                          style={{
                            borderRadius: "5px",
                            width: "65px",
                            height: "30px",
                            backgroundColor: "#ffffff",
                            border: "1px solid #979797",
                            fontSize: "15px",
                          }}
                          onClick={handleEditTimeClick}
                        >
                          <span>11: 30</span>
                        </div>
                        <div
                          className="d-flex"
                          style={{
                            width: "65px",
                            height: "30px",
                            border: "1px solid #bbbbbb",
                            borderRadius: "5px",
                            backgroundColor: "#d9d9d9",
                          }}
                        >
                          {/* AM Button  */}
                          <button
                            className={`d-flex w-50 justify-content-center align-items-center p-1 me-0 ${
                              period === "AM" ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                period === "AM" ? "#204160" : "#d9d9d9",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              fontSize: "12px",
                              margin: "2px",
                              fontWeight: "600",
                            }}
                            onClick={() => toggleTime("AM")}
                          >
                            AM
                          </button>

                          {/* PM Button  */}
                          <button
                            className={`d-flex w-50 justify-content-center align-items-center p-1 ms-0 ${
                              period === "PM" ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                period === "PM" ? "#204160" : "#d9d9d9",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              fontSize: "12px",
                              margin: "2px",
                              fontWeight: "600",
                            }}
                            onClick={() => toggleTime("PM")}
                          >
                            PM
                          </button>
                        </div>
                        {getDevice().deviceType === "irrigation" && (
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              width: "75px",
                              height: "30px",
                              border: "1px solid #979797",
                              borderRadius: "5px",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            <span style={{ fontSize: "14px" }}>15 mins</span>
                            <IoIosArrowDown size={16} />
                          </div>
                        )}
                      </div>
                    </div>

                    {["petfeeder", "irrigation"].includes(
                      getDevice().deviceType
                    ) ? (
                      <div className="d-flex justify-content-start mt-3">
                        <button
                          className="btn rounded-circle d-flex align-items-center justify-content-center ms-2"
                          style={{
                            backgroundColor: "#204160",
                            width: "22px",
                            height: "22px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                            padding: "5px",
                          }}
                        >
                          <FaPlus color="white" />
                        </button>
                        <div
                          className="d-flex justify-content-center align-items-center ms-2"
                          style={{
                            height: "22px",
                          }}
                        >
                          <span style={{ fontWeight: "600" }}>New slot</span>
                        </div>
                      </div>
                    ) : null}

                    <div
                      className="mt-3"
                      onClick={() => setActiveContent("repeatTime")}
                    >
                      <div
                        className="d-flex justify-content-center justify-content-between fw-bold p-1"
                        style={{
                          borderRadius: "5px",
                          width: "100%",
                          height: "35px",
                          backgroundColor: "#ffffff",
                          border: "1px solid #979797",
                          fontSize: "16px",
                        }}
                      >
                        <span className="ms-2">Repeat</span>
                        <span className="me-2">
                          Never<IoIosArrowForward></IoIosArrowForward>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Content 1 */}
            <div
              className="mb-4"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
              }}
            >
              <div
                className="d-flex justify-content-between align-items-center p-3 ps-4 pe-4"
                style={{
                  backgroundColor: getSelectedDeviceToggle(
                    getRoom().id,
                    getDevice().device_id,
                    "toggle1"
                  )
                    ? "#e3ebee" // Use light grey if toggle1 is true
                    : "#ffffff", // Use white if toggle1 is false
                  borderRadius: "14px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  width: "calc(100% - 15%)",
                  transition: "background-color 0.3s ease",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#000000",
                      fontWeight: "650",
                    }}
                  >
                    {getDevice().content.feature}
                  </span>
                  <div>
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#979797",
                        fontWeight: "700",
                      }}
                    >
                      {getDevice().content.smartFeature}
                    </span>
                  </div>
                </div>
                <label className="purple-switch">
                  <input
                    type="checkbox"
                    checked={getSelectedDeviceToggle(
                      getRoom().id,
                      getDevice().device_id,
                      "toggle1"
                    )}
                    onChange={() =>
                      handleContentToggle(
                        getRoom().id,
                        getDevice().device_id,
                        "toggle1"
                      )
                    }
                  />
                  <span className="purple-slider round"></span>
                </label>
              </div>
            </div>

            {/* Content 2 */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
              }}
            >
              <div
                className="d-flex justify-content-between align-items-center p-3 ps-4 pe-4"
                style={{
                  backgroundColor: getSelectedDeviceToggle(
                    getRoom().id,
                    getDevice().device_id,
                    "toggle2"
                  )
                    ? "#e3ebee" // Use light grey if toggle1 is true
                    : "#ffffff", // Use white if toggle1 is false
                  borderRadius: "14px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  width: "calc(100% - 15%)",
                  transition: "background-color 0.3s ease",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#000000",
                      fontWeight: "650",
                    }}
                  >
                    {getDevice().content.featurePeriod}
                  </span>
                  <div>
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#979797",
                        fontWeight: "700",
                      }}
                    >
                      {getDevice().content.featureDetail}
                    </span>
                  </div>
                </div>
                <label className="purple-switch">
                  <input
                    type="checkbox"
                    checked={getSelectedDeviceToggle(
                      getRoom().id,
                      getDevice().device_id,
                      "toggle2"
                    )}
                    onChange={() =>
                      handleContentToggle(
                        getRoom().id,
                        getDevice().device_id,
                        "toggle2"
                      )
                    }
                  />
                  <span className="purple-slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Edit Title */}
      {isEditing && (
        <EditTitleModal
          editingType={editingType}
          tempTitle={tempTitle}
          setTempTitle={setTempTitle}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
        />
      )}

      {/* Edit Time */}
      {isEditTime && (
        <EditTimeModal
          handleConfirm={handleConfirmEditTime}
          handleCancel={handleCancelEditTime}
        />
      )}
    </>
  );
};

export default ManageDevice;
