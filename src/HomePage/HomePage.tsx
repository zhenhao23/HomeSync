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
// import airConditionerOff from "../assets/manageDevice/airConditionerOff.svg";
// import airConditionerOn from "../assets/manageDevice/airConditionerOn.svg";
import collaboratorIcon from "../assets/collaborators/collaboratorProfile.svg";
import AddRoom from "./AddRoom.tsx";
import ViewDeviceStatus from "./ViewDeviceStatus.tsx";
import AddDevice from "./AddDevice.tsx";
import DeviceSetting from "./DeviceSetting.tsx";
import ManageDevice from "./ManageDevice.tsx";
import ViewCollaborator from "./ViewCollaborator.tsx";
import EditTitleModal from "./EditTitleModal.tsx";
import RemoveRoomModal from "./RemoveRoomModal.tsx";
import EditTimeModal from "./EditTimeModal.tsx";
import RemoveCollabModal from "./RemoveCollabModal.tsx";

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
    iconImage: string;
    percentage: number;
    celsius: number;
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

export interface roomIcon {
  image: string;
  title: string;
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

// Homepage component definition
const HomePage: React.FC = () => {
  // Predefined devices for adding
  const addDevice: Device[] = [
    {
      device_id: 0,
      room_id: 0,
      image: petfeederIcon,
      title: "Pet Feeder 02134",
      deviceType: "petfeeder",
      status: false,
      swiped: false,
      devData: {
        iconImage: managePetfeeder,
        percentage: 60,
        celsius: 0,
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
        percentage: 0,
        celsius: 24,
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
        celsius: 0,
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

  // Handle button click to set active content
  const handleButtonClick = (content: string) => {
    if (content === "viewDeviceStatus") {
      setConnectDevice(false); // Reset connectDevice when navigating back
    }
    setActiveContent(content); // Set the content based on the clicked button
  };

  // Predefined room array
  const rooms: Room[] = [
    { id: 0, image: LivingRoomImage, title: "Living Room", devices: 1 },
    { id: 1, image: BedRoomImage, title: "Bedroom", devices: 3 },
    { id: 2, image: KitchenImage, title: "Kitchen", devices: 0 },
    { id: 3, image: GardenImage, title: "Garden", devices: 1 },
    { id: 4, image: BathroomImage, title: "Bathroom", devices: 5 },
  ];

  // state to keep track changes in Room
  const [room, setRoom] = useState<Room>({
    id: 0,
    image: LivingRoomImage,
    title: "Default",
    devices: 0,
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
        percentage: 0,
        celsius: 0,
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
        percentage: 0,
        celsius: 30,
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
        celsius: 0,
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
        celsius: 0,
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
        celsius: 0,
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
        percentage: 0,
        celsius: 16,
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
        celsius: 18,
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
        percentage: 0,
        celsius: 20,
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
        percentage: 0,
        celsius: 25,
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
        percentage: 0,
        celsius: 28,
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

  // Predefined collaborator array
  const collaborators: Collaborator[] = [
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

  // state to keep track the current device to display when user click on specific device in a room
  const [device, setDevice] = useState<Device>({
    // default value to a set device
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
      celsius: 0,
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

  // state to keep track the current selected device type
  const [devType, setDevType] = useState<string | null>(null);

  // Function to select the device selected by user
  const handleSelectDevice = (selectedDevice: Device) => {
    setDevType(selectedDevice.deviceType);
    setDevice(selectedDevice);
    setActiveContent("manageDevice");
  };

  // State to store the swipe status for each device
  const [swipedDevice, setSwipedDevice] = useState<{
    [deviceId: number]: boolean;
  }>({});

  // state to store swipe status for each collaborator
  const [swipedCollab, setSwipedCollab] = useState<{
    [collabId: number]: boolean;
  }>({});

  // Function to get selected device
  const getDevice = () => {
    return device;
  };

  // Function to get the selected room
  const getRoom = () => {
    return room;
  };

  // state to track the device's state from devices array
  const [devicesState, setDevicesState] = useState(devices);
  // state to track the collaborator's state from collaborators array
  const [collabState, setCollabState] = useState(collaborators);

  // const getSelectedDeviceStatus = (roomId: number, deviceId: number) => {
  //   // Use find instead of filter to return the device directly
  //   const device = devicesState.find(
  //     (dev) => dev.room_id === roomId && dev.device_id === deviceId
  //   );
  //   return device ? device.status : false; // Return the status, or false if the device is not found
  // };

  // function to get the current selected device status attribute (button on/off)
  const getSelectedDeviceStatus = (roomId: number, deviceId: number) => {
    const device = devicesMap.get(roomId)?.get(deviceId);
    return device ? device.status : false;
  };

  // Function to handle the toggle of a device's status in a room (button on/off)
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

  // state to track the room's state from rooms array
  const [roomsState, setRoomsState] = useState(rooms);

  // state to track the startX position when user swipe
  const [startX, setStartX] = useState(0);

  // State to track the currently selected/swiped device to remove
  const [removeDevice, setRemoveDevice] = useState<Device | null>(null);
  // State to track the currently selected/swiped collaborator to remove
  const [removeCollab, setRemoveCollab] = useState<Collaborator | null>(null);

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

  // Function to remove collaborator from the CollabState
  const handleRemoveCollab = (collab: Collaborator) => {
    setRemoveCollab(collab); // Set the collaborator to be removed

    if (removeCollab) {
      // Remove the collaborator from the collaborators list based on the collaborator's id
      setCollabState((prevCollaborators) =>
        prevCollaborators.filter((collab) => collab.id !== removeCollab.id)
      );

      setRemoveCollab(null); // Reset after removal
    }
  };

  // Handle touch start (when swiping in device begins)
  const handleTouchStart = (e: React.TouchEvent, device: Device) => {
    setRemoveDevice(device); // Store device for removal
    setStartX(e.touches[0].clientX); // Store the initial touch position
  };

  // Handle touch move (during swiping in device)
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

  // State to manage the active content page to display for user
  const [activeContent, setActiveContent] = useState<string | null>("home");

  // Icons array to manage the 8 icons for add room
  const addRoomIcons = [
    { image: livingRoomIcon, title: "Living Room" },
    { image: bedIcon, title: "Bedroom" },
    { image: kitchenTableIcon, title: "Kitchen" },
    { image: bathroomIcon, title: "Bathroom" },
    { image: gardenIcon, title: "Garden" },
    { image: carIcon, title: "Garage" },
    { image: bookShelfIcon, title: "Study Room" },
    { image: coatHangerIcon, title: "Closet" },
  ];

  // State to track the selected icon in add room page or add device page
  const [selectedIcon, setSelectedIcon] = useState<{
    image: string;
    title: string;
  } | null>(null);

  // State to track if tp display icon text label when user clicked on a device
  const [isIconTextVisible, setIconTextVisible] = useState(false);

  // Handle click on an icon
  const handleIconClick = (icon: { image: string; title: string }) => {
    setSelectedIcon(icon);
    setIconTextVisible(false); // Reset the visibility before the new swipe-in animation
    setTimeout(() => {
      setIconTextVisible(true); // Trigger the swipe-in animation
    }, 250); // Adjust this timeout based on your animation duration
  };

  // State to track the room name input from user in add room page
  const [roomName, setRoomName] = useState<string | null>(null);
  // State to track the device name input from user in add device page
  const [devName, setDevName] = useState<string | null>(null);
  // state to check the room name is inputed by user (error handling)
  const [roomNameAlert, setRoomNameAlert] = useState(false);
  // state to check the icon is selected by user in add room and add device page (error handling)
  const [iconAlert, setIconAlert] = useState(false);
  // state to check the device name is inputed by user (error handling)
  const [devNameAlert, setDevNameAlert] = useState(false);

  // function to add a room
  const handleAddRoom = () => {
    // Case if user didn't input room name and icon in add room page
    if (selectedIcon === null && !roomName?.trim()) {
      setRoomNameAlert(true);
      setIconAlert(true);
      return;
    }
    // Case if user didn't input room name in add room page
    if (!roomName?.trim()) {
      setRoomNameAlert(true);
      return;
    }
    // Case if user didn't input icon in add room page
    if (selectedIcon === null) {
      setIconAlert(true);
      return;
    }

    // new room
    const newRoom = {
      id: roomsState.length + 1, // add 1 to the total device
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

  // function handle navigate from add device page to home page
  const handleFromAddDeviceToHome = () => {
    handleBackToHomePage();
    setIconTextVisible(false);
  };

  // function to handle general navigate back to home page
  const handleBackToHomePage = () => {
    setActiveContent("home");
    // to ensure the flow of homepage when navigate back
    setRoomNameAlert(false);
    setIconAlert(false);
    setSelectedIcon(null);
    setRoomName(null);
  };

  // function to handle back to add device page
  const handleBackToAddDevice = () => {
    setActiveContent("addDevice");
    // to ensure the flow of homepage when navigate back
    setDevNameAlert(false);
    setIconAlert(false);
    setSelectedIcon(null);
    setDevName(null);
  };

  // function to handle room clicked by user
  const handleRoomClick = (selectedRoom: {
    id: number;
    title: string;
    image: string;
    devices: number;
  }) => {
    setRoom(selectedRoom); // Set the selected room data
    setActiveContent("viewDeviceStatus"); // Navigate to the viewDeviceStatus page
  };

  // state to track if user is editing title
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode or exit mode
  // state to track the temporary title changed
  const [tempTitle, setTempTitle] = useState(getRoom().title); // Temporary title during editing
  // state to track the editing type is room or a device for modal displaying
  const [editingType, setEditingType] = useState<string | null>(null); // "room" or "device"

  // function to handle if user click to edit room title in viewDeviceStatus page
  const handleEditRoomClick = () => {
    setIsEditing(true); // Open the edit modal
    setEditingType("room"); // Set to "room" when editing a room
    setTempTitle(getRoom().title); // Set temp title to the current room title
  };

  // function to handle if user click to edit device title in manageDevice page
  const handleEditDeviceClick = () => {
    setIsEditing(true); // Open the edit modal
    setEditingType("device"); // Set to "device" when editing a device
    setTempTitle(getDevice().title); // Set temp title to the current device title
  };

  // function to handle if user click to edit time (still doing it)
  const handleEditTimeClick = () => {
    toggleEditTime();
    setEditingType("time"); // Set to "device" when editing a device
    setTempTitle("Wanna edit time"); // Set temp title to the current device title
  };

  // function to handle if user confirm for the changes in all modals
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

    setEditingType(null);
    setIsEditing(false); // Exit edit mode after confirming
  };

  // function to handle cancel if user wants to cancel their action in all modals
  const handleCancel = () => {
    if (editingType === "room") {
      setTempTitle(getRoom().title); // Reset temp title to the original room title
      setIsEditing(false); // Exit edit mode
    } else if (editingType === "device") {
      setTempTitle(getDevice().title);
      setIsEditing(false);
    } else if (editingType === "time") {
      setTempTitle("time");
      setIsEditTime(false);
    }

    setEditingType(null);
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

  // Function to handle the curennt selected device's smart feature toggle in manageDevice page
  const getSelectedDeviceToggle = (
    roomId: number,
    deviceId: number,
    toggleKey: "toggle1" | "toggle2"
  ) => {
    const device = devicesMap.get(roomId)?.get(deviceId); // Perform a fast lookup for the device using roomId and deviceId.
    return device ? device.content[toggleKey] : false; // Return the toggle value or false if the device is not found.
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

  // function to handle adding new device
  const handleDeviceSelect = (device: Device) => {
    setAddSelectDevice(device); // Set selected device
  };

  // state to track the device to connect in add device page
  const [connectDevice, setConnectDevice] = useState(false);

  // function to handle if user click to connect on a device in add device page
  const handleConnectClick = (activeContent: string) => {
    if (!addSelectDevice) {
      // Show error message if no device is selected
      setConnectDevice(true);
    } else {
      handleButtonClick(activeContent); // Change the active content to device settings
    }
  };

  // function to handle if user wants to add device
  const handleAddDevice = () => {
    // Case when no device is selected
    if (!addSelectDevice) {
      // Handle case if no device is selected
      return;
    }

    // case of no selected device icon and device name inout by user
    if (selectedIcon === null && !devName?.trim()) {
      setDevNameAlert(true);
      setIconAlert(true);
      return;
    }

    // case if user didn't input device name
    if (!devName?.trim()) {
      setDevNameAlert(true);
      return;
    }

    // case if user didn't select device icon
    if (selectedIcon === null) {
      setIconAlert(true);
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
    setSelectedIcon(null); // Reset selected icon
    setDevNameAlert(false); // Reset dev Alert to false state
    setIconAlert(false); // Reset icon alert to false state

    // Update the devicesState with the new device
    setDevicesState(updatedDevicesState);
    // Navigate back to view device status page
    setActiveContent("viewDeviceStatus");
  };

  // state to track if it shall spin or not for the bluetooth icon connect
  const [isSpinning, setIsSpinning] = useState(false);

  // function to spin the bluetooth icon connect
  const handleSpinClick = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 2000);
  };

  // state to track if user is removing room in homepage
  const [isRoomEditing, setRoomEditing] = useState(false);

  // Toggle edit mode when removing a room in home page
  const handleRoomEdit = () => {
    setRoomEditing((prev) => !prev); // Toggle edit mode
  };

  // function to remove a room selected by user in homepage
  const handleRemoveRoom = (roomId: number, e: React.MouseEvent) => {
    // Stop the event propagation to prevent triggering the parent click
    e.stopPropagation();
    // Remove room by filtering out the room with the specified ID
    const updatedRooms = roomsState.filter((room) => room.id !== roomId);
    setRoomsState(updatedRooms); // Update the state with the remaining rooms
  };

  // state to track if user wants to add new smart feature schedule in manageDevice page
  const [addFeature, setAddFeature] = useState(false);

  // function to handle adding smart feature schedule
  const handleAddFeature = () => {
    setAddFeature((prev) => !prev);
  };

  // funciton to find current device
  const currentDevice = devicesState.find(
    (device) => device.device_id === getDevice().device_id
  );

  // use effect to set the current device when there's changes in current device state's attribute
  useEffect(() => {
    if (currentDevice) {
      setDevice(currentDevice);
    }
  }, [devicesState]);

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

  // function to get different unit label for different current selected device type
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

  // state to track selected period for smart feature
  const [period, setPeriod] = useState("AM"); // Tracks the selected option
  // state to track if user is editing time (not yet done)
  const [isEditTime, setIsEditTime] = useState(false);

  // state to track the toggled period by user (not yet done)
  const toggleTime = (time: string) => {
    setPeriod(time); // Update the selected state
  };

  // state to track the toggled edit time by user (not yet done)
  const toggleEditTime = () => {
    setIsEditTime((prev) => !prev);
  };

  const [intervalId, setIntervalId] = useState<any>(null); // Track the interval ID (use any to avoid type issues)

  // Start increasing/decreasing tempature celsius when the button is pressed
  const startChangingTemperature = (action: () => void) => {
    const id = setInterval(() => {
      action();
    }, 300);
    setIntervalId(id); // Save the interval ID to stop it later
  };

  // Stop changing when the button is released
  const stopChangingTemperature = () => {
    if (intervalId) {
      clearInterval(intervalId); // Clear the interval
      setIntervalId(null); // Reset the interval ID state
    }
  };

  // Handle touch start for collaborators
  const handleCollabTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX); // Store the initial touch position
  };

  // Handle touch move for collaborators
  const handleCollabTouchMove = (e: React.TouchEvent, collabId: number) => {
    if (!swipedCollab) return; // Prevent move if no collab is swiped

    const currentX = e.touches[0].clientX; // Get the current touch position
    const deltaX = currentX - startX; // Calculate the change in position

    // Update the swipe state based on deltaX
    if (deltaX < -50) {
      // If swiped to the left
      setSwipedCollab((prev) => ({
        ...prev,
        [collabId]: true, // swiped
      }));
    } else if (deltaX > 50) {
      // If swiped to the right
      setSwipedCollab((prev) => ({
        ...prev,
        [collabId]: false, // not swiped
      }));
    }
  };

  // function to handle cancel action modal in collaborator page
  const handleCollabCancel = () => {
    if (removeCollab) {
      // Reset the swiped state for the selected collaborator
      setSwipedCollab((prevState) => ({
        ...prevState,
        [removeCollab.id]: false, // Set the specific collaborator's swipe state to false
      }));
    }

    // Reset the removeCollab state to null
    setRemoveCollab(null);
  };

  // effect to updates changes
  // useEffect(() => {
  //   console.log("Updated devicesState:", devicesState);
  // }, [devicesState]);
  // useEffect(() => {
  //   console.log("Updated roomsState:", roomsState);
  // }, [roomsState]);

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
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
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
        <AddRoom
          roomName={roomName}
          roomNameAlert={roomNameAlert}
          selectedIcon={selectedIcon}
          addRoomIcons={addRoomIcons}
          iconAlert={iconAlert}
          isIconTextVisible={isIconTextVisible}
          setRoomName={setRoomName}
          handleFromAddDeviceToHome={handleFromAddDeviceToHome}
          handleIconClick={handleIconClick}
          handleAddRoom={handleAddRoom}
        />
      ) : activeContent === "viewDeviceStatus" ? (
        <ViewDeviceStatus
          swipedDevice={swipedDevice}
          handleBackToHomePage={handleBackToHomePage}
          getRoom={getRoom}
          getDevice={getDevice}
          handleEditRoomClick={handleEditRoomClick}
          handleButtonClick={handleButtonClick}
          roomsState={roomsState}
          devicesState={devicesState}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleSelectDevice={handleSelectDevice}
          getSelectedDeviceStatus={getSelectedDeviceStatus}
          handleToggle={handleToggle}
          handleRemoveDevice={handleRemoveDevice}
        />
      ) : activeContent === "addDevice" ? (
        <AddDevice
          isSpinning={isSpinning}
          addDevice={addDevice}
          addSelectDevice={addSelectDevice}
          connectDevice={connectDevice}
          handleButtonClick={handleButtonClick}
          handleSpinClick={handleSpinClick}
          handleDeviceSelect={handleDeviceSelect}
          handleConnectClick={handleConnectClick}
        />
      ) : activeContent === "deviceSetting" ? (
        <DeviceSetting
          handleBackToAddDevice={handleBackToAddDevice}
          devName={devName}
          devNameAlert={devNameAlert}
          setDevName={setDevName}
          icons={icons}
          selectedIcon={selectedIcon}
          handleIconClick={handleIconClick}
          iconAlert={iconAlert}
          handleAddDevice={handleAddDevice}
        />
      ) : activeContent === "manageDevice" ? (
        <ManageDevice
          devType={devType}
          handleButtonClick={handleButtonClick}
          getDevice={getDevice}
          handleEditDeviceClick={handleEditDeviceClick}
          getUnitLabel={getUnitLabel}
          getSelectedDeviceStatus={getSelectedDeviceStatus}
          getRoom={getRoom}
          handleToggle={handleToggle}
          handleDecreaseCelsius={handleDecreaseCelsius}
          startChangingTemperature={startChangingTemperature}
          stopChangingTemperature={stopChangingTemperature}
          handleIncreaseCelsius={handleIncreaseCelsius}
          getIntensityLabel={getIntensityLabel}
          getIntensityIcon={getIntensityIcon}
          smallCircles={smallCircles}
          handleSmallCircleClick={handleSmallCircleClick}
          circlePosition={circlePosition}
          handleTouchStartCircle={handleTouchStartCircle}
          handleTouchMoveCircle={handleTouchMoveCircle}
          handleTouchEndCircle={handleTouchEndCircle}
          dragging={dragging}
          handleAddFeature={handleAddFeature}
          addFeature={addFeature}
          days={days}
          activeDay={activeDay}
          handleDayClick={handleDayClick}
          handleEditTimeClick={handleEditTimeClick}
          period={period}
          toggleTime={toggleTime}
          getSelectedDeviceToggle={getSelectedDeviceToggle}
          handleContentToggle={handleContentToggle}
        />
      ) : activeContent === "viewCollaborators" ? (
        <ViewCollaborator
          handleButtonClick={handleButtonClick}
          collabState={collabState}
          swipedCollab={swipedCollab}
          handleCollabTouchStart={handleCollabTouchStart}
          handleCollabTouchMove={handleCollabTouchMove}
          setRemoveCollab={setRemoveCollab}
        />
      ) : null}

      {/* Remove Collaborator */}
      {removeCollab && (
        <RemoveCollabModal
          removeCollab={removeCollab}
          handleCollabCancel={handleCollabCancel}
          handleRemoveCollab={handleRemoveCollab}
        />
      )}

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

      {/* Remove Room Display */}
      {false && <RemoveRoomModal editingType={editingType} />}

      {/* Edit Time */}
      {isEditTime && (
        <EditTimeModal
          tempTitle={tempTitle}
          setTempTitle={setTempTitle}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
};

export default HomePage;
