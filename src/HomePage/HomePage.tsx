import { FaMinusCircle, FaPlus } from "react-icons/fa";
import LivingRoomImage from "../assets/rooms/livingroom.svg";
import BedRoomImage from "../assets/rooms/bedroom.svg";
import KitchenImage from "../assets/rooms/kitchen.svg";
import GardenImage from "../assets/rooms/garden.svg";
import BathroomImage from "../assets/rooms/bathroom.svg";
import WeatherDisplay from "./WeatherDisplay.tsx";
import LogoNotif from "./LogoNotif.tsx";
import "./Switch.css"; // Import the CSS for toggle button
import "./RadioButton.css";
import "./CircleDot.css";
import "./glowingEffect.css";
import "./Alert.css";
import "./SyncButton.css";
import { useEffect, useMemo, useState } from "react";
import lampIcon from "../assets/devicesSettingIcon/lamp.svg";
import sprinklerIcon from "../assets/devicesSettingIcon/sprinkler.svg";
import petfeederIcon from "../assets/devicesSettingIcon/cooker.svg";
import airCondIcon from "../assets/viewDeviceStatus/aircond3.svg"; //test vercel
import manageLamp from "../assets/manageDevice/light.svg";
import managePetfeeder from "../assets/manageDevice/petfeeder.svg";
import manageAircond from "../assets/manageDevice/aircond2.svg";
import manageIrrigation from "../assets/manageDevice/irrigation.svg";
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
import collaboratorIcon from "../assets/addCollab/collab-profile.svg";
import RepeatTime from "./RepeatTime.tsx";

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

// Homepage component definition
const HomePage: React.FC = () => {
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
  });

  // state to keep track the current selected device type
  const [devType, setDevType] = useState<string | null>(null);

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

  // const getSelectedDeviceStatus = (roomId: number, deviceId: number) => {
  //   // Use find instead of filter to return the device directly
  //   const device = devicesState.find(
  //     (dev) => dev.room_id === roomId && dev.device_id === deviceId
  //   );
  //   return device ? device.status : false; // Return the status, or false if the device is not found
  // };

  // state to track the room's state from rooms array
  const [roomsState, setRoomsState] = useState(rooms);

  // State to manage the active content page to display for user
  const [activeContent, setActiveContent] = useState<string | null>("home");

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

  // function to get the current selected device status attribute (button on/off)
  const getSelectedDeviceStatus = (roomId: number, deviceId: number) => {
    const device = devicesMap.get(roomId)?.get(deviceId);
    return device ? device.status : false;
  };

  // Function to handle the curennt selected device's smart feature toggle in manageDevice page
  const getSelectedDeviceToggle = (
    roomId: number,
    deviceId: number,
    toggleKey: "toggle1" | "toggle2"
  ) => {
    const device = devicesMap.get(roomId)?.get(deviceId); // Perform a fast lookup for the device using roomId and deviceId.
    return device ? device.content[toggleKey] : false; // Return the toggle value or false if the device is not found.
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

  // State to store selected device to add in add device page
  const [addSelectDevice, setAddSelectDevice] = useState<Device | null>(null);

  // state to track if user is removing room in homepage
  const [isRoomEditing, setRoomEditing] = useState(false);

  // Toggle edit mode when removing a room in home page
  const handleRoomEdit = () => {
    setRoomEditing((prev) => !prev); // Toggle edit mode
  };

  // state to track if user has initiated to remove room in home page
  const [removeRoom, setRemoveRoom] = useState<Room | null>(null);

  // function to remove a room selected by user in homepage
  const handleRemoveRoom = () => {
    if (removeRoom) {
      setRoomsState((prevRooms) => {
        // Remove the selected room and reassign IDs
        const updatedRooms = prevRooms
          .filter((room) => room.id !== removeRoom.id)
          .map((room, index) => ({ ...room, id: index })); // Reassign room_id

        return updatedRooms;
      });

      setDevicesState((prevDevices) => {
        // Remove devices belonging to the removed room
        const filteredDevices = prevDevices.filter(
          (device) => device.room_id !== removeRoom.id
        );

        // Update room_id for remaining devices
        return filteredDevices.map((device) => ({
          ...device,
          room_id:
            device.room_id > removeRoom.id
              ? device.room_id - 1
              : device.room_id,
        }));
      });

      setRemoveRoom(null); // Reset state after removal
    }
  };

  // function to handle cancel action modal in remove room display
  const handleRoomCancel = () => {
    // Reset the removeCollab state to null
    setRemoveRoom(null);
  };

  // state to track
  const [isRequestAccess, setRequestAccess] = useState(false);

  // function to request access in modal
  const handleRequest = () => {
    setRequestAccess(true); // Close the modal after request
  };

  // function to cancel request access in modal
  const handleCancel = () => {
    setRequestAccess(false);
  };

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

  // state to track the collaborator's state from collaborators array
  const [collabState, setCollabState] = useState(collaborators);

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

  const currentRoom = roomsState.find((room) => room.id === getRoom().id);

  // use effect to set the current device when there's changes in current device state's attribute
  useEffect(() => {
    if (currentDevice) {
      setDevice(currentDevice);
    }
  }, [devicesState]);

  useEffect(() => {
    if (currentRoom) {
      setRoom(currentRoom);
    }
  }, [roomsState]);

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

      {/* Remove Room Display */}
      {removeRoom && (
        <RemoveModal
          removeWhat="room"
          removeItem={removeRoom}
          handleRemove={handleRemoveRoom}
          handleCancel={handleRoomCancel}
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
