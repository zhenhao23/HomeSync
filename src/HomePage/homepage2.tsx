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
import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import ViewDeviceStatus from "./ViewDeviceStatus.tsx";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // State to manage the active content
  const [activeContent, setActiveContent] = useState<string | null>("home");

  const rooms = [
    { image: LivingRoomImage, title: "Living Room", devices: 1 },
    { image: BedRoomImage, title: "Bedroom", devices: 3 },
    { image: KitchenImage, title: "Kitchen", devices: 0 },
    { image: GardenImage, title: "Garden", devices: 1 },
    { image: BathroomImage, title: "Bathroom", devices: 5 },
  ];

  // Icons array to manage the 8 icons
  const icons = [
    { image: livingRoomIcon, title: "Living Room" },
    { image: bedIcon, title: "Bed" },
    { image: kitchenTableIcon, title: "Kitchen Table" },
    { image: bathroomIcon, title: "Bathroom" },
    { image: gardenIcon, title: "Garden" },
    { image: carIcon, title: "Car" },
    { image: bookShelfIcon, title: "BookShelf" },
    { image: coatHangerIcon, title: "Coat Hanger" },
  ];

  // Handle button click to set active content
  const handleButtonClick = (content: string) => {
    setActiveContent(content); // Set the content based on the clicked button
  };

  const handleBackToHomePage = () => {
    setActiveContent("home");
  };

  const handleRoomClick = (room: {
    image: string;
    title: string;
    devices: number;
  }) => {
    navigate("/view-device-status", { state: room }); // Pass room data as state when navigating
  };

  return (
    <>
      <LogoNotif />
      <WeatherDisplay />

      {/* Render content based on activeContent state */}
      {activeContent === "home" ? (
        // Default content with rooms and buttons
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
              {rooms.map((r, index) => (
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
                      className="text-center d-flex flex-column justify-content-end align-items-center"
                      style={{
                        height: "60%",
                      }}
                    >
                      <img
                        src={r.image}
                        alt={r.title}
                        className="img-fluid mb-2"
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
      ) : activeContent === "addRoom" ? (
        // Content for when the "Add Room" button is clicked
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
                  id="roomName"
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
                />
              </div>
            </div>
            <div className="pt-3 pb-2 container-fluid">
              <span className="mb-3 fw-normal" style={{ color: "#204160" }}>
                Icon:
              </span>
              <div className="d-flex flex-wrap justify-content-start">
                {icons.map((i, index) => (
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
                      <img src={i.image} alt={i.title} className="img-fluid" />
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
                >
                  <h6>Save</h6>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : activeContent === "viewDeviceStatus" ? (
        <ViewDeviceStatus />
      ) : null}
    </>
  );
};

export default HomePage;
