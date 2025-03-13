import { IoIosArrowBack } from "react-icons/io";
import { Collaborator } from "./HomePage";
import { useState } from "react";
import collabIcon from "../assets/addCollab/collab-profile.svg";
import "./AddCollaborator.css";

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
      <div className="add-collab-background">
        <div className="add-collab-container">
          <div className="add-collab-header">
            {/* Back Button */}
            <div
              onClick={() => setActiveContent("viewCollaborators")}
              className="add-collab-back"
            >
              <IoIosArrowBack size={22} className="add-collab-arrow" />
              <span className="add-collab-word">Back</span>
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
              <h3 className="fw-bold me-2 add-collab-title">
                Add Collaborators
              </h3>
            </div>
          </div>

          {/* White container  */}
          <div className="d-flex flex-column add-collab-laptop">
            {/* Collaborators */}
            <div className="d-flex flex-column add-collab-div">
              {/* Render collaborators */}
              {addCollab.map((person) => (
                <div className="add-collab-list" key={person.id}>
                  <div
                    className="p-4 mb-4 d-flex"
                    style={{
                      backgroundColor: isSelected(person)
                        ? "#e3ebee"
                        : "#ffffff",
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
        </div>
      </div>
    </>
  );
};

export default AddCollaborator;
