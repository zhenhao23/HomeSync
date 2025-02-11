import { IoIosArrowBack } from "react-icons/io";
import LogoNotif from "./LogoNotif";
import WeatherDisplay from "./WeatherDisplay";
import { FaExclamationCircle } from "react-icons/fa";
import { roomIcon } from "./HomePage";

interface AddRoomProps {
  roomName: string | null;
  roomNameAlert: boolean;
  selectedIcon: { image: string; title: string } | null;
  addRoomIcons: roomIcon[];
  iconAlert: boolean;
  isIconTextVisible: boolean;
  setRoomName: (name: string | null) => void;
  handleFromAddDeviceToHome: () => void;
  handleIconClick: (icon: { image: string; title: string }) => void;
  handleAddRoom: () => void;
}

const AddRoom: React.FC<AddRoomProps> = ({
  roomName,
  roomNameAlert,
  selectedIcon,
  addRoomIcons,
  iconAlert,
  isIconTextVisible,
  setRoomName,
  handleFromAddDeviceToHome,
  handleIconClick,
  handleAddRoom,
}) => {
  return (
    <>
      <LogoNotif />
      <WeatherDisplay />
      <div
        className="bg-white position-fixed start-50 translate-middle-x w-100 overflow-auto"
        style={{
          top: "27%",
          height: "calc(100% - 30%)",
          borderRadius: "18px",
        }}
      >
        <div
          onClick={handleFromAddDeviceToHome}
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
            <p
              className="mb-3 fw-normal"
              style={{ color: "#204160", fontSize: "18px" }}
            >
              Name:
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "80vw",
                }}
              >
                <input
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
                    fontSize: "17px",
                    border: "2px solid",
                    borderColor: !roomName && roomNameAlert ? "red" : "#eeeeee",
                  }}
                  onChange={(e) => setRoomName(e.target.value)}
                />
                {roomNameAlert && !roomName && (
                  <FaExclamationCircle
                    color="red"
                    size={20}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="pt-3 pb-2 container-fluid">
            <div>
              <span
                className="mb-3 fw-normal"
                style={{ color: "#204160", fontSize: "18px" }}
              >
                Icon:
              </span>

              <div
                className="d-flex align-items-center"
                style={{
                  overflow: "hidden",
                  marginTop: "-7%",
                  position: "absolute",
                  right: "0",
                  width: "145px",
                  height: "45px",
                }}
              >
                <div
                  className="d-flex justify-content-start align-items-center ps-4"
                  style={{
                    position: "absolute",
                    right: "0",
                    marginLeft: "auto",
                    width: "135px",
                    height: "35px",
                    backgroundColor: "#204160",
                    borderTopLeftRadius: "18px",
                    borderBottomLeftRadius: "18px",
                    transition: "transform 0.15s ease-in-out",
                    transform: isIconTextVisible
                      ? "translateX(0)"
                      : "translateX(105%)",
                    boxShadow: `0 0 3px 3px rgba(255, 255, 255, 0.4) inset,
                              0 0 2px 2px rgba(0, 0, 0, 0.3)`,
                  }}
                >
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "15px",
                    }}
                  >
                    {selectedIcon?.title}
                  </span>
                </div>
              </div>
            </div>
            <div>
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
                      <img src={i.image} alt={i.title} className="img-fluid" />
                    </div>
                  </div>
                ))}
              </div>
              {!selectedIcon && iconAlert ? (
                <div
                  className="p-1"
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <span style={{ color: "red", fontSize: "15px" }}>
                    Please select a room type!
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "calc(100% - 90%)",
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
  );
};

export default AddRoom;
