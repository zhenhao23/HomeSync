import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "./ChangePassword.css";

// Window size hook
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

interface ChangePasswordProps {
  onBack: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onBack }) => {
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  // Get window size for responsive layout
  const { width } = useWindowSize();
  const isLaptop = width >= 1280;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    onBack();
  };

  return (
    <>
      <div className="cp-container-fluid p-3 pb-2">
        <div className="cp-row align-items-center cp-mb-3">
          <div className="cp-col-4 text-start">
            <button className="cp-btn p-0" onClick={onBack}>
              <FaArrowLeft />
            </button>
          </div>
          <div className="cp-col-4 text-center">
            <h3 className="cp-header-change-password">Change Password</h3>
          </div>
          <div className="cp-col-4" />
        </div>
      </div>

      <div className={`cp-content-container ${isLaptop ? 'cp-laptop-view' : ''}`}>
        <form onSubmit={handleSubmit} className="cp-password-form">
          {error && <div className="cp-alert cp-alert-danger">{error}</div>}
          
          <div className="cp-form-group">
            <label>New Password:</label>
            <input
              type="password"
              className="cp-form-control"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
            />
          </div>

          <div className="cp-form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              className="cp-form-control"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
            />
          </div>

          <button type="submit" className="cp-btn cp-btn-primary">
            Change Password
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;