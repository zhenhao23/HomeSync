import { FaPlus } from "react-icons/fa";
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
import { useMemo } from "react";
import { useEffect, useState } from "react";
import lampIcon from "../assets/devicesSettingIcon/lamp.svg";
import airConditionerIcon from "../assets/devicesSettingIcon/air-conditioner.svg";
import sprinklerIcon from "../assets/devicesSettingIcon/sprinkler.svg";
import cookerIcon from "../assets/devicesSettingIcon/cooker.svg";
import smartLockIcon from "../assets/devicesSettingIcon/smart-lock.svg";
import fanIcon from "../assets/devicesSettingIcon/fan.svg";
import TVIcon from "../assets/devicesSettingIcon/tv.svg";
import speakerIcon from "../assets/devicesSettingIcon/speaker.svg";
import fridgeIcon from "../assets/devicesSettingIcon/fridge.svg";
import doorBellIcon from "../assets/devicesSettingIcon/door-bell.svg";
import smokeDetectorIcon from "../assets/devicesSettingIcon/smoke-detector.svg";
import robotVacuumIcon from "../assets/devicesSettingIcon/robot-vacuum.svg";
import airCondIcon from "../assets/viewDeviceStatus/aircond.svg"; //test vercel
import manageLamp from "../assets/manageDevice/light.svg";
import managePetfeeder from "../assets/manageDevice/petfeeder.svg";
import manageAircond from "../assets/manageDevice/aircond.svg";
import manageIrrigation from "../assets/manageDevice/irrigation.svg";
import bulbOn from "../assets/manageDevice/bulbOn.svg";
import bulbOff from "../assets/manageDevice/bulbOff.svg";

