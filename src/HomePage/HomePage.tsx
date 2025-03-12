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
import useWindowSize from "./Layout.tsx";
import LogoSmartHome from "./LogoSmartHome.tsx";
import "./HomePage.css";
import DeviceSmartFeature from "./DeviceSmartFeature.tsx";
import collabIcon from "../assets/addCollab/collab-profile.svg";

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

// Homepage component definition
const HomePage: React.FC = () => {
  // Predefined room array
  const rooms: Room[] = [
    {
      id: 0,
      image: LivingRoomImage,
      title: "Living Room",
      devices: 1,
      collaborators: [
        { id: 0, name: "Adrian", image: collabIcon, type: "Owner" },
        { id: 1, name: "Joshua", image: collabIcon, type: "Dweller" },
      ],
    },
    {
      id: 1,
      image: BedRoomImage,
      title: "Bedroom",
      devices: 3,
      collaborators: [],
    },
    {
      id: 2,
      image: KitchenImage,
      title: "Kitchen",
      devices: 0,
      collaborators: [
        { id: 4, name: "Mike", image: collabIcon, type: "Owner" },
        { id: 5, name: "Emma", image: collabIcon, type: "Dweller" },
        { id: 5, name: "Lily", image: collabIcon, type: "Dweller" },
      ],
    },
    {
      id: 3,
      image: GardenImage,
      title: "Garden",
      devices: 1,
      collaborators: [
        { id: 4, name: "Rose", image: collabIcon, type: "Dweller" },
        { id: 5, name: "Lisa", image: collabIcon, type: "Dweller" },
      ],
    },
    {
      id: 4,
      image: BathroomImage,
      title: "Bathroom",
      devices: 5,
      collaborators: [
        { id: 4, name: "Fuko", image: collabIcon, type: "Dweller" },
        { id: 5, name: "Elly", image: collabIcon, type: "Dweller" },
      ],
    },
  ];

  // state to keep track changes in Room
  const [room, setRoom] = useState<Room>({
    id: 0,
    image: "",
    title: "",
    devices: 0,
    collaborators: [],
  });

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
    {
      device_id: 6,
      room_id: 4,
      image: airCondIcon,
      title: "Air Cond",
      deviceType: "aircond",
      status: false,
      swiped: false,
      devData: {
        iconImage: manageAircond,
        percentage: 0,
        celsius: 18,
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
      device_id: 7,
      room_id: 4,
      image: airCondIcon,
      title: "Air Cond",
      deviceType: "aircond",
      status: false,
      swiped: false,
      devData: {
        iconImage: manageAircond,
        percentage: 0,
        celsius: 20,
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
      device_id: 8,
      room_id: 4,
      image: airCondIcon,
      title: "Air Cond",
      deviceType: "aircond",
      status: false,
      swiped: false,
      devData: {
        iconImage: manageAircond,
        percentage: 0,
        celsius: 25,
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
      device_id: 9,
      room_id: 4,
      image: airCondIcon,
      title: "Air Cond",
      deviceType: "aircond",
      status: false,
      swiped: false,
      devData: {
        iconImage: manageAircond,
        percentage: 0,
        celsius: 28,
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
      iconImage: "",
      percentage: 0,
      celsius: 0,
      waterFlow: 0,
    },
    content: [],
  };

  // state to keep track the current device to display when user click on specific device in a room
  const [device, setDevice] = useState<Device>(defaultDevice);

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
        `http://localhost:5000/api/devices/${deviceId}`,
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

  // Update your fetch function:
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
          "http://localhost:5000/api/homes/user",
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

          // Fetch rooms for this home
          await fetchRoomsForHome(firstHomeId, token);
        } else {
          setError("No homes found for your account");
          setIsLoading(false);
        }
      } else {
        // Use the stored homeId to fetch rooms
        await fetchRoomsForHome(parseInt(homeId), token);
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

  // Helper function to fetch rooms for a specific home
  const fetchRoomsForHome = async (homeId: number, token: string) => {
    try {
      // Set timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        `http://localhost:5000/api/rooms/home/${homeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, navigate to login
          console.error("Authentication token expired or invalid");
          navigate("/signin");
          return;
        }
        if (response.status === 403) {
          throw new Error("You don't have access to this home");
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const roomsData: ApiRoom[] = await response.json();

      // First, update rooms from API
      const updatedRooms = roomsData.map((room) => ({
        id: room.id,
        image: getRoomImage(room.iconType),
        title: room.name,
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
      // Handle AbortError separately
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching rooms"
        );
      }
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

  // Function to handle the curennt selected device's smart feature toggle in manageDevice page
  // const getSelectedDeviceToggle = (
  //   roomId: number,
  //   deviceId: number,
  //   toggleKey: "toggle1" | "toggle2"
  // ) => {
  //   const device = devicesMap.get(roomId)?.get(deviceId); // Perform a fast lookup for the device using roomId and deviceId.
  //   return device ? device.content[toggleKey] : false; // Return the toggle value or false if the device is not found.
  // };

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
          `http://localhost:5000/api/rooms/${removeRoom.id}`,
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

  // Function to handle adding smart feature schedule
  const handleAddFeature = (deviceId: number) => {
    // Find the selected device
    const selectedDevice = devicesState.find(
      (device) => device.device_id === deviceId
    );

    // Ensure selected device exists
    if (!selectedDevice) return;

    // Define new smart feature schedule
    const newFeature = {
      feature_id: selectedDevice.content.length + 2,
      feature: repeatOption,
      label:
        turnOn +
        turnOnPeriod.toLowerCase() +
        " to " +
        turnOff +
        turnOffPeriod.toLowerCase(),
      status: false,
      isUserAdded: true,
    };

    // Update the device's content array to include the new feature
    setDevicesState((prevDevices) =>
      prevDevices.map((device) =>
        device.device_id === deviceId
          ? {
              ...device,
              content: [...device.content, newFeature], // Correct structure
            }
          : device
      )
    );

    handleAddFeatureToggle();
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

  // Function to remove device if swiped
  const handleRemoveDevice = () => {
    if (removeDevice) {
      // Remove the device from the devicesState based on removeDevice's device_id
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

      setIsSwiping(false);
      setSwipedDevice(null);
      setRemoveDevice(null); // Reset after removal
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
              <div className="position-absolute flex-column room-container">
                <div className="container-fluid p-3 pb-2">
                  <div className="row align-items-center mb-2">
                    <div className="col-4 text-start">
                      <h5
                        className="mb-0 ms-3 edit"
                        style={{ color: "#ffffff" }}
                        onClick={handleRoomEdit}
                      >
                        {isRoomEditing ? "Done" : "Edit"}
                      </h5>
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
                      <button
                        className="me-2 btn rounded-circle p-2 d-flex align-items-center justify-content-center add-room-button"
                        onClick={() => setActiveContent("addRoom")}
                        disabled={isRoomEditing}
                      >
                        <FaPlus color="#204160" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="container-fluid overflow-auto room-item-div">
                  <div className="row g-3 pb-5 p-1">
                    {roomsState.map((r, index) => (
                      <div
                        key={index}
                        className="col-6 mt-3 room-item"
                        tabIndex={0} // Makes div focusable for :focus-within effect
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
                            outline: "none",
                          }}
                        >
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
                              <h5 className="room-title">{r.title}</h5>
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
                      <h5
                        className="mb-0 ms-3 fw-semibold"
                        style={{ color: "#204160" }}
                        onClick={handleRoomEdit}
                      >
                        {isRoomEditing ? "Done" : "Edit"}
                      </h5>
                    </div>
                    <div className="col-4 text-center">
                      <h3 className="mb-0 fw-bold" style={{ color: "#404040" }}>
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
