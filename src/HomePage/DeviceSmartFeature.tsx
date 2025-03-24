import { useState } from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Day, Device, Room } from "./HomePage";
import EditTimeModal from "./EditTimeModal";
import "./DeviceSmartFeature.css";
import useWindowSize from "./Layout.tsx";
import RepeatError from "./RepeatError.tsx";
import CancelAddFeature from "./CancelAddFeature.tsx";
import RemoveScheduleModal from "./RemoveSchedule.tsx";

export interface Schedule {
  feature_id: number; // Unique ID for the feature
  feature: string; // The type or name of the feature (e.g., "Repeat Option")
  label: string; // Descriptive label (e.g., "Turn On at 8 AM to Turn Off at 10 PM")
  status: boolean; // Whether the feature is active or not
  isUserAdded: boolean; // Indicates if the feature was added by the user
}

interface SmartFeatureProps {
  getSelectedDeviceToggle: (
    roomId: number,
    deviceId: number,
    featureId: number
  ) => boolean;
  addFeature: boolean;
  handleAddFeature: (deviceId: number) => void;
  handleAddFeatureToggle: () => void;
  getDevice: () => Device;
  setDevicesState: React.Dispatch<React.SetStateAction<Device[]>>;
  getRoom: () => Room;
  setActiveContent: (content: string) => void;
  repeat: boolean;
  handleRepeatChange: () => void;
  hasSelect: boolean;
  setHasSelect: React.Dispatch<React.SetStateAction<boolean>>;
  turnOn: string;
  turnOff: string;
  handleTurnOnChange: (time: string) => void;
  handleTurnOffChange: (time: string) => void;
  turnOnPeriod: string;
  turnOffPeriod: string;
  toggleTime: (time: string, type: "turnOn" | "turnOff") => void;
  setAddFeature: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeviceSmartFeature: React.FC<SmartFeatureProps> = ({
  getSelectedDeviceToggle,
  addFeature,
  // handleAddFeature,
  handleAddFeatureToggle,
  getDevice,
  setDevicesState,
  getRoom,
  setActiveContent,
  repeat,
  handleRepeatChange,
  // hasSelect,
  // setHasSelect,
  turnOn,
  turnOff,
  handleTurnOnChange,
  handleTurnOffChange,
  turnOnPeriod,
  turnOffPeriod,
  toggleTime,
  setAddFeature,
}) => {
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

  // Get today's day name
  const todayName = new Date().toLocaleString("en-US", { weekday: "long" });

  // Find the corresponding day object
  const todayDay = days.find((day) => day.name === todayName) || null;

  // state to track the selected day by user
  const [activeDay, setActiveDay] = useState<Day | null>(todayDay);

  // function to handle day click by user
  const handleDayClick = (day: { name: string; letter: string }) => {
    setActiveDay(day);
  };

  // state to track if user click to edit time for modal display
  const [isEditTime, setIsEditTime] = useState(false);

  // state to track the toggled edit time by user (not yet done)
  const toggleEditTime = () => {
    setIsEditTime((prev) => !prev);
  };

  // Add state to track whether editing "turn on" or "turn off"
  const [turnType, setTurnType] = useState<"turnOn" | "turnOff">("turnOn");

  // function to handle if user click to edit time
  const handleEditTimeClick = (turnType: "turnOn" | "turnOff") => {
    setTurnType(turnType);
    toggleEditTime();
    //setEditingType("time"); // Set to "time" when editing time
    //setTempTitle("Edit time"); // Set temp title to the current device title
  };

  // API function to toggle a device feature/trigger status
  const toggleDeviceFeatureAPI = async (
    deviceId: number,
    triggerId: number,
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

      // Debug log to check the values being sent
      console.log("Sending request with:", {
        deviceId,
        triggerId,
        isActive: newStatus,
        homeId: parseInt(homeId),
      });

      // Send request to update the feature status
      const response = await fetch(
        `https://homesync-production.up.railway.app/api/devices/${deviceId}/triggers/${triggerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: newStatus,
            homeId: parseInt(homeId),
          }),
        }
      );

      // Log the raw response for debugging
      console.log("Response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication token expired");
        }

        if (response.status === 403) {
          throw new Error("You don't have permission to modify this device");
        }

        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update feature status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating feature status:", error);
      throw error;
    }
  };

  // function to handle the toggle of smart feature in manageDevice page
  const handleContentToggle = async (
    roomId: number,
    deviceId: number,
    featureId: number
  ) => {
    try {
      // Find the current feature status
      const device = getDevice();
      const feature = device.content.find((f) => f.feature_id === featureId);

      if (!feature) return;

      // Calculate the new status (toggle the current status)
      const newStatus = !feature.status;

      // Update local state optimistically for immediate UI feedback
      setDevicesState((prevDevices) =>
        prevDevices.map((device) => {
          if (device.room_id === roomId && device.device_id === deviceId) {
            return {
              ...device,
              content: device.content.map((feature) =>
                feature.feature_id === featureId
                  ? { ...feature, status: newStatus }
                  : feature
              ),
            };
          }
          return device;
        })
      );

      // Call the API to persist the change
      await toggleDeviceFeatureAPI(deviceId, featureId, newStatus);

      console.log(`Feature ${featureId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update feature status:", error);

      // Revert optimistic update if API call failed
      setDevicesState((prevDevices) =>
        prevDevices.map((device) => {
          if (device.room_id === roomId && device.device_id === deviceId) {
            return {
              ...device,
              content: device.content.map((feature) =>
                feature.feature_id === featureId
                  ? { ...feature, status: !feature.status } // Toggle back
                  : feature
              ),
            };
          }
          return device;
        })
      );

      // Show error to user
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update feature status. Please try again."
      );
    }
  };

  // function to handle cancel add feature
  const handleCancelAddFeature = () => {
    toggleClickCancel();
  };

  // function to discard the smart feature when adding it
  const handleDiscardAddFeature = () => {
    toggleClickCancel();
    setAddFeature(false);
  };

  // state to keep track if user click cancel button
  const [clickCancel, setClickCancel] = useState(false);

  // function to toggle the state if cancel is clicked
  const toggleClickCancel = () => {
    setClickCancel((prev) => !prev);
  };

  // state to keep track the selected slot duration for petfeeder and irrigation
  const [selectedDuration, setSelectedDuration] = useState("5 mins");

  // Available duration options
  const durationOptions = [
    "5 mins",
    "10 mins",
    "15 mins",
    "20 mins",
    "30 mins",
  ];

  // state to track the startX position when user swipe on user-added smart feature
  const [startX, setStartX] = useState(0);
  // State to store the swipe status for a user-added smart feature
  const [swipedFeatureId, setSwipedFeatureId] = useState<number | null>(null);
  // State to track if user is swiping
  const [isFeatureSwiped, setFeatureSwiped] = useState(false);

  // Handle touch start (when user begins swiping)
  const handleTouchStart = (
    e: React.TouchEvent,
    featureId: number,
    isUserAdded: boolean
  ) => {
    if (isUserAdded) {
      setStartX(e.touches[0].clientX); // Store the initial touch position
      setSwipedFeatureId(featureId); // Track the swiped feature
      setFeatureSwiped(false);
    } else return;
  };

  // Handle touch move (while swiping)
  const handleTouchMove = (
    e: React.TouchEvent,
    featureId: number,
    isUserAdded: boolean
  ) => {
    if (!swipedFeatureId && !isUserAdded) return; // Prevent move if no feature is swiped

    const currentX = e.touches[0].clientX; // Get current touch position
    const deltaX = currentX - startX; // Calculate swipe distance

    // Determine swipe direction
    if (deltaX < -50) {
      // If swiped left (show delete button)
      setSwipedFeatureId(featureId);
      setFeatureSwiped(true);
    } else if (deltaX > 50) {
      // If swiped right (hide delete button)
      setSwipedFeatureId(null);
      setFeatureSwiped(false);
    }
  };

  // Remove feature from the correct device
  const handleRemoveFeature = (removeSchedule: Schedule) => {
    if (!removeSchedule) return; // Prevent errors if feature is undefined
    setDevicesState((prevDevices) =>
      prevDevices.map((device) =>
        device.device_id === getDevice().device_id
          ? {
              ...device,
              content: device.content.filter(
                (feature) => feature.feature_id !== removeSchedule.feature_id
              ),
            }
          : device
      )
    );
    setRemoveSchedule(null);
  };

  // function to handle cancel action modal in remove schedule display
  const handleScheduleCancel = () => {
    setSwipedFeatureId(null);
    setFeatureSwiped(false);
    setRemoveSchedule(null);
  };

  // state to track if user has initiated to remove room in home page
  const [removeSchedule, setRemoveSchedule] = useState<Schedule | null>(null);

  const isLaptop = useWindowSize();

  return (
    <>
      <div className="smart-feature-background">
        <div className="dev-smart-feature-container">
          <div className="dev-smart-feature-list">
            <div className="p-4 smart-feature-div">
              {isLaptop && (
                <>
                  <div
                    className="smart-feature-back"
                    onClick={() => {
                      setActiveContent("viewDeviceStatus");
                    }}
                  >
                    <IoIosArrowBack size={20} />
                    <span>Back</span>
                  </div>
                </>
              )}
              <div className="text-start ms-3 smart-feature-title">
                <h3 className="mb-0 fw-bold smart-feature-word">
                  Smart Features
                </h3>
              </div>
              <div className="text-end feature-button-div">
                {addFeature ? (
                  ["Cancel", "Done"].map((label, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-center align-items-center me-2 done-cancel-button"
                      onClick={() => {
                        if (label === "Done") {
                          handleCancelAddFeature();
                        } else {
                          // Handle cancel action
                          handleCancelAddFeature();
                        }
                      }}
                    >
                      {label}
                    </div>
                  ))
                ) : (
                  <button
                    className="me-2 btn rounded-circle p-2 smart-feature-plus"
                    onClick={handleAddFeatureToggle}
                  >
                    <FaPlus color="white" />
                  </button>
                )}
              </div>
            </div>
            {/* Smart Feature */}
            {addFeature && (
              <div className="smart-feature">
                <div
                  className="p-3 mb-4"
                  style={{
                    borderRadius: "14px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
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
                          border: "1px solid #204160",
                        }}
                        onClick={() => handleDayClick(day)}
                      >
                        {day.letter}
                      </button>
                    ))}
                  </div>
                  {/* Border Container */}
                  <div>
                    <div className="d-flex justify-content-start align-items-center p-1 mt-3">
                      <span
                        className="fw-bold"
                        style={{ color: "#979797", fontSize: "15px" }}
                      >
                        {["aircond", "light"].includes(getDevice().deviceType)
                          ? "Turn On:"
                          : "Slot 1:"}
                      </span>
                      <div className="ms-2 d-flex justify-content-between align-items-center">
                        <div className="me-3 ms-1">
                          <div
                            className=" d-flex justify-content-center align-items-center fw-bold"
                            style={{
                              borderRadius: "5px",
                              width: "65px",
                              height: "30px",
                              backgroundColor: "#ffffff",
                              border: "1px solid #979797",
                              fontSize: "15px",
                            }}
                            onClick={() => handleEditTimeClick("turnOn")}
                          >
                            <span>{turnOn}</span>
                          </div>
                        </div>
                        <div
                          className="d-flex"
                          style={{
                            width: "65px",
                            height: "30px",
                            border: "1px solid #bbbbbb",
                            borderRadius: "5px",
                            backgroundColor: "#d9d9d9",
                          }}
                        >
                          {/* AM Button  */}
                          <button
                            className={`d-flex w-50 justify-content-center align-items-center p-1 me-0 ${
                              turnOnPeriod === "AM" ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                turnOnPeriod === "AM" ? "#204160" : "#d9d9d9",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              fontSize: "12px",
                              margin: "2px",
                              fontWeight: "600",
                            }}
                            onClick={() => toggleTime("AM", "turnOn")}
                          >
                            AM
                          </button>

                          {/* PM Button  */}
                          <button
                            className={`d-flex w-50 justify-content-center align-items-center p-1 ms-0 ${
                              turnOnPeriod === "PM" ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                turnOnPeriod === "PM" ? "#204160" : "#d9d9d9",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              fontSize: "12px",
                              margin: "2px",
                              fontWeight: "600",
                            }}
                            onClick={() => toggleTime("PM", "turnOn")}
                          >
                            PM
                          </button>
                        </div>
                        {getDevice().deviceType === "irrigation" && (
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              width: "75px",
                              height: "30px",
                              border: "1px solid #979797",
                              borderRadius: "5px",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            <select
                              value={selectedDuration}
                              onChange={(e) =>
                                setSelectedDuration(e.target.value)
                              }
                              style={{
                                fontSize: "15px",
                                border: "none",
                                width: "100%",
                                textAlign: "center",
                                cursor: "pointer",
                              }}
                            >
                              {durationOptions.map((duration, index) => (
                                <option key={index} value={duration}>
                                  {duration}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d-flex justify-content-start align-items-center p-1 mt-1">
                      <span
                        className="fw-bold"
                        style={{ color: "#979797", fontSize: "15px" }}
                      >
                        {["aircond", "light"].includes(getDevice().deviceType)
                          ? "Turn Off:"
                          : "Slot 2:"}
                      </span>
                      <div className="ms-2 d-flex justify-content-between align-items-center">
                        <div className="me-3">
                          <div
                            className="d-flex justify-content-center align-items-center fw-bold"
                            style={{
                              borderRadius: "5px",
                              width: "65px",
                              height: "30px",
                              backgroundColor: "#ffffff",
                              border: "1px solid #979797",
                              fontSize: "15px",
                            }}
                            onClick={() => handleEditTimeClick("turnOff")}
                          >
                            <span>{turnOff}</span>
                          </div>
                        </div>
                        <div
                          className="d-flex"
                          style={{
                            width: "65px",
                            height: "30px",
                            border: "1px solid #bbbbbb",
                            borderRadius: "5px",
                            backgroundColor: "#d9d9d9",
                          }}
                        >
                          {/* AM Button  */}
                          <button
                            className={`d-flex w-50 justify-content-center align-items-center p-1 me-0 ${
                              turnOffPeriod === "AM" ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                turnOffPeriod === "AM" ? "#204160" : "#d9d9d9",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              fontSize: "12px",
                              margin: "2px",
                              fontWeight: "600",
                            }}
                            onClick={() => toggleTime("AM", "turnOff")}
                          >
                            AM
                          </button>

                          {/* PM Button  */}
                          <button
                            className={`d-flex w-50 justify-content-center align-items-center p-1 ms-0 ${
                              turnOffPeriod === "PM" ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                turnOffPeriod === "PM" ? "#204160" : "#d9d9d9",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              fontSize: "12px",
                              margin: "2px",
                              fontWeight: "600",
                            }}
                            onClick={() => toggleTime("PM", "turnOff")}
                          >
                            PM
                          </button>
                        </div>
                        {getDevice().deviceType === "irrigation" && (
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              width: "75px",
                              height: "30px",
                              border: "1px solid #979797",
                              borderRadius: "5px",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            <select
                              value={selectedDuration}
                              onChange={(e) =>
                                setSelectedDuration(e.target.value)
                              }
                              style={{
                                fontSize: "15px",
                                border: "none",
                                width: "100%",
                                textAlign: "center",
                                cursor: "pointer",
                              }}
                            >
                              {durationOptions.map((duration, index) => (
                                <option key={index} value={duration}>
                                  {duration}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {["petfeeder", "irrigation"].includes(
                      getDevice().deviceType
                    ) ? (
                      <div className="d-flex justify-content-start mt-3">
                        <button
                          className="btn rounded-circle d-flex align-items-center justify-content-center ms-2"
                          style={{
                            backgroundColor: "#204160",
                            width: "22px",
                            height: "22px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                            padding: "5px",
                          }}
                        >
                          <FaPlus color="white" />
                        </button>
                        <div
                          className="d-flex justify-content-center align-items-center ms-2"
                          style={{
                            height: "22px",
                          }}
                        >
                          <span style={{ fontWeight: "600" }}>New slot</span>
                        </div>
                      </div>
                    ) : null}

                    <div
                      className="mt-3"
                      onClick={() => setActiveContent("repeatTime")}
                    >
                      <div
                        className="d-flex justify-content-center justify-content-between fw-bold p-1"
                        style={{
                          borderRadius: "5px",
                          width: "100%",
                          height: "35px",
                          backgroundColor: "#ffffff",
                          border: "1px solid #979797",
                          fontSize: "16px",
                        }}
                      >
                        <span className="ms-2">Repeat</span>
                        <span className="me-2">
                          Never<IoIosArrowForward></IoIosArrowForward>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamically render all content items */}
            {getDevice().content.map((item, index) => (
              <div key={index} className="mb-4 schedule">
                <div
                  className="d-flex justify-content-between align-items-center p-3 ps-4 pe-4"
                  style={{
                    backgroundColor: getSelectedDeviceToggle(
                      getRoom().id,
                      getDevice().device_id,
                      item.feature_id
                    )
                      ? "#e3ebee"
                      : "#ffffff",
                    borderRadius: "14px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    width: "calc(100% - 15%)",
                    transition: "transform 0.3s ease",
                    transform:
                      swipedFeatureId === item.feature_id &&
                      isFeatureSwiped &&
                      item.isUserAdded
                        ? "translateX(-50px)"
                        : "translateX(0)",
                  }}
                  onTouchStart={(e) =>
                    handleTouchStart(e, item.feature_id, item.isUserAdded)
                  }
                  onTouchMove={(e) =>
                    handleTouchMove(e, item.feature_id, item.isUserAdded)
                  }
                >
                  <div>
                    <span className="feature-label">{item.feature}</span>
                    <div>
                      <span className="feature-detail-label">{item.label}</span>
                    </div>
                  </div>
                  <label className="purple-switch">
                    <input
                      type="checkbox"
                      checked={getSelectedDeviceToggle(
                        getRoom().id,
                        getDevice().device_id,
                        item.feature_id
                      )}
                      onChange={() =>
                        handleContentToggle(
                          getRoom().id,
                          getDevice().device_id,
                          item.feature_id
                        )
                      }
                    />
                    <span className="purple-slider round"></span>
                  </label>
                </div>
                <div>
                  {/* Show delete button only for user-added features */}
                  {item.isUserAdded &&
                    swipedFeatureId === item.feature_id &&
                    isFeatureSwiped && (
                      <button
                        style={{
                          backgroundColor: "red",
                          padding: "10px",
                          display: "flex",
                          borderRadius: "50%",
                          border: "none",
                          transform: "translate(-50%, 0%)",
                        }}
                      >
                        <FaTrashAlt
                          color="white"
                          size={18}
                          onClick={() => setRemoveSchedule(item)}
                        />
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Time */}
      {isEditTime && (
        <EditTimeModal
          handleTurnOnChange={handleTurnOnChange}
          handleTurnOffChange={handleTurnOffChange}
          turnType={turnType}
          toggleEditTime={toggleEditTime}
        />
      )}

      {repeat && <RepeatError handleOk={handleRepeatChange} />}

      {clickCancel && (
        <CancelAddFeature
          handleCancelAddFeature={handleCancelAddFeature}
          handleDiscardAddFeature={handleDiscardAddFeature}
        />
      )}

      {/* Remove Room Display */}
      {removeSchedule && (
        <RemoveScheduleModal
          handleCancel={handleScheduleCancel}
          handleConfirm={handleRemoveFeature}
          removeSchedule={removeSchedule}
        />
      )}
    </>
  );
};

export default DeviceSmartFeature;
