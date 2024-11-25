import PropTypes from 'prop-types';

const ChatBox = ({ activeChat, messages }) => {
  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-bold">{activeChat.name}</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-blue-100 p-2 mb-2 rounded-md w-fit max-w-xs">
          {activeChat.message}
        </div>
        {/* Add more messages as needed */}
      </div>
      {messages.map((msg) => (
        <div key={msg.id} className={`p-2 mb-2 rounded-md w-fit max-w-xs ${msg.sender === 'me' ? 'bg-blue-100 self-end' : 'bg-gray-200'}`}>
          {msg.message}
        </div>
      ))}

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

ChatBox.propTypes = {
  activeChat: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
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
};

export default ChatBox;