import { FaMinus, FaPen, FaPlus } from "react-icons/fa";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import { Day, Device, Room } from "./HomePage";

interface ManageDeviceProps {
  devType: string | null;
  handleButtonClick: (content: string) => void;
  getDevice: () => Device;
  handleEditDeviceClick: () => void;
  getUnitLabel: (deviceType: string) => string;
  getSelectedDeviceStatus: (roomId: number, deviceId: number) => boolean;
  getRoom: () => Room;
  handleToggle: (roomId: number, deviceId: number) => void;
  handleDecreaseCelsius: () => void;
  startChangingTemperature: (action: () => void) => void;
  stopChangingTemperature: () => void;
  handleIncreaseCelsius: () => void;
  getIntensityLabel: (deviceType: string) => string;
  getIntensityIcon: (deviceType: string) => { on: string; off: string };
  smallCircles: number[];
  handleSmallCircleClick: (index: number) => void;
  circlePosition: number;
  handleTouchStartCircle: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchMoveCircle: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchEndCircle: () => void;
  dragging: boolean;
  handleAddFeature: () => void;
  addFeature: boolean;
  days: Day[];
  activeDay: Day | null;
  handleDayClick: (day: { name: string; letter: string }) => void;
  handleEditTimeClick: () => void;
  period: string;
  toggleTime: (time: string) => void;
  getSelectedDeviceToggle: (
    roomId: number,
    deviceId: number,
    toggleKey: "toggle1" | "toggle2"
  ) => boolean;
  handleContentToggle: (
    roomId: number,
    deviceId: number,
    toggleKey: "toggle1" | "toggle2"
  ) => void;
}

