import { FaMinusCircle, FaPlus } from "react-icons/fa";
import LivingRoomImage from "../assets/rooms/livingroom.svg";
import BedRoomImage from "../assets/rooms/bedroom.svg";
import KitchenImage from "../assets/rooms/kitchen.svg";
import GardenImage from "../assets/rooms/garden.svg";
import BathroomImage from "../assets/rooms/bathroom.svg";
import WeatherDisplay from "./WeatherDisplay.tsx";
import LogoNotif from "./LogoNotif.tsx";
import livingRoomIcon from "../assets/addRoomIcon/livingroom.svg";
import bedIcon from "../assets/addRoomIcon/bed.svg";
import kitchenTableIcon from "../assets/addRoomIcon/kitchen-table.svg";
import bathroomIcon from "../assets/addRoomIcon/bathroom.svg";
import gardenIcon from "../assets/addRoomIcon/garden.svg";
import carIcon from "../assets/addRoomIcon/car.svg";
import bookShelfIcon from "../assets/addRoomIcon/bookshelf.svg";
import coatHangerIcon from "../assets/addRoomIcon/coat-hanger.svg";
import { FaTrashAlt } from "react-icons/fa";
import { FaExclamationCircle } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaSync } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import profile1Icon from "../assets/viewDeviceProfile/profile1.svg";
import profile2Icon from "../assets/viewDeviceProfile/profile2.svg";
import "./Switch.css"; // Import the CSS for toggle button
import "./RadioButton.css";
import "./CircleDot.css";
import "./glowingEffect.css";
import "./Alert.css";
import "./SyncButton.css";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import lampIcon from "../assets/devicesSettingIcon/lamp.svg";
import airConditionerIcon from "../assets/devicesSettingIcon/air-conditioner.svg";
import sprinklerIcon from "../assets/devicesSettingIcon/sprinkler.svg";
import petfeederIcon from "../assets/devicesSettingIcon/cooker.svg";
import smartLockIcon from "../assets/devicesSettingIcon/smart-lock.svg";
import fanIcon from "../assets/devicesSettingIcon/fan.svg";
import TVIcon from "../assets/devicesSettingIcon/tv.svg";
import speakerIcon from "../assets/devicesSettingIcon/speaker.svg";
import fridgeIcon from "../assets/devicesSettingIcon/fridge.svg";
import doorBellIcon from "../assets/devicesSettingIcon/door-bell.svg";
import smokeDetectorIcon from "../assets/devicesSettingIcon/smoke-detector.svg";
import robotVacuumIcon from "../assets/devicesSettingIcon/robot-vacuum.svg";
import airCondIcon from "../assets/viewDeviceStatus/aircond3.svg"; //test vercel
import manageLamp from "../assets/manageDevice/light.svg";
import managePetfeeder from "../assets/manageDevice/petfeeder.svg";
import manageAircond from "../assets/manageDevice/aircond2.svg";
import manageIrrigation from "../assets/manageDevice/irrigation.svg";
import bulbOn from "../assets/manageDevice/bulbOn.svg";
import bulbOff from "../assets/manageDevice/bulbOff.svg";
import foodOff from "../assets/manageDevice/petFoodOff.svg";
import foodOn from "../assets/manageDevice/petFoodOn.svg";
import irrigationOff from "../assets/manageDevice/irrigationOff.svg";
import irrigationOn from "../assets/manageDevice/irrigationOn.svg";
import airConditionerOff from "../assets/manageDevice/airConditionerOff.svg";
import airConditionerOn from "../assets/manageDevice/airConditionerOn.svg";

