import { FaMinusCircle, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Device, Room } from "./HomePage";
import profile1Icon from "../assets/viewDeviceProfile/profile1.svg";
import profile2Icon from "../assets/viewDeviceProfile/profile2.svg";
import { useState } from "react";
import EditTitleModal from "./EditTitleModal";
import RemoveModal from "./RemoveModal";
import "./ViewDeviceStatus.css";
import DeviceOverview from "./DeviceOverview";
import useWindowSize from "./Layout";
import NoDeviceMessage from "./NoDeviceMessage";

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
  swipedDevice: string | null;
  setSwipedDevice: React.Dispatch<React.SetStateAction<string | null>>;
  removeDevice: Device | null;
  setRemoveDevice: React.Dispatch<React.SetStateAction<Device | null>>;
  handleRemoveDevice: () => void;
  handleDeviceCancel: () => void;
  isSwiping: boolean;
  setIsSwiping: React.Dispatch<React.SetStateAction<boolean>>;
}

// Add the API helper function
const removeDeviceFromAPI = async (deviceId: number) => {
  try {
    // Get auth token from localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("Authentication token not found. Please log in again.");
    }

    const response = await fetch(
      `http://localhost:5000/api/devices/${deviceId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the authorization header
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to remove device");
    }
    return await response.json();
  } catch (error) {
    console.error("Error removing device:", error);
    throw error;
  }
};

// Add this function at the top of your file, alongside the removeDeviceFromAPI function
const updateRoomTitleAPI = async (roomId: number, newTitle: string) => {
  try {
    // Get auth token from localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("Authentication token not found. Please log in again.");
    }

    const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add the authorization header
      },
      body: JSON.stringify({ name: newTitle }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update room title");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating room title:", error);
    throw error;
  }
};

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
  swipedDevice,
  setSwipedDevice,
  removeDevice,
  setRemoveDevice,
  handleRemoveDevice,
  handleDeviceCancel,
  isSwiping,
  setIsSwiping,
}) => {
  const goBackToHomePage = () => {
    setActiveContent("home");
  };

  // state to track the startX position when user swipe
  const [startX, setStartX] = useState(0);

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

  // Update the handleConfirm function to use the API
  const handleConfirm = async () => {
    if (editingType === "room") {
      try {
        // Show loading state if needed
        // setIsLoading(true);

        // Call the API to update the room title
        await updateRoomTitleAPI(getRoom().id, tempTitle);

        // If API call succeeds, update the local state
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
      } catch (error) {
        // Handle error - you might want to show an error message
        console.error("Failed to update room title:", error);
        // Optional: Reset to original title
        // setTempTitle(getRoom().title);
      } finally {
        // Hide loading state if needed
        // setIsLoading(false);
      }
    }

    // Clean up UI state
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

  const isLaptop = useWindowSize();

  // Filter devices for the selected room
  const filteredDevices = devicesState.filter(
    (device) => device.room_id === getRoom().id
  );

  // state to track if user is editing device in view device status page
  const [isDeviceEditing, setRoomEditing] = useState(false);

  // Toggle edit mode when editing device in view device status page
  const handleDeviceEdit = () => {
    setRoomEditing((prev) => !prev); // Toggle edit mode
  };

  return (
    <>
      {/* Container for Back Button and Title */}
      <div
        style={{ position: "relative", top: "60px" }}
        className="room-title-pen"
      >
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
      <div className="position-fixed purple-container">
        {isLaptop ? (
          <div
            style={{ width: "100%" }}
            className="d-flex justify-content-between align-items-center p-4 pb-1"
          >
            <div className="col-4 text-start device-edit-div">
              <h5
                className="mb-0 ms-3 fw-semibold device-edit"
                onClick={handleDeviceEdit}
              >
                {isDeviceEditing ? "Done" : "Edit"}
              </h5>
            </div>
            <div className="col-4 text-center d-flex justify-content-center align-items-center">
              <h3 className="fw-bold me-2 room-device-title">
                {getRoom().title}
              </h3>
              {isDeviceEditing ? (
                <FaPen
                  className="mb-1"
                  size={18}
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
              ) : (
                <>
                  <div onClick={() => setActiveContent("viewCollaborators")}>
                    <img
                      src={profile1Icon}
                      className="img-fluid mb-1 pe-2 collab-image"
                    />
                    <img
                      src={profile2Icon}
                      className="img-fluid mb-1 pe-2 collab-image"
                    />
                    <IoIosArrowForward size={22} color="#f5f5f5" />
                  </div>
                </>
              )}
            </div>

            <div className="col-4 text-end add-device-container">
              <button
                className="me-2 btn rounded-circle p-2 add-device-div"
                disabled={isDeviceEditing}
                onClick={(e) => {
                  if (swipedDevice === getDevice().device_id.toString()) {
                    e.stopPropagation(); // Prevent device selection in swipe mode
                  } else {
                    setActiveContent("addDevice"); // Proceed to select the device if not swiped
                  }
                }}
              >
                <FaPlus className="add-device-button" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 collab-image-div">
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
                  className="me-2 btn rounded-circle p-2 add-device-div"
                  style={{}}
                  onClick={(e) => {
                    if (swipedDevice === getDevice().device_id.toString()) {
                      e.stopPropagation(); // Prevent device selection in swipe mode
                    } else {
                      setActiveContent("addDevice"); // Proceed to select the device if not swiped
                    }
                  }}
                >
                  <FaPlus className="add-device-button" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Devices */}
        {isLaptop ? (
          <div className="row laptop-container pt-4">
            {filteredDevices.length > 0 ? (
              filteredDevices.map((device) => (
                <div
                  className="col-6 laptop-devices"
                  style={{ position: "relative" }}
                >
                  {isDeviceEditing ? (
                    <div
                      style={{
                        pointerEvents: isDeviceEditing ? "auto" : "none",
                        opacity: 1,
                      }}
                    >
                      {/* White Background Behind Minus Button */}
                      <div className="edit-device-white"></div>
                      <FaMinusCircle
                        color="red"
                        size={18}
                        className="d-flex flex-start edit-device-minus-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRemoveDevice(device);
                        }}
                      />
                    </div>
                  ) : null}

                  <DeviceOverview
                    setActiveContent={setActiveContent}
                    getDevice={() => device}
                    getSelectedDeviceStatus={getSelectedDeviceStatus}
                    handleToggle={handleToggle}
                    getRoom={getRoom}
                    setDevicesState={setDevicesState}
                    setDevice={setDevice}
                    devicesState={devicesState}
                  />
                  <div className="view-more">
                    <p
                      style={{ color: "white", margin: 0 }}
                      onClick={() => {
                        setActiveContent("manageDevice");
                        setDevice(device);
                      }}
                    >
                      View More
                    </p>
                    <IoIosArrowForward size={22} color="#FFFFFF" />
                  </div>
                </div>
              ))
            ) : (
              <NoDeviceMessage />
            )}
          </div>
        ) : (
          <>
            <div className="dev-container">
              {/* Render devices for the selected room  */}
              {getRoom() !== null && roomsState[getRoom().id] && (
                <div key={getRoom().id}>
                  {roomsState[getRoom().id].devices != 0 ? (
                    // Filter devices for the current room and map over them
                    filteredDevices.map((device) => (
                      <div className="devices-container" key={device.device_id}>
                        <div
                          className="p-3 mb-4 devices-div"
                          style={{
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
                    <NoDeviceMessage />
                  )}
                </div>
              )}
            </div>
          </>
        )}
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
