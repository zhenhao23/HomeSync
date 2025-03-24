import { FaMinusCircle, FaPlus } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import

// Import images
import LivingRoomImage from "../assets/rooms/livingroom.svg";
import BedRoomImage from "../assets/rooms/bedroom.svg";
import KitchenImage from "../assets/rooms/kitchen.svg";
import GardenImage from "../assets/rooms/garden.svg";
import BathroomImage from "../assets/rooms/bathroom.svg";
// Import additional room icons
import carIcon from "../assets/addRoomIcon/car.svg";
import bookShelfIcon from "../assets/addRoomIcon/bookshelf.svg";
import coatHangerIcon from "../assets/addRoomIcon/coat-hanger.svg";
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
import useWindowSize from "./Layout.tsx";
import LogoSmartHome from "./LogoSmartHome.tsx";
import DeviceSmartFeature from "./DeviceSmartFeature.tsx";
// import collabIcon from "../assets/addCollab/collab-profile.svg";
import OwnerGuard from "../OwnerGuard.tsx";

// Import styles
import "./Switch.css";
import "./RadioButton.css";
import "./CircleDot.css";
import "./glowingEffect.css";
import "./Alert.css";
import "./SyncButton.css";
import "./HomePage.css";

// Type definitions
export interface Room {
  id: number;
  image: string;
  title: string;
  devices: number;
  collaborators: Collaborator[];
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
  content: DeviceTrigger[];
}

export interface Icon {
  image: string;
  title: string;
  enabled?: boolean; // Add this property
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

type DeviceTrigger = {
  feature_id: number;
  feature: string;
  label: string;
  status: boolean;
  isUserAdded: boolean;
};

// Predefined room array
const rooms: Room[] = [
  // {
  //   id: 0,
  //   image: LivingRoomImage,
  //   title: "Living Room",
  //   devices: 1,
  //   collaborators: [
  //     { id: 0, name: "Adrian", image: collabIcon, type: "Owner" },
  //     { id: 1, name: "Joshua", image: collabIcon, type: "Dweller" },
  //   ],
  // },
  // {
  //   id: 1,
  //   image: BedRoomImage,
  //   title: "Bedroom",
  //   devices: 3,
  //   collaborators: [],
  // },
  // {
  //   id: 2,
  //   image: KitchenImage,
  //   title: "Kitchen",
  //   devices: 0,
  //   collaborators: [
  //     { id: 4, name: "Mike", image: collabIcon, type: "Owner" },
  //     { id: 5, name: "Emma", image: collabIcon, type: "Dweller" },
  //     { id: 5, name: "Lily", image: collabIcon, type: "Dweller" },
  //   ],
  // },
  // {
  //   id: 3,
  //   image: GardenImage,
  //   title: "Garden",
  //   devices: 1,
  //   collaborators: [
  //     { id: 4, name: "Rose", image: collabIcon, type: "Dweller" },
  //     { id: 5, name: "Lisa", image: collabIcon, type: "Dweller" },
  //   ],
  // },
  // {
  //   id: 4,
  //   image: BathroomImage,
  //   title: "Bathroom",
  //   devices: 5,
  //   collaborators: [
  //     { id: 4, name: "Fuko", image: collabIcon, type: "Dweller" },
  //     { id: 5, name: "Elly", image: collabIcon, type: "Dweller" },
  //   ],
  // },
];

// Predefined exisitng device array
const devices: Device[] = [
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
      percentage: 10,
      celsius: 0,
      waterFlow: 0,
    },
    content: [
      {
        feature_id: 1,
        feature: "Every Monday",
        label: "9:00am",
        status: false,
        isUserAdded: true,
      },
      {
        feature_id: 2,
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
    title: "Air Cond",
    deviceType: "aircond",
    status: false,
    swiped: false,
    devData: {
      id: 0,
      iconImage: manageAircond,
      percentage: 0,
      celsius: 30,
      waterFlow: 0,
    },
    content: [
      {
        feature_id: 1,
        feature: "Auto Air Cond",
        label: "Turn on when room temp > 25°C",
        status: false,
        isUserAdded: false,
      },
      {
        feature_id: 2,
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
    title: "Lamp 1",
    deviceType: "light",
    status: false,
    swiped: false,
    devData: {
      id: 0,
      iconImage: manageLamp,
      percentage: 40,
      celsius: 0,
      waterFlow: 0,
    },
    content: [
      {
        feature_id: 1,
        feature: "Auto Lighting",
        label: "Infrared Detection",
        status: false,
        isUserAdded: false,
      },
      {
        feature_id: 2,
        feature: "Daily",
        label: "8:00am to 7:00pm",
        status: false,
        isUserAdded: true,
      },
    ],
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
      id: 0,
      iconImage: manageLamp,
      percentage: 60,
      celsius: 0,
      waterFlow: 0,
    },
    content: [
      {
        feature_id: 1,
        feature: "Auto Lighting",
        label: "Infrared Detection",
        status: false,
        isUserAdded: false,
      },
      {
        feature_id: 2,
        feature: "Daily",
        label: "8:00am to 7:00pm",
        status: false,
        isUserAdded: true,
      },
    ],
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
      id: 0,
      iconImage: manageIrrigation,
      percentage: 30,
      celsius: 0,
      waterFlow: 30,
    },
    content: [
      {
        feature_id: 1,
        feature: "Auto Irrigation",
        label: "Soil Moisture Sensor",
        status: false,
        isUserAdded: false,
      },
      {
        feature_id: 2,
        feature: "Every monday",
        label: "8:00am (10 minutes)",
        status: false,
        isUserAdded: true,
      },
    ],
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
      id: 0,
      iconImage: manageAircond,
      percentage: 0,
      celsius: 16,
      waterFlow: 0,
    },
    content: [
      {
        feature_id: 1,
        feature: "Auto Air Cond",
        label: "Turn on when room temp > 25°C",
        status: false,
        isUserAdded: false,
      },
      {
        feature_id: 2,
        feature: "Daily",
        label: "9:00am to 4:00pm",
        status: false,
        isUserAdded: true,
      },
    ],
  },
];

