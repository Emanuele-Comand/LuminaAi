import { useState } from "react";
import LuminaSidebar from "../components/LuminaSidebar";
import LuminaHeader from "../components/LuminaHeader";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import ChatBubble from "../components/ChatBubble";

const LuminaChat = () => {
  const [messages, setMessages] = useState([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  //User prompt Handler
  const handlePrompt = async () => {
    if (!userPrompt.trim() || isStreaming) return;

    setIsStreaming(true);
    const userMessage = { role: "user", content: userPrompt };
    setMessages((prev) => [...prev, userMessage]);

    // Sending message to backend
    await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, userMessage],
      }),
    });

    // Empty message for ai response
    const assistantMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    // Opening stream
    const eventSource = new EventSource("/api/stream");

    eventSource.onmessage = (e) => {
      console.log("Received chunk:", e.data);
      const chunk = JSON.parse(e.data);
      console.log("Parsed chunk:", chunk);

      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessageIndex = newMessages.length - 1;
        if (newMessages[lastMessageIndex].role === "assistant") {
          const content = chunk.content || "";
          newMessages[lastMessageIndex] = {
            ...newMessages[lastMessageIndex],
            content: newMessages[lastMessageIndex].content + content,
          };
        }
        return newMessages;
      });
    };

    eventSource.addEventListener("done", () => {
      console.log("Stream completed");
      eventSource.close();
      setIsStreaming(false);
    });

    eventSource.addEventListener("error", (error) => {
      console.error("Stream error:", error);
      eventSource.close();
      setIsStreaming(false);
    });

    setUserPrompt("");
  };

  return (
    <>
      <div className="flex items-end justify-center">
        <div>
          <LuminaSidebar />
        </div>
        <div className="flex flex-col w-full items-center">
          <div className="bg-white/20 backdrop-blur-2xl text-white w-full border border-t-0 border-l-0 border-r-0 p-2 pt-2.5 relative z-10">
            <LuminaHeader></LuminaHeader>
          </div>
          <div>
            <ScrollArea className="bg-white/20 backdrop-blur-2xl text-white w-[886px] h-[680px] rounded-md border p-4 mb-2 mt-4 relative z-0">
              {messages.map((message, index) => (
                <ChatBubble
                  key={index}
                  role={message.role}
                  content={message.content}
                  isStreaming={isStreaming}
                ></ChatBubble>
              ))}
            </ScrollArea>
          </div>
          <div className="bg-white/20 backdrop-blur-2xl rounded-md w-3/4 mb-4">
            <Input
              className="text-white"
              placeholder={
                isStreaming
                  ? "Streaming in corso..."
                  : "Enter your message here..."
              }
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePrompt();
              }}
              disabled={isStreaming}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LuminaChat;
