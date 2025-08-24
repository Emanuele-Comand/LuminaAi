import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const ChatBubble = ({ role, content, isStreaming }) => {
  const isUser = role === "user";
  const isAi = role === "assistant";
  const showLoading = isStreaming && isAi && !content.trim();

  return (
    <div
      className={`flex items-start gap-3 mb-4 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        {/* <AvatarImage
          src={isUser ? "https://github.com/shadcn.png" : "/Lumina logo.png"}
          alt={isUser ? "User" : "AI"}
        /> */}
        <AvatarFallback
          className={`${
            isUser ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          {isUser ? "U" : "AI"}
        </AvatarFallback>
      </Avatar>
      <div
        className={`max-w-xs p-4 ${
          isUser
            ? "rounded-t-lg rounded-bl-lg bg-white text-black"
            : "rounded-t-lg rounded-br-xl bg-black text-white"
        }`}
      >
        {showLoading ? (
          <div className="flex items-center gap-1">
            <div className="bg-white rounded-full animate-pulse w-2 h-2"></div>
            <div className="bg-white rounded-full animate-pulse w-2 h-2"></div>
            <div className="bg-white rounded-full animate-pulse w-2 h-2"></div>
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
