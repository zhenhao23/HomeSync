import { FaPlus } from "react-icons/fa";
import LivingRoomImage from "../assets/rooms/livingroom.svg";
import BedRoomImage from "../assets/rooms/bedroom.svg";
import KitchenImage from "../assets/rooms/kitchen.svg";
import GardenImage from "../assets/rooms/garden.svg";
import BathroomImage from "../assets/rooms/bathroom.svg";
import WeatherDisplay from "../WeatherDisplay.tsx";

const HomePage: React.FC = () => {
  const rooms = [
    { image: LivingRoomImage, title: "Living Room", devices: 1 },
    { image: BedRoomImage, title: "Bedroom", devices: 3 },
    { image: KitchenImage, title: "Kitchen", devices: 0 },
    { image: GardenImage, title: "Garden", devices: 1 },
    { image: BathroomImage, title: "Bathroom", devices: 5 },
  ];

  return (
    <>
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
          <div className="row align-items-center mb-3">
            <div className="col-4 text-start">
              <h5 className="mb-0 ms-3">Edit</h5>
            </div>
            <div className="col-4 text-center">
              <h3 className="mb-0">Rooms</h3>
            </div>
            <div className="col-4 text-end d-flex justify-content-end">
              <button
                className="me-2 btn rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#204160",
                  width: "30px",
                  height: "30px",
                }}
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
            {rooms.map((room, index) => (
              <div key={index} className="col-6 mt-3">
                <div
                  className="p-2 py-5 text-center"
                  style={{
                    backgroundColor: "#eeeeee",
                    borderRadius: "8px",
                    height: "100%",
                  }}
                >
                  <div
                    className="text-center d-flex flex-column justify-content-end align-items-center"
                    style={{
                      height: "60%",
                    }}
                  >
                    <img
                      src={room.image}
                      alt={room.title}
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
                      <h5>{room.title}</h5>
                    </p>
                    <p className="mb-0 text-center">
                      <span
                        className="px-1"
                        style={{
                          backgroundColor: "#C2C2C2",
                          borderRadius: "4px",
                        }}
                      >
                        {room.devices}
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
  );
};

export default HomePage;
