import { FaUser, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import imagelogin from './assets/imagelogin.png';
import Axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post('http://localhost:3000/user/login', formData);

      console.log(response.data);


      const userID = response.data.UserID || response.data.user?.UserID;
      if (!userID) throw new Error('UserID is missing in the response');



      Swal.fire({
        title: "Good job!",
        text: "Login Sucessful!",
        icon: "success"
      });
      setTimeout(() => {
        Swal.close();
      }, 3000);

      await new Promise(resolve => setTimeout(resolve, 750));

      // Save token to localStorage and redirect
      // localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('UserID', userID);
      window.location.href = '/profile';
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data.message || 'Login failed!',
        icon: 'error',
      });
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${imagelogin})` }}
    >
      <div className="bg-gradient-to-b from-bluebg to-skybg shadow-lg rounded-lg p-12 w-90 transform transition-transform hover:scale-105">
        <form onSubmit={handleLogin}>
          <h1 className="text-4xl font-bold mb-8 text-center text-white">Login</h1>
          <div className="relative mb-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-full w-full py-3 px-4 bg-white bg-opacity-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white transition-transform hover:scale-105"
            />
            <FaUser className="absolute right-4 top-3 text-white" />
          </div>
          <div className="relative mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-full w-full py-3 px-4 bg-white bg-opacity-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white transition-transform hover:scale-105"
            />
            <FaLock className="absolute right-4 top-3 text-white" />
          </div>
          <div className="flex justify-between items-center mb-6 text-white">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-black hover:underline ml-4">
              Forgot password?
            </a>
          </div>
          <button className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition-transform hover:scale-105">
            Login
          </button>
          <div className="text-center mt-6">
            <p className="text-white">
              Don&apos;t have an account?{' '}
              <Link to="/Register" className="text-black hover:underline">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
