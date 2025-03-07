import { FaMinusCircle, FaPlus } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import

// Import images
import LivingRoomImage from "../assets/rooms/livingroom.svg";
import BedRoomImage from "../assets/rooms/bedroom.svg";
import KitchenImage from "../assets/rooms/kitchen.svg";
import GardenImage from "../assets/rooms/garden.svg";
import BathroomImage from "../assets/rooms/bathroom.svg";
import lampIcon from "../assets/devicesSettingIcon/lamp.svg";
import sprinklerIcon from "../assets/devicesSettingIcon/sprinkler.svg";
import petfeederIcon from "../assets/devicesSettingIcon/cooker.svg";
import airCondIcon from "../assets/viewDeviceStatus/aircond3.svg";
import manageLamp from "../assets/manageDevice/light.svg";
import managePetfeeder from "../assets/manageDevice/petfeeder.svg";
import manageAircond from "../assets/manageDevice/aircond2.svg";
import manageIrrigation from "../assets/manageDevice/irrigation.svg";
import collaboratorIcon from "../assets/addCollab/collab-profile.svg";

// Import components
import WeatherDisplay from "./WeatherDisplay.tsx";
import LogoNotif from "./LogoNotif.tsx";
import AddRoom from "./AddRoom.tsx";
import ViewDeviceStatus from "./ViewDeviceStatus.tsx";
import AddDevice from "./AddDevice.tsx";
import DeviceSetting from "./DeviceSetting.tsx";
import ManageDevice from "./ManageDevice.tsx";
import ViewCollaborator from "./ViewCollaborator.tsx";
import RemoveModal from "./RemoveModal.tsx";
import ViewNotification from "./ViewNotification.tsx";
import RequestAccessModal from "./RequestAccessModal.tsx";
import AddCollaborator from "./AddCollaborator.tsx";
import RepeatTime from "./RepeatTime.tsx";

// Import styles
import "./Switch.css";
import "./RadioButton.css";
import "./CircleDot.css";
import "./glowingEffect.css";
import "./Alert.css";
import "./SyncButton.css";

// Type definitions
export interface Room {
  id: number;
  image: string;
  title: string;
  devices: number;
}

export interface Device {
  device_id: number;
  room_id: number;
  title: string;
  image: string;
  deviceType: string;
  status: boolean;
  swiped: boolean;
  devData: {
    id: number;
    iconImage: string;
    percentage: number;
    celsius: number;
    waterFlow: number;
  };
  content: {
    feature: string;
    smartFeature: string;
    toggle1: boolean;
    featurePeriod: string;
    featureDetail: string;
    toggle2: boolean;
  };
}

export interface Icon {
  image: string;
  title: string;
}

export interface Day {
  name: string;
  letter: string;
}

export interface Collaborator {
  id: number;
  name: string;
  image: string;
  type: string;
}

// API Types
interface ApiControl {
  id: number;
  controlType: "percentage" | "temperature" | "waterFlow";
  currentValue: number;
}

interface ApiTrigger {
  triggerType: string;
  conditionOperator: string;
  isActive: boolean;
  featurePeriod: string;
  featureDetail: string;
}

interface ApiDevice {
  id: number;
  roomId: number;
  type: string;
  displayName: string;
  status: boolean;
  swiped: boolean;
  controls: ApiControl[];
  triggers: ApiTrigger[];
}

interface ApiRoom {
  id: number;
  homeId: number;
  name: string;
  iconType: string;
  createdAt: string;
  devices: ApiDevice[];
}

// Initial data
const initialRooms: Room[] = [
  { id: 0, image: LivingRoomImage, title: "Living Room", devices: 1 },
  { id: 1, image: BedRoomImage, title: "Bedroom", devices: 3 },
  { id: 2, image: KitchenImage, title: "Kitchen", devices: 0 },
  { id: 3, image: GardenImage, title: "Garden", devices: 1 },
  { id: 4, image: BathroomImage, title: "Bathroom", devices: 5 },
];

