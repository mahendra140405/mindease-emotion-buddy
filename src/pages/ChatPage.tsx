import React, { useState, useEffect, useRef } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import MultilingualInput from "@/components/MultilingualInput";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  language?: string;
}

const ChatPage = () => {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on message change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim() !== "") {
      const newMessage: ChatMessage = {
        id: String(Date.now()),
        text: inputText,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: String(Date.now() + 1),
          text: `AI response to: ${inputText}`,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-mindease text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto py-6 px-4 h-full flex flex-col">
        <h1 className="text-2xl font-bold mb-4">AI Chat</h1>

        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto mb-4 p-3 rounded shadow-inner"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 flex flex-col ${
                message.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-xl px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-mindease text-white"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {message.text}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {message.sender === "user" ? "You" : "AI"} -{" "}
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow rounded-md"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage} className="bg-mindease hover:bg-mindease-dark">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
