const ChatBubble = ({ role, content }) => {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs p-4 ${
          isUser
            ? "rounded-t-lg rounded-bl-lg bg-white text-black"
            : "rounded-t-lg rounded-br-xl bg-black text-white"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatBubble;
