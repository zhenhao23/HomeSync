import { useState, useEffect } from "react";
import {
  FaBell,
  FaUser,
  FaUsers,
  FaLanguage,
  FaLock,
  FaCamera,
  FaHome,
  FaChartPie,
  FaSun,
  FaPlus,
  FaTrash,
  FaSignOutAlt,
  FaCheck,
  FaEllipsisV
} from "react-icons/fa";
import EditProfilePage from "./EditProfile";
import LanguagesPage from "./Languages";
import ChangePasswordPage from "./ChangePassword";
import ManageUsers from "./ManageUsers";
import ProfileImage from "./img1.jpeg";
import AlvinProfilePic from './img1.jpeg';
import AnnaProfilePic from './anna-profile.avif';
import AdrianProfilePic from './adrian-profile.avif';
import JoshuaProfilePic from './joshua-profile.avif';
import LilyProfilePic from './lily-profile.avif';
import "./ProfilePage.css";
import "./laptop333.css";

// Define User Type
interface UserType {
  id: number;
  name: string;
  profilePic: string;
}

const ProfilePage = () => {
  const [currentPage, setCurrentPage] = useState("profile");
  const [userData, setUserData] = useState({
    name: "Alvin",
    email: "alvin1112@gmail.com",
    profileImage: ProfileImage,
  });
  const [isLaptopView, setIsLaptopView] = useState(false);
  const [showHomeModal, setShowHomeModal] = useState(false);
  const [homes, setHomes] = useState([
    { id: 1, name: "Smart Home 1", selected: false },
    { id: 2, name: "Smart Home 2", selected: true }
  ]);
  
  // Shared state for users that will be used across both mobile and laptop views
  const [users, setUsers] = useState<UserType[]>([
    {
      id: 1,
      name: "Alvin (You)",
      profilePic: AlvinProfilePic,
    },
    { 
      id: 2, 
      name: "Alice", 
      profilePic: "" 
    },
    { 
      id: 3, 
      name: "Anna", 
      profilePic: AnnaProfilePic
    },
    { 
      id: 4, 
      name: "Adrian", 
      profilePic: AdrianProfilePic
    },
    { 
      id: 5, 
      name: "Joshua", 
      profilePic: JoshuaProfilePic
    },
    { 
      id: 6, 
      name: "Lily", 
      profilePic: LilyProfilePic
    },
  ]);
  
  // State for the invite modal
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number, y: number } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setUserData({
          name: data.name || "Alvin",
          email: data.email || "alvin1112@gmail.com",
          profileImage: data.profileImage || ProfileImage,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const checkScreenSize = () => {
      setIsLaptopView(window.innerWidth >= 1024);
    };

    // Close context menu when clicking anywhere
    const handleClickOutside = () => {
      setContextMenuPosition(null);
    };

    fetchUserData();
    checkScreenSize();
    
    window.addEventListener('resize', checkScreenSize);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Implement logout functionality
    alert("Logging out...");
    // In a real app, you would clear auth tokens, cookies, etc.
    // and redirect to login page
  };

  const handleAddHome = () => {
    setShowHomeModal(true);
  };

  const selectHome = (id: number) => {
    setHomes(homes.map(home => ({
      ...home,
      selected: home.id === id
    })));
  };
  
  // Handle adding a new user
  const addUser = () => {
    if (!email) return;
    const newUser: UserType = {
      id: Math.max(...users.map(user => user.id)) + 1, // Generate new ID
      name: email.split("@")[0],
      profilePic: "",
    };
    setUsers([...users, newUser]);
    setEmail("");
    setShowInvite(false);
  };
  
  // Handle deleting a user
  const deleteUser = (userId: number) => {
    // Don't delete the owner (Alvin)
    if (userId === 1) return;
    
    setUsers(users.filter(user => user.id !== userId));
    setContextMenuPosition(null);
  };
  
  // Handle right-click on user in laptop view
  const handleUserContextMenu = (e: React.MouseEvent, userId: number) => {
    e.preventDefault();
    if (userId === 1) return; // Can't delete the owner
    
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setSelectedUserId(userId);
  };

  const HomeModal = () => {
    return (
      <div className="home-modal">
        <div className="home-modal-content">
          <div className="modal-header">Switch Home</div>
          
          <ul className="home-list">
            {homes.map(home => (
              <li 
                key={home.id} 
                className={`home-item ${home.selected ? 'selected' : ''}`}
                onClick={() => selectHome(home.id)}
              >
                {home.name}
                {home.selected && <FaCheck className="check-icon" />}
              </li>
            ))}
          </ul>
          
          <div className="add-new-home">
            <span className="plus-icon"><FaPlus size={14} /></span>
            <span>Add New Home</span>
          </div>
          
          <div className="modal-actions">
            <button className="cancel-button" onClick={() => setShowHomeModal(false)}>
              Cancel
            </button>
            <button className="done-button" onClick={() => setShowHomeModal(false)}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Invite modal for adding new users
  const InviteModal = () => {
    return (
      <div className="modal-overlay">
        <div className="invite-modal">
          <h3>Invite People</h3>
          <p>
            Share a code via email to grant secure access to your smart home.
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
    );
  };
  
  // Context menu for right-click delete functionality
  const ContextMenu = () => {
    if (!contextMenuPosition) return null;
    
    return (
      <div 
        className="context-menu"
        style={{ 
          position: 'fixed', 
          top: contextMenuPosition.y, 
          left: contextMenuPosition.x,
          zIndex: 1000,
          background: 'white',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          borderRadius: '4px',
          padding: '8px 0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="context-menu-item"
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#e74c3c'
          }}
          onClick={() => deleteUser(selectedUserId!)}
        >
          <FaTrash />
          <span>Delete User</span>
        </div>
      </div>
    );
  };

  const renderMobileView = () => {
    switch (currentPage) {
      case "edit-profile":
        return (
          <EditProfilePage
            onBack={() => setCurrentPage("profile")}
            userData={userData}
            setUserData={setUserData}
          />
        );
      case "languages":
        return <LanguagesPage onBack={() => setCurrentPage("profile")} />;
      case "change-password":
        return <ChangePasswordPage onBack={() => setCurrentPage("profile")} />;
      case "manage-users":
        return (
          <ManageUsers 
            onBack={() => setCurrentPage("profile")} 
            users={users} 
            setUsers={setUsers}
          />
        );
      default:
        return (
          <>
            <h1 className="profile-heading">My Profile</h1>
            <div className="profile-content">
              {/* Profile Section */}
              <div className="profile-info">
                <div className="profile-image-container">
                  <div className="profile-image">
                    <img className="profile-image2"
                      src={userData.profileImage} 
                      alt="Profile" 
                    />
                  </div>
                  <div className="camera-icon">
                    <FaCamera size={16} color="#666" />
                  </div>
                </div>
                <div className="user-details">
                  <h2 className="user-name">{userData.name}</h2>
                  <p className="user-email">{userData.email}</p>
                </div>
              </div>

              {/* Divider Line */}
              <div className="divider333" />

              {/* Menu Section */}
              <div className="profile-menu">
                {/* First grey container */}
                <div className="menu-group">
                  <button
                    className="menu-item"
                    onClick={() => setCurrentPage("edit-profile")}
                  >
                    <FaUser className="menu-icon" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    className="menu-item"
                    onClick={() => setCurrentPage("manage-users")}
                  >
                    <FaUsers className="menu-icon" />
                    <span>Manage Users</span>
                  </button>

                  <button
                    className="menu-item"
                    onClick={() => setCurrentPage("languages")}
                  >
                    <FaLanguage className="menu-icon" />
                    <span>Languages</span>
                  </button>

                  <button
                    className="menu-item"
                    onClick={() => setCurrentPage("change-password")}
                  >
                    <FaLock className="menu-icon" />
                    <span>Change Password</span>
                  </button>
                </div>

                {/* Second grey container */}
                <div className="notification-group">
                  <div className="notification-item">
                    <div className="notification-left">
                      <FaBell className="menu-icon" />
                      <span>Notification</span>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                      />
                    </div>
                  </div>
                </div>

                {/* Add Home and Log Out buttons */}
                <div className="mobile-action-buttons">
                  <button className="add-home-button" onClick={handleAddHome}>
                    <FaHome className="button-icon" />
                    <span>Add Home</span>
                  </button>
                  <button className="log-out-button" onClick={handleLogout}>
                    <FaSignOutAlt className="button-icon" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  const renderLaptopView = () => {
    return (
      <div className="laptop-container">
        {/* Content Area */}
        <div className="laptop-content-wrapper">
          <div className="laptop-profile-container">
            {/* Profile Section */}
            <div className="laptop-profile-left">
              <div className="laptop-profile-info">
                <div className="laptop-profile-image-container">
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="laptop-profile-image"
                  />
                  <div className="laptop-camera-icon">
                    <FaCamera size={16} color="#666" />
                  </div>
                </div>
                <div className="laptop-user-details">
                  <h2 className="laptop-user-name">{userData.name}</h2>
                  <p className="laptop-user-email">{userData.email}</p>
                </div>
              </div>
              
              {currentPage === "profile" && (
                <>
                  <div className="laptop-profile-form">
                    <div className="laptop-form-group">
                      <label className="laptop-form-label">Full Name:</label>
                      <input 
                        type="text" 
                        className="laptop-form-input" 
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                      />
                    </div>
                    <div className="laptop-form-group">
                      <label className="laptop-form-label">Email Address:</label>
                      <input 
                        type="email" 
                        className="laptop-form-input" 
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                      />
                    </div>
                    <button className="laptop-button">Edit</button>
                  </div>
                  
                  <div className="laptop-divider"></div>
                  
                  <div className="laptop-profile-options">
                    <div 
                      className="laptop-option-item"
                      onClick={() => setCurrentPage("languages")}
                    >
                      <FaLanguage className="laptop-option-icon" />
                      <span>Languages</span>
                    </div>
                    
                    <div 
                      className="laptop-option-item"
                      onClick={() => setCurrentPage("change-password")}
                    >
                      <FaLock className="laptop-option-icon" />
                      <span>Change Password</span>
                    </div>
                    
                    <div className="laptop-notification-option">
                      <div className="laptop-notification-left">
                        <FaBell className="laptop-option-icon" />
                        <span>Notification</span>
                      </div>
                      <label className="laptop-toggle">
                        <input type="checkbox" />
                        <span className="laptop-slider"></span>
                      </label>
                    </div>
                  </div>

                  {/* Add Home and Log Out buttons for laptop view */}
                  <div className="laptop-action-buttons">
                    <button className="laptop-add-home-button" onClick={handleAddHome}>
                      <FaHome className="laptop-button-icon" />
                      <span>Add Home</span>
                    </button>
                    <button className="laptop-log-out-button" onClick={handleLogout}>
                      <FaSignOutAlt className="laptop-button-icon" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}

              {currentPage === "languages" && (
                <LanguagesPage onBack={() => setCurrentPage("profile")} />
              )}
              
              {currentPage === "change-password" && (
                <ChangePasswordPage onBack={() => setCurrentPage("profile")} />
              )}
            </div>
            
            {/* Manage Users Section */}
            <div className="laptop-manage-users">
              <div className="laptop-manage-header">
                <h2 className="laptop-manage-title">Manage Users</h2>
              </div>
              
              <div className="laptop-user-header-row">
                <div className="laptop-total-users">Total {users.length}</div>
                <button className="laptop-add-user-btn" onClick={() => setShowInvite(true)}>
                  <FaPlus />
                </button>
              </div>
              
              <ul className="laptop-user-list">
                {users.map((user) => (
                  <li 
                    key={user.id} 
                    className="laptop-user-item"
                    onContextMenu={(e) => handleUserContextMenu(e, user.id)}
                  >
                    <div className="laptop-user-profile">
                      {user.profilePic ? (
                        <div className="laptop-user-pic">
                          <img src={user.profilePic} alt={user.name} />
                        </div>
                      ) : (
                        <div className="laptop-default-avatar">{user.name.charAt(0)}</div>
                      )}
                      <div className="laptop-user-name">{user.name}</div>
                    </div>
                    {user.id !== 1 && (
                      <div 
                        className="laptop-delete-indicator"
                        onClick={() => deleteUser(user.id)}
                      >
                        <FaTrash />
                        <span>Delete</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="profile-page">
      {isLaptopView ? renderLaptopView() : renderMobileView()}
      {showHomeModal && <HomeModal />}
      {showInvite && <InviteModal />}
      {contextMenuPosition && <ContextMenu />}
    </div>
  );
};

export default ProfilePage;