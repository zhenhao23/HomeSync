import { useState, useEffect } from "react";
import {
  FaBell,
  FaUser,
  FaUsers,
  // FaLanguage,
  FaLock,
  FaCamera,
  FaHome,
  // FaChartPie,
  // FaSun,
  FaPlus,
  FaTrash,
  FaSignOutAlt,
  FaCheck,
  // FaEllipsisV,
  FaArrowLeft,
  FaBed,
  FaCouch,
  FaUtensils,
  FaQuestionCircle, // Added for Help icon
} from "react-icons/fa";
import EditProfilePage from "./EditProfile";
import ChangePasswordPage from "./ChangePassword";
import ManageUsers from "./ManageUsers";
import ProfileImage from "./img1.jpeg";
// import AlvinProfilePic from "./img1.jpeg";
import AnnaProfilePic from "./anna-profile.avif";
import AdrianProfilePic from "./adrian-profile.avif";
import JoshuaProfilePic from "./joshua-profile.avif";
import LilyProfilePic from "./lily-profile.avif";
import "./ProfilePage.css";
import "./laptop333.css";
import { useHome } from "../App.tsx";
import { useNavigate } from "react-router-dom";
import OwnerGuard from "../OwnerGuard.tsx";

interface HomeItem {
  id: number;
  name: string;
  selected: boolean;
}

// Define User Type
interface UserType {
  id: number;
  name: string;
  profilePic: string;
}

// Define Device Type
interface DeviceType {
  name: string;
  location: string;
  icon: JSX.Element;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("profile");
  const [userData, setUserData] = useState({
    name: "Alvin",
    email: "alvin1112@gmail.com",
    profileImage: ProfileImage,
  });

