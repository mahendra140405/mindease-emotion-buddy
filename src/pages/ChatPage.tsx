
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MultilingualInput from "@/components/MultilingualInput";
import { saveChatMessage, getChatHistory } from "@/lib/supabase";

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
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Function to save messages to both local storage and server
  const saveMessages = async (updatedMessages: ChatMessage[]) => {
    // Save to local storage
    localStorage.setItem("chat-messages", JSON.stringify(updatedMessages));
    
    // Save latest user message to server if there's a user message
    const latestMessage = updatedMessages[updatedMessages.length - 1];
    if (latestMessage && latestMessage.role === "user") {
      try {
        await saveChatMessage({
          text: latestMessage.content,
          sender: 'user',
          emotion: latestMessage.emotion
        });
      } catch (error) {
        console.error("Error saving message to server:", error);
      }
    }
  };

  // Load messages on initial load
  useEffect(() => {
    const loadMessages = async () => {
      try {
        // Try to load messages from localStorage first
        const savedMessages = localStorage.getItem("chat-messages");
        let loadedMessages = INITIAL_MESSAGES;
        
        if (savedMessages) {
          try {
            loadedMessages = JSON.parse(savedMessages);
          } catch (error) {
            console.error("Error parsing saved messages:", error);
          }
        }
        
        // Try to load messages from server and append unique ones
        if (user) {
          const serverMessages = await getChatHistory();
          if (serverMessages && serverMessages.length > 0) {
            // Convert server messages to our format
            const formattedServerMessages = serverMessages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
              timestamp: new Date(msg.created_at || Date.now()),
              emotion: msg.emotion
            })) as ChatMessage[];
            
            // Merge messages, preferring local ones if there's overlap
            const localMessageIds = new Set(loadedMessages.map(m => m.content));
            const uniqueServerMessages = formattedServerMessages.filter(
              m => !localMessageIds.has(m.content)
            );
            
            loadedMessages = [...loadedMessages, ...uniqueServerMessages].sort(
              (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
            );
          }
        }
        
        setMessages(loadedMessages);
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Error loading messages:", error);
        setIsInitialLoad(false);
      }
    };
    
    loadMessages();
  }, [user]);

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
    if (!isInitialLoad) {
      scrollToBottom();
      // Save messages when they change
      saveMessages(messages);
    }
  }, [messages, isInitialLoad]);

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
      // Save the user message to both storages
      await saveChatMessage({
        text: userMessage.content,
        sender: 'user',
        emotion: userMessage.emotion
      });
      
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
        
        // Also save assistant message to server
        saveChatMessage({
          text: assistantResponse.content,
          sender: 'bot',
          emotion: 'supportive'
        }).catch(error => {
          console.error("Error saving assistant message to server:", error);
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
