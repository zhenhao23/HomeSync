import collabIcon from "../assets/collaborators/collaboratorProfile.svg";
import { IoIosArrowBack } from "react-icons/io";
import { Collaborator } from "./HomePage";
import { useState } from "react";

interface AddCollabProps {
  setActiveContent: (content: string) => void;
}

const AddCollaborator: React.FC<AddCollabProps> = ({ setActiveContent }) => {
  // Predefined add collaborator array
  const addCollab: Collaborator[] = [
    {
      id: 0,
      name: "Adrian",
      image: collabIcon,
      type: "Dweller",
    },
    {
      id: 1,
      name: "Joshua",
      image: collabIcon,
      type: "Dweller",
    },
    {
      id: 2,
      name: "Lily",
      image: collabIcon,
      type: "Dweller",
    },
  ];

  // State to store selected collab to add in add collab page
  const [addSelectCollab, setAddSelectCollab] = useState<Collaborator[]>([]);

  // function to handle selecting collabs
  const handleAddCollabSelect = (collab: Collaborator) => {
    //setAddSelectCollab(collab); // Set selected device
    setAddSelectCollab((prevSelected) => {
      const isAlreadySelected = prevSelected.some((c) => c.id === collab.id);

      if (isAlreadySelected) {
        // Remove from selection if already selected
        return prevSelected.filter((c) => c.id !== collab.id);
      } else {
        // Add to selection if not selected
        return [...prevSelected, collab];
      }
    });
  };

  const isSelected = (person: Collaborator) => {
    return addSelectCollab.some((c) => c.id === person.id);
  };

  return (
    <>
      <div style={{ position: "relative", top: "60px" }}>
        {/* Back Button */}
        <div
          onClick={() => setActiveContent("viewCollaborators")}
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
            Add Collaborators
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
        {/* Collaborators */}
        <div
          className="d-flex flex-column overflow-auto"
          style={{ height: "calc(100% - 280px)", marginTop: "25px" }}
        >
          {/* Render collaborators */}
          {addCollab.map((person) => (
            <div
              className="d-flex justify-content-center align-items-center"
              key={person.id}
              style={{
                width: "100vw",
              }}
            >
              <div
                className="p-4 mb-4 d-flex"
                style={{
                  backgroundColor: isSelected(person) ? "#e3ebee" : "#ffffff",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                  width: "calc(100% - 15%)",
                  height: "76px",
                }}
              >
                <div className="d-flex align-items-center">
                  <img src={person.image} className="img-fluid" />
                  <span className="ms-3">
                    {person.name} {person.type === "Owner" ? "(Owner)" : ""}
                  </span>
                </div>
                <label className="container col-1 me-0">
                  <input
                    type="checkbox"
                    onChange={() => handleAddCollabSelect(person)}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Add Collab */}
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            height: "calc(100% - 95%)",
          }}
        >
          <button
            className="btn p-2 px-5"
            style={{
              backgroundColor: "#204160",
              color: "white",
              borderRadius: "12px",
              cursor: "pointer",
            }}
            //onClick={() => handleConnectClick("deviceSetting")}
          >
            <h6>Add</h6>
          </button>
        </div>
      </div>
    </>
  );
};

export default AddCollaborator;
