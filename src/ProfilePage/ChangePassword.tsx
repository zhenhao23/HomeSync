import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

interface ChangePasswordProps {
  onBack: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onBack }) => {
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

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
      <div className="container-fluid p-3 pb-2">
        <div className="row align-items-center mb-333">
          <div className="col-4 text-start">
            <button className="btn p-0" onClick={onBack}>
              <FaArrowLeft />
            </button>
          </div>

          <div className="col-4 text-center">
            <h3 className="header-change-password">Change Password</h3>
          </div>
          <div className="col-4" />
        </div>
      </div>

      <div className="content-container">
      <form onSubmit={handleSubmit} className="password-form">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            className="form-control"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            className="form-control"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Change Password
        </button>
      </form>
      </div>
    </>
  );
};
export default ChangePassword; 