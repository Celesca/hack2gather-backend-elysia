import { useState, useEffect } from "react";
import ChatList from "./components/ChatList";
import ChatBox from "./components/ChatBox";
import axios from "axios";

// Schemas for Inbox
// MessageID: int
// SenderID: int
// ReceiverID: int
// MessageContent: string
// otherUser: {
// UserID: int, UserName, ProfileImage

// Example of chats
// const chats = [
//   { UserID: 1, UserName: 'Alice', ProfileImage: '/profile1.jpg', }, ]

const Message = () => {
  const [activeUser, setActiveUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

    // First add this loading spinner component at the top of your file
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  

  const fetchChats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Configure axios with timeout and retry
      const instance = axios.create({
        timeout: 5000,
        baseURL: 'http://localhost:3000'
      });
      
      const response = await instance.get(`/message/inbox/${userID}`);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      const chats = response.data.map((chat) => ({
        UserID: chat.otherUser?.UserID,
        UserName: chat.otherUser?.UserName,
        ProfileImage: chat.otherUser?.ProfileImage || '/default-profile.jpg',
        MessageContent: chat.MessageContent,
      }));
      
      setChats(chats);
    } catch (error) {
      let errorMessage = 'An error occurred while fetching chats';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out';
        } else if (error.response) {
          errorMessage = `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = 'No response from server';
        }
      }
      
      setError(errorMessage);
      console.error("Error fetching chats:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (receiverID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/message/${userID}/${receiverID}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("UserID");
    if (user) {
      setUserID(user);
    }
  }, []);

  fetchChats();

  const handleChatSelect = (receiverData) => {
    setActiveUser(receiverData);
    fetchMessages(receiverData.UserID);
  };

  const handleSendMessage = async (message) => {
    try {
      await axios.post("http://localhost:3000/message/send", {
        senderID: userID,
        receiverID: activeUser.UserID,
        messageContent: message,
      });
      fetchMessages(activeUser.UserID);
    } catch (error) {
      console.error("Error sending message:", error);
  }};

  return (
    
    <div className="flex h-screen bg-gray-100">
      {chats.length > 0 ? (
        <div className="flex flex-1 pt-4">
          <ChatList chats={chats} onSelectChat={handleChatSelect} />
          <ChatBox activeUser={activeUser} messages={messages} handleSendMessage={handleSendMessage} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <img src="/undraw_friends.svg" alt="Friends" className="w-1/5" />
          <p className="text-lg text-gray-700 mb-4">
            Try to make new friends by Matching Feature
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => (window.location.href = "/swipe")}
          >
            Go to Matching Feature
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;
