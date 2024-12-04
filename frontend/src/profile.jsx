import { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Axios from 'axios';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2'
// import image from '../../public/uploads/profiles/5psgeommk-b1715b66-2c24-49ee-b16e-37ab0ba43ea0.jpeg' 

// EditProfileModal component
const EditProfileModal = ({ isOpen, onClose, onSave, user }) => {
  const [userName, setUserName] = useState(user?.UserName || '');
  const [email, setEmail] = useState(user?.Email || '');
  const [profileImage, setProfileImage] = useState(null);
  const [workingStyle, setWorkingStyle] = useState(user?.WorkingStyle || '');
  const [bio, setBio] = useState(user?.Bio || '');
  const [age, setAge] = useState(user?.Age || ''); // Ensure age is a string initially
  const [location, setLocation] = useState(user?.Location || '');

  useEffect(() => {
    setUserName(user?.UserName || '');
    setEmail(user?.Email || '');
    setProfileImage(null);
    setWorkingStyle(user?.WorkingStyle || '');
    setBio(user?.Bio || '');
    setAge(user?.Age || ''); // Ensure age is a string initially
    setLocation(user?.Location || '');
  }, [user]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('email', email);
    formData.append('profileImage', profileImage);
    formData.append('workingStyle', workingStyle);
    formData.append('bio', bio);
    formData.append('age', String(age)); // Ensure age is appended as a string
    formData.append('location', location);

    try {
      const response = await Axios.put(`http://localhost:3000/user/${user.UserID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSave(response.data);

      

      Swal.fire({
        title: "Good job!",
        text: "Update Profile successful!",
        icon: "success"
      });
      setTimeout(() => {
        Swal.close();
      }, 3000);

      await new Promise(resolve => setTimeout(resolve, 2000));

      window.location.href = '/profile';

    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-gradient-to-b from-bluebg to-skybg text-white rounded-lg p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
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
            <div className="relative">
              <input
                type="number"
                placeholder="Age"
                required
                value={age}
                className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                onChange={(e) => setAge(e.target.value)} // Ensure age is updated as a string
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Location"
                required
                value={location}
                className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                onChange={(e) => setLocation(e.target.value)}
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
    Age: PropTypes.string,
    Location: PropTypes.string,
  }),
};




// AddSkillModal component
const AddSkillModal = ({ isOpen, onClose, onSave }) => {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await Axios.get('http://localhost:3000/skill/all');
        setSkills(response.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  const handleSubmit = async () => {
    try {
      const userID = localStorage.getItem('UserID');
      await Axios.post('http://localhost:3000/skill/add-to-user', {
        userID,
        skillName: selectedSkill,
      });

      onSave(selectedSkill);

      Swal.fire({
        title: "Good job!",
        text: "Skill Added Successfully!",
        icon: "success"
      });
      setTimeout(() => {
        Swal.close();
      }, 3000);


      await new Promise(resolve => setTimeout(resolve, 2000));


      window.location.href = '/profile'


      onClose();
    } catch (error) {
      console.error('Error adding skill:', error);
      Swal.fire({
        title: "Error",
        text: "There was an error adding the skill.",
        icon: "error"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-b from-bluebg to-skybg text-white rounded-lg p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <h1 className="text-4xl font-bold text-center mb-8 animate-fade-in">
            Add Skill
          </h1>
          <div className="relative">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full h-12 px-4 py-2 bg-transparent border-2 border-white rounded-full 
                       text-white placeholder-white focus:outline-none focus:border-white
                       transition-all duration-300 hover:border-opacity-80
                       appearance-none cursor-pointer"
              required
            >
              <option value="" disabled className="bg-blue-500 text-white">
                Select a skill
              </option>
              {skills.map((skill) => (
                <option 
                  key={skill.Skill_ID} 
                  value={skill.Skill_Name}
                  className="bg-blue-500 text-white"
                >
                  {skill.Skill_Name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-3.5 text-white pointer-events-none
                          transform transition-transform duration-300 group-hover:scale-110">
              ▼
            </div>
          </div>

          <div className="flex justify-between mt-8 gap-4">
            <button
              onClick={handleSubmit}
              className="w-1/2 h-12 bg-white text-black font-bold rounded-full 
                       shadow-md transition-all duration-300 
                       hover:bg-opacity-90 hover:scale-105 hover:shadow-lg
                       active:transform active:scale-95"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="w-1/2 h-12 bg-red-500 text-white font-bold rounded-full 
                       shadow-md transition-all duration-300
                       hover:bg-red-600 hover:scale-105 hover:shadow-lg
                       active:transform active:scale-95"
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
  const [personalTypeDetail, setPersonalTypeDetail] = useState('');

  const handleSubmit = async () => {
    try {
      const createResponse = await Axios.post('http://localhost:3000/personal/create', {
        personalType,
        personalTypeDetail,
      });

      const newPersonalType = createResponse.data;

      const userID = localStorage.getItem('UserID');
      await Axios.post('http://localhost:3000/personal/addToUser', {
        userID,
        personalTypeID: newPersonalType.PersonalTypeID,
      });

      onSave(newPersonalType);

      Swal.fire({
        title: "Good job!",
        text: "Personal Type Added Successfully!",
        icon: "success"
      });
      setTimeout(() => {
        Swal.close();
      }, 3000);

      
      await new Promise(resolve => setTimeout(resolve, 2000));


      window.location.href = '/profile'




      onClose();
    } catch (error) {
      console.error('Error creating personal type:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-b from-bluebg to-skybg text-white rounded-lg p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <h1 className="text-4xl font-bold text-center mb-8 animate-fade-in">
            Add Personal Type
          </h1>
          
          <div className="relative">


          <a 
            href='https://www.arealme.com/disc-personality-test/th/' 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-center px-4 py-3 mb-3 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            Take DISC Personality Test
          </a>

            <select
              value={personalType}
              onChange={(e) => setPersonalType(e.target.value)}
              className="w-full h-12 px-4 py-2 bg-transparent border-2 border-white rounded-full 
                       text-white placeholder-white focus:outline-none focus:border-white
                       transition-all duration-300 hover:border-opacity-80
                       appearance-none cursor-pointer"
              required
            >
              <option value="" disabled className="bg-blue-500 text-white">Select your DISC type</option>
              <option value="Superiority: Eagle" className="bg-blue-500 text-white">Superiority: Eagle</option>
              <option value="Influences: Fox" className="bg-blue-500 text-white">Influences: Fox</option>
              <option value="Steadiness: elephant" className="bg-blue-500 text-white">Steadiness: elephant</option>
              <option value="Conscientiousness : owl" className="bg-blue-500 text-white">Conscientiousness : owl</option>
            </select>
            <div className="absolute right-4 top-3.5 text-white pointer-events-none">▼</div>
          </div>

          <textarea
            placeholder="Describe your personal type characteristics..."
            value={personalTypeDetail}
            onChange={(e) => setPersonalTypeDetail(e.target.value)}
            className="w-full h-32 px-4 py-2 bg-transparent border-2 border-white rounded-lg 
                     text-white placeholder-white focus:outline-none focus:border-white
                     transition-all duration-300 resize-none"
            required
          />

        

          <div className="flex justify-between gap-4">
            <button
              onClick={handleSubmit}
              className="w-1/2 h-12 bg-white text-black font-bold rounded-full 
                       shadow-md transition-all duration-300 
                       hover:bg-opacity-90 hover:scale-105 hover:shadow-lg"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="w-1/2 h-12 bg-red-500 text-white font-bold rounded-full 
                       shadow-md transition-all duration-300
                       hover:bg-red-600 hover:scale-105 hover:shadow-lg"
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
  const [skills, setSkills] = useState([]);
  const [personalType, setPersonalType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [isAddPersonalTypeModalOpen, setIsAddPersonalTypeModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!UserID) throw new Error("UserID is required");

        const userResponse = await Axios.get(`http://localhost:3000/user/id/${UserID}`);
        if (!userResponse.data) throw new Error("User not found");

        const skillsResponse = await Axios.get(`http://localhost:3000/skill/user/${UserID}`);
        const personalTypeResponse = await Axios.get(`http://localhost:3000/personal/${UserID}`);

        setUser(userResponse.data);
        setSkills(skillsResponse.data);
        setPersonalType(personalTypeResponse.data.personalType || null);
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
      await Axios.put(`http://localhost:3000/user/${UserID}`, profileData);
      setIsEditProfileModalOpen(false);
      const response = await Axios.get(`http://localhost:3000/user/id/${UserID}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSkillSave = async (skill) => {
    try {
      await Axios.post('http://localhost:3000/skill/add-to-user', { userID: UserID, skillName: skill });
      setIsAddSkillModalOpen(false);
      const response = await Axios.get(`http://localhost:3000/user/id/${UserID}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const handleSkillDelete = async (skillName) => {
    try {
      await Axios.delete('http://localhost:3000/skill/remove-from-user', { data: { userID: UserID, skillName } });
      const response = await Axios.get(`http://localhost:3000/user/id/${UserID}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error deleting skill:", error);
    }

    Swal.fire({
      title: "Good job!",
      text: "Deleted skill successfully!",
      icon: "success"
    });
    setTimeout(() => {
      Swal.close();
    }, 3000);

    await new Promise(resolve => setTimeout(resolve, 2000));

    window.location.href = '/profile';
  };

  const handlePersonalTypeSave = async (personalType) => {
    try {
      await Axios.post('http://localhost:3000/personal/addToUser', { userID: UserID, personalTypeID: personalType });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center p-8">
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
      <div className="p-8 space-y-10 mt-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl max-w-5xl w-full 
                      transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl
                      border border-white/20">
        <div className="flex items-start gap-8">
          <div className="group">
            <div className="border-4 border-blue-400 p-2 rounded-xl overflow-hidden
                          transform transition-all duration-500 group-hover:border-blue-500 group-hover:rotate-3 group-hover:scale-105
                          shadow-lg group-hover:shadow-2xl">
              <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg 
                            flex items-center justify-center overflow-hidden">
                {user.ProfileImage ? (
                  <img 
                    src={user.ProfileImage}
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-lg 
                              transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                  />
                ) : (
                  <FaUser className="w-24 h-24 text-gray-400 transition-all duration-300 group-hover:text-blue-500" />
                )}
              </div>
            </div>
            <div className="mt-4 text-start">
              <p className="text-3xl font-medium text-gray-700">Age {user.Age} Years</p>
              <p className="text-lg text-gray-600">Address {user.Location}</p>
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500">
                  {user.UserName || 'Anonymous User'}
                </h1>

                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`w-6 h-6 ${
                        index < Math.round(user.AverageRating || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">Rating ({(user.AverageRating || 0).toFixed(1)})</span>
                </div>
        
                <div className="transform transition-all duration-300 hover:translate-x-2">
                  <h2 className="font-medium text-xl text-gray-700">About Me</h2>
                  <p className="mt-2 text-gray-600 leading-relaxed max-w-screen-lg">
                    {user.Bio || 'No bio available'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                {[
                  { text: 'EDIT PROFILE', onClick: () => setIsEditProfileModalOpen(true) },
                  { text: 'ADD SKILL', onClick: () => setIsAddSkillModalOpen(true) },
                  { text: 'ADD PERSONAL TYPE', onClick: () => setIsAddPersonalTypeModalOpen(true) }
                ].map((btn, index) => (
                  <button 
                    key={index}
                    onClick={btn.onClick}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-xl
                             font-medium transform transition-all duration-300 
                             hover:scale-105 hover:shadow-lg hover:from-blue-600 hover:to-sky-600
                             active:scale-95 active:shadow-inner"
                  >
                    {btn.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="transform transition-all duration-300 hover:translate-x-2 p-6 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
              <h2 className="text-2xl font-semibold text-gray-800">Working Style</h2>
              <p className="mt-3 text-gray-700 text-lg leading-relaxed">
                {user.WorkingStyle || 'No working style available'}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {skills.map(skill => (
                  <div
                    key={skill.Skill_ID}
                    className="group px-5 py-2.5 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-xl
                             transform transition-all duration-300 hover:scale-110 hover:rotate-2
                             shadow-md hover:shadow-xl cursor-pointer
                             border-2 border-transparent hover:border-white
                             flex items-center space-x-2"
                  >
                    <span className="font-medium">{skill.Skill_Name}</span>
                    <button
                      onClick={() => handleSkillDelete(skill.Skill_Name)}
                      className="opacity-0 group-hover:opacity-100 ml-2 bg-red-500/80 text-white rounded-full p-1.5
                               hover:bg-red-600 transition-all duration-300 transform hover:rotate-180"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="transform transition-all duration-300 hover:translate-x-2">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Personal Type</h2>
              <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl
                            transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl
                            border border-purple-200/50">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {personalType ? personalType.PersonalType : 'No personal type available'} 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;