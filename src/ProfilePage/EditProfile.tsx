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
      <div className="container-fluid p-3 pb-2">
        <div className="row align-items-center mb-3">
          <div className="col-4 text-start">
            <button className="btn p-0" onClick={onBack}>
              <FaArrowLeft />
            </button>
          </div>
          <div className="col-4 text-center">
            <h1 className="edit-profile">Edit Profile</h1>
          </div>
          <div className="col-4" />
        </div>
      </div>

      <div className="content-container">
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="profile-image-upload">
            <img className="profile-image1"
              src={ProfileImage} 
              alt="Profile" 
            />
            <button type="button" className="upload-button">
              <FaCamera />
            </button>
          </div>

          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              className="form-control"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Email Address:</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="save-button-container">
            <button type="submit" className="btn btn-primary w-100">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;