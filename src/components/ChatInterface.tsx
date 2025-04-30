
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Brain, Info, Bot, User, ArrowUpCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

// Enhanced response generator with more mental health focus
const getMentalHealthResponse = (message: string) => {
  const lowercaseMsg = message.toLowerCase();
  
  // Check for anxiety
  if (lowercaseMsg.includes("anxious") || lowercaseMsg.includes("anxiety") || lowercaseMsg.includes("worry") || lowercaseMsg.includes("panic")) {
    return {
      text: "It sounds like you might be experiencing anxiety. Remember that anxiety is a normal emotion that everyone feels at times. Try taking some deep breaths - inhale for 4 counts, hold for 2, and exhale for 6. Would you like to try one of our guided breathing exercises?",
      emotion: "anxious",
    };
  }
  
  // Check for sadness/depression
  if (
    lowercaseMsg.includes("sad") || 
    lowercaseMsg.includes("depress") || 
    lowercaseMsg.includes("down") ||
    lowercaseMsg.includes("hopeless") ||
    lowercaseMsg.includes("empty")
  ) {
    return {
      text: "I'm sorry to hear you're feeling down. Depression and sadness are common experiences, but you don't have to face them alone. Have you spoken to someone you trust about how you're feeling? Sometimes sharing our feelings can help lighten the load. Remember that professional help is also available if needed.",
      emotion: "sad",
    };
  }
  
  // Check for stress
  if (lowercaseMsg.includes("stress") || lowercaseMsg.includes("overwhelm") || lowercaseMsg.includes("pressure")) {
    return {
      text: "It sounds like you're feeling overwhelmed. Stress is your body's response to high-pressure situations. Try breaking down what's causing your stress into smaller, manageable parts. Our progressive muscle relaxation exercise might help you release physical tension. Remember to take breaks and practice self-care.",
      emotion: "stressed",
    };
  }
  
  // Check for sleep issues
  if (lowercaseMsg.includes("sleep") || lowercaseMsg.includes("insomnia") || lowercaseMsg.includes("tired") || lowercaseMsg.includes("rest")) {
    return {
      text: "Sleep problems can significantly impact mental health. Try establishing a regular sleep schedule, creating a relaxing bedtime routine, and limiting screen time before bed. Our sleep meditation exercises might help you fall asleep more easily. Would you like to try one?",
      emotion: "tired",
    };
  }
  
  // Check for self-esteem issues
  if (lowercaseMsg.includes("worthless") || lowercaseMsg.includes("hate myself") || lowercaseMsg.includes("not good enough") || lowercaseMsg.includes("failure")) {
    return {
      text: "I'm hearing that you might be struggling with self-esteem. Remember that your worth isn't determined by achievements or others' opinions. You are inherently valuable. Try practicing self-compassion - speak to yourself as you would to a good friend. Would you like to explore some self-compassion exercises?",
      emotion: "sad",
    };
  }
  
  // Check for trauma
  if (lowercaseMsg.includes("trauma") || lowercaseMsg.includes("ptsd") || lowercaseMsg.includes("flashback") || lowercaseMsg.includes("something bad happened")) {
    return {
      text: "Trauma can have a profound impact on mental wellbeing. If you're experiencing symptoms related to trauma, know that healing is possible. Grounding techniques can help during difficult moments. For example, try naming 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
      emotion: "anxious",
    };
  }
  
  // Check for questions about therapy
  if (lowercaseMsg.includes("therapy") || lowercaseMsg.includes("counseling") || lowercaseMsg.includes("therapist") || lowercaseMsg.includes("psychiatrist")) {
    return {
      text: "Therapy can be a valuable resource for mental health support. Different types include cognitive-behavioral therapy (CBT), psychodynamic therapy, and mindfulness-based approaches. A mental health professional can help determine what might be most beneficial for your specific needs. Would you like to learn more about finding a therapist?",
      emotion: "neutral",
    };
  }
  
  // Check for questions about mental health
  if (lowercaseMsg.includes("mental health") || lowercaseMsg.includes("mental illness") || lowercaseMsg.includes("mental wellbeing")) {
    return {
      text: "Mental health is just as important as physical health! Taking care of your mental wellbeing can include therapy, mindfulness practices, regular exercise, adequate sleep, and social connection. Is there a specific aspect of mental health you'd like to know more about?",
      emotion: "neutral",
    };
  }
  
  // Check for gratitude and positive emotions
  if (lowercaseMsg.includes("grateful") || lowercaseMsg.includes("thankful") || lowercaseMsg.includes("blessed") || lowercaseMsg.includes("happy")) {
    return {
      text: "It's wonderful to hear you're experiencing positive emotions! Practicing gratitude regularly can boost mental wellbeing. Consider keeping a gratitude journal or taking a moment each day to reflect on things you appreciate. Would you like to share what you're grateful for today?",
      emotion: "neutral",
    };
  }
  
  // Check for greeting or how are you
  if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi") || 
      lowercaseMsg.includes("hey") || lowercaseMsg.includes("how are you")) {
    return {
      text: "Hello! I'm Mindease, your AI mental health companion. I'm here to support you and provide resources for your mental wellbeing. How are you feeling today? Remember, I'm here to listen without judgment.",
      emotion: "neutral",
    };
  }
  
  // Default response
  return {
    text: "Thank you for sharing. I'm here to support you with your mental wellbeing. Would you like to try one of our exercises, track your mood, or continue chatting about how you're feeling? Remember that while I'm here to help, I'm not a replacement for professional mental health support.",
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
  const [longMessage, setLongMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if localStorage has previous chat history
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string timestamps back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error("Failed to parse chat history:", error);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveMessagesToLocalStorage = (updatedMessages: Message[]) => {
    try {
      localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessagesToLocalStorage(updatedMessages);
    
    setInputValue("");
    setIsTyping(true);
    setLongMessage(false);

    // Simulate response delay (1.5-3 seconds)
    const responseDelay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      const response = getMentalHealthResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "bot",
        emotion: response.emotion,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveMessagesToLocalStorage(finalMessages);
      setIsTyping(false);
    }, responseDelay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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
      case "tired":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-mindease-light border-mindease-light";
    }
  };

  const clearChat = () => {
    const confirmClear = window.confirm("Are you sure you want to clear your chat history?");
    if (confirmClear) {
      setMessages([
        {
          id: "1",
          text: "Hi there! I'm your Mindease companion. How are you feeling today?",
          sender: "bot",
          emotion: "neutral",
          timestamp: new Date(),
        },
      ]);
      localStorage.removeItem("chatHistory");
      toast.success("Chat history cleared");
    }
  };

  const toggleInputType = () => {
    setLongMessage(!longMessage);
    setTimeout(() => {
      if (!longMessage) {
        textareaRef.current?.focus();
      }
    }, 0);
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
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearChat}>
            Clear Chat
          </Button>
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
                  mental health support. Your conversations are stored locally on your device
                  and not sent to any server.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
                    <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
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
          {longMessage ? (
            <Textarea
              ref={textareaRef}
              placeholder="Type your message (press Shift+Enter for new line)..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-h-[80px] max-h-[200px]"
            />
          ) : (
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleInputType}
            title={longMessage ? "Switch to single line input" : "Switch to multi-line input"}
            className="flex-shrink-0"
          >
            {longMessage ? (
              <span className="text-xs">abc</span>
            ) : (
              <span className="text-xs">ABC</span>
            )}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="bg-mindease flex-shrink-0"
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
