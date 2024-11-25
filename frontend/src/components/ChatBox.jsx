import PropTypes from 'prop-types';
import { useState } from 'react';
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

  fetchProfileImage(UserID);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      handleSendMessage(newMessage);
      setNewMessage('');
    }
  };

  if (!activeUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 pt-16">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-bold text-black">{activeUser.UserName}</h2>
      </div>

      {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col">
            {messages.map((msg) => (
              <div key={msg.MessageID} className="flex items-start mb-2">
          {msg.SenderID === activeUser.UserID ? (
            <>
              <div className="flex-1 flex justify-start">
                <img 
            src={activeUser.ProfileImage} 
            alt={activeUser.UserName} 
            className="w-8 h-8 rounded-full mr-2"
                />
                <div className="p-2 rounded-md bg-gray-200 text-black max-w-xs">
            {msg.MessageContent}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 flex justify-end">
                <div className="p-2 rounded-md bg-blue-100 text-black max-w-xs">
            {msg.MessageContent}
                </div>
                <img 
            src={senderImage} 
            alt={senderImage} 
            className="w-8 h-8 rounded-full ml-2"
                />
              </div>
            </>
          )}
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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
    MessageContent: PropTypes.string.isRequired,
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