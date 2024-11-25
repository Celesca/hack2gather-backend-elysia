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

  fetchChats();

  useEffect(() => {
    const user = localStorage.getItem('UserID');
    if (user) {
      setUserID(user);
      console.log(user);
    }
  }, [])



  const handleChatSelect = (contact) => {
    setActiveChat(contact);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      <div className="flex flex-1 pt-4">
        
        <ChatList contacts={contacts} onSelectChat={handleChatSelect} />

        {/* Chat Box */}
        <ChatBox activeChat={activeChat} />
      </div>
    </div>
  );
};

export default Message;