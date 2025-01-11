import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaSync } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import profile1Icon from "../assets/viewDeviceProfile/profile1.svg";
import profile2Icon from "../assets/viewDeviceProfile/profile2.svg";
import "./Switch.css"; // Import the CSS for toggle button
import "./RadioButton.css";
import { useState } from "react";
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

const ViewDeviceStatus: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const room = location.state as {
    image: string;
    title: string;
    devices: number;
  };

  const devices = ["Pet Feeder 02134", "Air conditioner 31837", "Lights 1221"];

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

  const handleBackToViewDevice = () => {
    setActiveContent(null);
  };

  const handleBackToHomePage = () => {
    navigate("/");
  };

  // Initialize state as an array of false values, one for each device
  const [deviceStates, setDeviceStates] = useState<boolean[]>(
    Array(room.devices).fill(false)
  );

  const handleToggle = (index: number) => {
    // Toggle the state for the specific device
    const newDeviceStates = [...deviceStates];
    newDeviceStates[index] = !newDeviceStates[index];
    setDeviceStates(newDeviceStates);
  };

  // State to manage the active content
  const [activeContent, setActiveContent] = useState<string | null>(
    "viewDeviceStatus"
  );

  // Handle button click to set active content
  const handleButtonClick = (content: string) => {
    setActiveContent(content); // Set the content based on the clicked button
  };

  // Array to track swipe states for each device
  const [isSwiped, setIsSwiped] = useState<boolean[]>(
    Array(room.devices).fill(false)
  );
  const [startX, setStartX] = useState(0);

  // Handle touch start event
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  // Handle touch move event for swiping
  const handleTouchMove = (e: React.TouchEvent, index: number) => {
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    setIsSwiped((prev) => {
      const newSwipeState = [...prev];
      if (deltaX < -50) {
        newSwipeState[index] = true; // Set swipe state to true for swiped device
      } else if (deltaX > 50) {
        newSwipeState[index] = false; // Reset swipe state for device
      }
      return newSwipeState;
    });
  };

  {
    /*
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode or exit mode
  const [title, setTitle] = useState(() => room?.title || "Room"); // Track the current title
  const [tempTitle, setTempTitle] = useState(title); // Temporary title during editing

  const handleEditClick = () => {
    setTempTitle(title); // Set temp title to current title
    setIsEditing(true); // Open the modal
  };

  const handleConfirm = () => {
    setTitle(tempTitle); // Update the title
    setIsEditing(false); // Exit edit mode
  };

  const handleCancel = () => {
    setTempTitle(title); // Reset to original title
    setIsEditing(false); // Exit edit mode
  };
*/
  }
  return (
    <>
      {activeContent === "viewDeviceStatus" ? (
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
                {room.title} {/* {title} */}
              </h3>
              {/* Edit Icon */}
              <FaPen
                className="mb-1"
                size={15}
                color="white"
                //onClick={handleEditClick} // Enable edit mode when clicked
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
              {Array.from({ length: room.devices }).map((_, index) => (
                <div
                  key={index}
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

                      transition: "transform 0.3s ease", // Smooth transition for transform
                      transform: isSwiped[index]
                        ? "translateX(-50px)"
                        : "translateX(0)",
                    }}
                    onTouchStart={(e) => handleTouchStart(e)}
                    onTouchMove={(e) => handleTouchMove(e, index)}
                  >
                    <span>Device {index + 1}</span>
                    <div className="text-end">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={deviceStates[index]} // Access the state for the specific device
                          onChange={() => handleToggle(index)} // Toggle state for the specific device
                        />
                        <span className="slider round"></span>
                        <span className="on-text">ON</span>
                        <span className="off-text">OFF</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    {isSwiped[index] && (
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
              ))}
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
              onClick={handleBackToViewDevice}
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
            {devices.map((device, index) => (
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
                //margin: "auto",
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
                          backgroundColor: "#eeeeee",
                          borderRadius: "50%",
                          maxWidth: "calc(100% - 20%)",
                          maxHeight: "calc(100% - 20%)",
                        }}
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
      ) : null}

      {/* Edit Title */}
      {/*
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
            <h4>Edit Room Title</h4>
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
        */}
    </>
  );
};

export default ViewDeviceStatus;
