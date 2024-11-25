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
  

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/message/inbox/${userID}`
      );
      const chats = response.data.map((chat) => ({
        UserID: chat.otherUser.UserID,
        UserName: chat.otherUser.UserName,
        ProfileImage: chat.otherUser.ProfileImage,
        MessageContent: chat.MessageContent,
        unreadMessages: chat.unreadMessages,
      }));
      setChats(chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchMessages = async (receiverID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/message/${userID}/${receiverID}`
      );
      setMessages(response.data);
      // Mark messages as read
      await axios.put(`http://localhost:3000/message/read/${userID}/${receiverID}`);

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

  useEffect(() => {
    if (userID) {
      fetchChats();
    }
  }, [userID]);

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
