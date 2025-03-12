import { FaMinus, FaPen, FaPlus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { Device, Room } from "./HomePage";
import { useEffect, useState } from "react";
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

  const handleDecreaseWaterFlow = () => {
    setDevicesState((prevDevices) =>
      prevDevices.map((device) =>
        device.device_id === getDevice().device_id &&
        device.devData.waterFlow > 2
          ? {
              ...device,
              devData: {
                ...device.devData,
                waterFlow: device.devData.waterFlow - 1,
              },
            }
          : device
      )
    );
  };

  const handleIncreaseWaterFlow = () => {
    setDevicesState((prevDevices) =>
      prevDevices.map((device) =>
        device.device_id === getDevice().device_id &&
        device.devData.waterFlow < 60
          ? {
              ...device,
              devData: {
                ...device.devData,
                waterFlow: device.devData.waterFlow + 1,
              },
            }
          : device
      )
    );
  };

  // Handle Increase Celsius
  const handleIncreaseCelsius = () => {
    setDevicesState((prevDevices) =>
      prevDevices.map((device) =>
        device.device_id === getDevice().device_id &&
        device.devData.celsius < 30
          ? {
              ...device,
              devData: {
                ...device.devData,
                celsius: device.devData.celsius + 1,
              },
            }
          : device
      )
    );
  };

  // handle decrease celsius
  const handleDecreaseCelsius = () => {
    setDevicesState((prevDevices) =>
      prevDevices.map((device) =>
        device.device_id === getDevice().device_id &&
        device.devData.celsius > 14
          ? {
              ...device,
              devData: {
                ...device.devData,
                celsius: device.devData.celsius - 1,
              },
            }
          : device
      )
    );
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

  const handleConfirm = () => {
    // Update the device title
    const updatedDeviceTitle = devicesState.map((d) => {
      if (d.device_id === getDevice().device_id) {
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

  // Event handler for touch move
  const handleTouchMoveCircle = (e: React.TouchEvent<HTMLDivElement>) => {
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

      // Update the state for the specific device
      setDevicesState((prevDevices) => {
        return prevDevices.map((device) =>
          device.device_id === getDevice().device_id
            ? {
                ...device,
                devData: { ...device.devData, percentage: newPercentage },
              }
            : device
        );
      });
    }
  };

  // Event handler for touch end (touchend)
  const handleTouchEndCircle = () => {
    setDragging(false); // End the dragging when touch ends
  };

  // function to handle if user click on circles as an alternative to swipe the intensity (could have make the duplicated code to one function and just directly call that function for set device state)
  const handleSmallCircleClick = (index: number) => {
    setCirclePosition(smallCircles[index]);

    const newPercentage = mapToPercentage(smallCircles[index]);

    // Update the state for the specific device
    setDevicesState((prevDevices) => {
      return prevDevices.map((device) =>
        device.device_id === getDevice().device_id
          ? {
              ...device,
              devData: { ...device.devData, percentage: newPercentage },
            }
          : device
      );
    });
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

              <div className="drag-line"
              ></div>

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
