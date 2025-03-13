import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaBolt, FaSun, FaUser } from "react-icons/fa";
import "./HomePage/BottomNavBar.css";
import useWindowSize from "./HomePage/Layout.tsx";

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
      path: "/home",
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

  const isLaptop = useWindowSize();

  return (
    <nav className="fixed-bottom px-3 py-2 bottom-navbar">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavClick(item.path)}
          className={`btn flex-grow-0 nav-button ${
            (item.path === "/energy" ? isEnergyActive : activeTab === item.path)
              ? "active"
              : ""
          }`}
          style={{
            padding: (
              item.path === "/energy" ? isEnergyActive : activeTab === item.path
            )
              ? "0 20px"
              : "0 12px",
            minWidth: (
              item.path === "/energy" ? isEnergyActive : activeTab === item.path
            )
              ? "110px"
              : "auto",
          }}
        >
          <div className="d-flex align-items-center">
            {item.icon}
            {(isLaptop ||
              (item.path === "/energy"
                ? isEnergyActive
                : activeTab === item.path)) && (
              <span className="ms-2 fw-medium nav-label">{item.label}</span>
            )}
          </div>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavbar;
