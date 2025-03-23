import React, { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import "./ManageUsers.css";
import UserDevices from "./UserDevices";
import ProfileImage from "./img1.jpeg";
import AnnaProfilePic from "./anna-profile.avif";
import AdrianProfilePic from "./adrian-profile.avif";
import JoshuaProfilePic from "./joshua-profile.avif";
import LilyProfilePic from "./lily-profile.avif";
import { IoIosArrowBack } from "react-icons/io";

// Add this helper function
const getProfilePicture = (profilePicPath: string) => {
  switch (profilePicPath) {
    case "/img1.jpeg":
      return ProfileImage;
    case "/anna-profile.avif":
      return AnnaProfilePic;
    case "/adrian-profile.avif":
      return AdrianProfilePic;
    case "/joshua-profile.avif":
      return JoshuaProfilePic;
    case "/lily-profile.avif":
      return LilyProfilePic;
    default:
      return ProfileImage;
  }
};

interface UserType {
  id: number;
  name: string;
  profilePic: string;
}

interface ManageUsersProps {
  onBack: () => void;
  users: UserType[];
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
}

const ManageUsers: React.FC<ManageUsersProps> = ({
  onBack,
  users,
  setUsers,
}) => {
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [swipedUserId, setSwipedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const touchStartX = useRef<number>(0);
  const currentTranslateX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const [translateX, setTranslateX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent, userId: number) => {
    if (userId === 1) return; // Prevent swiping for owner
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
    setSwipedUserId(userId);
    setTranslateX(0); // Reset
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;

    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    currentTranslateX.current = Math.min(Math.max(diff, -100), 0);

    const element = e.currentTarget as HTMLElement;
    element.style.transform = `translateX(${currentTranslateX.current}px)`;

    // Show/hide delete indicator based on swipe distance
    const deleteIndicator = element.querySelector(
      ".delete-indicator"
    ) as HTMLElement;
    if (deleteIndicator) {
      deleteIndicator.style.opacity = Math.min(
        Math.abs(currentTranslateX.current) / 75,
        1
      ).toString();
    }
  };
 

  const handleTouchEnd = (e: React.TouchEvent, userId: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const element = e.currentTarget as HTMLElement;

    if (currentTranslateX.current < -50) {
      // Delete the user if swiped far enough
      element.style.transform = "translateX(-100%)";
      element.style.transition = "transform 0.2s ease-out";
      setTimeout(() => {
        setUsers(users.filter((user) => user.id !== userId));
      }, 200);
    } else {
      // Reset position if not swiped far enough
      element.style.transform = "translateX(0)";
      element.style.transition = "transform 0.2s ease-out";
    }

    setTimeout(() => {
      element.style.transition = "";
      currentTranslateX.current = 0;
      setSwipedUserId(null);
    }, 200);
  };

  

  const addUser = () => {
    if (!email) return;
    const newUser: UserType = {
      id: Math.max(...users.map((user) => user.id)) + 1, // Generate new ID
      name: email.split("@")[0],
      profilePic: "",
    };
    setUsers([...users, newUser]);
    setEmail("");
    setShowInvite(false);
  };

  if (selectedUser) {
    return (
      <UserDevices onBack={() => setSelectedUser(null)} user={selectedUser} />
    );
  }

  return (
    <div className="manage-users">
      <div className="header">
        {/* Back Button - Stays on the Left */}
        <div
          onClick={onBack}
          style={{
            padding: "8px 15px",
            cursor: "pointer",
            position: "absolute",
            left: 0, // Ensures it's on the left
            display: "flex",
            alignItems: "center",
          }}
        >
          <IoIosArrowBack size={22} color="#FFFFFF" />
          <span
            style={{ marginLeft: "8px", color: "#FFFFFF", fontSize: "16px" }}
          >
            Back
          </span>
        </div>

        {/* Centered Title */}
        <h3
          className="fw-bold"
          style={{
            color: "#FFFFFF",
            fontSize: "1.5rem",
            textAlign: "center",
            flex: 1, // Ensures it takes available space
          }}
        >
          Manage Users
        </h3>
      </div>

      <div className="content-container">
        <div className="header-row">
          <div className="total-users">Total {users.length}</div>
          <button className="add-user-btn" onClick={() => setShowInvite(true)}>
            <FaPlus /> Add
          </button>
        </div>

        <ul className="user-list">
          {users.map((user) => (
            <li
              key={user.id}
              className={`user-item ${
                swipedUserId === user.id ? "swiping" : ""
              }`}
              onTouchStart={(e) => handleTouchStart(e, user.id)}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => handleTouchEnd(e, user.id)}
              onClick={() => setSelectedUser(user)}
              style={{
                transform: `translateX(${swipedUserId === user.id ? translateX : 0}px)`,
                transition: isDragging.current ? "none" : "transform 0.2s ease-out",
              }}
            >
              <div className="user-content">
                {user.profilePic ? (
                  <img
                    src={getProfilePicture(user.profilePic)}
                    alt={user.name}
                    className="profile-pic"
                  />
                ) : (
                  <div className="default-avatar">{user.name.charAt(0)}</div>
                )}
                <span>{user.name}</span>
              </div>
              {/* <div>
                {swipedUserId === user.id && (
                  <button
                    onClick={() =>
                      setUsers(users.filter((u) => u.id !== user.id))
                    }
                    style={{
                      backgroundColor: "red",
                      padding: "10px",
                      display: "flex",
                      borderRadius: "50%",
                      border: "none",
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10,
                    }}
                  >
                    <FaTrashAlt color="white" size={18} />
                  </button>
                )}
              </div> */}
            </li>
          ))}
        </ul>

        {showInvite && (
          <div className="modal-overlay">
            <div className="invite-modal">
              <h3>Invite People</h3>
              <p>
                Share a code via email to grant secure access to your smart
                home.
              </p>
              <input
                type="email"
                placeholder="Enter their email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="modal-actions">
                <button onClick={() => setShowInvite(false)}>Cancel</button>
                <button onClick={addUser}>Done</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
