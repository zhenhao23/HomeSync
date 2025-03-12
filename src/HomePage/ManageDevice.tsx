import { Device, Room } from "./HomePage";
import DeviceOverview from "./DeviceOverview";
import DeviceSmartFeature from "./DeviceSmartFeature";

interface ManageDeviceProps {
  devType: string | null;
  setActiveContent: (content: string) => void;
  getDevice: () => Device;
  getRoom: () => Room;
  setDevicesState: React.Dispatch<React.SetStateAction<Device[]>>;
  getSelectedDeviceStatus: (roomId: number, deviceId: number) => boolean;
  handleToggle: (roomId: number, deviceId: number) => void;
  setDevice: React.Dispatch<React.SetStateAction<Device>>;
  devicesState: Device[];
  getSelectedDeviceToggle: (
    roomId: number,
    deviceId: number,
    featureId: number
  ) => boolean;
  addFeature: boolean;
  handleAddFeature: (deviceId: number) => void;
  handleAddFeatureToggle: () => void;
  repeat: boolean;
  handleRepeatChange: () => void;
  hasSelect: boolean;
  setHasSelect: React.Dispatch<React.SetStateAction<boolean>>;
  turnOn: string;
  turnOff: string;
  handleTurnOnChange: (s: string) => void;
  handleTurnOffChange: (s: string) => void;
  turnOnPeriod: string;
  turnOffPeriod: string;
  toggleTime: (time: string, type: "turnOn" | "turnOff") => void;
  setAddFeature: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManageDevice: React.FC<ManageDeviceProps> = ({
  devType,
  setActiveContent,
  getDevice,
  getRoom,
  setDevicesState,
  getSelectedDeviceStatus,
  handleToggle,
  setDevice,
  devicesState,
  getSelectedDeviceToggle,
  addFeature,
  handleAddFeature,
  handleAddFeatureToggle,
  repeat,
  handleRepeatChange,
  hasSelect,
  setHasSelect,
  turnOn,
  turnOff,
  handleTurnOnChange,
  handleTurnOffChange,
  turnOnPeriod,
  turnOffPeriod,
  toggleTime,
  setAddFeature,
}) => {
  // Add a new function to update device controls via API
  const updateDeviceControl = async (
    deviceId: number,
    controlValue: number,
    controlID: number
  ) => {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `http://localhost:5000/api/devices/${deviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add the authorization header
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
      // Get auth token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Make API call to update the device title
      const response = await fetch(
        `http://localhost:5000/api/devices/${deviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add the authorization header
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
      <DeviceOverview
        setActiveContent={setActiveContent}
        getDevice={getDevice}
        getSelectedDeviceStatus={getSelectedDeviceStatus}
        handleToggle={handleToggle}
        getRoom={getRoom}
        setDevicesState={setDevicesState}
        setDevice={setDevice}
        devicesState={devicesState}
      />

      {devType === "light" || "aircond" || "petfeeder" || "irrigation" ? (
        <DeviceSmartFeature
          getSelectedDeviceToggle={getSelectedDeviceToggle}
          addFeature={addFeature}
          handleAddFeature={handleAddFeature}
          handleAddFeatureToggle={handleAddFeatureToggle}
          getDevice={getDevice}
          setDevicesState={setDevicesState}
          getRoom={getRoom}
          setActiveContent={setActiveContent}
          repeat={repeat}
          handleRepeatChange={handleRepeatChange}
          hasSelect={hasSelect}
          setHasSelect={setHasSelect}
          turnOn={turnOn}
          turnOff={turnOff}
          handleTurnOnChange={handleTurnOnChange}
          handleTurnOffChange={handleTurnOffChange}
          turnOnPeriod={turnOnPeriod}
          turnOffPeriod={turnOffPeriod}
          toggleTime={toggleTime}
          setAddFeature={setAddFeature}
        />
      ) : null}
    </>
  );
};

export default ManageDevice;
