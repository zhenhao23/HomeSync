import { FaMinus, FaPen, FaPlus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { Device, Room } from "./HomePage";
import React, { useEffect, useState } from "react";
import bulbOn from "../assets/manageDevice/bulbOn.svg";
import bulbOff from "../assets/manageDevice/bulbOff.svg";
import foodOff from "../assets/manageDevice/petFoodOff.svg";
import foodOn from "../assets/manageDevice/petFoodOn.svg";
import irrigationOff from "../assets/manageDevice/irrigationOff.svg";
import irrigationOn from "../assets/manageDevice/irrigationOn.svg";
import EditTitleModal from "./EditTitleModal";
import "./DeviceOverview.css";
import useWindowSize from "./Layout";

interface DevOverviewProps {
  setActiveContent: (content: string) => void;
  getDevice: () => Device;
  getSelectedDeviceStatus: (roomId: number, deviceId: number) => boolean;
  handleToggle: (roomId: number, deviceId: number) => void;
  getRoom: () => Room;
  setDevicesState: React.Dispatch<React.SetStateAction<Device[]>>;
  setDevice: React.Dispatch<React.SetStateAction<Device>>;
  devicesState: Device[];
}

const DeviceOverview: React.FC<DevOverviewProps> = ({
  setActiveContent,
  getDevice,
  getSelectedDeviceStatus,
  handleToggle,
  getRoom,
  setDevicesState,
  setDevice,
  devicesState,
}) => {
  // Debounce function to limit API calls
  const useDebounce = (callback: Function, delay: number) => {
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    return (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  // Add a new function to update device controls via API
  const updateDeviceControl = async (
    deviceId: number,
    controlValue: number,
    controlProperty: string // Like 'waterFlow', 'celsius', 'percentage'
  ) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // First fetch the device to get its controls
      const getDeviceResponse = await fetch(
        `https://homesync-production.up.railway.app/api/devices/${deviceId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!getDeviceResponse.ok) {
        throw new Error("Failed to get device data");
      }

      const deviceData = await getDeviceResponse.json();

      // Find the right control based on controlType
      let controlType;
      switch (controlProperty) {
        case "waterFlow":
          controlType = "waterFlow";
          break;
        case "celsius":
          controlType = "temperature";
          break;
        case "percentage":
          controlType = "percentage";
          break;
        default:
          throw new Error(`Unknown control property: ${controlProperty}`);
      }

      const control = deviceData.controls.find(
        (c: any) => c.controlType === controlType
      );

      if (!control) {
        throw new Error(`Control of type ${controlType} not found`);
      }

      // Now update with the correct control ID
      const response = await fetch(
        `https://homesync-production.up.railway.app/api/devices/${deviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            controls: [
              {
                id: control.id,
                currentValue: controlValue,
                // Only include currentValue for partial update
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

  // Add a function to update device title via API
  const updateDeviceTitle = async (deviceId: number, newTitle: string) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `https://homesync-production.up.railway.app/api/devices/${deviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            displayName: newTitle,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update device title");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating device title:", error);
      throw error;
    }
  };

  // Create debounced versions of the API calls
  const debouncedUpdateControl = useDebounce(
    (deviceId: number, value: number, property: string) => {
      updateDeviceControl(deviceId, value, property).catch((error) => {
        console.error(`Failed to update ${property}:`, error);
        // Optionally revert to previous state on API failure
      });
    },
    500 // Wait 500ms after last interaction before sending API request
  );

  // For circle position updates
  const debouncedUpdateCircle = useDebounce(
    (deviceId: number, percentage: number) => {
      updateDeviceControl(deviceId, percentage, "percentage").catch((error) => {
        console.error("Failed to update percentage:", error);
      });
    },
    500
  );

  // For temperature/water flow controls
  const handleDecreaseWaterFlow = () => {
    const currentDevice = getDevice();
    if (currentDevice.devData.waterFlow <= 2) return;

    const newValue = currentDevice.devData.waterFlow - 1;
    const deviceId = currentDevice.device_id;

    // Update local state immediately for responsive UI
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

    // Debounce the API call
    debouncedUpdateControl(deviceId, newValue, "waterFlow");
  };
  // Update the celsius handlers
  // Optimize the handleIncreaseCelsius function
  const handleIncreaseCelsius = () => {
    const currentDevice = getDevice();
    if (currentDevice.devData.celsius >= 30) return;

    const newValue = currentDevice.devData.celsius + 1;
    const deviceId = currentDevice.device_id;

    // Update local state immediately for responsive UI
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

    // Debounce the API call
    debouncedUpdateControl(deviceId, newValue, "celsius");
  };

  // Optimize the handleIncreaseWaterFlow function
  const handleIncreaseWaterFlow = () => {
    const currentDevice = getDevice();
    if (currentDevice.devData.waterFlow >= 60) return;

    const newValue = currentDevice.devData.waterFlow + 1;
    const deviceId = currentDevice.device_id;

    // Update local state immediately for responsive UI
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

    // Debounce the API call
    debouncedUpdateControl(deviceId, newValue, "waterFlow");
  };

  const handleDecreaseCelsius = () => {
    const currentDevice = getDevice();
    if (currentDevice.devData.celsius <= 14) return;

    const newValue = currentDevice.devData.celsius - 1;
    const deviceId = currentDevice.device_id;

    // Update local state immediately for responsive UI
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

    // Debounce the API call
    debouncedUpdateControl(deviceId, newValue, "celsius");
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

  const handleSmallCircleClick = (index: number) => {
    // Update UI immediately
    setCirclePosition(smallCircles[index]);
    const newPercentage = mapToPercentage(smallCircles[index]);
    const currentDevice = getDevice();
    const deviceId = currentDevice.device_id;

    // Update local state
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

    // Send API update with debounce
    debouncedUpdateCircle(deviceId, newPercentage);
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

      // Update UI immediately
      setCirclePosition(circlepos);

      // Update local state for percentage value
      const newPercentage = mapToPercentage(circlepos);
      const currentDevice = getDevice();
      const deviceId = currentDevice.device_id;

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

  // Track the interval ID for device
  const [intervalId, setIntervalId] = useState<any>(null);

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
    try {
      const currentDevice = getDevice();
      const deviceId = currentDevice.device_id;

      // Call the API to update the title
      await updateDeviceTitle(deviceId, tempTitle);

      // Update the local state with the new title
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
      // Optionally, show an error message to the user
    }
  };

  // function to handle cancel if user wants to cancel their action
  const handleCancel = () => {
    setTempTitle(getRoom().title); // Reset temp title to the original room title
    setIsEditing(false); // Exit edit mode
    setEditingType(null);
  };

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

  // Add API call when touch ends
  const handleTouchEndCircle = () => {
    setDragging(false);

    // Get final values and send to API
    const currentDevice = getDevice();
    const deviceId = currentDevice.device_id;
    const finalPercentage = mapToPercentage(circlePosition);

    // Call debounced API update
    debouncedUpdateCircle(deviceId, finalPercentage);
  };

  const isLaptop = useWindowSize();

  return (
    <>
      <div className="device-overview">
        {/* Back Button */}
        {!isLaptop && (
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
        )}

        {/* Room Title */}
        <div className="device-title-pen-div">
          {/* Display the title normally when not in edit mode */}
          <h3 className="fw-bold me-2 device-title">{getDevice().title}</h3>
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
        <div className="d-flex justify-content-between align-items-center device-info">
          <div className="text-start ms-4 p-2">
            <div className="text-start">
              <b className="device-data">
                {/* Find the current device from the updated devicesState */}
                {getDevice().deviceType === "aircond"
                  ? getDevice().devData.celsius
                  : getDevice().deviceType === "irrigation"
                  ? getDevice().devData.waterFlow
                  : getDevice().devData.percentage}
              </b>
              <b className="device-data-unit">
                {getUnit(getDevice().deviceType)}
              </b>

              <p className="text-start device-label">
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
          <div className="text-end me-5 device-image-icon">
            {/* Glowing effect div */}
            {getSelectedDeviceStatus(getRoom().id, getDevice().device_id) && (
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
          <div className="d-flex justify-content-center align-items-center p-2 device-feature-button">
            <button
              className="me-5 btn p-2 d-flex align-items-center justify-content-center device-button"
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
              className="me-2 btn p-2 d-flex align-items-center justify-content-center device-button"
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
            <p className="unit-label">
              {getIntensityLabel(getDevice().deviceType)}
            </p>
            <div className="d-flex justify-content-between align-items-center drag-content">
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

              <div className="drag-line"></div>

              <img src={getIntensityIcon(getDevice().deviceType).on} />
            </div>
          </div>
        )}
      </div>
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
    </>
  );
};

export default DeviceOverview;