  const [isLaptopView, setIsLaptopView] = useState(false);
  const [showHomeModal, setShowHomeModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [homes, setHomes] = useState([
    { id: 1, name: "Smart Home 1", selected: false },
    { id: 2, name: "Smart Home 2", selected: true },
  ]);
  // State for adding new home
  const [newHomeName, setNewHomeName] = useState("");
  const [showAddHomeInput, setShowAddHomeInput] = useState(false);

  // Update users state to empty array initially
  const [users, setUsers] = useState<UserType[]>([]);

  // Add state for current home
  const [, setCurrentHome] = useState<number | null>(null);

  // Add these state variables near the top with your other state declarations
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [, setUpdateError] = useState<string | null>(null);

  // Add this state for feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Add loading state
  const [isHomeLoading, setIsHomeLoading] = useState(false);

  // Add this near your other hooks/state declarations
  const { switchHome } = useHome();

  // Function to fetch users for a specific home
  const fetchHomeUsers = async (homeId: number, token: string) => {
    try {
      const response = await fetch(
        `https://homesync-production.up.railway.app/api/dwellers/home/${homeId}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch home users");
        return;
      }

      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching home users:", error);
    }
  };

  // Then update your selectHome function to use the context
  const selectHome = async (id: number) => {
    try {
      setIsHomeLoading(true);
      // Update UI state
      setHomes(
        homes.map((home) => ({
          ...home,
          selected: home.id === id,
        }))
      );

      // Set current home ID in state
      setCurrentHome(id);

      // Use the context function to update globally
      switchHome(id);

      console.log(`Switched to home: ${id}, saved in localStorage`);

      // Show feedback message
      setFeedbackMessage(`Switched to ${homes.find((h) => h.id === id)?.name}`);

      // Hide the message after 3 seconds
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 3000);

      // Fetch users for the selected home
      const token = localStorage.getItem("authToken");
      if (token) {
        await fetchHomeUsers(id, token);
      }
    } catch (error) {
      console.error("Error switching home:", error);
      setFeedbackMessage("Failed to switch home");
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 3000);
    } finally {
      setIsHomeLoading(false);
    }
  };

  // Add this useEffect to initialize the form data when userData changes
  useEffect(() => {
    const nameParts = userData.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    setFormData({
      firstName,
      lastName,
    });
  }, [userData.name]);

  // 1. Remove the duplicate useEffect hook
  // 2. Ensure the home loading is properly handled

  // Replace the duplicate useEffect with the correct single implementation

  // Added state for Help/Download modal
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error("No authentication token found");
          return;
        }

        // Fetch the current user's data
        const response = await fetch(
          "https://homesync-production.up.railway.app/api/users/current",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const user = await response.json();
        console.log("Current user ID:", user.id); // Log the user ID for debugging

        setUserData({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          profileImage: user.profilePictureUrl || ProfileImage,
        });

        // After getting user data, fetch the user's homes
        const homesResponse = await fetch(
          "https://homesync-production.up.railway.app/api/homes/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!homesResponse.ok) {
          console.error("Failed to fetch homes");
          return;
        }

        const homesData = await homesResponse.json();
        console.log("API response for homes:", homesData);
        console.log("Number of homes returned:", homesData.length);

        if (homesData.length > 0) {
          // Get current home ID from localStorage
          const currentHomeIdFromStorage =
            localStorage.getItem("currentHomeId");

          // Format homes for the state - THIS IS THE CODE YOU ASKED ABOUT
          const formattedHomes = homesData.map((home: any) => ({
            id: home.id,
            name: home.name,
            // Select the home that matches localStorage, or first home if no match
            selected: currentHomeIdFromStorage
              ? home.id === parseInt(currentHomeIdFromStorage)
              : false,
          }));

          // If no home is selected yet, select the first one
          if (!formattedHomes.some((home: HomeItem) => home.selected)) {
            formattedHomes[0].selected = true;
          }

          setHomes(formattedHomes);

          // Get the ID of the selected home
          const selectedHome = formattedHomes.find(
            (home: HomeItem) => home.selected
          );
          const selectedHomeId = selectedHome
            ? selectedHome.id
            : formattedHomes[0].id;

          // Set current home ID and save to localStorage
          setCurrentHome(selectedHomeId);
          localStorage.setItem("currentHomeId", selectedHomeId.toString());

          // Fetch users for this home
          fetchHomeUsers(selectedHomeId, token);
        }
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

    window.addEventListener("resize", checkScreenSize);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Update the modal close button to optionally refresh app data
  // Update the modal close button to handle refresh more elegantly
  const closeHomeModalAndRefresh = () => {
    setShowHomeModal(false);

    // Get the selected home
    const selectedHome = homes.find((home) => home.selected);

    if (!selectedHome) return;

    // Get the current home ID from localStorage
    const storedHomeId = localStorage.getItem("currentHomeId");
    const currentHomeId = storedHomeId ? parseInt(storedHomeId) : null;

    // If the selected home is different from what's in localStorage
    if (selectedHome.id !== currentHomeId) {
      // Ask if user wants to refresh the app
      if (
        window.confirm(
          `Switched to ${selectedHome.name}. Refresh to see updated data?`
        )
      ) {
        // Navigate to home page - this will trigger data reload with the new home ID
        navigate("/home", { replace: true }); // Navigates to home page replacing current history
      }
    }
  };

  // Add this helper function in your ProfilePage component
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

  // Add this function to handle form submission in laptop view
  const handleLaptopProfileUpdate = async () => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Validation
      if (!formData.firstName || !formData.lastName) {
        throw new Error("Both first name and last name are required");
      }

      // Make the API call to update user data
      const response = await fetch(
        "https://homesync-production.up.railway.app/api/users/current",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const result = await response.json();

      // Update the local state with the new data
      setUserData({
        ...userData,
        name: `${result.user.firstName} ${result.user.lastName}`,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdateError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // State for the invite modal
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // State for user devices modal
  const [showUserDevices, setShowUserDevices] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isAddingHome, setIsAddingHome] = useState(false);

  // Function to handle downloading the user guide
  const handleDownloadUserGuide = () => {
    // First close the modal
    setShowHelpModal(false);

    // Create a blob with the PDF content and proper MIME type
    fetch("/HomeSyncUserGuide.pdf")
      .then((response) => response.blob())
      .then((blob) => {
        // Create a link element
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(
          new Blob([blob], { type: "application/pdf" })
        );
        link.href = url;
        link.download = "HomeSyncUserGuide.pdf";

        // Append to the document, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL object
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
        alert("Failed to download the User Guide. Please try again later.");
      });
  };

  const handleAddHome = () => {
    setShowHomeModal(true);
  };

  // Function to handle Help button click
  const handleHelpClick = () => {
    setShowHelpModal(true);
  };

  // Function to add a new home
  const addNewHome = async () => {
    if (newHomeName.trim() === "") return;

    setIsAddingHome(true);

    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      // Call the API to create a new home
      const response = await fetch(
        "https://homesync-production.up.railway.app/api/homes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newHomeName.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create home: ${response.status}`);
      }

      const newHomeData = await response.json();
      console.log("API response:", newHomeData); // Debugging log

      // Handle both formats - the one wrapped in 'home' and the direct format
      const homeData = newHomeData.home || newHomeData;

      // Add the new home to the list
      const newHome = {
        id: homeData.id,
        name: homeData.name,
        selected: false,
      };

      // Update homes state with the new home (not selected by default)
      setHomes([...homes, newHome]);

      setNewHomeName("");
      setShowAddHomeInput(false);

      // Fetch users for the new home
      if (token) {
        fetchHomeUsers(newHome.id, token);
      }

      // Optional: Select the newly created home
      // selectHome(newHome.id);
    } catch (error) {
      console.error("Error creating new home:", error);
    } finally {
      setIsAddingHome(false);
    }
  };

