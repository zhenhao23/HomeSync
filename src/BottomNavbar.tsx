import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaBolt, FaSun, FaUser } from "react-icons/fa";

interface NavItem {
  id: string;
  icon: JSX.Element;
  label: string;
  path: string;
}

const BottomNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname;

  const navItems: NavItem[] = [
    {
      id: "home",
      icon: <FaHome size={20} />,
      label: "Home",
      path: "/",
    },
    {
      id: "energy",
      icon: <FaBolt size={20} />,
      label: "Usage",
      path: "/energy",
    },
    {
      id: "solar",
      icon: <FaSun size={20} />,
      label: "Solar",
      path: "/solar",
    },
    {
      id: "profile",
      icon: <FaUser size={20} />,
      label: "Profile",
      path: "/profile",
    },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  // Check if the current path is either "/energy" or "/energy-limit"
  const isEnergyActive =
    activeTab === "/energy" || activeTab === "/energy-limit";

  return (
    <nav
      className="fixed-bottom d-flex justify-content-between align-items-center px-3 py-2"
      style={{
        backgroundColor: "#204160",
        gap: "8px",
      }}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavClick(item.path)}
          className={`btn d-flex align-items-center flex-grow-0 ${
            (item.path === "/energy" ? isEnergyActive : activeTab === item.path)
              ? "active"
              : ""
          }`}
          style={{
            backgroundColor: "#ffffff",
            color: "#204160",
            borderRadius: "8px",
            height: "40px",
            padding: (
              item.path === "/energy" ? isEnergyActive : activeTab === item.path
            )
              ? "0 20px"
              : "0 12px",
            transition: "all 0.2s ease",
            minWidth: (
              item.path === "/energy" ? isEnergyActive : activeTab === item.path
            )
              ? "110px"
              : "auto",
            flexShrink: 1,
          }}
        >
          <div className="d-flex align-items-center">
            {item.icon}
            {(item.path === "/energy"
              ? isEnergyActive
              : activeTab === item.path) && (
              <span className="ms-2 fw-medium" style={{ fontSize: "14px" }}>
                {item.label}
              </span>
            )}
          </div>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavbar;
