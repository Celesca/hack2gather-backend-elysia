import { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Axios from 'axios';
import PropTypes from 'prop-types';


// EditProfileModal component
const EditProfileModal = ({ isOpen, onClose, onSave, user }) => {
  const [userName, setUserName] = useState(user?.UserName || '');
  const [email, setEmail] = useState(user?.Email || '');
  const [profileImage, setProfileImage] = useState(null);
  const [workingStyle, setWorkingStyle] = useState(user?.WorkingStyle || '');
  const [bio, setBio] = useState(user?.Bio || '');

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('email', email);
    formData.append('profileImage', profileImage);
    formData.append('workingStyle', workingStyle);
    formData.append('bio', bio);


    try {
      const response = await Axios.put(`http:/localhost:3000/user/${user.UserID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSave(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-2xl bg-gradient-to-b from-bluebg to-skybg text-white rounded-lg p-5 shadow-lg">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1 className="text-4xl font-bold text-center mb-6">Edit Profile</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="User Name"
                required
                value={userName}
                className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                onChange={(e) => setUserName(e.target.value)}
              />
              <FaUser className="absolute right-4 top-3 text-white" />
            </div>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                onChange={(e) => setEmail(e.target.value)}
              />
              <MdEmail className="absolute right-4 top-3 text-white" />
            </div>
            <div className="relative">
              <input
                type="file"
                className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
              <FaUser className="absolute right-4 top-3 text-white" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Working Style"
                required
                value={workingStyle}
                className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                onChange={(e) => setWorkingStyle(e.target.value)}
              />
            </div>
            <div className="relative col-span-2">
              <textarea
                placeholder="Bio"
                required
                value={bio}
                className="w-full h-32 px-4 py-2 bg-transparent border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-white resize-none"
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={handleSubmit}
              className="w-1/3 h-12 bg-white text-black font-bold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="w-1/3 h-12 bg-red-500 text-white font-bold rounded-full shadow-md hover:bg-red-600 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PropTypes for validation
EditProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  user: PropTypes.shape({
    UserID: PropTypes.string.isRequired,
    UserName: PropTypes.string,
    Email: PropTypes.string,
    WorkingStyle: PropTypes.string,
    Bio: PropTypes.string,
  }),
};


// AddSkillModal component
const AddSkillModal = ({ isOpen, onClose, onSave }) => {
  const [skill, setSkill] = useState('');

  const handleSubmit = () => {
    onSave(skill);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-md bg-gradient-to-b from-bluebg to-skybg text-white rounded-lg p-5 shadow-lg">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1 className="text-4xl font-bold text-center mb-6">Add Skill</h1>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Skill"
              required
              className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
              onChange={(e) => setSkill(e.target.value)}
            />
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={handleSubmit}
              className="w-1/3 h-12 bg-white text-black font-bold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="w-1/3 h-12 bg-red-500 text-white font-bold rounded-full shadow-md hover:bg-red-600 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PropTypes for validation
AddSkillModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

// AddPersonalTypeModal component
const AddPersonalTypeModal = ({ isOpen, onClose, onSave }) => {
  const [personalType, setPersonalType] = useState('');

  const handleSubmit = () => {
    onSave(personalType);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-md bg-gradient-to-b from-bluebg to-skybg text-white rounded-lg p-5 shadow-lg">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1 className="text-4xl font-bold text-center mb-6">Add Personal Type</h1>
          <div className="relative mb-4">

          <a 
            href='https://www.arealme.com/disc-personality-test/th/' 
            target="_blank" 
            rel="noopener noreferrer"
            className="mb-5 w-full block text-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            ประเมิน personal type
          </a>

            <input
              type="text"
              placeholder="กรอกผลลัพธ์ Personal Type"
              required
              className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
              onChange={(e) => setPersonalType(e.target.value)}
            />
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={handleSubmit}
              className="w-1/3 h-12 bg-white text-black font-bold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="w-1/3 h-12 bg-red-500 text-white font-bold rounded-full shadow-md hover:bg-red-600 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PropTypes for validation
AddPersonalTypeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

// Profile Component
const Profile = () => {
  const UserID = localStorage.getItem('UserID');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [isAddPersonalTypeModalOpen, setIsAddPersonalTypeModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!UserID) throw new Error("UserID is required");

        const response = await Axios.get(`http://localhost:3000/user/id/${UserID}`);
        if (!response.data) throw new Error("User not found");

        console.log(response.data);

        setUser(response.data);
      } catch (err) {
        setError(err.message || "Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [UserID]);

  const handleProfileUpdate = async (profileData) => {
    try {
      await Axios.put('http://localhost:3000/user/${UserID}', profileData);
      setIsEditProfileModalOpen(false);
      const response = await Axios.get(`http://localhost:3000/user/${UserID}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSkillSave = async (skill) => {
    try {
      await Axios.post('http://localhost:3000/profile/add-skill', { skill, UserID });
      setIsAddSkillModalOpen(false);
      const response = await Axios.get(`http://localhost:3000/user/id/${UserID}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const handlePersonalTypeSave = async (personalType) => {
    try {
      await Axios.post('http://localhost:3000/profile/add-personal-type', { personalType, UserID });
      setIsAddPersonalTypeModalOpen(false);
      const response = await Axios.get(`http://localhost:3000/user/id/${UserID}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error adding personal type:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center p-4">
      <div className="p-6 space-y-10 bg-white rounded-lg shadow-md max-w-full max-h-screen">
        <div className="flex items-start gap-6">
          <div className="border-2 border-blue-400 p-1 rounded-lg">
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              {user.ProfileImage ? (
                <img 
                src={user.ProfileImage}
                alt="Profile" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <FaUser className="w-16 h-16 text-gray-400" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold">{user.UserName || 'Anonymous User'}</h1>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setIsEditProfileModalOpen(true)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
                >
                  EDIT PROFILE
                </button>
                <button 
                  onClick={() => setIsAddSkillModalOpen(true)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
                >
                  ADD SKILL
                </button>
                <button 
                  onClick={() => setIsAddPersonalTypeModalOpen(true)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
                >
                  ADD PERSONAL TYPE
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h2 className="font-medium">Bio</h2>
              <p className="mt-2 text-gray-600 text-sm max-w-screen-lg">
                {user.Bio || 'No bio available'}
              </p>
            </div>
          </div>
        </div>
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          onSave={handleProfileUpdate}
          user={user}
        />
        <AddSkillModal
          isOpen={isAddSkillModalOpen}
          onClose={() => setIsAddSkillModalOpen(false)}
          onSave={handleSkillSave}
        />
        <AddPersonalTypeModal
          isOpen={isAddPersonalTypeModalOpen}
          onClose={() => setIsAddPersonalTypeModalOpen(false)}
          onSave={handlePersonalTypeSave}
        />
      </div>
    </div>
  );
};

export default Profile;
