import Swal from 'sweetalert2';
import Axios from 'axios';
import { useState } from 'react';
import imagelogin from './assets/imagelogin.png';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    ProfileImage: '',
    workingStyle: '',
    bio: '',
    age: '',
    location: '',
  });

  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
 
    if (name === 'ProfileImage' && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: "Invalid File Type!",
          text: "Please upload JPG, PNG, or GIF images only.",
          icon: "warning"
        });
        e.target.value = null; // Reset file input
        return;
      }
 
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        Swal.fire({
          title: "File Too Large!",
          text: "Image must be smaller than 5MB.",
          icon: "warning"
        });
        e.target.value = null; // Reset file input
        return;
      }
 
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, ProfileImage: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
 };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post('http://localhost:3000/user/create', {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        ProfileImage: formData.ProfileImage,
        workingStyle: formData.workingStyle,
        bio: formData.bio,
        age: parseInt(formData.age, 10),
        location: formData.location,
      });

      setMessage("User registered successfully!");

      if (response.data) {
        console.log(response.data);
        setMessage("User registered successfully!");
        setFormData({
          userName: "",
          email: "",
          password: "",
          ProfileImage: "",
          workingStyle: "",
          bio: "",
          age: "",
          location: "",
        });

        Swal.fire({
          title: "Good job!",
          text: "Register Successful!",
          icon: "success"
        });
        setTimeout(() => {
          Swal.close();
        }, 3000);

        await new Promise(resolve => setTimeout(resolve, 2000));

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
      <div className="mt-20 w-full max-w-2xl bg-gradient-to-b from-bluebg to-skybg text-white rounded-lg p-8 shadow-2xl transform transition duration-500 hover:scale-105">
        <form onSubmit={handleSubmit}>
          <h1 className="text-4xl font-bold text-center mb-8">Register</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="userName"
              type="text"
              placeholder="Username"
              value={formData.userName}
              onChange={handleInputChange}
              required
              className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-black placeholder-white focus:outline-none focus:border-white transition duration-300 hover:bg-white hover:text-black"
            />
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white transition duration-300 hover:bg-white hover:text-black"
            />
            <textarea
              name="bio"
              placeholder="Short Description"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full h-32 px-4 py-2 bg-transparent border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-white resize-none transition duration-300 hover:bg-white hover:text-black"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white transition duration-300 hover:bg-white hover:text-black"
            />
            <input
              name="ProfileImage"
              type="file"
              onChange={handleInputChange}
              accept="image/*"
              required
              className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white transition duration-300 hover:bg-white hover:text-black"
            />
            <input
              name="workingStyle"
              type="text"
              placeholder="Working Style"
              value={formData.workingStyle}
              onChange={handleInputChange}
              className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white transition duration-300 hover:bg-white hover:text-black"
            />
            <input
              name="age"
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white transition duration-300 hover:bg-white hover:text-black"
            />
            <input
              name="location"
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white transition duration-300 hover:bg-white hover:text-black"
            />
          </div>

          <button
            type="submit"
            className="mt-10 w-full h-12 bg-white text-black font-bold rounded-full shadow-md hover:bg-gray-200 transition duration-300 transform hover:scale-105"
          >
            Register
          </button>

          <div className="text-center mt-6">
            <p className="text-white">
              Already have an account?{' '}
              <Link to="/login" className="text-black hover:underline">
                Login
              </Link>
            </p>
          </div>
          {message && <p className="text-center mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;