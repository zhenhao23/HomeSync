import { IoIosArrowBack } from "react-icons/io";
import LogoNotif from "./LogoNotif";
import WeatherDisplay from "./WeatherDisplay";
import { FaExclamationCircle } from "react-icons/fa";
import livingRoomIcon from "../assets/addRoomIcon/livingroom.svg";
import bedIcon from "../assets/addRoomIcon/bed.svg";
import kitchenTableIcon from "../assets/addRoomIcon/kitchen-table.svg";
import bathroomIcon from "../assets/addRoomIcon/bathroom.svg";
import gardenIcon from "../assets/addRoomIcon/garden.svg";
import carIcon from "../assets/addRoomIcon/car.svg";
import bookShelfIcon from "../assets/addRoomIcon/bookshelf.svg";
import coatHangerIcon from "../assets/addRoomIcon/coat-hanger.svg";
import { useState } from "react";
import { Room } from "./HomePage";

interface AddRoomProps {
  roomsState: Room[];
  setRoomsState: React.Dispatch<React.SetStateAction<Room[]>>;
  setActiveContent: (content: string) => void;
  homeId: number; // Add this prop
}

const AddRoom: React.FC<AddRoomProps> = ({
  roomsState,
  setRoomsState,
  setActiveContent,
  homeId, // Add this prop
}) => {
  // Icons array to manage the 8 icons for add room
  const addRoomIcons = [
    { image: livingRoomIcon, title: "Living Room" },
    { image: bedIcon, title: "Bedroom" },
    { image: kitchenTableIcon, title: "Kitchen" },
    { image: bathroomIcon, title: "Bathroom" },
    { image: gardenIcon, title: "Garden" },
    { image: carIcon, title: "Garage" },
    { image: bookShelfIcon, title: "Study Room" },
    { image: coatHangerIcon, title: "Closet" },
  ];

  // function handle navigate from add device page to home page
  const goBackToHomePage = () => {
    setIconTextVisible(false);
    // to ensure the flow of homepage when navigate back
    setRoomNameAlert(false);
    setRoomIconAlert(false);
    setSelectedRoomIcon(null);
    setRoomName(null);
    setActiveContent("home"); // Navigate to the previous page
  };

  // State to track the selected icon in add room page or add device page
  const [selectedRoomIcon, setSelectedRoomIcon] = useState<{
    image: string;
    title: string;
  } | null>(null);

  // State to track if to display icon text label when user clicked on a device
  const [isIconTextVisible, setIconTextVisible] = useState(false);

  // Handle click on an icon
  const handleRoomIconClick = (icon: { image: string; title: string }) => {
    setSelectedRoomIcon(icon);
    setIconTextVisible(false); // Reset the visibility before the new swipe-in animation
    setTimeout(() => {
      setIconTextVisible(true); // Trigger the swipe-in animation
    }, 150); // Adjust this timeout based on your animation duration
  };

  // state to check the room name is inputed by user (error handling)
  const [roomNameAlert, setRoomNameAlert] = useState(false);
  // state to check the icon is selected by user in add room  (error handling)
  const [roomIconAlert, setRoomIconAlert] = useState(false);
  // State to track the room name input from user in add room page
  const [roomName, setRoomName] = useState<string | null>(null);

  // First, let's create a function to make the API call
  const addRoomToAPI = async (
    roomName: string,
    iconType: string,
    homeId: number
  ) => {
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: roomName,
          iconType: iconType,
          homeId: homeId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add room");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding room:", error);
      throw error;
    }
  };

  // Now let's update your handleAddRoom function
  const handleAddRoom = async () => {
    // Validation logic (unchanged)
    if (selectedRoomIcon === null && !roomName?.trim()) {
      setRoomNameAlert(true);
      setRoomIconAlert(true);
      return;
    }
    if (!roomName?.trim()) {
      setRoomNameAlert(true);
      return;
    }
    if (selectedRoomIcon === null) {
      setRoomIconAlert(true);
      return;
    }

    try {
      // Use the homeId from props, not a hardcoded value

      // Get the icon type from the selected icon
      const iconType = selectedRoomIcon.title;

      console.log("Sending request to add room:", {
        name: roomName,
        iconType: iconType,
        homeId: homeId,
      });

      // Call the API to add the room - use the full URL
      const response = await fetch("http://localhost:5000/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: roomName,
          iconType: iconType,
          homeId: homeId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server responded with error:", errorData);
        throw new Error(errorData.error || "Failed to add room");
      }

      const newRoomFromAPI = await response.json();
      console.log("Room added successfully:", newRoomFromAPI);

      // Create a new room object using the data returned from the API
      const newRoom = {
        id: newRoomFromAPI.id,
        image: selectedRoomIcon.image,
        title: roomName,
        devices: 0,
      };

      // Add new room to the rooms list
      setRoomsState((prevRooms) => [...prevRooms, newRoom]);

      // Reset states
      setRoomName(null);
      setSelectedRoomIcon(null);
      setRoomNameAlert(false);
      setRoomIconAlert(false);

      // Navigate back to home page
      goBackToHomePage();
    } catch (error) {
      console.error("Failed to add room:", error);
      // You might want to show an error message to the user
    }
  };

  // // function to add a room
  // const handleAddRoom = () => {
  //   // Case if user didn't input room name and icon in add room page
  //   if (selectedRoomIcon === null && !roomName?.trim()) {
  //     setRoomNameAlert(true);
  //     setRoomIconAlert(true);
  //     return;
  //   }
  //   // Case if user didn't input room name in add room page
  //   if (!roomName?.trim()) {
  //     setRoomNameAlert(true);
  //     return;
  //   }
  //   // Case if user didn't input icon in add room page
  //   if (selectedRoomIcon === null) {
  //     setRoomIconAlert(true);
  //     return;
  //   }

  //   // new room
  //   const newRoom = {
  //     id: roomsState.length,
  //     image: selectedRoomIcon.image,
  //     title: roomName,
  //     devices: 0,
  //   };

  //   // Add new room to the rooms list
  //   setRoomsState((prevRooms) => [...prevRooms, newRoom]);
  //   // Update the room's devices count in roomsState

  //   setRoomName(null); // Reset the room name input
  //   setSelectedRoomIcon(null); // Reset selected icon
  //   setRoomNameAlert(false); // Reset room Alert to false state
  //   setRoomIconAlert(false); // Reset icon alert to false state

  //   // Navigate back to home page
  //   goBackToHomePage();
  // };

  // function to handle general navigate back to home page
  const handleBackToHomePage = () => {
    goBackToHomePage();
    // to ensure the flow of homepage when navigate back
    setRoomNameAlert(false);
    setRoomIconAlert(false);
    setSelectedRoomIcon(null);
    setRoomName(null);
  };

  return (
    <>
      <LogoNotif setActiveContent={setActiveContent} />
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
                    {selectedRoomIcon?.title}
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
                          selectedRoomIcon?.title === i.title
                            ? "#d9d9d9"
                            : "#f5f5f5",
                        borderRadius: "50%",
                        maxWidth: "calc(100% - 20%)",
                        maxHeight: "calc(100% - 20%)",
                      }}
                      onClick={() => handleRoomIconClick(i)}
                    >
                      <img src={i.image} alt={i.title} className="img-fluid" />
                    </div>
                  </div>
                ))}
              </div>
              {!selectedRoomIcon && roomIconAlert ? (
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