const ManageDevice: React.FC<ManageDeviceProps> = ({
  devType,
  handleButtonClick,
  getDevice,
  handleEditDeviceClick,
  getUnitLabel,
  getSelectedDeviceStatus,
  getRoom,
  handleToggle,
  handleDecreaseCelsius,
  startChangingTemperature,
  stopChangingTemperature,
  handleIncreaseCelsius,
  getIntensityLabel,
  getIntensityIcon,
  smallCircles,
  handleSmallCircleClick,
  circlePosition,
  handleTouchStartCircle,
  handleTouchMoveCircle,
  handleTouchEndCircle,
  dragging,
  handleAddFeature,
  addFeature,
  days,
  activeDay,
  handleDayClick,
  handleEditTimeClick,
  period,
  toggleTime,
  getSelectedDeviceToggle,
  handleContentToggle,
}) => {
  return (
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
                    {getDevice().deviceType === "aircond"
                      ? getDevice().devData.celsius
                      : getDevice().devData.percentage}

                    {/* If it's aircon, show the mapped Celsius value; otherwise, show percentage */}
                    {/* {getDevice().deviceType === "aircond"
                    ? getTemperature() // Assuming percentage represents the scroll position
                    : getDevice().devData.percentage} */}
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
                        getDevice().device_id
                      )} // Access the state for the specific device
                      onChange={() => {
                        handleToggle(getRoom().id, getDevice().device_id); // Toggle state for the specific device
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

            {/* Display button for different device */}
            {getDevice().deviceType === "aircond" ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "90px" }}
              >
                <button
                  className="me-5 btn p-2 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "#ffffff",
                    width: "70px",
                    height: "50px",
                    borderRadius: "15px",
                  }}
                  onClick={handleDecreaseCelsius}
                  disabled={getDevice().devData.celsius === 14}
                  onTouchStart={() =>
                    startChangingTemperature(handleDecreaseCelsius)
                  }
                  onTouchEnd={stopChangingTemperature}
                  onMouseDown={() =>
                    startChangingTemperature(handleDecreaseCelsius)
                  }
                  onMouseUp={stopChangingTemperature}
                >
                  <FaMinus color="black" size={"18"} />
                </button>

                <button
                  className="me-2 btn p-2 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "#ffffff",
                    width: "70px",
                    height: "50px",
                    borderRadius: "15px",
                  }}
                  onClick={handleIncreaseCelsius}
                  disabled={getDevice().devData.celsius === 30}
                  onTouchStart={() =>
                    startChangingTemperature(handleIncreaseCelsius)
                  }
                  onTouchEnd={stopChangingTemperature}
                  onMouseDown={() =>
                    startChangingTemperature(handleIncreaseCelsius)
                  }
                  onMouseUp={stopChangingTemperature}
                >
                  <FaPlus color="black" size={"18"} />
                </button>
              </div>
            ) : (
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
                      onClick={() => handleSmallCircleClick(index)}
                    ></div>
                  ))}

                  {/* Draggable Big Circle */}
                  <div
                    className="big_circle"
                    style={{
                      marginLeft: "3.5%",
                      left: `${circlePosition}%`,
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
            )}
          </div>
          {/* White container */}
          <div
            className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column overflow-auto"
            style={{
              top: "50%",
              height: "45%",
              borderRadius: "18px",
              paddingBottom: "15%",
            }}
          >
            <div className="d-flex justify-content-between align-items-center p-4">
              <div className="text-start ms-3">
                <h3 className="mb-0 fw-bold" style={{ color: "#204160" }}>
                  Smart Features
                </h3>
              </div>
              <div className="text-end d-flex justify-content-end">
                {addFeature ? (
                  <div
                    className="d-flex justify-content-center align-items-center me-2"
                    style={{
                      backgroundColor: "#204160",
                      color: "#ffffff",
                      borderRadius: "90px",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                      fontWeight: "500",
                      width: "65px",
                      height: "30px",
                      fontSize: "15px",
                    }}
                    onClick={handleAddFeature}
                  >
                    Done
                  </div>
                ) : (
                  <button
                    className="me-2 btn rounded-circle p-2 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#204160",
                      width: "30px",
                      height: "30px",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                    }}
                    onClick={handleAddFeature}
                  >
                    <FaPlus color="white" />
                  </button>
                )}
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
                      <div
                        className={`ms-2 d-flex justify-content-between align-items-center ${
                          getDevice().deviceType === "irrigation"
                            ? "col-9"
                            : "col-6"
                        }`}
                      >
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
                          onClick={handleEditTimeClick}
                        >
                          <span>08: 20</span>
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
                              period === "AM" ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                period === "AM" ? "#204160" : "#d9d9d9",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              fontSize: "12px",
                              margin: "2px",
                              fontWeight: "600",
                            }}
                            onClick={() => toggleTime("AM")}
                          >
                            AM
                          </button>

                          {/* PM Button  */}
                          <button
                            className={`d-flex w-50 justify-content-center align-items-center p-1 ms-0 ${
                              period === "PM" ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                period === "PM" ? "#204160" : "#d9d9d9",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              fontSize: "12px",
                              margin: "2px",
                              fontWeight: "600",
                            }}
                            onClick={() => toggleTime("PM")}
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
                            <span style={{ fontSize: "14px" }}>10 mins</span>
                            <IoIosArrowDown size={16} />
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
                      <div
                        className={`ms-2 d-flex justify-content-between align-items-center ${
                          getDevice().deviceType === "irrigation"
                            ? "col-9"
                            : "col-6"
                        }`}
                      >
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
                          onClick={handleEditTimeClick}
                        >
                          <span>11: 20</span>
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
                              period === "AM" ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                period === "AM" ? "#204160" : "#d9d9d9",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              fontSize: "12px",
                              margin: "2px",
                              fontWeight: "600",
                            }}
                            onClick={() => toggleTime("AM")}
                          >
                            AM
                          </button>

                          {/* PM Button  */}
                          <button
                            className={`d-flex w-50 justify-content-center align-items-center p-1 ms-0 ${
                              period === "PM" ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                period === "PM" ? "#204160" : "#d9d9d9",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              fontSize: "12px",
                              margin: "2px",
                              fontWeight: "600",
                            }}
                            onClick={() => toggleTime("PM")}
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
                            <span style={{ fontSize: "14px" }}>15 mins</span>
                            <IoIosArrowDown size={16} />
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

                    <div className="mt-3">
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
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
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
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
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
  );
};

export default ManageDevice;
