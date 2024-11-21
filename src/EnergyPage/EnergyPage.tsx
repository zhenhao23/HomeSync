import { FaPlus } from "react-icons/fa";
const EnergyPage: React.FC = () => {
  return (
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
            <h3 className="mb-0">Energy</h3>
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
    </div>
  );
};

export default EnergyPage;
