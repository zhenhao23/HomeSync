import { FaMinusCircle, FaPlus } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";

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
  const handleToggle = (roomId: number, deviceId: number) => {
    setDevicesState((prevDevicesState) =>
      prevDevicesState.map((dev) =>
        dev.room_id === roomId && dev.device_id === deviceId
          ? { ...dev, status: !dev.status }
          : dev
      )
    );
  };

  const handleRoomClick = (selectedRoom: Room) => {
    setRoom(selectedRoom);
    setActiveContent("viewDeviceStatus");
  };

  const handleRoomEdit = () => {
    setRoomEditing((prev) => !prev);
  };

  const handleRemoveRoom = () => {
    if (removeRoom) {
      // Update rooms
      setRoomsState((prevRooms) => {
        const updatedRooms = prevRooms
          .filter((room) => room.id !== removeRoom.id)
          .map((room, index) => ({ ...room, id: index }));
        return updatedRooms;
      });

      // Update devices
      setDevicesState((prevDevices) => {
        const filteredDevices = prevDevices.filter(
          (device) => device.room_id !== removeRoom.id
        );
        return filteredDevices.map((device) => ({
          ...device,
          room_id:
            device.room_id > removeRoom.id
              ? device.room_id - 1
              : device.room_id,
        }));
      });

      setRemoveRoom(null);
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
