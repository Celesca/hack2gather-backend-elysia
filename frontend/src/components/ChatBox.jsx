import PropTypes from 'prop-types';

const ChatBox = ({ activeUser, messages }) => {

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
            src={msg.SenderID.ProfileImage} 
            alt={msg.SenderID.UserName} 
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
};

export default ChatBox;