import { IoIosArrowBack } from "react-icons/io";
import Warning from "./Warning";
import AccessRequest from "./AccessRequest";
import personImage from "../assets/notification/notif.svg";

interface viewNotifProps {
  setActiveContent: (content: string) => void;
}

const accessRequests = [
  { person: "Alice", requestItem: "Garden" },
  { person: "Bob", requestItem: "Kitchen" },
  { person: "Charlie", requestItem: "Smart Lock" },
];

const viewNotification: React.FC<viewNotifProps> = ({ setActiveContent }) => {
  return (
    <>
      {/* Container for Back Button and Title, button */}
      <div
        className="d-flex justify-content-between"
        style={{ width: "100%", position: "relative", top: "60px" }}
      >
        {/* Back Button */}
        <div
          onClick={() => {
            setActiveContent("home");
          }}
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
            Notifications
          </h3>
        </div>

        {/* Notifications */}
        <div
          className="d-flex flex-column overflow-auto"
          style={{ height: "calc(100% - 260px)" }}
        >
          {/* White container */}
          <div
            className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column overflow-auto"
            style={{
              top: "13%",
              height: "100%",
              borderRadius: "18px",
            }}
          >
            {/* Warning */}
            <Warning
              title={"Warning:"}
              message={"Your Energy Usage Limit has surpassed."}
            />
            <div
              className="d-flex justify-content-start"
              style={{ marginLeft: "40px" }}
            >
              <h6 className="text-dark fw-bold pt-1 pb-2">Access Requested:</h6>
            </div>
            <div>
              {accessRequests.map((request, index) => (
                <AccessRequest
                  key={index}
                  image={personImage}
                  person={request.person}
                  requestItem={request.requestItem}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default viewNotification;
