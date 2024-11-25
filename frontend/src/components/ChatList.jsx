import PropTypes from 'prop-types';

const ChatList = ({ contacts, onSelectChat }) => {
  return (
    <div className="w-1/3 bg-white border-r overflow-y-auto">
      <h2 className="text-lg font-bold p-4 border-b">Chats</h2>
      <ul>
        {contacts.map((contact) => (
          <li
            key={contact.id}
            onClick={() => onSelectChat(contact)}
            className="p-4 border-b hover:bg-gray-200 cursor-pointer"
          >
            <p className="font-semibold">{contact.name}</p>
            <p className="text-sm text-gray-500 truncate">{contact.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

ChatList.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelectChat: PropTypes.func.isRequired,
};

export default ChatList;