const initialDevices: Device[] = [
  {
    device_id: 0,
    room_id: 0,
    image: petfeederIcon,
    title: "Pet Feeder 1",
    deviceType: "petfeeder",
    status: false,
    swiped: false,
    devData: {
      id: 0,
      iconImage: managePetfeeder,
      percentage: 0,
      celsius: 0,
      waterFlow: 0,
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
    title: "Air Cond",
    deviceType: "aircond",
    status: false,
    swiped: false,
    devData: {
      id: 1,
      iconImage: manageAircond,
      percentage: 0,
      celsius: 30,
      waterFlow: 0,
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
  // Additional devices...
  {
    device_id: 2,
    room_id: 1,
    image: lampIcon,
    title: "Lamp 1",
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
    content: {
      feature: "Auto Lighting",
      smartFeature: "Infrared Detection",
      toggle1: false,
      featurePeriod: "Daily",
      featureDetail: "8:00pm to 7:00am",
      toggle2: false,
    },
  },
  {
    device_id: 3,
    room_id: 1,
    image: lampIcon,
    title: "Lamp 2",
    deviceType: "light",
    status: false,
    swiped: false,
    devData: {
      id: 3,
      iconImage: manageLamp,
      percentage: 60,
      celsius: 0,
      waterFlow: 0,
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
  {
    device_id: 4,
    room_id: 3,
    image: sprinklerIcon,
    title: "Irrigation 1",
    deviceType: "irrigation",
    status: false,
    swiped: false,
    devData: {
      id: 4,
      iconImage: manageIrrigation,
      percentage: 30,
      celsius: 0,
      waterFlow: 30,
    },
    content: {
      feature: "Auto Irrigation",
      smartFeature: "Soil Moisture Sensor",
      toggle1: false,
      featurePeriod: "Every Monday",
      featureDetail: "8:00am (10 minutes)",
      toggle2: false,
    },
  },
  {
    device_id: 5,
    room_id: 4,
    image: airCondIcon,
    title: "Air Cond",
    deviceType: "aircond",
    status: false,
    swiped: false,
    devData: {
      id: 5,
      iconImage: manageAircond,
      percentage: 0,
      celsius: 16,
      waterFlow: 0,
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
  // Other air conditioners in room 4...
];

const initialCollaborators: Collaborator[] = [
  {
    id: 0,
    name: "Alvin",
    image: collaboratorIcon,
    type: "Owner",
  },
  {
    id: 1,
    name: "Alice",
    image: collaboratorIcon,
    type: "Dweller",
  },
  {
    id: 2,
    name: "Anna",
    image: collaboratorIcon,
    type: "Dweller",
  },
];

const defaultDevice: Device = {
  device_id: 0,
  room_id: 0,
  title: "Default",
  image: LivingRoomImage,
  deviceType: "light",
  status: false,
  swiped: false,
  devData: {
    id: 0,
    iconImage: manageLamp,
    percentage: 80,
    celsius: 0,
    waterFlow: 0,
  },
  content: {
    feature: "Auto Lighting",
    smartFeature: "Infrared Detection",
    toggle1: false,
    featurePeriod: "Daily",
    featureDetail: "8:00pm to 7:00am",
    toggle2: false,
  },
};

const defaultRoom: Room = {
  id: 0,
  image: LivingRoomImage,
  title: "Default",
  devices: 0,
};

const HomePage: React.FC = () => {
  // State management
  const [roomsState, setRoomsState] = useState(initialRooms);
  const [devicesState, setDevicesState] = useState(initialDevices);
  const [collabState, setCollabState] = useState(initialCollaborators);

  const [room, setRoom] = useState<Room>(defaultRoom);
  const [device, setDevice] = useState<Device>(defaultDevice);
  const [devType, setDevType] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<string | null>("home");
  const [addSelectDevice, setAddSelectDevice] = useState<Device | null>(null);
  const [isRoomEditing, setRoomEditing] = useState(false);
  const [removeRoom, setRemoveRoom] = useState<Room | null>(null);
  const [isRequestAccess, setRequestAccess] = useState(false);
  const [addFeature, setAddFeature] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Add this hook

  // First, modify your device counting logic in the API fetch:
  const updateDeviceCounts = (devices: Device[], rooms: Room[]): Room[] => {
    // Create a map to count devices per room
    const deviceCountByRoom = new Map<number, number>();
    devices.forEach((device) => {
      const count = deviceCountByRoom.get(device.room_id) || 0;
      deviceCountByRoom.set(device.room_id, count + 1);
    });

    // Update rooms with correct device counts
    return rooms.map((room) => ({
      ...room,
      devices: deviceCountByRoom.get(room.id) || 0,
    }));
  };

  // Add this function at the top of your file alongside other API functions
  const updateDeviceStatusAPI = async (
    deviceId: number,
    newStatus: boolean
  ) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      // If no token is available, show error
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `http://localhost:5000/api/devices/${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          navigate("/signin");
          throw new Error("Authentication token expired");
        }

        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update device status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating device status:", error);
      throw error;
    }
  };

  // Update your fetch function:
  // Update your fetch function to include the auth token:
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      // If no token is available, redirect to signin
      if (!token) {
        console.error("No authentication token found");
        navigate("/signin");
        return;
      }

      // TEMPORARY FIX: Use a specific homeId you know exists in your database
      // Later, replace this with proper home selection
      const homeId = 8; // Replace with a valid home ID from your database

      const response = await fetch(
        `http://localhost:5000/api/rooms/home/${homeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, navigate to login
          console.error("Authentication token expired or invalid");
          navigate("/signin");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const roomsData: ApiRoom[] = await response.json();

      // First, update rooms from API
      const updatedRooms = roomsData.map((room) => ({
        id: room.id,
        image: getRoomImage(room.iconType), // Use iconType from API
        title: room.name, // Use name directly from API
        devices: 0, // We'll update this count later
      }));

      // Then transform devices
      const transformedDevices = transformApiData(roomsData);

      // Finally, update device counts
      const roomsWithCounts = updateDeviceCounts(
        transformedDevices,
        updatedRooms
      );

      setDevicesState(transformedDevices);
      setRoomsState(roomsWithCounts);

      // Log for debugging
      console.log("Rooms after update:", roomsWithCounts);
      console.log("Devices after update:", transformedDevices);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching data"
      );
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add these helper functions to map room IDs to images and titles
  const getRoomImage = (roomIconType: string): string => {
    const roomImages: Record<string, string> = {
      "living-room": LivingRoomImage,
      bedroom: BedRoomImage,
      kitchen: KitchenImage,
      garden: GardenImage,
      bathroom: BathroomImage,
    };
    return roomImages[roomIconType] || LivingRoomImage; // Default to LivingRoom if not found
  };

  const getRoomTitle = (roomId: number): string => {
    const roomTitles: Record<number, string> = {
      52: "Living Room",
      53: "Bedroom",
      54: "Kitchen",
      3: "Garden",
      4: "Bathroom",
    };
    return roomTitles[roomId] || "Unknown Room";
  };

  // Update your device mapping function to handle the correct device types
  const getDeviceImage = (type: string): string => {
    const deviceImages: Record<string, string> = {
      petfeeder: petfeederIcon,
      light: lampIcon,
      aircond: airCondIcon, // Note the AC type mapping
      irrigation: sprinklerIcon,
    };
    return deviceImages[type] || "../assets/default-device.svg";
  };

  const getDeviceIcon = (type: string): string => {
    const deviceIcons: Record<string, string> = {
      petfeeder: managePetfeeder,
      aircond: manageAircond,
      light: manageLamp,
      irrigation: manageIrrigation,
    };
    return deviceIcons[type] || "../assets/default-icon.svg";
  };

  const transformApiData = (roomsData: ApiRoom[]): Device[] => {
    return roomsData.flatMap((room) =>
      room.devices.map(
        (device: ApiDevice): Device => ({
          device_id: device.id,
          room_id: device.roomId,
          image: getDeviceImage(device.type),
          title: device.displayName,
          deviceType: device.type,
          status: device.status,
          swiped: device.swiped,
          devData: {
            id: device.controls[0]?.id,
            iconImage: getDeviceIcon(device.type),
            percentage:
              Number(
                device.controls.find((c) => c.controlType === "percentage")
                  ?.currentValue
              ) || 0,
            celsius:
              Number(
                device.controls.find((c) => c.controlType === "temperature")
                  ?.currentValue
              ) || 0,
            waterFlow:
              Number(
                device.controls.find((c) => c.controlType === "waterFlow")
                  ?.currentValue
              ) || 0,
          },
          content: {
            feature: device.triggers[0]?.triggerType || "Default Feature",
            smartFeature:
              device.triggers[0]?.conditionOperator || "Default Operator",
            toggle1: device.triggers[0]?.isActive ?? false,
            featurePeriod: device.triggers[0]?.featurePeriod || "Daily",
            featureDetail:
              device.triggers[0]?.featureDetail || "8:00am, 12:00pm, 7:00pm",
            toggle2: false,
          },
        })
      )
    );
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Memoized devices map for efficient lookups
  const devicesMap = useMemo(() => {
    const map = new Map();
    devicesState.forEach((device) => {
      if (!map.has(device.room_id)) {
        map.set(device.room_id, new Map());
      }
      map.get(device.room_id).set(device.device_id, device);
    });
    return map;
  }, [devicesState]);

  // Getter functions
  const getDevice = () => device;
  const getRoom = () => room;

  // Device state helper functions
  const getSelectedDeviceStatus = (roomId: number, deviceId: number) => {
    const device = devicesMap.get(roomId)?.get(deviceId);
    return device ? device.status : false;
  };

  const getSelectedDeviceToggle = (
    roomId: number,
    deviceId: number,
    toggleKey: "toggle1" | "toggle2"
  ) => {
    const device = devicesMap.get(roomId)?.get(deviceId);
    return device ? device.content[toggleKey] : false;
  };

  // Event handlers
  // const handleToggle = (roomId: number, deviceId: number) => {
  //   setDevicesState((prevDevicesState) =>
  //     prevDevicesState.map((dev) =>
  //       dev.room_id === roomId && dev.device_id === deviceId
  //         ? { ...dev, status: !dev.status }
  //         : dev
  //     )
  //   );
  //   console.log("thissss");
  // };
  // Updated handleToggle function with API integration
  const handleToggle = async (roomId: number, deviceId: number) => {
    try {
      // Get the current device status
      const currentDevice = devicesState.find(
        (dev) => dev.room_id === roomId && dev.device_id === deviceId
      );

      if (!currentDevice) return;

      // Calculate the new status (toggle the current status)
      const newStatus = !currentDevice.status;

      // Update local state optimistically for immediate UI feedback
      setDevicesState((prevDevicesState) =>
        prevDevicesState.map((dev) =>
          dev.room_id === roomId && dev.device_id === deviceId
            ? { ...dev, status: newStatus }
            : dev
        )
      );

      // Call the API to update the status in the backend
      await updateDeviceStatusAPI(deviceId, newStatus);

      console.log(`Device ${deviceId} status updated to ${newStatus}`);
    } catch (error) {
      // If the API call fails, revert the local state change
      console.error("Failed to update device status:", error);

      // Revert the optimistic update
      setDevicesState((prevDevicesState) =>
        prevDevicesState.map((dev) =>
          dev.room_id === roomId && dev.device_id === deviceId
            ? { ...dev, status: !dev.status } // Toggle back to original state
            : dev
        )
      );

      // Optional: Show error to user
      alert("Failed to update device status. Please try again.");
    }
  };

  const handleRoomClick = (selectedRoom: Room) => {
    setRoom(selectedRoom);
    setActiveContent("viewDeviceStatus");
  };

  const handleRoomEdit = () => {
    setRoomEditing((prev) => !prev);
  };

  const handleRemoveRoom = async () => {
    if (removeRoom) {
      try {
        setIsLoading(true);

        // Call the API to delete the room
        const response = await fetch(
          `http://localhost:5000/api/rooms/${removeRoom.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update rooms - this replaces both of the problematic setState calls
        setRoomsState((prevRooms) =>
          prevRooms.filter((room) => room.id !== removeRoom.id)
        );

        // Update devices - this replaces both of the problematic setState calls
        setDevicesState((prevDevices) =>
          prevDevices.filter((device) => device.room_id !== removeRoom.id)
        );

        setRemoveRoom(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while deleting the room"
        );
        console.error("API Error:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRoomCancel = () => {
    setRemoveRoom(null);
  };

  const handleRequest = () => {
    setRequestAccess(true);
  };

  const handleCancel = () => {
    setRequestAccess(false);
  };

  const handleAddFeature = () => {
    setAddFeature((prev) => !prev);
  };

  // Find current device and room
  const currentDevice = devicesState.find(
    (d) => d.device_id === device.device_id
  );
  const currentRoom = roomsState.find((r) => r.id === room.id);

  // Effects to keep current device and room updated
  useEffect(() => {
    if (currentDevice) {
      setDevice(currentDevice);
    }
  }, [devicesState, currentDevice]);

  useEffect(() => {
    if (currentRoom) {
      setRoom(currentRoom);
    }
  }, [roomsState, currentRoom]);

  // Logging for debugging
  useEffect(() => {
    console.log("Updated devicesState:", devicesState);
  }, [devicesState]);

  useEffect(() => {
    console.log("Updated roomsState:", roomsState);
  }, [roomsState]);

  // Render home page view
  const renderHomePage = () => (
    <>
      <LogoNotif setActiveContent={setActiveContent} />
      <WeatherDisplay />
      <div
        className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column"
        style={{
          top: "27%",
          height: "100%",
          borderRadius: "18px",
        }}
      >
        <div className="container-fluid p-3 pb-2">
          <div className="row align-items-center mb-2">
            <div className="col-4 text-start">
              <h5
                className="mb-0 ms-3 fw-semibold"
                style={{ color: "#204160" }}
                onClick={handleRoomEdit}
              >
                {isRoomEditing ? "Done" : "Edit"}
              </h5>
            </div>
            <div className="col-4 text-center">
              <h3 className="mb-0 fw-bold" style={{ color: "#204160" }}>
                Rooms
              </h3>
            </div>
            <div className="col-4 text-end d-flex justify-content-end">
              <button
                className="me-2 btn rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#204160",
                  width: "30px",
                  height: "30px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                }}
                onClick={() => setActiveContent("addRoom")}
                disabled={isRoomEditing}
              >
                <FaPlus color="white" />
              </button>
            </div>
          </div>
        </div>
        <div
          className="container-fluid overflow-auto"
          style={{
            height: "calc(100% - 320px)",
          }}
        >
          <div className="row g-3 pb-5 p-1">
            {roomsState.map((r, index) => (
              <div
                key={index}
                className="col-6 mt-3"
                onClick={() => handleRoomClick(r)}
                style={{
                  pointerEvents: isRoomEditing ? "none" : "auto",
                }}
              >
                <div
                  className="p-2 py-5"
                  style={{
                    backgroundColor: "#eeeeee",
                    borderRadius: "16px",
                    height: "100%",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                    position: "relative",
                  }}
                >
                  {isRoomEditing && (
                    <div
                      style={{
                        pointerEvents: "auto",
                        opacity: 1,
                      }}
                    >
                      <FaMinusCircle
                        color="red"
                        size={18}
                        className="d-flex flex-start"
                        style={{
                          cursor: "pointer",
                          position: "absolute",
                          top: "-4px",
                          left: "-4px",
                          width: "28px",
                          height: "28px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setRemoveRoom(r);
                        }}
                      />
                    </div>
                  )}
                  <div
                    className="d-flex flex-column justify-content-end align-items-center"
                    style={{
                      height: "60%",
                    }}
                  >
                    <img
                      src={r.image}
                      alt={r.title}
                      className="img-fluid mb-2"
                      style={{
                        width: "calc(100% - 60%)",
                      }}
                    />
                  </div>
                  <div
                    className="text-center"
                    style={{
                      height: "40%",
                    }}
                  >
                    <div className="mb-0 text-center">
                      <h5>{r.title}</h5>
                    </div>
                    <p className="mb-0 text-center">
                      <span
                        className="px-1"
                        style={{
                          backgroundColor: "#C2C2C2",
                          borderRadius: "4px",
                        }}
                      >
                        {r.devices}
                      </span>{" "}
                      devices
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // Main render
  return (
    <>
      {/* Render the appropriate content based on activeContent state */}
      {activeContent === "home" ? (
        renderHomePage()
      ) : activeContent === "addRoom" ? (
        <AddRoom
          roomsState={roomsState}
          setRoomsState={setRoomsState}
          setActiveContent={setActiveContent}
          homeId={8}
        />
      ) : activeContent === "viewDeviceStatus" ? (
        <ViewDeviceStatus
          getRoom={getRoom}
          getDevice={getDevice}
          roomsState={roomsState}
          setRoomsState={setRoomsState}
          devicesState={devicesState}
          setDevicesState={setDevicesState}
          setRoom={setRoom}
          setDevice={setDevice}
          setDevType={setDevType}
          setActiveContent={setActiveContent}
          getSelectedDeviceStatus={getSelectedDeviceStatus}
          handleToggle={handleToggle}
        />
      ) : activeContent === "addDevice" ? (
        <AddDevice
          addSelectDevice={addSelectDevice}
          setAddSelectDevice={setAddSelectDevice}
          setActiveContent={setActiveContent}
        />
      ) : activeContent === "deviceSetting" ? (
        <DeviceSetting
          addSelectDevice={addSelectDevice}
          setRoomsState={setRoomsState}
          getRoom={getRoom}
          setActiveContent={setActiveContent}
          devicesState={devicesState}
          setDevicesState={setDevicesState}
        />
      ) : activeContent === "manageDevice" ? (
        <ManageDevice
          devType={devType}
          setActiveContent={setActiveContent}
          getDevice={getDevice}
          getSelectedDeviceStatus={getSelectedDeviceStatus}
          getRoom={getRoom}
          handleToggle={handleToggle}
          setDevicesState={setDevicesState}
          getSelectedDeviceToggle={getSelectedDeviceToggle}
          setDevice={setDevice}
          devicesState={devicesState}
          addFeature={addFeature}
          handleAddFeature={handleAddFeature}
        />
      ) : activeContent === "viewCollaborators" ? (
        <ViewCollaborator
          setActiveContent={setActiveContent}
          collabState={collabState}
          setCollabState={setCollabState}
        />
      ) : activeContent === "viewNotification" ? (
        <ViewNotification setActiveContent={setActiveContent} />
      ) : activeContent === "addCollaborator" ? (
        <AddCollaborator setActiveContent={setActiveContent} />
      ) : activeContent === "repeatTime" ? (
        <RepeatTime
          setActiveContent={setActiveContent}
          setAddFeature={handleAddFeature}
        />
      ) : null}

      {/* Modals */}
      {removeRoom && (
        <RemoveModal
          removeWhat="room"
          removeItem={removeRoom}
          handleRemove={handleRemoveRoom}
          handleCancel={handleRoomCancel}
        />
      )}

      {false && isRequestAccess && (
        <RequestAccessModal
          handleCancel={handleCancel}
          handleRequest={handleRequest}
        />
      )}
    </>
  );
};

export default HomePage;
