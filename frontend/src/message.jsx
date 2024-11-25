import { useState } from 'react';
import ChatList from './components/ChatList';
import ChatBox from './components/ChatBox';

const Message = () => {
  const [activeChat, setActiveChat] = useState(null);

  const contacts = [
    { id: 1, name: 'John Doe', message: 'Hey! How are you?' },
    { id: 2, name: 'Jane Smith', message: 'Let’s catch up soon!' },
    { id: 3, name: 'Mark Taylor', message: 'Check this out.' },
  ];

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