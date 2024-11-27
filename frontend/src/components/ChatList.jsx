import PropTypes from 'prop-types';

const ChatList = ({ chats, onSelectChat }) => {
  return (
    <div className="min-h-screen w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 border-r shadow-lg mt-16">
      {/* Header with Gradient and Animated Title */}
      <h2 className="text-lg font-bold p-4 border-b bg-gradient-to-r from-purple-700 to-blue-700 text-white 
        flex items-center justify-between
        transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Chats
        </span>
        <span className="text-sm opacity-75">({chats.length})</span>
      </h2>

      {/* Chat List with Enhanced Interactions */}
      <ul className="divide-y divide-gray-200">
        {chats.map((chat) => (
          <li
            key={chat.UserID}
            onClick={() => onSelectChat(chat)}
            className="
              p-4 
              flex items-center 
              cursor-pointer 
              group 
              transition-all 
              duration-300 
              ease-in-out
              hover:bg-gradient-to-r 
              hover:from-blue-50 
              hover:to-purple-50
              transform 
              hover:-translate-y-1 
              hover:shadow-lg
              relative
              overflow-hidden
            "
          >
            {/* Subtle Background Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

            {/* Profile Image with Hover Effect */}
            <div className="relative mr-4">
              <img
                src={chat.ProfileImage}
                alt={`${chat.UserName}'s profile`}
                className="
                  w-12 h-12 
                  rounded-full 
                  border-2 
                  border-transparent 
                  group-hover:border-blue-300 
                  transition-all 
                  duration-300 
                  transform 
                  group-hover:scale-110
                  shadow-sm
                  group-hover:shadow-md
                "
              />
              {/* Online Status Indicator */}
              <span className="
                absolute 
                bottom-0 
                right-0 
                block 
                w-3 h-3 
                bg-green-500 
                rounded-full 
                ring-2 
                ring-white
                animate-pulse
              "></span>
            </div>

            {/* Chat Info */}
            <div className="flex-grow overflow-hidden">
              <div className="flex justify-between items-center">
                <p className="
                  font-semibold 
                  text-gray-800 
                  group-hover:text-blue-600 
                  transition-colors 
                  duration-300
                ">
                  {chat.UserName}
                </p>
                <p className="
                  text-xs 
                  text-gray-500 
                  group-hover:text-purple-600
                  transition-colors 
                  duration-300
                ">
                  {/* You could add timestamp here */}
                  Just now
                </p>
              </div>
              <p className="
                text-sm 
                text-gray-500 
                truncate 
                group-hover:text-gray-700 
                transition-colors 
                duration-300
              ">
                {chat.MessageContent}
              </p>
            </div>

            {/* Unread Messages Badge with Animated Pulse */}
            {chat.UnreadMessages > 0 && (
              <span className="
                bg-blue-500 
                text-white 
                rounded-full 
                px-2 
                py-1 
                text-xs 
                ml-2
                animate-bounce 
                hover:animate-none
                transition-all 
                duration-300
              ">
                {chat.UnreadMessages}
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Empty State */}
      {chats.length === 0 && (
        <div className="
          text-center 
          p-8 
          text-gray-500 
          opacity-70 
          transform 
          transition-all 
          duration-300 
          hover:scale-105
        ">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          No chats yet
        </div>
      )}
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