// homepage
const HomePage: React.FC = () => {
  const addDevice: Device[] = [
    {
      device_id: 0,
      room_id: 0,
      image: airCondIcon,
      title: "Pet Feeder 02134",
      deviceType: "petfeeder",
      status: false,
      swiped: false,
      devData: {
        iconImage: managePetfeeder,
        percentage: 60,
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
      title: "Air Conditioner 31837",
      deviceType: "aircond",
      status: false,
      swiped: false,
      devData: {
        iconImage: manageAircond,
        percentage: 20,
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
    {
      device_id: 2,
      room_id: 1,
      image: lampIcon,
      title: "Lights 1221",
      deviceType: "light",
      status: false,
      swiped: false,
      devData: {
        iconImage: manageLamp,
        percentage: 40,
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
  ];

  // Icons array to manage the 8 icons
  const icons = [
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

  // Handle button click to set active content
  const handleButtonClick = (content: string) => {
    if (content === "viewDeviceStatus") {
      setConnectDevice(false); // Reset connectDevice when navigating back
    }
    setActiveContent(content); // Set the content based on the clicked button
  };

  const rooms = [
    { id: 0, image: LivingRoomImage, title: "Living Room", devices: 1 },
    { id: 1, image: BedRoomImage, title: "Bedroom", devices: 3 },
    { id: 2, image: KitchenImage, title: "Kitchen", devices: 0 },
    { id: 3, image: GardenImage, title: "Garden", devices: 1 },
    { id: 4, image: BathroomImage, title: "Bathroom", devices: 5 },
  ];

  const [room, setRoom] = useState<{
    id: number;
    image: string;
    title: string;
    devices: number;
  }>({
    id: 0,
    image: LivingRoomImage,
    title: "Default",
    devices: 0,
  });

  const devices = [
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
        percentage: 0,
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
        iconImage: manageAircond,
        percentage: 20,
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
        iconImage: manageLamp,
        percentage: 60,
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
        iconImage: manageIrrigation,
        percentage: 80,
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
        iconImage: manageAircond,
        percentage: 100,
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
        percentage: 20,
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
        percentage: 40,
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
        percentage: 60,
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
  ];

  type Device = {
    device_id: number;
    room_id: number;
    title: string;
    image: string;
    deviceType: string;
    status: boolean;
    swiped: boolean;
    devData: {
      iconImage: string;
      percentage: number;
    };
    content: {
      feature: string;
      smartFeature: string;
      toggle1: boolean;
      featurePeriod: string;
      featureDetail: string;
      toggle2: boolean;
    };
  };

  const [device, setDevice] = useState<Device>({
    device_id: 0,
    room_id: 0,
    title: "Default",
    image: LivingRoomImage,
    deviceType: "light",
    status: false,
    swiped: false,
    devData: {
      iconImage: manageLamp,
      percentage: 80,
    },
    content: {
      feature: "Auto Lighting",
      smartFeature: "Infrared Detection",
      toggle1: false,
      featurePeriod: "Daily",
      featureDetail: "8:00pm to 7:00am",
      toggle2: false,
    },
  });

  const [devType, setDevType] = useState<string | null>(null);

  const handleSelectDevice = (selectedDevice: Device) => {
    setDevType(selectedDevice.deviceType);
    setDevice(selectedDevice);
    setActiveContent("manageDevice");
  };

  // State to store the swipe status for each device
  const [swipedDevice, setSwipedDevice] = useState<{
    [deviceId: number]: boolean;
  }>({});

  // Function to get selected device
  const getDevice = () => {
    return device;
  };

  // Function to get the selected room
  const getRoom = () => {
    return room;
  };

  // To access or update a device's state, copy from 'devices'
  const [devicesState, setDevicesState] = useState(devices);

  // const getSelectedDeviceStatus = (roomId: number, deviceId: number) => {
  //   // Use find instead of filter to return the device directly
  //   const device = devicesState.find(
  //     (dev) => dev.room_id === roomId && dev.device_id === deviceId
  //   );
  //   return device ? device.status : false; // Return the status, or false if the device is not found
  // };

  const getSelectedDeviceStatus = (roomId: number, deviceId: number) => {
    const device = devicesMap.get(roomId)?.get(deviceId);
    return device ? device.status : false;
  };

  const handleToggle = (roomId: number, deviceId: number) => {
    setDevicesState((prevDevicesState) =>
      prevDevicesState.map(
        (dev) =>
          dev.room_id === roomId && dev.device_id === deviceId
            ? { ...dev, status: !dev.status } // Toggle the status of the specific device
            : dev // Leave other devices unchanged
      )
    );
  };

  const [roomsState, setRoomsState] = useState(rooms);

  const [startX, setStartX] = useState(0);

  // State to store the currently selected/swiped device to remove
  const [removeDevice, setRemoveDevice] = useState<Device | null>(null);

  // Function to remove device if swiped
  const handleRemoveDevice = () => {
    //console.log("Removing device:", removeDevice);
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

      setRemoveDevice(null); // Reset after removal
    }
  };

  // Handle touch start (when swiping begins)
  const handleTouchStart = (e: React.TouchEvent, device: Device) => {
    setRemoveDevice(device); // Store device for removal
    setSwipedDevice(device); // Store the device being swiped
    setStartX(e.touches[0].clientX); // Store the initial touch position
  };

  // Handle touch move (during swiping)
  const handleTouchMove = (e: React.TouchEvent, deviceId: number) => {
    if (!swipedDevice) return; // Prevent move if no device is swiped

    const currentX = e.touches[0].clientX; // Get the current touch position
    const deltaX = currentX - startX; // Calculate the change in position

    // Update the swipe state based on deltaX
    if (deltaX < -50) {
      // If swiped to the left
      setSwipedDevice((prev) => ({
        ...prev,
        [deviceId]: true, // swiped
      }));
    } else if (deltaX > 50) {
      // If swiped to the right
      setSwipedDevice((prev) => ({
        ...prev,
        [deviceId]: false, // not swiped
      }));
    }

    // After updating the swipe state, also update the devices array
    setDevicesState((prevDevicesState) =>
      prevDevicesState.map((device) =>
        device.device_id === deviceId
          ? { ...device, swiped: swipedDevice[deviceId] } // Update the 'swiped' property
          : device
      )
    );
  };

  // State to manage the active content
  const [activeContent, setActiveContent] = useState<string | null>("home");

  // Icons array to manage the 8 icons
  const addRoomIcons = [
    { image: livingRoomIcon, title: "Living Room" },
    { image: bedIcon, title: "Bed" },
    { image: kitchenTableIcon, title: "Kitchen Table" },
    { image: bathroomIcon, title: "Bathroom" },
    { image: gardenIcon, title: "Garden" },
    { image: carIcon, title: "Car" },
    { image: bookShelfIcon, title: "BookShelf" },
    { image: coatHangerIcon, title: "Coat Hanger" },
  ];

  // State to track the selected icon
  const [selectedIcon, setSelectedIcon] = useState<{
    image: string; // Assuming image is a string (URL or image path)
    title: string;
  } | null>(null);

  // Handle click on an icon
  const handleIconClick = (icon: { image: string; title: string }) => {
    setSelectedIcon(icon);
  };

  // State to track the room name input
  const [roomName, setRoomName] = useState<string | null>(null);
  const [devName, setDevName] = useState<string | null>(null);

  const [roomNameAlert, setRoomNameAlert] = useState(false);
  const [iconAlert, setIconAlert] = useState(false);
  const [devNameAlert, setDevNameAlert] = useState(false);

  const handleAddRoom = () => {
    if (selectedIcon === null && !roomName?.trim()) {
      setRoomNameAlert(true);
      setIconAlert(true);
      return;
    }

    if (!roomName?.trim()) {
      setRoomNameAlert(true);
      return;
    }

    if (selectedIcon === null) {
      setIconAlert(true);
      return;
    }

    // new room
    const newRoom = {
      id: roomsState.length + 1,
      image: selectedIcon.image,
      title: roomName,
      devices: 0,
    };

    // Add new room to the rooms list
    setRoomsState((prevRooms) => [...prevRooms, newRoom]);
    // Update the room's devices count in roomsState

    setRoomName(null); // Reset the room name input
    setSelectedIcon(null); // Reset selected icon
    setRoomNameAlert(false); // Reset room Alert to false state
    setIconAlert(false); // Reset icon alert to false state

    // Navigate back to home page
    setActiveContent("home");
  };

  const handleBackToHomePage = () => {
    setActiveContent("home");
    // to ensure the flow of homepage when navigate back
    setRoomNameAlert(false);
    setIconAlert(false);
    setSelectedIcon(null);
    setRoomName(null);
  };

  const handleBackToAddDevice = () => {
    setActiveContent("addDevice");
    // to ensure the flow of homepage when navigate back
    setDevNameAlert(false);
    setIconAlert(false);
    setSelectedIcon(null);
    setDevName(null);
  };

  const handleRoomClick = (selectedRoom: {
    id: number;
    title: string;
    image: string;
    devices: number;
  }) => {
    setRoom(selectedRoom); // Set the selected room data
    setActiveContent("viewDeviceStatus"); // Switch to the viewDeviceStatus view
  };

  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode or exit mode
  const [tempTitle, setTempTitle] = useState(getRoom().title); // Temporary title during editing

  const [editingType, setEditingType] = useState(""); // "room" or "device"

  const handleEditRoomClick = () => {
    setIsEditing(true); // Open the edit modal
    setEditingType("room"); // Set to "room" when editing a room
    setTempTitle(getRoom().title); // Set temp title to the current room title
  };

  const handleEditDeviceClick = () => {
    setIsEditing(true); // Open the edit modal
    setEditingType("device"); // Set to "device" when editing a device
    setTempTitle(getDevice().title); // Set temp title to the current device title
  };

  const handleConfirm = () => {
    if (editingType === "room") {
      // Update the room title
      const updatedRoomTitle = roomsState.map((r) => {
        if (r.id === getRoom().id) {
          return { ...r, title: tempTitle }; // Update room title
        }
        return r;
      });
      setRoomsState(updatedRoomTitle); // Update the state with the new title for the room

      setRoom((prevRoom) => ({
        ...prevRoom,
        title: tempTitle, // Update the room title
      }));
    } else if (editingType === "device") {
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
    }

    setIsEditing(false); // Exit edit mode after confirming
  };

  const handleCancel = () => {
    if (editingType === "room") {
      setTempTitle(getRoom().title); // Reset temp title to the original room title
    } else if (editingType === "device") {
      setTempTitle(getDevice().title); // Reset temp title to the original device title
    }
    setIsEditing(false); // Exit edit mode
  };

  // If devicesState doesn't change, devicesMap is reused from the previous render
  const devicesMap = useMemo(() => {
    const map = new Map(); // Initialize a new Map to store devices by room_id and device_id.
    devicesState.forEach((device) => {
      if (!map.has(device.room_id)) {
        map.set(device.room_id, new Map()); // Create a nested Map for devices in a room if it doesn't exist.
      }
      map.get(device.room_id).set(device.device_id, device); // Add the device to the nested Map using device_id as the key.
    });
    return map; // Return the populated Map.
  }, [devicesState]); // Recompute the Map only when devicesState changes.

  // const getSelectedDeviceToggle = (
  //   roomId: number,
  //   deviceId: number,
  //   toggleKey: "toggle1" | "toggle2"
  // ) => {
  //   const device = devicesState.find(
  //     (dev) => dev.room_id === roomId && dev.device_id === deviceId
  //   );
  //   return device ? device.content[toggleKey] : false; // Return the toggle status, or false if the device is not found
  // };

  const getSelectedDeviceToggle = (
    roomId: number,
    deviceId: number,
    toggleKey: "toggle1" | "toggle2"
  ) => {
    const device = devicesMap.get(roomId)?.get(deviceId); // Perform a fast lookup for the device using roomId and deviceId.
    return device ? device.content[toggleKey] : false; // Return the toggle value or false if the device is not found.
  };

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

  // Static small circles positions (percentage values)
  const smallCircles = [14, 25.8, 37.6, 49.4, 61.2, 73];

  // Create a position map
  const positionMap = (perct: number) => {
    const index = Math.min(Math.floor(perct / 20), smallCircles.length - 1); // Mapping to index of small circles
    return smallCircles[index];
  };

  const [circlePosition, setCirclePosition] = useState(
    positionMap(getDevice().devData.percentage)
  ); // Default position (start of progress bar

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
      const moveX = e.touches[0].clientX - startXCircle;

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

  // // Add event listeners when dragging starts
  // useEffect(() => {
  //   if (dragging) {
  //     window.addEventListener("touchstart", handleTouchStartCircle);
  //     window.addEventListener("touchmove", handleTouchMoveCircle);
  //     window.addEventListener("touchend", handleTouchEndCircle);
  //   }

  //   // Cleanup event listener
  //   return () => {
  //     window.removeEventListener("touchstart", handleTouchStartCircle);
  //     window.removeEventListener("touchmove", handleTouchMoveCircle);
  //     window.removeEventListener("touchend", handleTouchEndCircle);
  //   };
  // }, [dragging]);

  // State to store selected device
  const [addSelectDevice, setAddSelectDevice] = useState<Device | null>(null);

  // Handle device selection
  const handleDeviceSelect = (device: Device) => {
    setAddSelectDevice(device); // Set selected device
  };

  const [connectDevice, setConnectDevice] = useState(false);

  const handleConnectClick = (activeContent: string) => {
    if (!addSelectDevice) {
      // Show error message if no device is selected
      setConnectDevice(true);
    } else {
      handleButtonClick(activeContent); // Change the active content to device settings
    }
  };

  const handleAddDevice = () => {
    if (!addSelectDevice) {
      // Handle case if no device is selected
      return;
    }

    if (selectedIcon === null && !devName?.trim()) {
      setDevNameAlert(true);
      setIconAlert(true);
      return;
    }

    if (!devName?.trim()) {
      setDevNameAlert(true);
      return;
    }

    if (selectedIcon === null) {
      setIconAlert(true);
      return;
    }

    // Calculate the next device_id
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
    setSelectedIcon(null); // Reset selected icon
    setDevNameAlert(false); // Reset dev Alert to false state
    setIconAlert(false); // Reset icon alert to false state

    // Update the devicesState with the new device
    setDevicesState(updatedDevicesState);
    // Navigate back to view device status page
    setActiveContent("viewDeviceStatus");
  };

  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpinClick = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 2000);
  };

  const [isRoomEditing, setRoomEditing] = useState(false); // To track if in edit mode

  // Toggle edit mode
  const handleRoomEdit = () => {
    setRoomEditing((prev) => !prev); // Toggle edit mode
  };

  const handleRemoveRoom = (roomId: number, e: React.MouseEvent) => {
    // Stop the event propagation to prevent triggering the parent click
    e.stopPropagation();
    // Remove room by filtering out the room with the specified ID
    const updatedRooms = roomsState.filter((room) => room.id !== roomId);
    setRoomsState(updatedRooms); // Update the state with the remaining rooms
  };

  const [addFeature, setAddFeature] = useState(false);

  const handleAddFeature = () => {
    setAddFeature((prev) => !prev);
  };

  const currentDevice = devicesState.find(
    (device) => device.device_id === getDevice().device_id
  );

  useEffect(() => {
    if (currentDevice) {
      setDevice(currentDevice);
    }
  }, [devicesState]);

  type Day = { name: string; letter: string };

  const days = [
    { name: "Monday", letter: "M" },
    { name: "Tuesday", letter: "T" },
    { name: "Wednesday", letter: "W" },
    { name: "Thursday", letter: "T" },
    { name: "Friday", letter: "F" },
    { name: "Saturday", letter: "S" },
    { name: "Sunday", letter: "S" },
  ];

  const [activeDay, setActiveDay] = useState<Day | null>(null);

  const handleDayClick = (day: { name: string; letter: string }) => {
    setActiveDay(day);
  };

  const getIntensityIcon = (
    deviceType: string
  ): { on: string; off: string } => {
    const iconMap: { [key: string]: { on: string; off: string } } = {
      petfeeder: {
        on: foodOff,
        off: foodOn,
      },
      aircond: {
        on: airConditionerOn,
        off: airConditionerOff,
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

  const getUnitLabel = (deviceType: string): string => {
    switch (deviceType) {
      case "irrigation":
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

  // effect to updates changes
  useEffect(() => {
    console.log("Updated devicesState:", devicesState);
  }, [devicesState]);
  useEffect(() => {
    console.log("Updated roomsState:", roomsState);
  }, [roomsState]);

  return (
    <>
      {/* Render content based on activeContent state */}
      {activeContent === "home" ? (
        <>
          <LogoNotif />
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
                    }}
                    onClick={() => handleButtonClick("addRoom")}
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
                            onClick={(e) => handleRemoveRoom(r.id, e)}
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
      ) : activeContent === "addRoom" ? (
        <>
          <LogoNotif />
          <WeatherDisplay />
          <div
            className="bg-white position-fixed start-50 translate-middle-x w-100 overflow-auto"
            style={{
              top: "27%",
              height: "calc(100% - 30%)",
              borderRadius: "18px",
            }}
          >
            <div
              onClick={handleBackToHomePage}
              style={{ width: "65px", height: "30px", cursor: "pointer" }}
              className="ms-3 mt-3"
            >
              <IoIosArrowBack size={22} color="#204160" />
              <span
                style={{
                  marginLeft: "2px",
                  color: "#204160",
                }}
              >
                Back
              </span>
            </div>
            <div className="pb-2 p-3" style={{ width: "100vw" }}>
              <div className="text-left pb-3 container-fluid">
                <h3 className="mb-0 fw-bold" style={{ color: "#204160" }}>
                  Room Settings
                </h3>
              </div>
              <div className="container-fluid">
                <p
                  className="mb-3 fw-normal"
                  style={{ color: "#204160", fontSize: "18px" }}
                >
                  Name:
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "80vw",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Enter a name for your room"
                      style={{
                        backgroundColor: "#eeeeee",
                        borderRadius: "10px",
                        width: "80vw",
                        height: "40px",
                        boxShadow: "inset 3px 3px 2px rgba(0, 0, 0, 0.1)",
                        textAlign: "left",
                        paddingLeft: "15px",
                        fontSize: "17px",
                        border: "2px solid",
                        borderColor:
                          !roomName && roomNameAlert ? "red" : "#eeeeee",
                      }}
                      onChange={(e) => setRoomName(e.target.value)}
                    />
                    {roomNameAlert && !roomName && (
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
              <div className="pt-3 pb-2 container-fluid">
                <span
                  className="mb-3 fw-normal"
                  style={{ color: "#204160", fontSize: "18px" }}
                >
                  Icon:
                </span>
                <div>
                  <div className="d-flex flex-wrap justify-content-start">
                    {addRoomIcons.map((i, index) => (
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
                              selectedIcon?.title === i.title
                                ? "#d9d9d9"
                                : "#f5f5f5",
                            borderRadius: "50%",
                            maxWidth: "calc(100% - 20%)",
                            maxHeight: "calc(100% - 20%)",
                          }}
                          onClick={() => handleIconClick(i)}
                        >
                          <img
                            src={i.image}
                            alt={i.title}
                            className="img-fluid"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {!selectedIcon && iconAlert ? (
                    <div
                      className="p-1"
                      style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <span style={{ color: "red", fontSize: "15px" }}>
                        Please select a room type!
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "calc(100% - 90%)",
                  }}
                >
                  <button
                    className="btn p-2 px-5"
                    style={{
                      backgroundColor: "#204160",
                      color: "white",
                      borderRadius: "12px",
                      cursor: "pointer",
                      margin: "30px auto",
                    }}
                    onClick={handleAddRoom}
                  >
                    <h6>Save</h6>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : activeContent === "viewDeviceStatus" ? (
        <div>
          {/* Container for Back Button and Title */}
          <div style={{ position: "relative", top: "60px" }}>
            {/* Back Button */}
            <div
              onClick={handleBackToHomePage}
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
                {getRoom().title}
              </h3>
              {/* Edit Icon */}
              <FaPen
                className="mb-1"
                size={15}
                color="white"
                onClick={(e) => {
                  if (swipedDevice[getDevice().device_id]) {
                    e.stopPropagation(); // Prevent device selection in swipe mode
                  } else {
                    handleEditRoomClick(); // Proceed to select the device if not swiped
                  }
                }}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          {/* White container */}
          <div
            className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column"
            style={{
              top: "13%",
              height: "100%",
              borderRadius: "18px",
            }}
          >
            <div className="d-flex justify-content-between p-4">
              <div
                className="text-start"
                onClick={(e) => {
                  if (swipedDevice[getDevice().device_id]) {
                    e.stopPropagation(); // Prevent device selection in swipe mode
                  } else {
                    handleButtonClick("viewCollaborators"); // Proceed to select the device if not swiped
                  }
                }}
              >
                <img src={profile1Icon} className="img-fluid mb-1 pe-2" />
                <img src={profile2Icon} className="img-fluid mb-1" />
                <IoIosArrowForward size={22} color="#748188" />
              </div>
              <div className="text-end d-flex justify-content-end">
                <button
                  className="me-2 btn rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "#204160",
                    width: "30px",
                    height: "30px",
                  }}
                  onClick={(e) => {
                    if (swipedDevice[getDevice().device_id]) {
                      e.stopPropagation(); // Prevent device selection in swipe mode
                    } else {
                      handleButtonClick("addDevice"); // Proceed to select the device if not swiped
                    }
                  }}
                >
                  <FaPlus color="white" />
                </button>
              </div>
            </div>

            {/* Devices */}
            <div
              className="d-flex flex-column overflow-auto"
              style={{ height: "calc(100% - 260px)" }}
            >
              {/* Render devices for the selected room */}
              {getRoom() !== null && roomsState[getRoom().id] && (
                <div key={getRoom().id}>
                  {roomsState[getRoom().id].devices > 0 ? (
                    // Filter devices for the current room and map over them
                    devicesState
                      .filter((device) => device.room_id === getRoom().id)
                      .map((device) => (
                        <div
                          key={device.device_id}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100vw",
                          }}
                        >
                          <div
                            className="p-3 mb-4 d-flex justify-content-between"
                            style={{
                              backgroundColor: "#f5f5f5",
                              borderRadius: "16px",
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                              width: "calc(100% - 15%)",
                              height: "76px",
                              transition: "transform 0.3s ease",
                              transform: swipedDevice[device.device_id]
                                ? "translateX(-50px)"
                                : "translateX(0)",
                            }}
                            onTouchStart={(e) => handleTouchStart(e, device)}
                            onTouchMove={(e) =>
                              handleTouchMove(e, device.device_id)
                            }
                            onClick={() => handleSelectDevice(device)}
                          >
                            <div className="d-flex align-items-center">
                              <img src={device.image} className="img-fluid" />
                              <span className="ms-3">{device.title}</span>
                            </div>
                            <div
                              className="text-end d-flex align-items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={getSelectedDeviceStatus(
                                    getRoom().id,
                                    device.device_id
                                  )} // Access the state for the specific device
                                  onChange={() => {
                                    handleToggle(
                                      getRoom().id,
                                      device.device_id
                                    ); // Toggle state for the specific device
                                  }}
                                />
                                <span className="slider round"></span>
                                <span className="on-text">ON</span>
                                <span className="off-text">OFF</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            {swipedDevice[device.device_id] && (
                              <button
                                style={{
                                  backgroundColor: "red",
                                  padding: "10px",
                                  display: "flex",
                                  borderRadius: "50%",
                                  border: "none",
                                  transform: "translate(-50%, -30%)",
                                }}
                              >
                                <FaTrashAlt
                                  color="white"
                                  size={18}
                                  onClick={handleRemoveDevice}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p></p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeContent === "addDevice" ? (
        <div>
          {/* Container for Back Button and Title, button */}
          <div
            className="d-flex justify-content-between"
            style={{ width: "100%", position: "relative", top: "60px" }}
          >
            {/* Back Button */}
            <div
              onClick={() => handleButtonClick("viewDeviceStatus")}
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
            <div className="d-flex col-12 justify-content-center text-center">
              {/* Display the title normally when not in edit mode */}
              <h3
                className="fw-bold"
                style={{ color: "#FFFFFF", fontSize: "1.5rem" }}
              >
                Add Device
              </h3>
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
                className="btn p-2 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "white",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                  borderRadius: "8px",
                }}
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
          <div
            className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column overflow-auto"
            style={{
              top: "13%",
              height: "100%",
              borderRadius: "18px",
            }}
          >
            {addDevice.map((device, index) => (
              <div
                key={index}
                style={{ marginTop: index === 0 ? "30px" : "0" }}
              >
                <div className="d-flex justify-content-between">
                  <div
                    className="col-8"
                    style={{
                      marginLeft: "calc(100% - 90%)",
                      fontSize: "18px",
                    }}
                  >
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
            <div
              style={{
                display: "flex",
                height: "calc(100% - 50%)",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
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
                  className="btn p-2 px-5"
                  style={{
                    backgroundColor: "#204160",
                    color: "white",
                    borderRadius: "12px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleConnectClick("deviceSetting")}
                >
                  <h6>Connect</h6>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : activeContent === "deviceSetting" ? (
        <div>
          {/* Container for Back Button and Title, button */}
          <div
            className="d-flex justify-content-between"
            style={{ width: "100%", position: "relative", top: "60px" }}
          >
            {/* Back Button */}
            <div
              onClick={handleBackToAddDevice}
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
            <div className="d-flex col-12 justify-content-center text-center">
              {/* Display the title normally when not in edit mode */}
              <h3
                className="fw-bold"
                style={{ color: "#FFFFFF", fontSize: "1.5rem" }}
              >
                Device Settings
              </h3>
            </div>
          </div>

          {/* White container */}
          <div
            className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column overflow-auto"
            style={{
              top: "13%",
              height: "100%",
              borderRadius: "18px",
            }}
          >
            <div className="pb-2 p-3" style={{ width: "100vw" }}>
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
                      width: "80vw",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Enter a name for your device"
                      style={{
                        backgroundColor: "#eeeeee",
                        borderRadius: "10px",
                        width: "80vw",
                        height: "40px",
                        boxShadow: "inset 3px 3px 2px rgba(0, 0, 0, 0.1)",
                        textAlign: "left",
                        paddingLeft: "15px",
                        fontSize: "17px",
                        border: "2px solid",
                        borderColor:
                          !devName && devNameAlert ? "red" : "#eeeeee",
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
                              selectedIcon?.title === icon.title
                                ? "#d9d9d9"
                                : "#f5f5f5",
                            borderRadius: "50%",
                            maxWidth: "calc(100% - 20%)",
                            maxHeight: "calc(100% - 20%)",
                          }}
                          onClick={() => handleIconClick(icon)}
                        >
                          <img
                            src={icon.image}
                            alt={icon.title}
                            className="img-fluid"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {!selectedIcon && iconAlert ? (
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
              <div
                style={{
                  display: "flex",
                  height: "calc(100% - 50%)",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
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
      ) : activeContent === "manageDevice" ? (
        <>
          {/* Purple Container */}
          {devType === "light" || "aircond" || "petfeeder" || "irrigation" ? (
            <>
              <div style={{ position: "relative", top: "60px" }}>
                {/* Back Button */}
                <div
                  onClick={() => handleButtonClick("viewDeviceStatus")}
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
                        {getDevice().devData.percentage}
                      </b>
                      {getDevice().deviceType === "aircond" ? (
                        <b style={{ fontSize: "30px", color: "white" }}>°C</b>
                      ) : (
                        <b style={{ fontSize: "30px", color: "white" }}>%</b>
                      )}
                      <p
                        className="text-start"
                        style={{
                          fontSize: "20px",
                          color: "white",
                        }}
                      >
                        {getUnitLabel(getDevice().deviceType)}
                      </p>
                    </div>
                    <div className="text-start pt-2">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={getSelectedDeviceStatus(
                            getRoom().id,
                            device.device_id
                          )} // Access the state for the specific device
                          onChange={() => {
                            handleToggle(getRoom().id, device.device_id); // Toggle state for the specific device
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
                      ></div>
                    ))}

                    {/* Draggable Big Circle */}
                    <div
                      className="big_circle"
                      style={{
                        left: `${circlePosition + 3.5}%`,
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
              </div>
              {/* White container */}
              <div
                className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column overflow-auto"
                style={{
                  top: "50%",
                  height: "100%",
                  borderRadius: "18px",
                }}
              >
                <div className="d-flex justify-content-between p-4">
                  <div className="text-start">
                    <h3 className="mb-0 fw-bold" style={{ color: "#204160" }}>
                      Smart Features
                    </h3>
                  </div>
                  <div className="text-end d-flex justify-content-end">
                    <button
                      className="me-2 btn rounded-circle p-2 d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: "#204160",
                        width: "30px",
                        height: "30px",
                      }}
                      onClick={handleAddFeature}
                    >
                      {addFeature ? (
                        <div
                          style={{
                            backgroundColor: "#204160",
                            color: "#ffffff",
                            padding: "8px 12px",
                            borderRadius: "20px",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                            fontWeight: "600",
                          }}
                        >
                          Done
                        </div>
                      ) : (
                        <FaPlus color="white" />
                      )}
                    </button>
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
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
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
                              fontFamily: "'Montagu Slab', serif",
                              border: "1px solid #204160",
                            }}
                            onClick={() => handleDayClick(day)}
                          >
                            {day.letter}
                          </button>
                        ))}
                      </div>
                      {/* Border Container */}
                      <div style={{ fontFamily: "'Montagu Slab', serif" }}>
                        <div className="border border-3 d-flex justify-content-start">
                          <span className="fw-bold">Turn On:</span>
                          <div
                            className="ms-2 d-flex justify-content-center"
                            style={{
                              borderRadius: "5px",
                              width: "60px",
                              backgroundColor: "#ffffff",
                              border: "1px solid #979797",
                            }}
                          >
                            <span>08:20</span>
                          </div>
                        </div>
                        <div className="border border-3 d-flex justify-content-start">
                          <span className="fw-bold">Turn Off:</span>
                          <div
                            className="ms-2 d-flex justify-content-center"
                            style={{
                              borderRadius: "5px",
                              width: "60px",
                              backgroundColor: "#ffffff",
                              border: "1px solid #979797",
                            }}
                          >
                            <span>11:20</span>
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
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
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
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
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
        </>
      ) : activeContent === "viewCollaborators" ? (
        <>
          <div style={{ position: "relative", top: "60px" }}>
            {/* Back Button */}
            <div
              onClick={() => handleButtonClick("viewDeviceStatus")}
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
                Collaborators
              </h3>
            </div>
          </div>

          {/* White container  */}
          <div
            className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column"
            style={{
              top: "13%",
              height: "100%",
              borderRadius: "18px",
            }}
          >
            {/* Total collaborators */}
            <div className="d-flex justify-content-between p-4">
              <div className="d-flex align-items-center justify-content-center">
                <h5 style={{ color: "#404040", margin: "0" }}>Total&nbsp;</h5>
                <span
                  className="px-2 fw-semibold"
                  style={{
                    backgroundColor: "#4c7380",
                    borderRadius: "4px",
                    color: "#f9fbfb",
                  }}
                >
                  3
                </span>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Edit Title */}
      {isEditing && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "200",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              height: "160px",
              textAlign: "center",
            }}
          >
            <h4 style={{ color: "#000000", fontSize: "20px" }}>
              Edit {editingType === "room" ? "Room" : "Device"} Title
            </h4>
            <input
              className="mb-3"
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "8px",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                color: "#000000",
                backgroundColor: "#eeeeee",
                boxShadow: "inset 4px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />

            <div
              style={{
                borderTop: "1px solid #979797",
                width: "100%",
              }}
            ></div>
            <div className="p-1 d-flex justify-content-around">
              <button
                onClick={handleConfirm}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#4285f4",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "650",
                  width: "49vw",
                  fontSize: "18px",
                }}
              >
                Confirm
              </button>
              <div
                style={{
                  borderLeft: "1px solid #979797",
                  height: "40px",
                }}
              ></div>
              <button
                onClick={handleCancel}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#f34235",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "650",
                  width: "49vw",
                  fontSize: "18px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Room Display */}
      {false && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "200",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              height: "160px",
              textAlign: "center",
            }}
          >
            <h4 style={{ color: "#000000", fontSize: "20px" }}>
              Remove {editingType === "room" ? "Room" : "Device"}
            </h4>
            <div className="pb-2">
              <span
                style={{
                  fontSize: "15px",
                  color: "#000000",
                }}
              >
                Are you sure you want to remove this{" "}
                {editingType === "room" ? "Room" : "Device"}?
              </span>
            </div>
            <div
              style={{
                borderTop: "1px solid #979797",
                width: "100%",
              }}
            ></div>
            <div className="p-1 d-flex justify-content-around">
              <button
                //onClick={handleConfirm}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#4285f4",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "650",
                  width: "49vw",
                  fontSize: "18px",
                }}
              >
                Cancel
              </button>
              <div
                style={{
                  borderLeft: "1px solid #979797",
                  height: "40px",
                }}
              ></div>
              <button
                //onClick={handleCancel}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#f34235",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "650",
                  width: "49vw",
                  fontSize: "18px",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
