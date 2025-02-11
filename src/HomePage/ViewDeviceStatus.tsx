import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Device, Room } from "./HomePage";
import profile1Icon from "../assets/viewDeviceProfile/profile1.svg";
import profile2Icon from "../assets/viewDeviceProfile/profile2.svg";

interface ViewDeviceStatusProps {
  swipedDevice: { [deviceId: number]: boolean };
  handleBackToHomePage: () => void;
  getRoom: () => Room;
  getDevice: () => Device;
  handleEditRoomClick: () => void;
  handleButtonClick: (content: string) => void;
  roomsState: Room[];
  devicesState: Device[];
  handleTouchStart: (e: React.TouchEvent, device: Device) => void;
  handleTouchMove: (e: React.TouchEvent, deviceId: number) => void;
  handleSelectDevice: (selectedDevice: Device) => void;
  getSelectedDeviceStatus: (roomId: number, deviceId: number) => boolean;
  handleToggle: (roomId: number, deviceId: number) => void;
  handleRemoveDevice: () => void;
}

const ViewDeviceStatus: React.FC<ViewDeviceStatusProps> = ({
  swipedDevice,
  handleBackToHomePage,
  getRoom,
  getDevice,
  handleEditRoomClick,
  handleButtonClick,
  roomsState,
  devicesState,
  handleTouchStart,
  handleTouchMove,
  handleSelectDevice,
  getSelectedDeviceStatus,
  handleToggle,
  handleRemoveDevice,
}) => {
  return (
    <>
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
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
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
    </>
  );
};

export default ViewDeviceStatus;
