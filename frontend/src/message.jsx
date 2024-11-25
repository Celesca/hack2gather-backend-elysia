import { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import ChatBox from './components/ChatBox';
import axios from 'axios';

const Message = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [userID, setUserID] = useState(null);

  const contacts = [
    { id: 1, name: 'John Doe', message: 'Hey! How are you?' },
    { id: 2, name: 'Jane Smith', message: 'Let’s catch up soon!' },
    { id: 3, name: 'Mark Taylor', message: 'Check this out.' },
  ];

  const fetchChats = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/message/inbox/${userID}`);
      console.log(response.data[0]);
      setActiveChat(response.data[0]);
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

  fetchChats();



  const handleChatSelect = (contact) => {
    setActiveChat(contact);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {activeChat ? (
        <div className="flex flex-1 pt-4">
          <ChatList contacts={contacts} onSelectChat={handleChatSelect} />
          <ChatBox activeChat={activeChat} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <p className="text-lg text-gray-700 mb-4">Try to make new friends by Matching Feature</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => window.location.href = '/matching'}
          >
            Go to Matching Feature
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;