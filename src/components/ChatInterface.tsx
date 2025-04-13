
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Brain, Info, Bot, User, ArrowUpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock responses based on keywords
const getMockResponse = (message: string) => {
  const lowercaseMsg = message.toLowerCase();
  
  // Check for anxiety
  if (lowercaseMsg.includes("anxious") || lowercaseMsg.includes("anxiety")) {
    return {
      text: "It sounds like you might be experiencing anxiety. Remember that anxiety is a normal emotion that everyone feels at times. Try taking some deep breaths - inhale for 4 counts, hold for 2, and exhale for 6. Would you like to try one of our guided breathing exercises?",
      emotion: "anxious",
    };
  }
  
  // Check for sadness/depression
  if (
    lowercaseMsg.includes("sad") || 
    lowercaseMsg.includes("depress") || 
    lowercaseMsg.includes("down")
  ) {
    return {
      text: "I'm sorry to hear you're feeling down. Depression and sadness are common experiences, but you don't have to face them alone. Have you spoken to someone you trust about how you're feeling? Sometimes sharing our feelings can help lighten the load.",
      emotion: "sad",
    };
  }
  
  // Check for stress
  if (lowercaseMsg.includes("stress") || lowercaseMsg.includes("overwhelm")) {
    return {
      text: "It sounds like you're feeling overwhelmed. Stress is your body's response to high-pressure situations. Try breaking down what's causing your stress into smaller, manageable parts. Our progressive muscle relaxation exercise might help you release physical tension.",
      emotion: "stressed",
    };
  }
  
  // Check for questions about mental health
  if (lowercaseMsg.includes("mental health") || lowercaseMsg.includes("therapy")) {
    return {
      text: "Mental health is just as important as physical health! Taking care of your mental wellbeing can include therapy, mindfulness practices, regular exercise, adequate sleep, and social connection. Is there a specific aspect of mental health you'd like to know more about?",
      emotion: "neutral",
    };
  }
  
  // Default response
  return {
    text: "Thank you for sharing. I'm here to support you with your mental wellbeing. Would you like to try one of our exercises, track your mood, or continue chatting about how you're feeling?",
    emotion: "neutral",
  };
};

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  emotion?: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I'm your Mindease companion. How are you feeling today?",
      sender: "bot",
      emotion: "neutral",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      const response = getMockResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "bot",
        emotion: response.emotion,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case "anxious":
        return "bg-yellow-50 border-yellow-200";
      case "sad":
        return "bg-blue-50 border-blue-200";
      case "stressed":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-mindease-light border-mindease-light";
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-4xl animate-fade-in flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mindease AI Chat</h1>
          <p className="text-muted-foreground">
            Your supportive AI companion for mental wellbeing
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">
                This AI chatbot uses emotion detection to provide personalized
                mental health support. Your conversations are private and not
                stored permanently.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator className="my-2" />

      <div className="relative flex-1">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] items-start gap-3 rounded-lg border p-4 ${
                    message.sender === "user"
                      ? "bg-mindease text-white"
                      : getEmotionColor(message.emotion)
                  }`}
                >
                  {message.sender === "bot" && (
                    <Bot className="mt-1 h-5 w-5 text-mindease" />
                  )}
                  <div className="flex-1">
                    <p className="leading-relaxed">{message.text}</p>
                    <p className="mt-1 text-right text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {message.sender === "user" && (
                    <User className="mt-1 h-5 w-5 text-white" />
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] items-start gap-3 rounded-lg border bg-mindease-light p-4">
                  <Bot className="mt-1 h-5 w-5 text-mindease" />
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-mindease"></div>
                    <div className="h-3 w-3 animate-pulse rounded-full bg-mindease animation-delay-200"></div>
                    <div className="h-3 w-3 animate-pulse rounded-full bg-mindease animation-delay-500"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-20 right-4 rounded-full bg-white shadow-md md:bottom-24"
          onClick={scrollToBottom}
        >
          <ArrowUpCircle className="h-5 w-5 rotate-180" />
        </Button>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="bg-mindease"
          >
            {isTyping ? (
              <Brain className="h-5 w-5 animate-pulse" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          If you're experiencing a mental health emergency, please call your
          local emergency number or crisis hotline immediately.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
