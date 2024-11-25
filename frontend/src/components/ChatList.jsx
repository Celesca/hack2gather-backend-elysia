import PropTypes from 'prop-types';

const ChatList = ({ chats, onSelectChat }) => {
  return (
    <div className="w-1/3 bg-white border-r overflow-y-auto">
      <h2 className="text-lg font-bold p-4 border-b">Chats</h2>
      <ul>
        {chats.map((contact) => (
          <li
            key={contact.UserID}
            onClick={() => onSelectChat(contact)}
            className="p-4 border-b hover:bg-gray-200 cursor-pointer"
          >
            <p className="font-semibold">{contact.UserName}</p>
            <p className="text-sm text-gray-500 truncate">{contact.MessageContent}</p>
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
    })
  ).isRequired,
  onSelectChat: PropTypes.func.isRequired,
};

export default ChatList;