const HomePage: React.FC = () => {
  const addDevice = [
    "Pet Feeder 02134",
    "Air conditioner 31837",
    "Lights 1221",
  ];

  // Icons array to manage the 8 icons
  const icons = [
    { image: lampIcon, title: "Lamp" },
    { image: airConditionerIcon, title: "Air Conditioner" },
    { image: sprinklerIcon, title: "Sprinkler" },
    { image: cookerIcon, title: "Cooker" },
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
    title: string;
    image: string;
    devices: number;
  }>({
    id: 0,
    title: "Default",
    image: LivingRoomImage,
    devices: 0,
  });

  const devices = [
    {
      device_id: 0,
      room_id: 0,
      image: airCondIcon,
      title: "Pet Feeder 1",
      deviceType: "petfeeder",
      status: false,
      swiped: false,
      devData: {
        iconImage: managePetfeeder,
        percentage: "10",
        unit: "Amount",
        intensity: 1,
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
        percentage: "20",
        unit: "Temperature",
        intensity: 1,
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
        percentage: "30",
        unit: "Brightness",
        intensity: 1,
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
        percentage: "40",
        unit: "Brightness",
        intensity: 1,
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
      image: airCondIcon,
      title: "Irrigation 1",
      deviceType: "irrigation",
      status: false,
      swiped: false,
      devData: {
        iconImage: manageIrrigation,
        percentage: "50",
        unit: "Amount",
        intensity: 1,
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
        percentage: "60",
        unit: "Brightness",
        intensity: 1,
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
        percentage: "70",
        unit: "Brightness",
        intensity: 1,
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
        percentage: "80",
        unit: "Brightness",
        intensity: 1,
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
        percentage: "90",
        unit: "Brightness",
        intensity: 1,
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
        percentage: "10",
        unit: "Brightness",
        intensity: 1,
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
      percentage: string;
      unit: string;
      intensity: number;
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
      percentage: "80%",
      unit: "Brightness",
      intensity: 1,
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

  const [roomTitle, setRoomTitle] = useState(rooms);
  const [devTitle, setDevTitle] = useState(devices);

  const [startX, setStartX] = useState(0);

  // Handle touch start (when swiping begins)
  const handleTouchStart = (e: React.TouchEvent, device: Device) => {
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
  } | null>({
    image: "None", // Default image
    title: "None", // Default title
  });

  // Handle click on an icon
  const handleIconClick = (icon: { image: string; title: string }) => {
    setSelectedIcon(icon);
  };

  // State to track the room name input
  const [roomName, setRoomName] = useState<string | null>(null);
  const [addRoom, setAddRoom] = useState(rooms);

  const handleAddRoom = () => {
    if (!roomName?.trim()) {
      setAlertVisible(true);
      return;
    }

    if (selectedIcon === null || selectedIcon.image === "None") {
      setAlertVisible(true);
      return;
    }

    // new room
    const newRoom = {
      id: addRoom.length + 1,
      image: selectedIcon.image,
      title: roomName,
      devices: 0,
    };

    // Add new room to the rooms list
    setAddRoom((prevRooms) => [...prevRooms, newRoom]);

    setRoomName(null); // Reset the room name input
    setSelectedIcon(null); // Reset selected icon

    // Navigate back to home page
    setActiveContent("home");
  };

  const handleBackToHomePage = () => {
    setActiveContent("home");
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
      const updatedTitles = roomTitle.map((r) => {
        if (r.id === getRoom().id) {
          return { ...r, title: tempTitle }; // Update room title
        }
        return r;
      });
      setRoomTitle(updatedTitles); // Update the state with the new title for the room

      setRoom((prevRoom) => ({
        ...prevRoom,
        title: tempTitle, // Update the room title
      }));
    } else if (editingType === "device") {
      // Update the device title
      const updatedDevices = devTitle.map((d) => {
        if (d.device_id === getDevice().device_id) {
          return { ...d, title: tempTitle }; // Update device title
        }
        return d;
      });
      setDevTitle(updatedDevices); // Update the state with the new title for the device

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

  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    console.log("Updated devicesState:", devicesState);
  }, [devicesState]);

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
              <div className="row align-items-center mb-3">
                <div className="col-4 text-start">
                  <h5
                    className="mb-0 ms-3 fw-semibold"
                    style={{ color: "#204160" }}
                  >
                    Edit
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
              <div className="row g-3 pb-5">
                {addRoom.map((r, index) => (
                  <div
                    key={index}
                    className="col-6 mt-3"
                    onClick={() => handleRoomClick(r)}
                  >
                    <div
                      className="p-2 py-5 text-center"
                      style={{
                        backgroundColor: "#eeeeee",
                        borderRadius: "8px",
                        height: "100%",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                      }}
                    >
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
                            width: "40%",
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
            className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column overflow-auto"
            style={{
              top: "27%",
              height: "100%",
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
                <p className="mb-3 fw-normal" style={{ color: "#204160" }}>
                  Name:
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <input
                    className="border-0"
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
                      lineHeight: "40px",
                    }}
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                </div>
              </div>
              <div className="pt-3 pb-2 container-fluid">
                <span className="mb-3 fw-normal" style={{ color: "#204160" }}>
                  Icon:
                </span>
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
                {getRoom().title} {/* {title} */}
              </h3>
              {/* Edit Icon */}
              <FaPen
                className="mb-1"
                size={15}
                color="white"
                onClick={handleEditRoomClick} // Enable edit mode when clicked
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
              <div className="text-start">
                <img
                  src={profile1Icon}
                  //alt={room.title}
                  className="img-fluid mb-1 pe-2"
                />
                <img
                  src={profile2Icon}
                  //alt={room.title}
                  className="img-fluid mb-1"
                />
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
                  onClick={() => handleButtonClick("addDevice")}
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
              {getRoom() !== null && rooms[getRoom().id] && (
                <div key={getRoom().id}>
                  {rooms[getRoom().id].devices > 0 ? (
                    Array.from(
                      { length: rooms[getRoom().id].devices },
                      (_, deviceIndex) => {
                        // Find the device in the filtered list
                        const roomDevices = devTitle.filter(
                          (d) => d.room_id === getRoom().id
                        );

                        const device = roomDevices[deviceIndex];

                        return (
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
                              className="p-3 text-start mb-4 d-flex justify-content-between"
                              style={{
                                backgroundColor: "#f0f0f0",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                                width: "calc(100% - 15%)",
                                transition: "transform 0.3s ease",
                                transform: swipedDevice[device.device_id]
                                  ? "translateX(-50px)"
                                  : "translateX(0)", // Apply transform based on swipe status
                              }}
                              onTouchStart={(e) => handleTouchStart(e, device)} // Start tracking the device
                              onTouchMove={
                                (e) => handleTouchMove(e, device.device_id) // Only update the specific device
                              }
                              onClick={() => handleSelectDevice(device)} // Select the correct device
                            >
                              <span>{device.title}</span>
                              <div
                                className="text-end"
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
                                  <FaTrashAlt color="white" size={18} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )
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
              >
                <FaSync color="#748188" />
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
                    style={{ marginLeft: "calc(100% - 90%)" }}
                  >
                    {device}
                  </div>
                  <label className="container col-1">
                    <input type="radio" name="radio" />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <hr
                  style={{ border: "1px solid #000000", margin: "18px 30px" }}
                />
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
              <button
                className="btn p-2 px-5"
                style={{
                  backgroundColor: "#204160",
                  color: "white",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
                onClick={() => handleButtonClick("deviceSetting")}
              >
                <h6>Connect</h6>
              </button>
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
              onClick={() => handleButtonClick("addDevice")}
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
                <p className="mb-3 fw-normal" style={{ color: "#204160" }}>
                  Name:
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <input
                    className="border-0"
                    type="text"
                    id="roomName"
                    placeholder="Enter a name for your device"
                    style={{
                      backgroundColor: "#eeeeee",
                      borderRadius: "10px",
                      width: "80vw",
                      height: "40px",
                      boxShadow: "inset 3px 3px 2px rgba(0, 0, 0, 0.1)",
                      textAlign: "left",
                      paddingLeft: "15px",
                      lineHeight: "40px",
                    }}
                  />
                </div>
              </div>
              <div className="pt-3 container-fluid">
                <span className="mb-3 fw-normal" style={{ color: "#204160" }}>
                  Icon:
                </span>
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
            <div>
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
                        {getDevice().devData.percentage}
                      </b>
                      <b style={{ fontSize: "30px", color: "white" }}>%</b>
                      <p
                        className="text-start"
                        style={{
                          fontSize: "20px",
                          color: "white",
                        }}
                      >
                        {getDevice().devData.unit}
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
                      style={
                        {
                          //boxShadow: "0px 0px 15px 5px rgba(255, 255, 0, 0.7)", // Adds glowing effect
                        }
                      }
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
                    Intensity
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <img src={bulbOff} />

                    <div
                      className="small_circle"
                      style={{ marginLeft: "calc(100% - 86%)" }}
                    ></div>
                    <div
                      className="small_circle"
                      style={{ marginLeft: "calc(100% - 74.4%)" }}
                    ></div>
                    <div
                      className="small_circle"
                      style={{ marginLeft: "calc(100% - 62.8%)" }}
                    ></div>
                    <div
                      className="small_circle"
                      style={{ marginLeft: "calc(100% - 51.2%)" }}
                    ></div>
                    <div
                      className="big_circle"
                      style={{ marginLeft: "calc(100% - 39.6%)" }}
                    ></div>
                    <div
                      className="small_circle"
                      style={{ marginLeft: "calc(100% - 28%)" }}
                    ></div>

                    <hr
                      style={{
                        border: "1px solid #cdcdcd",
                        width: "calc(100% - 30%)",
                      }}
                    />
                    <img src={bulbOn} />
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
                      //onClick={() => handleButtonClick("addDevice")}
                    >
                      <FaPlus color="white" />
                    </button>
                  </div>
                </div>

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
            </div>
          ) : null}
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
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h4>Edit {editingType === "room" ? "room" : "device"} title</h4>
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "8px",
                border: "1px solid #b0b0b0",
                borderRadius: "8px",
              }}
            />
            <div>
              <button
                onClick={handleConfirm}
                style={{
                  marginRight: "10px",
                  backgroundColor: "green",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Confirm
              </button>
              <button
                onClick={handleCancel}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {alertVisible && (
        <div className="alert">
          <span className="closebtn" onClick={() => setAlertVisible(false)}>
            &times;
          </span>
          <strong>Alert!</strong> Indicates a dangerous or potentially negative
          action.
        </div>
      )}
    </>
  );
};

export default HomePage;
