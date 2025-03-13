import { IoIosArrowBack } from "react-icons/io";
import Warning from "./Warning";
import AccessRequest from "./AccessRequest";
import personImage from "../assets/notification/notif.svg";
import "./ViewNotification.css";

interface viewNotifProps {
  setActiveContent: (content: string) => void;
  accessRequests: { id: number; person: string; requestItem: string }[];
  handleRemoveRequest: (id: number) => void;
}

const viewNotification: React.FC<viewNotifProps> = ({ setActiveContent,accessRequests, handleRemoveRequest }) => {

  return (
    <>
      {/* Container for Back Button and Title, button */}
      <div className="view-notif-background">
        <div className="view-notif-laptop">
          <div className="view-notif-container">
            <div className="view-notif-header">
              {/* Back Button */}
              <div
                className="view-notif-back"
                onClick={() => {
                  setActiveContent("home");
                }}
              >
                <IoIosArrowBack size={22} className="view-notif-arrow" />
                <span className="view-notif-word">Back</span>
              </div>

              {/* Room Title */}
              <div className="d-flex col-12 justify-content-center text-center">
                {/* Display the title normally when not in edit mode */}
                <h3 className="fw-bold view-notif-title">Notifications</h3>
              </div>
            </div>

            {/* Notifications */}
            {/* White container */}
            <div className="view-notif-div">
              <div className="view-notif-list">
                {/* Warning */}
                <Warning
                  title={"Warning:"}
                  message={"Your Energy Usage Limit has surpassed."}
                />
                <div
                  className="d-flex justify-content-start"
                  style={{ marginLeft: "40px" }}
                >
                  <h6 className="text-dark fw-bold pt-1 pb-2">
                    Access Requested:
                  </h6>
                </div>
                <div>
                  {accessRequests.map((request, index) => (
                    <AccessRequest
                      key={index}
                      requestId={request.id}
                      image={personImage}
                      person={request.person}
                      requestItem={request.requestItem}
                      handleRemoveRequest={handleRemoveRequest}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default viewNotification;
