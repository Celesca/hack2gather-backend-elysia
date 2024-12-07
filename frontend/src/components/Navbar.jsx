import { useState, useEffect } from 'react';
import { Search, Menu, X, Bell, InboxIcon } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userID = localStorage.getItem('UserID');
    if (userID) {
      setIsLoggedIn(true);
      fetchUserDetails(userID);
      fetchNotifications(userID);
    }
  }, []);

  const fetchUserDetails = async (userID) => {
    try {
      const response = await axios.get(`http://localhost:3000/user/id/${userID}`);
      if (response.data.Email === 'admin@gmail.com') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('UserID');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const fetchNotifications = async (userID) => {
    try {
      const response = await axios.get(`http://localhost:3000/noti/${userID}`);
      const unreadNotifications = response.data.filter(
        (notification) => !notification.ReadStatus
      );
      setNotifications(unreadNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationID) => {
    try {
      await axios.put(`http://localhost:3000/noti/${notificationID}`, { ReadStatus: true });
      setNotifications((prev) =>
        prev.filter((notification) => notification.NotificationID !== notificationID)
      );
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/hackathon?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false); // Close mobile menu if open
    }
  };

  const NotificationBell = () => (
    <div className="relative">
      <button
        className="p-2 hover:bg-white/10 rounded-full transition duration-300 relative focus:outline-none"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <Bell className="h-6 w-6 text-white" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {notifications.length}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-10">
          <ul className="divide-y divide-gray-200">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification.NotificationID}
                  className="p-4 flex justify-between items-center"
                >
                  <span>{notification.NotificationContent}</span>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => markAsRead(notification.NotificationID)}
                  >
                    ✖
                  </button>
                </li>
              ))
            ) : (
              <li className="p-4 text-gray-500">No unread notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-blue-700 p-4 shadow-lg fixed w-full z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div
              className="text-white text-3xl font-bold tracking-wider cursor-pointer hover:opacity-90 flex items-center"
              onClick={() => navigate('/')}
            >
              <span className="bg-white text-purple-700 px-2 py-1 rounded-lg mr-2">H2G</span>
              Hack2gather
            </div>
          </div>

          {/* Search Form */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="ค้นหากิจกรรม..."
                className="w-full px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-5 w-5 text-gray-300" />
              </button>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-white hover:text-purple-200 transition duration-300 font-medium">
              Home
            </a>
            {!isLoggedIn ? (
              <>
                <a href="/about_us" className="text-white hover:text-purple-200 transition duration-300 font-medium">
                  About us
                </a>
                <a href="/register" className="text-white hover:text-purple-200 transition duration-300 font-medium">
                  Register
                </a>
                <a href="/login" className="text-white hover:text-purple-200 transition duration-300 font-medium">
                  Login
                </a>
              </>
            ) : (
              <>
                <a href="/profile" className="text-white hover:text-purple-200 transition duration-300 font-medium">
                  Profile
                </a>
                <a href="/hackathon" className="text-white hover:text-purple-200 transition duration-300 font-medium">
                  Hackathon
                </a>
                <a href="/Rating" className="text-white hover:text-purple-200 transition duration-300 font-medium">
                  Rating
                </a>
                <a href="/swipe" className="text-white hover:text-purple-200 transition duration-300 font-medium">
                  Match
                </a>
                {isAdmin && (
                  <a href="/dashboard" className="text-white hover:text-purple-200 transition duration-300 font-medium">
                    Dashboard
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-purple-200 transition duration-300 font-medium"
                >
                  Logout
                </button>
                <NotificationBell />
                <a href="/message" className="text-white hover:text-purple-200 transition duration-300 font-medium">
                  <InboxIcon className="h-6 w-6" />
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
            <div className="flex flex-col space-y-2 p-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="ค้นหากิจกรรม..."
                  className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  <Search className="h-5 w-5 text-gray-300" />
                </button>
              </form>
              <a href="/" className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-300">
                Home
              </a>
              {!isLoggedIn ? (
                <>
                  <a href="/about_us" className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-300">
                    About us
                  </a>
                  <a href="/register" className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-300">
                    Register
                  </a>
                  <a href="/login" className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-300">
                    Login
                  </a>
                </>
              ) : (
                <>
                  <a href="/profile" className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-300">
                    Profile
                  </a>
                  <a href="/EventDetail" className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-300">
                    Event hackathon
                  </a>
                  <a href="/hackathon" className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-300">
                    Hackathon
                  </a>
                  <a href="/swipe" className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-300">
                    Match
                  </a>
                  {isAdmin && (
                    <a href="/dashboard" className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-300">
                      Dashboard
                    </a>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-300"
                  >
                    Logout
                  </button>
                  <NotificationBell />
                  <a href="/message" className="text-white hover:text-purple-200 transition duration-300 font-medium">
                    <InboxIcon className="h-6 w-6" />
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;