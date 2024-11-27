import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ChatBox = ({ activeUser, messages, handleSendMessage }) => {
  const UserID = localStorage.getItem('UserID');
  const [senderImage, setSenderImage] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Fetching the User Profile Image
  const fetchProfileImage = async (UserID) => {
    try {
      const response = await axios.get(`http://localhost:3000/user/${UserID}`);
      setSenderImage(response.data.ProfileImage);
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  useEffect(() => {
    if (UserID) {
      fetchProfileImage(UserID);
    }
  }, [UserID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      handleSendMessage(newMessage);
      setNewMessage('');
    }
  };

  if (!activeUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <p className="text-gray-500 text-lg font-medium text-center">
            Select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mt-16">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white shadow-sm sticky top-0 z-10 transform transition-all duration-300 hover:shadow-md">
        <div className="flex items-center">
          <img 
            src={activeUser.ProfileImage} 
            alt={activeUser.UserName} 
            className="w-10 h-10 rounded-full mr-4 border-2 border-blue-500 transform transition-transform duration-300 hover:scale-110"
          />
          <h2 className="text-lg font-bold text-black hover:text-blue-600 transition-colors duration-300">
            {activeUser.UserName}
          </h2>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.MessageID} 
              className="flex items-start transition-all duration-300 hover:bg-gray-100 p-2 rounded-lg"
            >
              {msg.SenderID === activeUser.UserID ? (
                <div className="flex-1 flex justify-start items-center">
                  <img 
                    src={activeUser.ProfileImage} 
                    alt={activeUser.UserName} 
                    className="w-10 h-10 rounded-full mr-3 transform transition-transform duration-300 hover:scale-110"
                  />
                  <div className="p-3 rounded-xl bg-gray-200 text-black max-w-xs shadow-sm transition-all duration-300 hover:shadow-md">
                    {msg.MessageContent}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex justify-end items-center">
                  <div className="p-3 rounded-xl bg-blue-100 text-black max-w-xs mr-3 shadow-sm transition-all duration-300 hover:shadow-md">
                    {msg.MessageContent}
                  </div>
                  <img 
                    src={senderImage} 
                    alt="Sender" 
                    className="w-10 h-10 rounded-full transform transition-transform duration-300 hover:scale-110"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t shadow-inner">
        <form 
          onSubmit={handleSubmit} 
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full border rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

ChatBox.propTypes = {
  activeUser: PropTypes.shape({
    UserID: PropTypes.string.isRequired,
    UserName: PropTypes.string.isRequired,
    ProfileImage: PropTypes.string.isRequired,
  }),
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      MessageID: PropTypes.number.isRequired,
      MessageContent: PropTypes.string.isRequired,
      SenderID: PropTypes.string.isRequired,
      ReceiverID: PropTypes.string.isRequired,
      Timestamp: PropTypes.string.isRequired,
      ReadStatus: PropTypes.bool.isRequired,
    })
  ),
  handleSendMessage: PropTypes.func.isRequired,
};

export default ChatBox;