import PropTypes from 'prop-types';

const ChatList = ({ chats, onSelectChat }) => {
  return (
    <div className="w-1/3 bg-white border-r overflow-y-auto">
      <h2 className="text-lg font-bold p-4 border-b">Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.UserID}
            onClick={() => onSelectChat(chat)}
            className="p-4 border-b hover:bg-gray-200 cursor-pointer flex items-center"
          >
            <img
              src={chat.ProfileImage}
              alt={`${chat.UserName}'s profile`}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div>
              <p className="font-semibold">{chat.UserName}</p>
              <p className="text-sm text-gray-500 truncate">{chat.MessageContent}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

ChatList.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      UserID: PropTypes.string.isRequired,
      UserName: PropTypes.string.isRequired,
      ProfileImage: PropTypes.string.isRequired,
      MessageContent: PropTypes.string.isRequired,
      UnreadMessages: PropTypes.number,
    })
  ).isRequired,
  onSelectChat: PropTypes.func.isRequired,
};

export default ChatList;