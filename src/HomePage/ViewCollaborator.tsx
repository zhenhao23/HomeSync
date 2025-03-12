import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { Collaborator, Room } from "./HomePage";
import { useState } from "react";
import RemoveCollabModal from "./RemoveCollabModal";
import NoCollabMessage from "./NoCollabMessage";
import "./ViewCollaborator.css";

interface ViewCollaboratorProps {
  setActiveContent: (content: string) => void;
  roomsState: Room[];
  setRoomsState: React.Dispatch<React.SetStateAction<Room[]>>;
  getRoom: () => Room;
}

const ViewCollaborator: React.FC<ViewCollaboratorProps> = ({
  setActiveContent,
  roomsState,
  setRoomsState,
  getRoom,
}) => {
  // state to store swipe status for each collaborator
  const [swipedCollab, setSwipedCollab] = useState<string | null>(null);

  // state to track the startX position when user swipe
  const [startX, setStartX] = useState(0);
  // State to track if a swipe is in progress
  const [isSwiping, setIsSwiping] = useState(false);

  // Handle touch start for collaborators
  const handleCollabTouchStart = (e: React.TouchEvent, collabId: number) => {
    setStartX(e.touches[0].clientX); // Store the initial touch position
    setSwipedCollab(collabId.toString()); // Track the swiped device
    setIsSwiping(false);
  };

  // Handle touch move for collaborators
  const handleCollabTouchMove = (e: React.TouchEvent, collabId: number) => {
    if (!swipedCollab) return; // Prevent move if no collab is swiped
    setIsSwiping(true);

    const currentX = e.touches[0].clientX; // Get the current touch position
    const deltaX = currentX - startX; // Calculate the change in position

    // Update the swipe state based on deltaX
    if (deltaX < -50) {
      // If swiped to the left
      setSwipedCollab(collabId.toString());
    } else if (deltaX > 50) {
      // If swiped to the right
      setSwipedCollab(null);
      setIsSwiping(false);
    }
  };

  // State to track the currently selected/swiped collaborator to remove
  const [removeCollab, setRemoveCollab] = useState<Collaborator | null>(null);

  // Function to remove collaborator from the CollabState
  const handleRemoveCollab = () => {
    if (removeCollab) {
      setRoomsState((prevRooms) =>
        prevRooms.map((room) => ({
          ...room,
          collaborators: room.collaborators.filter(
            (collab) => collab.id !== removeCollab.id
          ),
        }))
      );
    }
    setRemoveCollab(null); // Reset after removal
    setSwipedCollab(null);
  };

  // function to handle cancel action modal in collaborator page
  const handleCollabCancel = () => {
    // Reset the removeCollab state to null
    setRemoveCollab(null);
    setSwipedCollab(null);
  };

  const selectedRoom = roomsState.find((room) => room.id === getRoom().id);

  return (
    <>
      <div className="view-collab-background">
        <div className="view-collab-container">
          <div className="view-collab-header">
            {/* Back Button */}
            <div
              className="view-collab-back"
              onClick={() => setActiveContent("viewDeviceStatus")}
            >
              <IoIosArrowBack size={22} className="view-collab-arrow" />
              <span className="view-collab-word">Back</span>
            </div>

            {/* Title */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Display the title normally when not in edit mode */}
              <h3 className="fw-bold me-2 view-collab-title">Collaborators</h3>
            </div>
          </div>

          {/* White container  */}
          <div className="d-flex flex-column view-collab-laptop">
            {/* Total collaborators and plus button */}
            <div className="row align-items-center mb-2 p-4">
              <div className="col-6 d-flex align-items-center justify-content-start">
                <h5 style={{ color: "#404040", margin: "0" }}>Total&nbsp;</h5>
                <span
                  className="px-2 fw-semibold"
                  style={{
                    backgroundColor: "#4c7380",
                    borderRadius: "4px",
                    color: "#f9fbfb",
                  }}
                >
                  3
                </span>
              </div>
              <div className="col-6 d-flex justify-content-end">
                <button
                  className="me-2 btn rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "#204160",
                    width: "30px",
                    height: "30px",
                  }}
                  onClick={() => setActiveContent("addCollaborator")}
                >
                  <FaPlus color="white" />
                </button>
              </div>
            </div>

            {/* Collaborators */}
            <div
              className="d-flex flex-column overflow-auto"
              style={{ height: "calc(100% - 260px)" }}
            >
              {selectedRoom ? (
                selectedRoom.collaborators.length > 0 ? (
                  selectedRoom.collaborators.map((person) => (
                    <div className="collab-list" key={person.id}>
                      <div
                        className="p-3 mb-4 d-flex justify-content-between"
                        style={{
                          backgroundColor: "#f5f5f5",
                          borderRadius: "16px",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                          width: "calc(100% - 15%)",
                          height: "76px",
                          transition: "transform 0.3s ease",
                          transform:
                            swipedCollab === person.id.toString() && isSwiping
                              ? "translateX(-50px)"
                              : "translateX(0)",
                        }}
                        onTouchStart={(e) =>
                          handleCollabTouchStart(e, person.id)
                        }
                        onTouchMove={(e) => handleCollabTouchMove(e, person.id)}
                      >
                        <div className="d-flex align-items-center">
                          <img src={person.image} className="img-fluid" />
                          <span className="ms-3">
                            {person.name}{" "}
                            {person.type === "Owner" ? "(Owner)" : ""}
                          </span>
                        </div>
                      </div>

                      <div>
                        {swipedCollab === person.id.toString() && isSwiping && (
                          <button
                            style={{
                              backgroundColor: "red",
                              padding: "10px",
                              display: "flex",
                              borderRadius: "50%",
                              border: "none",
                              transform: "translate(-50%, -30%)",
                            }}
                            onClick={() => setRemoveCollab(person)}
                          >
                            <FaTrashAlt color="white" size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <NoCollabMessage />
                )
              ) : (
                <p style={{ textAlign: "center", color: "#404040" }}>
                  Room not found.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Remove Collaborator */}
        {removeCollab && (
          <RemoveCollabModal
            removeCollab={removeCollab}
            handleCollabCancel={handleCollabCancel}
            handleRemoveCollab={handleRemoveCollab}
          />
        )}
      </div>
    </>
  );
};

export default ViewCollaborator;
