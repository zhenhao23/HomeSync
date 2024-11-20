import Vector4 from "./assets/weather/Vector4.svg";
import Vector5 from "./assets/weather/Vector5.svg";
import Vector6 from "./assets/weather/Vector6.svg";

const WeatherDisplay: React.FC = () => {
  return (
    <div
      className="position-fixed start-50 translate-middle-x w-100 d-flex flex-row"
      style={{
        top: "15%",
        height: "10%",
      }}
    >
      {/* Weather Vectors */}
      <div className="d-flex w-25">
        {/* Sun Beam */}
        <img
          src={Vector6}
          alt="Weather Vector 6"
          className="img-fluid"
          style={{
            width: "48px",
            height: "48px",
            transform: "translateX(60%) translateY(0%)",
          }}
        />
        {/* Sun */}
        <img
          src={Vector5}
          alt="Weather Vector 5"
          className="img-fluid"
          style={{
            width: "27px",
            height: "38px",
            transform: "translateX(-35%) translateY(41%)",
          }}
        />
        {/* Cloud */}
        <img
          src={Vector4}
          alt="Weather Vector 4"
          className="img-fluid"
          style={{
            width: "48px",
            height: "48px",
            transform: "translateX(-90%) translateY(50%)",
          }}
        />
      </div>
      {/* Weather Content */}
      <div
        className="d-flex flex-column text-white p-2"
        style={{ width: "40%" }}
      >
        <div style={{ fontSize: "12px" }}>
          <p className="m-0">Nov 6, 2024 9:41 am</p>
        </div>
        <div style={{ fontSize: "16px" }}>
          <p className="m-0">
            <b>Cloudy</b>
          </p>
        </div>
        <div style={{ fontSize: "12px" }}>
          <p className="m-0">Putrajaya, Malaysia</p>
        </div>
      </div>
      <div
        className="d-flex flex-column text-white p-2"
        style={{ width: "35%" }}
      >
        <div style={{ fontSize: "40px" }}>
          <p className="m-0">
            <b>19°C</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
