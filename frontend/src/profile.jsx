import  { useState } from 'react';
import { FaUser, FaLock  } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Axios from 'axios';
import { useEffect} from 'react';

const Profile = () => {
  /*ข้อมูล User*/
  const [UserID] = useState('');
  const [UserName, setUserName] = useState('');
  const [Bio, setBio] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [ProfileImage, setProfileImage] = useState('');
  const [WorkingStyle, setWorkingStyle] = useState(0);
  /*ไว้ Add ข้อมูล Skill*/
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEnddate] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartdate] = useState(0);
  const [title, setTitle] = useState('');

  const [Skilllist, setSkilllist] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const [userlist, setUserlist] = useState([]);


  // const getSkill = () => {
  //   Axios.get('http://localhost:3000/test').then((response) => {
  //     setSkilllist(response.data);
  //   });
  // };

  useEffect(() => {
    const fetchUser = async () => {
      if (UserID) { // ตรวจสอบว่ามีค่า UserID ก่อนเรียก API
        try {
          const response = await Axios.get(`/api/getUserById?userId=${UserID}`);
          const { UserName, Bio, ProfileImage } = response.data;
          setUserName(UserName);
          setBio(Bio);
          setProfileImage(ProfileImage);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
  
    fetchUser();
  }, [UserID]);
  

  const addSkill = () => {
    Axios.post('http://localhost:5173/profile', {
      company: company,
      description: description,
      endDate: endDate,
      location: location,
      startDate: startDate,
      title: title,
    }).then(() => {
      setSkilllist([
        ...Skilllist,
        {
          company: company,
          description: description,
          endDate: endDate,
          location: location,
          startDate: startDate,
          title: title,
        },
      ]);
      setIsModalOpen(false);
    });
  };

  
  // const getUsers = () => {
  //   Axios.get('http://localhost:3000/test').then((response) => {
  //     setUserlist(response.data);
  //   });
  // };

  
  const addUsers = () => {
    Axios.post('http://localhost:5173/profile', {
      UserName: UserName,
      Bio: Bio,
      email: Email,
      password: Password,
      ProfileImage: ProfileImage,
      WorkingStyle: WorkingStyle,
    }).then(() => {
      setUserlist([
        ...userlist,
        {
          UserName: UserName,
          Bio: Bio,
          email: Email,
          password: Password,
          ProfileImage: ProfileImage,
          WorkingStyle: WorkingStyle,
        },
      ]);
    });
  };
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center p-4">

        <div className="p-6 space-y-10 bg-white rounded-lg shadow-md max-w-full max-h-screen">
          {/* Profile Header Section */}
          <div className="flex items-start gap-6">
              {ProfileImage}
            <div className="border-2 border-blue-400 p-1 rounded-lg">
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
  
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">{UserName}</h1>
      
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= 4 ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-gray-600">4.0</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                    <button onClick={() => setIsEditProfileModalOpen(true)}
                        className="px-4 py-2 bg-gray-200 rounded-lg text-sm">
                        EDIT PROFILE
                    </button>
                    {/* Popup สำหรับแก้ไขโปรไฟล์ */}
                    {isEditProfileModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="w-full max-w-2xl bg-gradient-to-b from-bluebg to-skybg text-white rounded-lg p-5 shadow-lg">
                          <form action=''>
                            <h1 className="text-4xl font-bold text-center mb-6">Edit profile</h1>
                  
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="relative">
                                <input 
                                  type="text" 
                                  placeholder="User Name" 
                                  required 
                                  className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                                  onChange={(event) => setUserName(event.target.value)}
                                />
                                <FaUser className="absolute right-4 top-3 text-white" />
                              </div>
                              <div className="relative">
                                <input 
                                  type="email" 
                                  placeholder="Enter your email" 
                                  required 
                                  className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                                  onChange={(event) => setEmail(event.target.value)}
                                />
                                <MdEmail className="absolute right-4 top-3 text-white" />
                              </div>
                              <div className="relative">
                                <input 
                                  type="file" 
                                  placeholder="Image" 
                                  required 
                                  className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                                  onChange={(event) => setProfileImage(event.target.files[0])}
                                />
                                <FaUser className="absolute right-4 top-3 text-white" />
                              </div>
                              <div className="relative">
                                <input 
                                  type="text" 
                                  placeholder="Working Style" 
                                  required 
                                  className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                                  onChange={(event) => setWorkingStyle(Number(event.target.value))}
                                />
                                <FaUser className="absolute right-4 top-3 text-white" />
                              </div>

                              <div className="relative col-span-2">
                                <textarea 
                                  placeholder="Bio" 
                                  required 
                                  className="w-full h-32 px-4 py-2 bg-transparent border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-white resize-none"
                                  onChange={(event) => setBio(event.target.value)}
                                />
                              </div>

                            </div>
                  
                            <div className="relative mt-6 mb-6">
                              <input 
                                type="password" 
                                placeholder="Password" 
                                required 
                                className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                                onChange={(event) => setPassword(event.target.value)}
                              />
                              <FaLock className="absolute right-4 top-3 text-white" />
                            </div>
                  
                            <div className="flex justify-between mt-6">
                                    <button
                                        onClick={addUsers}
                                        className="w-1/3 h-12 bg-white text-black font-bold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setIsEditProfileModalOpen(false)}
                                        className="w-1/3 h-12 bg-red-500 text-white font-bold rounded-full shadow-md hover:bg-red-600 transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-gray-200 rounded-lg text-sm">
                        ADD SKILL
                    </button>
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="w-full max-w-2xl bg-gradient-to-b from-bluebg to-skybg text-white rounded-lg p-5 shadow-lg">
                                <h1 className="text-4xl font-bold text-center mb-6">Add skill</h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Company"
                                            required
                                            className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                                            onChange={(event) => setCompany(event.target.value)}
                                        />
                                        <FaUser className="absolute right-4 top-3 text-white" />
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Location"
                                            required
                                            className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                                            onChange={(event) => setLocation(event.target.value)}
                                        />
                                        <FaUser className="absolute right-4 top-3 text-white" />
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Start Date"
                                            required
                                            className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                                            onChange={(event) => setStartdate(event.target.value)}
                                        />
                                        <FaUser className="absolute right-4 top-3 text-white" />
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="End Date"
                                            required
                                            className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                                            onChange={(event) => setEnddate(event.target.value)}
                                        />
                                        <FaUser className="absolute right-4 top-3 text-white" />
                                    </div>
                                    
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            required
                                            className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                                            onChange={(event) => setTitle(event.target.value)}
                                        />
                                        <FaUser className="absolute right-4 top-3 text-white" />
                                    </div>
                                    <div className="relative col-span-2">
                                        <textarea 
                                          placeholder="Short Description" 
                                          required 
                                          className="w-full h-32 px-4 py-2 bg-transparent border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-white resize-none"
                                          onChange={(event) => setDescription(event.target.value)}
                                        />
                                        <FaUser className="absolute right-4 top-3 text-white" />
                                    </div>
                                </div>

                                <div className="flex justify-between mt-6">
                                    <button
                                        onClick={addSkill}
                                        className="w-1/3 h-12 bg-white text-black font-bold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-1/3 h-12 bg-red-500 text-white font-bold rounded-full shadow-md hover:bg-red-600 transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                
              </div>
  
              <div className="mt-4">
                <h2 className="font-medium">แนะนำตัว</h2>
                <p className="mt-2 text-gray-600 text-sm max-w-screen-lg">
                  {Bio}
                </p>
              </div>
            </div>
          </div>
  
          {/* Past Events Section */}

          <div className="mt-8">
            <div className="flex items-center rounded-lg p-4 shadow-sm justify-between">
              <h2 className="text-lg font-medium">Past Event</h2>
              <button className="p-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
  
            <div className="mt-10 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">Hackathon999</h3>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    เสร็จสิ้น
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>9/9/2023 - 2/10/2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>4/4 คน</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Profile;
 