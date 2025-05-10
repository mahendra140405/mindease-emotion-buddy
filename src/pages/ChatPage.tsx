
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MultilingualInput from "@/components/MultilingualInput";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  emotion?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content: "Hello! I'm your mental wellness assistant. How can I help you today?",
    timestamp: new Date(),
  },
];

// Emotion keywords for detection
const EMOTION_KEYWORDS: Record<string, string[]> = {
  "happy": ["happy", "joy", "excited", "good", "great", "wonderful", "fantastic", "thrilled"],
  "sad": ["sad", "unhappy", "depressed", "down", "low", "blue", "upset", "miserable"],
  "angry": ["angry", "upset", "mad", "furious", "annoyed", "irritated", "frustrated"],
  "anxious": ["anxious", "worried", "nervous", "afraid", "scared", "fearful", "stress", "stressed"],
  "tired": ["tired", "exhausted", "sleepy", "fatigued", "drained", "weary"],
  "calm": ["calm", "peaceful", "relaxed", "content", "serene", "tranquil"]
};

// Function to detect emotion from text
const detectEmotion = (text: string): string | undefined => {
  const lowerText = text.toLowerCase();
  
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return emotion;
    }
  }
  
  return undefined;
};

const ChatPage = () => {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Try to load messages from localStorage
    const savedMessages = localStorage.getItem("chat-messages");
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (error) {
        console.error("Error parsing saved messages:", error);
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Function to save messages
  const saveMessages = (updatedMessages: ChatMessage[]) => {
    localStorage.setItem("chat-messages", JSON.stringify(updatedMessages));
  };

  // Function to clear chat history
  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    localStorage.removeItem("chat-messages");
    toast({
      title: "Chat Cleared",
      description: "Your conversation history has been cleared.",
    });
  };

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Save messages when they change
    saveMessages(messages);
  }, [messages]);

  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to chat with emotion detection
    const userMessage: ChatMessage = {
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
      emotion: detectEmotion(inputValue)
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Simulate API delay for more natural interaction
      setTimeout(() => {
        const assistantResponse: ChatMessage = {
          role: "assistant",
          content: `Thanks for sharing. I'm here to support you on your wellness journey. How else can I assist you today?`,
          timestamp: new Date(),
        };
        
        setMessages((prev) => {
          const updatedMessages = [...prev, assistantResponse];
          saveMessages(updatedMessages);
          return updatedMessages;
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chat with Mindease AI</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearChat}
            className="flex items-center gap-1"
          >
            Clear Chat
          </Button>
        </div>

        <Card className="h-[calc(100vh-200px)] border-0 shadow-lg overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto p-4">
              <ScrollArea className="h-full pr-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    } mb-4`}
                  >
                    <div className="flex items-start max-w-[80%]">
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="/placeholder.svg" alt="AI" />
                          <AvatarFallback className="bg-mindease text-white">
                            AI
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          message.role === "user"
                            ? "bg-mindease text-white rounded-tr-none"
                            : "bg-muted rounded-tl-none"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.emotion && message.role === "user" && (
                          <div className="text-xs mt-1 italic text-white/80">
                            Detected emotion: {message.emotion}
                          </div>
                        )}
                        <div
                          className={`text-xs mt-1 ${
                            message.role === "user" ? "text-white/70" : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString ? message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }) : new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 ml-2">
                          <AvatarImage src="/placeholder.svg" alt="User" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            U
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="flex items-start max-w-[80%]">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/placeholder.svg" alt="AI" />
                        <AvatarFallback className="bg-mindease text-white">AI</AvatarFallback>
                      </Avatar>
                      <div className="px-4 py-2 rounded-lg bg-muted rounded-tl-none">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-mindease rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-mindease rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-mindease rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>
            </div>
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <MultilingualInput
                  value={inputValue}
                  onChange={setInputValue}
                  placeholder="Type your message here..."
                  className="flex-1 py-3 px-4"
                  onKeyDown={handleKeyPress}
                />
                <Button
                  className="bg-mindease hover:bg-mindease-dark"
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
