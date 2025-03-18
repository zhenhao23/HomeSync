import React, { useState, useRef } from "react";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import "./ManageUsers.css";
import UserDevices from "./UserDevices";
import ProfileImage from "./img1.jpeg";
import AnnaProfilePic from "./anna-profile.avif";
import AdrianProfilePic from "./adrian-profile.avif";
import JoshuaProfilePic from "./joshua-profile.avif";
import LilyProfilePic from "./lily-profile.avif";

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

  const handleTouchStart = (e: React.TouchEvent, userId: number) => {
    if (userId === 1) return; // Prevent swiping for owner
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
    setSwipedUserId(userId);
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
        <FaArrowLeft className="back-icon" onClick={onBack} />
        <h2>Manage Users</h2>
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
            >
              <div className="delete-indicator">
                <FaTrash />
                <span>Delete</span>
              </div>
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
