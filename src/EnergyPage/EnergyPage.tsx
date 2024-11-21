import { FaPlus, FaCaretUp, FaCaretDown } from "react-icons/fa";
import PieChart from "./PieChart.tsx";
import LampImage from "../assets/devices/lamp.svg";
import AirCondImage from "../assets/devices/aircond.svg";
import PetFeederImage from "../assets/devices/petfeeder.svg";
import IrrigationImage from "../assets/devices/irrigation.svg";
import SecurityImage from "../assets/devices/security.svg";

const EnergyPage: React.FC = () => {
  const devices = [
    {
      image: LampImage,
      title: "Lamp",
      usage: "1000 Kw/h",
      room: "Living Room",
      hours: "20 hours",
      trend: 11.2,
    },
    {
      image: AirCondImage,
      title: "Air Cond",
      usage: "700 Kw/h",
      room: "Bedroom",
      hours: "12 hours",
      trend: -10.8,
    },
    {
      image: PetFeederImage,
      title: "Pet Feeder",
      usage: "300 Kw/h",
      room: "Living Room",
      hours: "3 hours",
      trend: 8.5,
    },
    {
      image: IrrigationImage,
      title: "Irrigation",
      usage: "400 Kw/h",
      room: "Garden",
      hours: "3 hours",
      trend: -5.2,
    },
    {
      image: SecurityImage,
      title: "Home Security",
      usage: "1200 Kw/h",
      room: "Living Room",
      hours: "12 hours",
      trend: 15.3,
    },
  ];

  return (
    <>
      <PieChart />
      <div
        className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column"
        style={{
          top: "40%",
          height: "100%",
          borderRadius: "18px",
        }}
      >
        <div className="container-fluid p-3 pb-2">
          <div className="row align-items-center mb-3">
            <div className="col-4 text-start">
              <h5 className="mb-0 ms-3">
                Total{" "}
                <span
                  className="px-2"
                  style={{
                    backgroundColor: "#4C7380",
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "16px",
                    paddingBottom: "2px",
                    paddingTop: "2px",
                  }}
                >
                  5
                </span>
              </h5>
            </div>
            <div className="col-4 text-center"></div>
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

        {/* Devices List */}
        <div
          className="container-fluid overflow-auto px-4"
          style={{
            height: "calc(100% - 430px)",
          }}
        >
          <div className="row g-3 pb-5">
            {devices.map((device, index) => (
              <div key={index} className="col-12 mt-3">
                <div
                  className="p-3"
                  style={{
                    backgroundColor: "#D8E4E8",
                    borderRadius: "8px",
                    height: "100%",
                  }}
                >
                  <div className="row align-items-center">
                    <div className="col-3">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: "white",
                          borderRadius: "100%",
                          padding: "15px",
                          height: "60px",
                          width: "60px",
                        }}
                      >
                        <img
                          src={device.image}
                          alt={device.title}
                          className="img-fluid"
                          style={{ maxHeight: "30px" }}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <h6 className="mb-0">{device.title}</h6>
                      <div className="text-muted small mb-0">{device.room}</div>
                      <div className="text-muted small">{device.hours}</div>
                    </div>
                    <div className="col-3 text-end d-flex flex-column align-items-end ps-0">
                      <div className="mb-1" style={{ fontSize: "14px" }}>
                        {device.usage}
                      </div>
                      <div className="d-flex align-items-center">
                        {device.trend > 0 ? (
                          <FaCaretUp
                            className="me-1"
                            style={{ color: "#4CAF50" }}
                          />
                        ) : (
                          <FaCaretDown
                            className="me-1"
                            style={{ color: "#FF5252" }}
                          />
                        )}
                        <small
                          style={{
                            color: device.trend > 0 ? "#4CAF50" : "#FF5252",
                          }}
                        >
                          {Math.abs(device.trend)}%
                        </small>
                      </div>
                    </div>
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

export default EnergyPage;
