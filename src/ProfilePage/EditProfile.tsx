import { useState } from "react";
import { FaArrowLeft, FaCamera } from "react-icons/fa";
import ProfileImage from './img1.jpeg'; // Import the local image
import './EditProfile.css'

interface EditProfileProps {
  onBack: () => void;
  userData: any;
  setUserData: (data: any) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onBack, userData, setUserData }) => {
  const [formData, setFormData] = useState({
    fullName: userData.name,
    email: userData.email
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData({
      ...userData,
      name: formData.fullName,
      email: formData.email
    });
    onBack();
  };

  return (
    <>
      <div className="ep-container-fluid p-3 pb-2">
        <div className="ep-row align-items-center ep-mb-3">
          <div className="ep-col-4 text-start">
            <button className="ep-btn p-0" onClick={onBack}>
              <FaArrowLeft />
            </button>
          </div>
          <div className="ep-col-4 text-center">
            <h1 className="ep-edit-profile">Edit Profile</h1>
          </div>
          <div className="ep-col-4" />
        </div>
      </div>

      <div className="ep-content-container">
        <form onSubmit={handleSubmit} className="ep-edit-profile-form">
          <div className="ep-profile-image-upload">
            <img className="ep-profile-image1"
              src={ProfileImage} 
              alt="Profile" 
            />
            <button type="button" className="ep-upload-button">
              <FaCamera />
            </button>
          </div>

          <div className="ep-form-group">
            <label>Full Name:</label>
            <input
              type="text"
              className="ep-form-control"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>

          <div className="ep-form-group">
            <label>Email Address:</label>
            <input
              type="email"
              className="ep-form-control"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="ep-save-button-container">
            <button type="submit" className="ep-btn ep-btn-primary w-100">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
