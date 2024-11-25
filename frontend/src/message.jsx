import { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import ChatBox from './components/ChatBox';
import axios from 'axios';

// Schemas for Inbox
// MessageID: int
// SenderID: int
// ReceiverID: int
// MessageContent: string
// otherUser: {
// UserID: int, UserName, ProfileImage

const Message = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [userID, setUserID] = useState(null);
  const [chats, setChats] = useState([]);

  // Example of chats
  // const chats = [
  //   { UserID: 1, UserName: 'Alice', ProfileImage: '/profile1.jpg', }, ]

  const fetchChats = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/message/inbox/${userID}`);
      console.log(response.data);
      const chats = response.data.map(chat => ({
        UserID: chat.otherUser.UserID,
        UserName: chat.otherUser.UserName,
        ProfileImage: chat.otherUser.ProfileImage,
        MessageContent: chat.MessageContent
      }));
      setChats(chats);

      console.log(chats);
      // setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('UserID');
    if (user) {
      setUserID(user);
    }
  }, [])

  useEffect(() => {
    fetchChats();
  }, [userID]);

  const handleChatSelect = (contact) => {
    setActiveChat(contact);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {activeChat ? (
        <div className="flex flex-1 pt-4">
          <ChatList chats={chats} onSelectChat={handleChatSelect} />
          <ChatBox activeChat={activeChat} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <img src="/undraw_friends.svg" alt="Friends" className="w-1/5" />
          <p className="text-lg text-gray-700 mb-4">Try to make new friends by Matching Feature</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => window.location.href = '/swipe'}
          >
            Go to Matching Feature
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;