  // Handle adding a new user
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

  // Handle deleting a user
  const deleteUser = (userId: number) => {
    // Don't delete the owner (Alvin)
    if (userId === 1) return;

    setUsers(users.filter((user) => user.id !== userId));
    setContextMenuPosition(null);
  };

  // Handle right-click on user in laptop view
  const handleUserContextMenu = (e: React.MouseEvent, userId: number) => {
    e.preventDefault();
    if (userId === 1) return; // Can't delete the owner

    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setSelectedUserId(userId);
  };

  // Handle clicking on a user to show their devices
  const handleUserClick = (user: UserType) => {
    setSelectedUser(user);
    setShowUserDevices(true);
  };

  const handleLogout = () => {
    // Clear authentication tokens and user-specific data
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentHomeId");

    // Redirect to the login page
    navigate("/signin");
  };

  const HomeModal = () => {
    return (
      <div className="home-modal">
        <div className="home-modal-content">
          <div className="modal-header">Switch Home</div>

          {feedbackMessage && (
            <div
              style={{
                padding: "8px 12px",
                marginBottom: "12px",
                backgroundColor: "#4caf50",
                color: "white",
                borderRadius: "4px",
                textAlign: "center",
              }}
            >
              {feedbackMessage}
            </div>
          )}

          {/* Add the loading spinner here */}
          {isHomeLoading && (
            <div
              className="loading-spinner"
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "15px 0",
                color: "#4c7380",
              }}
            >
              <div
                style={{
                  border: "3px solid #f3f3f3",
                  borderTop: "3px solid #4c7380",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  animation: "spin 1s linear infinite",
                }}
              />
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          <ul className="home-list">
            {homes.map((home) => (
              <li
                key={home.id}
                className={`home-item ${home.selected ? "selected" : ""}`}
                onClick={() => selectHome(home.id)}
              >
                {home.name}
                {home.selected && <FaCheck className="check-icon" />}
              </li>
            ))}
          </ul>

          {!showAddHomeInput ? (
            <div
              className="add-new-home"
              onClick={() => setShowAddHomeInput(true)}
            >
              <span className="plus-icon">
                <FaPlus size={14} />
              </span>
              <span>Add New Home</span>
            </div>
          ) : (
            <div className="add-new-home-input">
              <input
                type="text"
                placeholder="Enter home name"
                value={newHomeName}
                onChange={(e) => setNewHomeName(e.target.value)}
                autoFocus
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  width: "100%",
                  marginBottom: "8px",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => {
                    setShowAddHomeInput(false);
                    setNewHomeName("");
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    background: "#f5f5f5",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={addNewHome}
                  disabled={isAddingHome}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "1px solid #0066cc",
                    background: "#0066cc",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "64px",
                  }}
                >
                  {isAddingHome ? (
                    <div
                      style={{
                        border: "2px solid white",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        width: "16px",
                        height: "16px",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button
              className="cancel-button"
              onClick={() => setShowHomeModal(false)}
            >
              Cancel
            </button>
            <button className="done-button" onClick={closeHomeModalAndRefresh}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Help/Download modal
  const HelpModal = () => {
    return (
      <div className="home-modal">
        <div className="home-modal-content">
          <div className="modal-header">Download User Guide</div>

          <div className="help-content" style={{ padding: "20px 10px" }}>
            <p>Do you want to download the User Guide PDF?</p>
          </div>

          <div className="modal-actions">
            <button
              className="cancel-button"
              onClick={() => setShowHelpModal(false)}
            >
              Cancel
            </button>
            <button className="done-button" onClick={handleDownloadUserGuide}>
              Download
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

  // User Devices Modal
  const UserDevicesModal = () => {
    if (!selectedUser) return null;

    // Generate some example devices for the user
    const devices: DeviceType[] = [
      {
        name: "Living Room Light",
        location: "Living Room",
        icon: <FaCouch size={24} />,
      },
      {
        name: "Bedroom AC",
        location: `${selectedUser.name}'s Bedroom`,
        icon: <FaBed size={24} />,
      },
      {
        name: "Kitchen Light",
        location: "Kitchen",
        icon: <FaUtensils size={24} />,
      },
    ];

    return (
      <div className="modal-overlay">
        <div className="invite-modal user-devices-modal">
          <div className="user-devices-header">
            <FaArrowLeft
              className="back-icon"
              onClick={() => setShowUserDevices(false)}
              style={{ cursor: "pointer" }}
            />
            <h3>User Devices</h3>
          </div>

          <div className="user-profile">
            <div className="profile-image">
              {selectedUser.profilePic ? (
                <img
                  src={getProfilePicture(selectedUser.profilePic)}
                  alt={selectedUser.name}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="default-avatar"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  {selectedUser.name.charAt(0)}
                </div>
              )}
            </div>
            <h3 className="user-name" style={{ marginTop: "10px" }}>
              {selectedUser.name}
            </h3>
          </div>

          <ul
            className="device-list"
            style={{ listStyle: "none", padding: "0", marginTop: "20px" }}
          >
            {devices.map((device, index) => (
              <li
                key={index}
                className="device-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px",
                  marginBottom: "8px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                }}
              >
                <div className="device-icon" style={{ marginRight: "12px" }}>
                  {device.icon}
                </div>
                <div className="device-info">
                  <div style={{ fontWeight: "bold" }}>{device.name}</div>
                  <span
                    className="device-location"
                    style={{ color: "#666", fontSize: "14px" }}
                  >
                    {device.location}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="modal-actions" style={{ marginTop: "20px" }}>
            <button onClick={() => setShowUserDevices(false)}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  // Logout confirmation modal
  const LogoutModal = () => {
    return (
      <div className="modal-overlay">
        <div className="invite-modal">
          <h3>Confirm Logout</h3>
          <p>Are you sure you want to log out?</p>
          <div className="modal-actions">
            <button onClick={() => setShowLogoutModal(false)}>Cancel</button>
            <button
              onClick={() => {
                setShowLogoutModal(false);
                // Implement logout functionality
                alert("Logging out...");
                // In a real app, you would clear auth tokens, cookies, etc.
                // and redirect to login page
              }}
            >
              Logout
            </button>
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
          position: "fixed",
          top: contextMenuPosition.y,
          left: contextMenuPosition.x,
          zIndex: 1000,
          background: "white",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          borderRadius: "4px",
          padding: "8px 0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="context-menu-item"
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#e74c3c",
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
      // case "languages":
      //   return <LanguagesPage onBack={() => setCurrentPage("profile")} />;
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
          <div
            className="profile-page"
            style={{
              height: "100vh",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <h1 className="profile-heading mb-3">My Profile</h1>

            <div
              className="profile-content"
              style={{
                position: "absolute",
                top: "18%",
                bottom: "1%",
                left: "0",
                right: "0",
                margin: "0 auto",
                width: "100%",
                background: "white",
                borderRadius: "48px 48px 0 0",
                padding: "20px",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
                paddingBottom: "20px", // Extra padding for bottom navbar
              }}
            >
              {/* Profile Section */}
              <div className="profile-info">
                <div className="profile-image-container">
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="profile-image profile-image2"
                  />
                  <button className="camera-icon">
                    <FaCamera size={18} />
                  </button>
                </div>
                <div className="user-details">
                  <h3 className="user-name">{userData.name}</h3>
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

                  {/* Wrap the Manage Users button with OwnerGuard */}
                  <OwnerGuard>
                    <button
                      className="menu-item"
                      onClick={() => setCurrentPage("manage-users")}
                    >
                      <FaUsers className="menu-icon" />
                      <span>Manage Users</span>
                    </button>
                  </OwnerGuard>

                  <button className="menu-item" onClick={handleHelpClick}>
                    <FaQuestionCircle className="menu-icon" />
                    <span>Help</span>
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
                    <span>Switch Home</span>
                  </button>
                  <button className="log-out-button" onClick={handleLogout}>
                    <FaSignOutAlt className="button-icon" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
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
                      <label className="laptop-form-label">First Name:</label>
                      <input
                        type="text"
                        className="laptop-form-input"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="laptop-form-group">
                      <label className="laptop-form-label">Last Name:</label>
                      <input
                        type="text"
                        className="laptop-form-input"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </div>
                    <button
                      className="laptop-button"
                      onClick={handleLaptopProfileUpdate}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>

                  <div className="laptop-divider"></div>

                  <div className="laptop-profile-options">
                    {/* Changed Languages to Help */}
                    <div
                      className="laptop-option-item"
                      onClick={handleHelpClick}
                    >
                      <FaQuestionCircle className="laptop-option-icon" />
                      <span>Help</span>
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
                    <button
                      className="laptop-add-home-button"
                      onClick={handleAddHome}
                    >
                      <FaHome className="laptop-button-icon" />
                      <span>Switch Home</span>
                    </button>
                    <button
                      className="laptop-log-out-button"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="laptop-button-icon" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}

              {/* {currentPage === "languages" && (
                <LanguagesPage onBack={() => setCurrentPage("profile")} />
              )} */}

              {currentPage === "change-password" && (
                <ChangePasswordPage onBack={() => setCurrentPage("profile")} />
              )}
            </div>
            <OwnerGuard>
              {/* Manage Users Section */}
              <div className="laptop-manage-users">
                <div className="laptop-manage-header">
                  <h2 className="laptop-manage-title">Manage Users</h2>
                </div>

                <div className="laptop-user-header-row">
                  <div className="laptop-total-users">Total {users.length}</div>
                  <button
                    className="laptop-add-user-btn"
                    onClick={() => setShowInvite(true)}
                  >
                    <FaPlus />
                  </button>
                </div>

                <ul className="laptop-user-list">
                  {users.map((user) => (
                    <li
                      key={user.id}
                      className="laptop-user-item"
                      onContextMenu={(e) => handleUserContextMenu(e, user.id)}
                      onClick={() => handleUserClick(user)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="laptop-user-profile">
                        {user.profilePic ? (
                          <div className="laptop-user-pic">
                            <img src={user.profilePic} alt={user.name} />
                          </div>
                        ) : (
                          <div className="laptop-default-avatar">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div className="laptop-user-name">{user.name}</div>
                      </div>
                      {user.id !== 1 && (
                        <div
                          className="laptop-delete-indicator"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent opening devices modal
                            deleteUser(user.id);
                          }}
                        >
                          <FaTrash />
                          <span>Delete</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </OwnerGuard>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="profile-page">
      {isLaptopView ? renderLaptopView() : renderMobileView()}
      {showHomeModal && <HomeModal />}
      {showHelpModal && <HelpModal />}
      {showInvite && <InviteModal />}
      {showLogoutModal && <LogoutModal />}
      {showUserDevices && <UserDevicesModal />}
      {contextMenuPosition && <ContextMenu />}
    </div>
  );
};

export default ProfilePage;