// A default device when no device is seleted to avoid null situation
const defaultDevice: Device = {
  device_id: -1,
  room_id: -1,
  title: "Default",
  image: "No device selected",
  deviceType: "",
  status: false,
  swiped: false,
  devData: {
    id: 0,
    iconImage: "",
    percentage: 0,
    celsius: 0,
    waterFlow: 0,
  },
  content: [],
};

const defaultRoom: Room = {
  id: 0,
  image: LivingRoomImage,
  title: "Default",
  devices: 0,
  collaborators: [],
};

// Initial rooms and devices arrays
const initialRooms = rooms;
const initialDevices = devices;

const HomePage: React.FC = () => {
  // State management
  const [roomsState, setRoomsState] = useState(initialRooms);
  const [devicesState, setDevicesState] = useState(initialDevices);
  const [, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  const [room, setRoom] = useState<Room>(defaultRoom);
  const [device, setDevice] = useState<Device>(defaultDevice);
  const [devType, setDevType] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<string | null>("home");
  const [addSelectDevice, setAddSelectDevice] = useState<Device | null>(null);
  const [isRoomEditing, setRoomEditing] = useState(false);
  const [removeRoom, setRemoveRoom] = useState<Room | null>(null);
  const [isRequestAccess, setRequestAccess] = useState(false);
  const navigate = useNavigate();

  // Add this with your other state variables
  const [roomEnergyData, setRoomEnergyData] = useState<Record<number, number>>(
    {}
  );

  // Get today's day name
  const todayName = new Date().toLocaleString("en-US", { weekday: "long" });

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

  // state to keep track the selected slot duration for petfeeder and irrigation
  const [selectedDuration] = useState("5 mins");

  // Find the corresponding day object
  const todayDay = days.find((day) => day.name === todayName) || null;

  // state to track the selected day by user
  const [activeDay, setActiveDay] = useState<Day | null>(todayDay);

  // function to handle room clicked by user
  const handleRoomClick = (selectedRoom: {
    id: number;
    title: string;
    image: string;
    devices: number;
    collaborators: Collaborator[];
  }) => {
    setRoom(selectedRoom); // Set the selected room data
    setActiveContent("viewDeviceStatus"); // Navigate to the viewDeviceStatus page
  };

  // Add this alongside your other API functions
  const fetchRoomEnergyData = async () => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No authentication token found");
        navigate("/signin");
        return;
      }

      const response = await fetch(
        "https://homesync-production.up.railway.app/api/devices/energy/rooms",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/signin");
          return;
        }
        throw new Error("Failed to fetch room energy data");
      }

      const data = await response.json();

      // Convert array to a map of roomId -> energyUsed
      const energyMap: Record<number, number> = {};
      data.forEach((room: { id: number; energyUsed: number }) => {
        energyMap[room.id] = room.energyUsed;
      });

      setRoomEnergyData(energyMap);
    } catch (error) {
      console.error("Error fetching room energy data:", error);
    }
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

      // Get the current homeId from localStorage
      const homeId = localStorage.getItem("currentHomeId");

      if (!homeId) {
        throw new Error("Home ID not found");
      }

      // Send both the status update and homeId for validation
      const response = await fetch(
        `https://homesync-production.up.railway.app/api/devices/${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            homeId: parseInt(homeId), // Send homeId for server-side validation
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          navigate("/signin");
          throw new Error("Authentication token expired");
        }

        if (response.status === 403) {
          throw new Error("You don't have permission to control this device");
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

  // API function to create a new device trigger
  const createDeviceTriggerAPI = async (
    deviceId: number,
    triggerType: string,
    conditionOperator: string,
    featurePeriod: string,
    featureDetail: string
  ) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Get the current homeId from localStorage
      const homeId = localStorage.getItem("currentHomeId");
      if (!homeId) {
        throw new Error("Home ID not found");
      }

      // Send request to create new trigger
      const response = await fetch(
        `https://homesync-production.up.railway.app/api/devices/${deviceId}/triggers`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            triggerType,
            conditionOperator,
            isActive: true,
            featurePeriod,
            featureDetail,
            homeId: parseInt(homeId),
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication token expired");
        }

        if (response.status === 403) {
          throw new Error("You don't have permission to modify this device");
        }

        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create trigger");
      }

      // Return the created trigger with its real ID from the backend
      return await response.json();
    } catch (error) {
      console.error("Error creating trigger:", error);
      throw error;
    }
  };

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

      // Get the current homeId from localStorage
      const homeId = localStorage.getItem("currentHomeId");

      // If no homeId is available, try to fetch homes
      if (!homeId) {
        // Fetch the user's homes
        const homesResponse = await fetch(
          "https://homesync-production.up.railway.app/api/homes/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!homesResponse.ok) {
          if (homesResponse.status === 401) {
            navigate("/signin");
            return;
          }
          throw new Error("Failed to fetch user's homes");
        }

        const homesData = await homesResponse.json();

        if (homesData.length > 0) {
          // Store and use the first home's ID
          const firstHomeId = homesData[0].id;
          localStorage.setItem("currentHomeId", firstHomeId.toString());

          // Fetch home data using the new endpoint
          await fetchHomeData(firstHomeId, token);
        } else {
          setError("No homes found for your account");
          setIsLoading(false);
        }
      } else {
        // Use the stored homeId to fetch home data
        await fetchHomeData(parseInt(homeId), token);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching data"
      );
      console.error("API Error:", err);
      setIsLoading(false);
    }
  };

  // In your fetchHomeData function, right after receiving the data:
  const fetchHomeData = async (homeId: number, token: string) => {
    try {
      const response = await fetch(
        `https://homesync-production.up.railway.app/api/homedata/${homeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Error handling code...
      }

      // Get the data in the format your frontend expects
      const data = await response.json();

      // Process image paths before updating state - add type annotations
      const processedRooms = data.roomsState.map((room: any) => ({
        ...room,
        image: getRoomImage(room.image),
        collaborators: room.collaborators.map((collab: any) => ({
          ...collab,
          image: collab.image.includes("collab-profile.svg")
            ? collaboratorIcon
            : collab.image,
        })),
      }));

      const processedDevices = data.devicesState.map((device: any) => ({
        ...device,
        image: getDeviceImage(device.deviceType),
        devData: {
          ...device.devData,
          iconImage: getDeviceIcon(device.deviceType),
        },
      }));

      // Update state with already-processed data
      setRoomsState(processedRooms);
      setDevicesState(processedDevices);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching home data:", error);
      throw error;
    }
  };

  const getRoomImage = (roomIconType: string): string => {
    // Map iconType from database to SVG images
    // Use kebab-case keys to match backend storage format
    const roomImages: Record<string, string> = {
      "living-room": LivingRoomImage,
      bedroom: BedRoomImage,
      kitchen: KitchenImage,
      garden: GardenImage,
      bathroom: BathroomImage,
      garage: carIcon, // Add garage/car
      "study-room": bookShelfIcon, // Add study room
      closet: coatHangerIcon, // Add closet
    };

    // Convert "Living Room" format to "living-room" if needed
    const normalizedType = roomIconType.toLowerCase().replace(/\s+/g, "-");

    // First try with the normalized type, then with the original type
    return (
      roomImages[normalizedType] || roomImages[roomIconType] || LivingRoomImage
    );
  };

  const getDeviceImage = (type: string): string => {
    // Use the same mapping as on the server
    const deviceImages: Record<string, string> = {
      petfeeder: petfeederIcon,
      light: lampIcon,
      aircond: airCondIcon,
      irrigation: sprinklerIcon,
    };
    return deviceImages[type] || "../assets/default-device.svg";
  };

  const getDeviceIcon = (type: string): string => {
    // Use the same mapping as on the server
    const deviceIcons: Record<string, string> = {
      petfeeder: managePetfeeder,
      aircond: manageAircond,
      light: manageLamp,
      irrigation: manageIrrigation,
    };
    return deviceIcons[type] || "../assets/default-icon.svg";
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
    fetchRoomEnergyData(); // Add this line
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
    featureId: number
  ) => {
    const device = devicesMap.get(roomId)?.get(deviceId);
    return device
      ? device.content.find(
          (item: DeviceTrigger) => item.feature_id === featureId
        )?.status || false
      : false;
  };

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

  // const handleRoomClick = (selectedRoom: Room) => {
  //   setRoom(selectedRoom);
  //   setActiveContent("viewDeviceStatus");
  // };

  const handleRoomEdit = () => {
    setRoomEditing((prev) => !prev);
  };

  const handleRemoveRoom = async () => {
    if (removeRoom) {
      try {
        setIsLoading(true);

        // Get auth token from localStorage
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error("Authentication token not found");
          navigate("/signin");
          return;
        }

        // Get current homeId (needed for validation on the backend)
        const homeId = localStorage.getItem("currentHomeId");

        if (!homeId) {
          setError("Home ID not found");
          return;
        }

        // Call the API to delete the room with proper authentication
        const response = await fetch(
          `https://homesync-production.up.railway.app/api/rooms/${removeRoom.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Handle different error responses
        if (!response.ok) {
          if (response.status === 401) {
            // Authentication failure
            navigate("/signin");
            return;
          }

          if (response.status === 403) {
            // Permission denied
            setError("You don't have permission to delete this room");
            setRemoveRoom(null);
            return;
          }

          if (response.status === 404) {
            // Room not found
            setError("Room not found");
            setRemoveRoom(null);
            return;
          }

          const errorData = await response.json();
          throw new Error(
            errorData.error || `Failed to delete room: ${response.status}`
          );
        }

        // Get the response data
        const deletedRoom = await response.json();
        console.log("Room deleted successfully:", deletedRoom);

        // Update local state
        setRoomsState((prevRooms) =>
          prevRooms.filter((room) => room.id !== removeRoom.id)
        );

        // Remove devices associated with this room
        setDevicesState((prevDevices) =>
          prevDevices.filter((device) => device.room_id !== removeRoom.id)
        );

        // Close the modal
        setRemoveRoom(null);
      } catch (err) {
        console.error("Error deleting room:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while deleting the room"
        );
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

  // state to track if user wants to add new smart feature schedule in manageDevice page
  const [addFeature, setAddFeature] = useState(false);

  // Function to complete adding a smart device
  const handleAddFeatureToggle = () => {
    setAddFeature((prev) => !prev);
  };

  // ...existing code...

  // Function to handle adding smart feature schedule
  const handleAddFeature = async (deviceId: number) => {
    try {
      // Find the selected device
      const selectedDevice = devicesState.find(
        (device) => device.device_id === deviceId
      );

      // Ensure selected device exists
      if (!selectedDevice) return;

      // Determine the correct triggerType based on repeat option
      let triggerType = "";

      if (repeatOption === "Never") {
        triggerType = "Once";
      } else if (repeatOption === "Daily") {
        triggerType = "Daily";
      } else if (repeatOption === "Weekly") {
        // For weekly, include the specific day name
        triggerType = activeDay ? `Every ${activeDay.name}` : "Every Monday";
      } else {
        // Default case if no repeat option is selected
        triggerType = activeDay ? `Every ${activeDay.name}` : "Daily";
      }

      // Format feature details based on device type
      const isTimeBasedDevice = ["aircond", "light"].includes(
        selectedDevice.deviceType
      );
      const conditionOperator = isTimeBasedDevice
        ? "Time-based"
        : "Time-based Slot";

      // Format time label based on device type
      const timeLabel = isTimeBasedDevice
        ? `${turnOn}${turnOnPeriod.toLowerCase()} to ${turnOff}${turnOffPeriod.toLowerCase()}`
        : `${turnOn}${turnOnPeriod.toLowerCase()}, ${turnOff}${turnOffPeriod.toLowerCase()} (${selectedDuration})`;

      // Create the feature in the backend first to get its real ID
      const newFeature = await createDeviceTriggerAPI(
        deviceId,
        triggerType,
        conditionOperator,
        activeDay ? activeDay.name : "Daily", // Use selected day or default to "Daily"
        timeLabel
      );

      // Update UI with the REAL backend ID from the response
      setDevicesState((prevDevices) =>
        prevDevices.map((device) =>
          device.device_id === deviceId
            ? {
                ...device,
                content: [
                  ...device.content,
                  {
                    feature_id: newFeature.id, // Use the real ID returned by the backend
                    feature: triggerType,
                    label: timeLabel,
                    status: true,
                    isUserAdded: true,
                  },
                ],
              }
            : device
        )
      );

      // Reset state for next use
      setAddFeature(false);
      setHasSelect(false);
    } catch (error) {
      console.error("Failed to add smart feature:", error);
      // Show error to user
      alert(
        error instanceof Error
          ? error.message
          : "Failed to add smart feature. Please try again."
      );
    }
  };

  // funciton to find current device
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

  // State to keep track for displaying repeat option error modal
  const [repeat, setRepeat] = useState(false);

  // State for repeat selection
  const [repeatOption, setRepeatOption] = useState("");

  // Available repeat options
  const repeatSelections = ["Never", "Daily", "Weekly"];

  // function to track if user has selected a repeat option
  const handleRepeatChange = () => {
    setRepeat((prev) => !prev);
  };

  // state to track if user select an option
  const [hasSelect, setHasSelect] = useState(false);

  // Function to get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, "0");
    const currentMinute = now.getMinutes().toString().padStart(2, "0");
    return `${currentHour}:${currentMinute}`;
  };

  // State to keep track turn on time chosen by user
  const [turnOn, setTurnOn] = useState(getCurrentTime());
  // State to keep track turn off time chosen by user
  const [turnOff, setTurnOff] = useState(getCurrentTime());

  // Effect to update the time whenever addFeature changes
  useEffect(() => {
    if (addFeature) {
      const updatedTime = getCurrentTime();
      setTurnOn(updatedTime);
      setTurnOff(updatedTime);
      setRepeatOption("");
    }
  }, [addFeature]);

  // Function to update Turn on time
  const handleTurnOnChange = (selectedTime: string) => {
    setTurnOn(selectedTime);
  };

  // Function to update Turn Off time
  const handleTurnOffChange = (selectedTime: string) => {
    setTurnOff(selectedTime);
  };

  // state to track selected period for smart feature
  const [turnOnPeriod, setTurnOnPeriod] = useState("AM"); // Tracks AM/PM for Turn On
  const [turnOffPeriod, setTurnOffPeriod] = useState("AM"); // Tracks AM/PM for Turn Off

  // state to track the toggled period by user
  const toggleTime = (time: string, type: "turnOn" | "turnOff") => {
    if (type === "turnOn") {
      setTurnOnPeriod(time);
    } else {
      setTurnOffPeriod(time);
    }
  };

  // State to store the swipe status for a device
  const [swipedDevice, setSwipedDevice] = useState<string | null>(null);
  // State to track the currently selected/swiped device to remove
  const [removeDevice, setRemoveDevice] = useState<Device | null>(null);
  // State to track if a swipe is in progress
  const [isSwiping, setIsSwiping] = useState(false);

  // Add this function alongside other API functions in HomePage.tsx
  const removeDeviceAPI = async (deviceId: number) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      // If no token is available, show error
      if (!token) {
        throw new Error("Authentication required");
      }

      // Get the current homeId from localStorage for logging purposes
      const homeId = localStorage.getItem("currentHomeId");

      if (!homeId) {
        throw new Error("Home ID not found");
      }

      // Send the delete request with authentication
      const response = await fetch(
        `https://homesync-production.up.railway.app/api/devices/${deviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          navigate("/signin");
          throw new Error("Authentication token expired");
        }

        if (response.status === 403) {
          throw new Error("You don't have permission to delete this device");
        }

        if (response.status === 404) {
          throw new Error("Device not found");
        }

        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete device");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting device:", error);
      throw error;
    }
  };

  // Function to remove device if swiped
  const handleRemoveDevice = async () => {
    if (removeDevice) {
      try {
        setIsLoading(true);

        // Call the API to delete the device
        await removeDeviceAPI(removeDevice.device_id);

        // Update the local state to remove the device
        setDevicesState((prevDevicesState) =>
          prevDevicesState.filter(
            (device) => device.device_id !== removeDevice.device_id
          )
        );

        // Update the room's devices count in roomsState
        setRoomsState((prevRoomsState) =>
          prevRoomsState.map((room) =>
            room.id === removeDevice.room_id
              ? { ...room, devices: Math.max(0, room.devices - 1) }
              : room
          )
        );

        // Reset UI states
        setIsSwiping(false);
        setSwipedDevice(null);
        setRemoveDevice(null);
      } catch (error) {
        console.error("Failed to remove device:", error);
        // Optionally show an error message to the user
        alert(
          error instanceof Error ? error.message : "Failed to remove device"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // function to handle cancel action modal in viewDeviceStatus page
  const handleDeviceCancel = () => {
    if (removeDevice) {
      // Reset the swiped state (un-swipe)
      setSwipedDevice(null);
      setIsSwiping(false);
    }

    // Reset the removeCollab state to null
    setRemoveDevice(null);
  };

  // Predefine the request list
  const requestList = [
    { id: 1, person: "Alice", requestItem: "Garden" },
    { id: 2, person: "Bob", requestItem: "Kitchen" },
    { id: 3, person: "Charlie", requestItem: "Smart Lock" },
    { id: 4, person: "David", requestItem: "Living Room" },
  ];

  // State to manage access requests
  const [accessRequests, setAccessRequests] = useState(requestList);

  // Function to remove an item from the access requests
  const handleRemoveRequest = (id: number) => {
    setAccessRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== id)
    );
  };

  const isLaptop = useWindowSize();

  return (
    <>
      {isLaptop ? (
        <>
          {/* Laptop view: Show both Home and ManageDevice */}
          <div className="d-flex justify-content-between">
            <div style={{ marginLeft: "calc(100% - 98%)" }}>
              <LogoNotif setActiveContent={setActiveContent} />

              <div className="d-flex align-items-center px-4 mt-3">
                <div className="m-3">
                  <LogoSmartHome />
                </div>
                <h3 className="homesync-title">HomeSync</h3>
              </div>

              <div className="weather-div">
                <WeatherDisplay />
              </div>
              <div className="position-absolute flex-column room-container overflow-hidden">
                <div className="container-fluid room-header">
                  <div className="row align-items-center mb-2">
                    <div className="col-4 text-start">
                      <OwnerGuard>
                        <h5
                          className="mb-0 ms-3 edit"
                          style={{ color: "#ffffff" }}
                          onClick={handleRoomEdit}
                        >
                          {isRoomEditing ? "Done" : "Edit"}
                        </h5>
                      </OwnerGuard>
                    </div>
                    <div className="col-4 text-center">
                      <h3
                        className="mb-0 room-container-title"
                        style={{ color: "#ffffff" }}
                      >
                        Rooms
                      </h3>
                    </div>
                    <div className="col-4 text-end d-flex justify-content-end">
                      <OwnerGuard>
                        <button
                          className="me-2 btn rounded-circle p-2 d-flex align-items-center justify-content-center add-room-button"
                          onClick={() => setActiveContent("addRoom")}
                          disabled={isRoomEditing}
                        >
                          <FaPlus color="#204160" />
                        </button>
                      </OwnerGuard>
                    </div>
                  </div>
                </div>
                <div className="container-fluid overflow-auto room-item-div">
                  <div className="row g-3 pb-5 p-1">
                    {roomsState.map((r, index) => (
                      <div
                        key={index}
                        className="col-6 mt-3 room-item"
                        onClick={() => handleRoomClick(r)}
                        style={{
                          pointerEvents: isRoomEditing ? "none" : "auto",
                        }}
                        tabIndex={0} // Makes div focusable for :focus-within effect
                      >
                        <div
                          className="room-item-border"
                          style={{
                            backgroundColor: "#eeeeee",
                            borderRadius: "16px",
                            height: "100%",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                            position: "relative",
                            outline: "none",
                          }}
                        >
                          {/* Add energy consumption text at top right */}
                          <div
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              backgroundColor: "#eeeeee",
                              color: "#204160",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            {roomEnergyData[r.id]
                              ? `${(roomEnergyData[r.id] / 1000).toFixed(
                                  1
                                )} kWh`
                              : "0 kWh"}
                          </div>
                          {isRoomEditing ? (
                            <div
                              style={{
                                pointerEvents: isRoomEditing ? "auto" : "none",
                                opacity: 1,
                              }}
                            >
                              {/* White Background Behind Minus Button */}
                              <div className="minus-white"></div>
                              <FaMinusCircle
                                color="red"
                                size={18}
                                className="d-flex flex-start room-minus-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRemoveRoom(r);
                                }}
                              />
                            </div>
                          ) : null}
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
                            <p className="mb-0 text-center">
                              <p className="room-title">{r.title}</p>
                            </p>
                            <p className="mb-0 text-center device-count">
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
            </div>

            {/* ViewDeviceStatus section on laptop */}
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
              swipedDevice={swipedDevice}
              setSwipedDevice={setSwipedDevice}
              removeDevice={removeDevice}
              setRemoveDevice={setRemoveDevice}
              handleRemoveDevice={handleRemoveDevice}
              handleDeviceCancel={handleDeviceCancel}
              isSwiping={isSwiping}
              setIsSwiping={setIsSwiping}
            />
          </div>
        </>
      ) : (
        // Mobile view: Show only the active content
        <>
          {activeContent === "home" ? (
            <>
              <div style={{ marginTop: "30px" }}>
                <LogoSmartHome />
              </div>
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
                      <OwnerGuard>
                        <h5
                          className="mb-0 ms-3 fw-semibold"
                          style={{ color: "#204160" }}
                          onClick={handleRoomEdit}
                        >
                          {isRoomEditing ? "Done" : "Edit"}
                        </h5>
                      </OwnerGuard>
                    </div>
                    <div className="col-4 text-center">
                      <h3 className="mb-0 fw-bold" style={{ color: "#404040" }}>
                        Rooms
                      </h3>
                    </div>
                    <div className="col-4 text-end d-flex justify-content-end">
                      <OwnerGuard>
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
                      </OwnerGuard>
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
                        {/* Mobile view version */}
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
                          {/* Add energy consumption text at top right */}
                          <div
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              backgroundColor: "#eeeeee",
                              color: "#204160",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            {roomEnergyData[r.id]
                              ? `${(roomEnergyData[r.id] / 1000).toFixed(
                                  1
                                )} kWh`
                              : "0 kWh"}
                          </div>

                          {isRoomEditing ? (
                            <div
                              style={{
                                pointerEvents: isRoomEditing ? "auto" : "none",
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
                          ) : null}
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
                            <p className="mb-0 text-center">
                              <h5>{r.title}</h5>
                            </p>
                            <p className="mb-0 text-center device-count">
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
              swipedDevice={swipedDevice}
              setSwipedDevice={setSwipedDevice}
              removeDevice={removeDevice}
              setRemoveDevice={setRemoveDevice}
              handleRemoveDevice={handleRemoveDevice}
              handleDeviceCancel={handleDeviceCancel}
              isSwiping={isSwiping}
              setIsSwiping={setIsSwiping}
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
              handleAddFeatureToggle={handleAddFeatureToggle}
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
              activeDay={activeDay} // Add this
              setActiveDay={setActiveDay} // Add this
            />
          ) : null}
        </>
      )}

      {activeContent === "addRoom" && (
        <>
          {!isLaptop && (
            <>
              <div style={{ marginTop: "30px" }}>
                <LogoSmartHome />
              </div>
              <LogoNotif setActiveContent={setActiveContent} />
              <WeatherDisplay />
            </>
          )}
          <AddRoom
            roomsState={roomsState}
            setRoomsState={setRoomsState}
            setActiveContent={setActiveContent}
            homeId={parseInt(localStorage.getItem("currentHomeId") || "0")}
          />
        </>
      )}

      {activeContent === "addDevice" && (
        <AddDevice
          addSelectDevice={addSelectDevice}
          setAddSelectDevice={setAddSelectDevice}
          setActiveContent={setActiveContent}
        />
      )}

      {activeContent === "manageDevice" && (
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
          activeDay={activeDay} // Add this
          setActiveDay={setActiveDay} // Add this
        />
      )}

      {activeContent === "deviceSetting" && (
        <DeviceSetting
          addSelectDevice={addSelectDevice}
          setRoomsState={setRoomsState}
          getRoom={getRoom}
          setActiveContent={setActiveContent}
          devicesState={devicesState}
          setDevicesState={setDevicesState}
          fetchData={fetchData} // Pass the fetchData function
        />
      )}

      {activeContent === "viewCollaborators" && (
        <ViewCollaborator
          setActiveContent={setActiveContent}
          roomsState={roomsState}
          setRoomsState={setRoomsState}
          getRoom={getRoom}
        />
      )}

      {activeContent === "repeatTime" && (
        <RepeatTime
          setActiveContent={setActiveContent}
          hasSelect={hasSelect}
          setHasSelect={setHasSelect}
          repeatOption={repeatOption}
          setRepeatOption={setRepeatOption}
          repeatSelections={repeatSelections}
        />
      )}

      {activeContent === "addCollaborator" && (
        <AddCollaborator setActiveContent={setActiveContent} />
      )}

      {activeContent === "viewNotification" && (
        <ViewNotification
          setActiveContent={setActiveContent}
          accessRequests={accessRequests}
          handleRemoveRequest={handleRemoveRequest}
        />
      )}

      {/* Modals */}
      {removeRoom && (
        <RemoveModal
          removeWhat="room"
          removeItem={removeRoom}
          handleRemove={handleRemoveRoom}
          handleCancel={handleRoomCancel}
        />
      )}

      {/* Remove Device Display */}
      {removeDevice && (
        <RemoveModal
          removeWhat="device"
          removeItem={removeDevice}
          handleRemove={handleRemoveDevice}
          handleCancel={handleDeviceCancel}
        />
      )}

      {/* request access modal Display */}
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
