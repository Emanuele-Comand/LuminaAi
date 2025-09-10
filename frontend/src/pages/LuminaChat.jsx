import { useState, useCallback, useMemo } from "react";
import LuminaSidebar from "../components/LuminaChat/LuminaSidebar";
import LuminaHeader from "../components/LuminaChat/LuminaHeader";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import ChatBubble from "../components/LuminaChat/ChatBubble";

const generateMessageId = () =>
  `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const LuminaChat = () => {
  const [messages, setMessages] = useState([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handlePrompt = useCallback(async () => {
    if (!userPrompt.trim() || isStreaming) return;

    setIsStreaming(true);
    const userMessage = {
      id: generateMessageId(),
      role: "user",
      content: userPrompt,
    };
    setMessages((prev) => [...prev, userMessage]);

    await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, userMessage],
      }),
    });

    const assistantMessage = {
      id: generateMessageId(),
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, assistantMessage]);

    const eventSource = new EventSource("/api/stream");

    eventSource.onmessage = (e) => {
      console.log("Received chunk:", e.data);
      const chunk = JSON.parse(e.data);
      console.log("Parsed chunk:", chunk);

      setMessages((prev) => {
        const lastIndex = prev.length - 1;
        if (lastIndex >= 0 && prev[lastIndex].role === "assistant") {
          const updatedMessages = [...prev];
          updatedMessages[lastIndex] = {
            ...prev[lastIndex],
            content: prev[lastIndex].content + (chunk.content || ""),
          };
          return updatedMessages;
        }
        return prev;
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
  }, [userPrompt, isStreaming, messages]);

  const handleInputChange = useCallback((e) => {
    setUserPrompt(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handlePrompt();
      }
    },
    [handlePrompt]
  );

  const inputPlaceholder = useMemo(
    () =>
      isStreaming ? "Streaming in corso..." : "Enter your message here...",
    [isStreaming]
  );

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
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  isStreaming={isStreaming && message.role === "assistant"}
                />
              ))}
            </ScrollArea>
          </div>
          <div className="bg-white/20 backdrop-blur-2xl rounded-md w-3/4 mb-4">
            <Input
              className="text-white"
              placeholder={inputPlaceholder}
              value={userPrompt}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LuminaChat;
