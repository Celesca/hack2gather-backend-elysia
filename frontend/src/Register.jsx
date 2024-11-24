// import { FaUser, FaLock } from "react-icons/fa";
// import { MdEmail } from "react-icons/md";
// import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import Axios from 'axios'
import {useState} from 'react'
import imagelogin from './assets/imagelogin.png';
const Register = () => {
  const  [formData, setFormData] = useState( { 
    userName:'',
    email:'',
    password:'',
    ProfileImage:'',
    workingStyle:'',
    bio:'',
  });

  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "ProfileImage" && files) {
      // Just store the file name (not the base64 string)
      setFormData({ ...formData, ProfileImage: files[0].name });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  


  const handleSubmit = async (e) => {
    e.preventDefault();


    // if (formData.password !== formData.confirmPassword) {
    //   Swal.fire({ 
    //     title: "Error!",
    //     text: "Passwords do not match!",
    //     icon: "error",
    //   });
    //   return;
  
    // }
    
    try {
      const response = await Axios.post('http://localhost:3000/user/create', {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        ProfileImage: formData.ProfileImage,
        workingStyle: formData.workingStyle,
        bio: formData.bio,
      });
      setMessage("User registered successfully!");

      if (response.data) {

        console.log(response.data)
        setMessage("User registered successfully!");
        setFormData({
          userName: "",
          email: "",
          password: "",
          ProfileImage: "",
          workingStyle: "",
          bio: "",
        });

        Swal.fire({
          title: "Good job!",
          text: "Register Sucessful!",
          icon: "success"
        });
        setTimeout(() => {
          Swal.close();
        }, 3000);

        await new Promise(resolve => setTimeout(resolve, 2000));

        // localStorage.setItem('UserID', JSON.stringify(response.data.UserID));
        window.location.href = '/login';

      }

    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data || "Error registering user",
        icon: "error",
      });
  
    }
  };
  
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${imagelogin})` }}
    >
      <div className="mt-20 w-full max-w-2xl bg-gradient-to-b from-bluebg to-skybg text-white rounded-lg p-5 shadow-lg">
        <form onSubmit={handleSubmit}>
          <h1 className="text-4xl font-bold text-center mb-6">Register</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input fields */}
            <input
              name="userName"
              type="text"
              placeholder="Username"
              value={formData.userName}
              onChange={handleInputChange}
              required
              className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
            />
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
            />

            <textarea
              name="bio"
              placeholder="Short Description"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full h-32 px-4 py-2 bg-transparent border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-white resize-none"
            />


          <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
            />

         
          <input
            name="ProfileImage"
            type="file"
            onChange={handleInputChange}
            required
            className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
          />


            <input
              name="workingStyle"
              type="text"
              placeholder="Working Style"
              value={formData.workingStyle}
              onChange={handleInputChange}
              className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
            />
           
           
         

          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="mt-10 w-full h-12 bg-white text-black font-bold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
          >
            Register
          </button>
          {message && <p className="text-center mt-4">{message}</p>}



        </form>
      </div>
    </div>
  );
};

export default Register;