import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Device, Room } from "./HomePage";
import profile1Icon from "../assets/viewDeviceProfile/profile1.svg";
import profile2Icon from "../assets/viewDeviceProfile/profile2.svg";
import { useState } from "react";
import EditTitleModal from "./EditTitleModal";
import RemoveModal from "./RemoveModal";

interface ViewDeviceStatusProps {
  getRoom: () => Room;
  getDevice: () => Device;
  roomsState: Room[];
  setRoomsState: React.Dispatch<React.SetStateAction<Room[]>>;
  devicesState: Device[];
  setDevicesState: React.Dispatch<React.SetStateAction<Device[]>>;
  setRoom: React.Dispatch<React.SetStateAction<Room>>;
  setDevice: React.Dispatch<React.SetStateAction<Device>>;
  setDevType: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveContent: (content: string) => void;
  getSelectedDeviceStatus: (roomId: number, deviceId: number) => boolean;
  handleToggle: (roomId: number, deviceId: number) => void;
}

const ViewDeviceStatus: React.FC<ViewDeviceStatusProps> = ({
  getRoom,
  getDevice,
  roomsState,
  setRoomsState,
  devicesState,
  setDevicesState,
  setRoom,
  setDevice,
  setDevType,
  setActiveContent,
  getSelectedDeviceStatus,
  handleToggle,
}) => {
  const goBackToHomePage = () => {
    setActiveContent("home");
  };

  //const [isSwiping, setIsSwiping] = useState(false);

  // State to store the swipe status for a device
  const [swipedDevice, setSwipedDevice] = useState<string | null>(null);
  // state to track the startX position when user swipe
  const [startX, setStartX] = useState(0);
  // State to track the currently selected/swiped device to remove
  const [removeDevice, setRemoveDevice] = useState<Device | null>(null);

  // state to track if user is editing title
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode or exit mode
  // state to track the temporary title changed
  const [tempTitle, setTempTitle] = useState(getRoom().title); // Temporary title during editing
  // state to track the editing type is room for modal displaying
  const [editingType, setEditingType] = useState<string | null>(null);

  // function to handle if user click to edit room title in viewDeviceStatus page
  const handleEditRoomClick = () => {
    setIsEditing(true); // Open the edit modal
    setEditingType("room"); // Set to "room" when editing a room
    setTempTitle(getRoom().title); // Set temp title to the current room title
  };

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

      setSwipedDevice(null);
      setRemoveDevice(null); // Reset after removal
    }
  };

  // function to handle cancel action modal in viewDeviceStatus page
  const handleDeviceCancel = () => {
    if (removeDevice) {
      // Reset the swiped state (un-swipe)
      setSwipedDevice(null);
    }

    // Reset the removeCollab state to null
    setRemoveDevice(null);
  };

  // State to track if a swipe is in progress
  const [isSwiping, setIsSwiping] = useState(false);

  // Handle touch start (when swiping in device begins)
  const handleTouchStart = (e: React.TouchEvent, deviceId: number) => {
    setStartX(e.touches[0].clientX); // Store the initial touch position
    setSwipedDevice(deviceId.toString()); // Track the swiped device
  };

  // Handle touch move (during swiping in device)
  const handleTouchMove = (e: React.TouchEvent, deviceId: number) => {
    if (!swipedDevice) return; // Prevent move if no device is swiped
    setIsSwiping(true);

    const currentX = e.touches[0].clientX; // Get the current touch position
    const deltaX = currentX - startX; // Calculate the change in position

    // Update the swipe state based on deltaX
    if (deltaX < -50) {
      // If swiped to the left
      setSwipedDevice(deviceId.toString());
    } else if (deltaX > 50) {
      // If swiped to the right
      setSwipedDevice(null);
    }

    // Update the devices state
    setDevicesState((prevDevicesState) =>
      prevDevicesState.map(
        (device) =>
          device.device_id === deviceId
            ? { ...device, swiped: deviceId.toString() === swipedDevice } // Convert to string for comparison
            : { ...device, swiped: false } // Reset others
      )
    );
  };

  // function to handle if user confirm for the changes in all modals
  const handleConfirm = () => {
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

    setEditingType(null);
    setIsEditing(false); // Exit edit mode after confirming
  };

  // function to handle cancel if user wants to cancel their action
  const handleCancel = () => {
    setTempTitle(getRoom().title); // Reset temp title to the original room title
    setIsEditing(false); // Exit edit mode
    setEditingType(null);
  };

  // Function to select the device selected by user
  const handleSelectDevice = (selectedDevice: Device) => {
    setSwipedDevice(null);
    setDevType(selectedDevice.deviceType);
    setDevice(selectedDevice);
    setActiveContent("manageDevice");
  };

  return (
    <>
      {/* Container for Back Button and Title */}
      <div style={{ position: "relative", top: "60px" }}>
        {/* Back Button */}
        <div
          onClick={goBackToHomePage}
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
              if (swipedDevice === getDevice().device_id.toString()) {
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
              if (swipedDevice === getDevice().device_id.toString()) {
                e.stopPropagation(); // Prevent device selection in swipe mode
              } else {
                setActiveContent("viewCollaborators"); // Proceed to select the device if not swiped
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
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
              }}
              onClick={(e) => {
                if (swipedDevice === getDevice().device_id.toString()) {
                  e.stopPropagation(); // Prevent device selection in swipe mode
                } else {
                  setActiveContent("addDevice"); // Proceed to select the device if not swiped
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
              {roomsState[getRoom().id].devices != 0 ? (
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
                          transform:
                            swipedDevice === device.device_id.toString() &&
                            isSwiping
                              ? "translateX(-50px)"
                              : "translateX(0)",
                        }}
                        onTouchStart={(e) =>
                          handleTouchStart(e, device.device_id)
                        }
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
                                handleToggle(getRoom().id, device.device_id); // Toggle state for the specific device
                              }}
                            />
                            <span className="slider round"></span>
                            <span className="on-text">ON</span>
                            <span className="off-text">OFF</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        {swipedDevice === device.device_id.toString() &&
                          isSwiping && (
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
                                onClick={() => setRemoveDevice(device)}
                              />
                            </button>
                          )}
                      </div>
                    </div>
                  ))
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "50vh" }}
                >
                  <p className="fw-semibold" style={{ fontSize: "15px" }}>
                    No devices added yet.
                    <br />
                    Tap '+' to get started!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
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

      {/* Remove Device Display */}
      {removeDevice && (
        <RemoveModal
          removeWhat="device"
          removeItem={removeDevice}
          handleRemove={handleRemoveDevice}
          handleCancel={handleDeviceCancel}
        />
      )}
    </>
  );
};

export default ViewDeviceStatus;
