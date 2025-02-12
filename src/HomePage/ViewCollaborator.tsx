import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { Collaborator } from "./HomePage";
import { useState } from "react";
import collaboratorIcon from "../assets/collaborators/collaboratorProfile.svg";
import RemoveCollabModal from "./RemoveCollabModal";

interface ViewCollaboratorProps {
  handleButtonClick: (content: string) => void;
}

const ViewCollaborator: React.FC<ViewCollaboratorProps> = ({
  handleButtonClick,
}) => {
  // Predefined collaborator array
  const collaborators: Collaborator[] = [
    {
      id: 0,
      name: "Alvin",
      image: collaboratorIcon,
      type: "Owner",
    },
    {
      id: 1,
      name: "Alice",
      image: collaboratorIcon,
      type: "Dweller",
    },
    {
      id: 2,
      name: "Anna",
      image: collaboratorIcon,
      type: "Dweller",
    },
  ];

  // state to store swipe status for each collaborator
  const [swipedCollab, setSwipedCollab] = useState<{
    [collabId: number]: boolean;
  }>({});

  // state to track the startX position when user swipe
  const [startX, setStartX] = useState(0);

  // Handle touch start for collaborators
  const handleCollabTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX); // Store the initial touch position
  };

  // Handle touch move for collaborators
  const handleCollabTouchMove = (e: React.TouchEvent, collabId: number) => {
    if (!swipedCollab) return; // Prevent move if no collab is swiped

    const currentX = e.touches[0].clientX; // Get the current touch position
    const deltaX = currentX - startX; // Calculate the change in position

    // Update the swipe state based on deltaX
    if (deltaX < -50) {
      // If swiped to the left
      setSwipedCollab((prev) => ({
        ...prev,
        [collabId]: true, // swiped
      }));
    } else if (deltaX > 50) {
      // If swiped to the right
      setSwipedCollab((prev) => ({
        ...prev,
        [collabId]: false, // not swiped
      }));
    }
  };

  // state to track the collaborator's state from collaborators array
  const [collabState, setCollabState] = useState(collaborators);

  // State to track the currently selected/swiped collaborator to remove
  const [removeCollab, setRemoveCollab] = useState<Collaborator | null>(null);

  // Function to remove collaborator from the CollabState
  const handleRemoveCollab = (collab: Collaborator) => {
    setRemoveCollab(collab); // Set the collaborator to be removed

    if (removeCollab) {
      // Remove the collaborator from the collaborators list based on the collaborator's id
      setCollabState((prevCollaborators) =>
        prevCollaborators.filter((collab) => collab.id !== removeCollab.id)
      );

      setRemoveCollab(null); // Reset after removal
    }
  };

  // function to handle cancel action modal in collaborator page
  const handleCollabCancel = () => {
    if (removeCollab) {
      // Reset the swiped state for the selected collaborator
      setSwipedCollab((prevState) => ({
        ...prevState,
        [removeCollab.id]: false, // Set the specific collaborator's swipe state to false
      }));
    }

    // Reset the removeCollab state to null
    setRemoveCollab(null);
  };

  return (
    <>
      <div style={{ position: "relative", top: "60px" }}>
        {/* Back Button */}
        <div
          onClick={() => handleButtonClick("viewDeviceStatus")}
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

        {/* Title */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Display the title normally when not in edit mode */}
          <h3
            className="fw-bold me-2"
            style={{ color: "#FFFFFF", fontSize: "1.5rem" }}
          >
            Collaborators
          </h3>
        </div>
      </div>

      {/* White container  */}
      <div
        className="bg-white position-fixed start-50 translate-middle-x w-100 d-flex flex-column"
        style={{
          top: "13%",
          height: "100%",
          borderRadius: "18px",
        }}
      >
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
          {/* Render collaborators */}
          {collabState.map((person) => (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100vw",
                }}
              >
                <div
                  className="p-3 mb-4 d-flex justify-content-between"
                  style={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: "16px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                    width: "calc(100% - 15%)",
                    height: "76px",
                    transition: "transform 0.3s ease",
                    transform: swipedCollab[person.id]
                      ? "translateX(-50px)"
                      : "translateX(0)",
                  }}
                  onTouchStart={(e) => handleCollabTouchStart(e)}
                  onTouchMove={(e) => handleCollabTouchMove(e, person.id)}
                >
                  <div className="d-flex align-items-center">
                    <img src={person.image} className="img-fluid" />
                    <span className="ms-3">
                      {person.name} {person.type === "Owner" ? "(Owner)" : ""}
                    </span>
                  </div>
                </div>

                <div>
                  {swipedCollab[person.id] && (
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
            </div>
          ))}
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
    </>
  );
};

export default ViewCollaborator;
