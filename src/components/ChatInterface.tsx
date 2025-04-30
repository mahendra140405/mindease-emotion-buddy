
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Brain, Info, Bot, User, ArrowUpCircle, LineChart, ExternalLink, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

// Sentiment analysis function (adapted from TextBlob functionality)
const analyzeSentiment = (text: string): { sentiment: string; polarity: number } => {
  // Simple word-based sentiment analysis
  const positiveWords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'love', 'like', 'enjoy', 'positive', 'joy', 'grateful', 'thankful', 'excited'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'dislike', 'negative', 'anxious', 'worry', 'depressed', 'angry', 'upset', 'frustrated'];
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  const polarity = (positiveCount - negativeCount) / Math.max(1, positiveCount + negativeCount);
  
  let sentiment;
  if (polarity > 0.5) sentiment = "Very Positive";
  else if (polarity > 0.1) sentiment = "Positive";
  else if (polarity >= -0.1 && polarity <= 0.1) sentiment = "Neutral";
  else if (polarity >= -0.5) sentiment = "Negative";
  else sentiment = "Very Negative";
  
  return { sentiment, polarity };
};

// Coping strategies based on sentiment
const provideCopingStrategy = (sentiment: string): string => {
  const strategies: Record<string, string> = {
    "Very Positive": "Keep up the positive vibes! Consider sharing your good mood with others.",
    "Positive": "It's great to see you're feeling positive. Keep doing what you're doing!",
    "Neutral": "Feeling neutral is okay. Consider engaging in activities you enjoy.",
    "Negative": "It seems you're feeling down. Try taking a break and doing something relaxing.",
    "Very Negative": "I'm sorry to hear that you're feeling very negative. Consider talking to a friend or seeking professional help."
  };
  
  return strategies[sentiment] || "Keep going, you're doing great!";
};

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

interface MoodData {
  message: string;
  sentiment: string;
  polarity: number;
  timestamp: Date;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  emotion?: string;
  sentiment?: string;
  polarity?: number;
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
  const [showMoodChart, setShowMoodChart] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [lastCopingStrategy, setLastCopingStrategy] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if localStorage has previous chat history
    const savedMessages = localStorage.getItem("chatHistory");
    const savedMoodData = localStorage.getItem("moodData");
    
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
    
    if (savedMoodData) {
      try {
        const parsedMoodData = JSON.parse(savedMoodData);
        const moodDataWithDates = parsedMoodData.map((mood: any) => ({
          ...mood,
          timestamp: new Date(mood.timestamp)
        }));
        setMoodData(moodDataWithDates);
      } catch (error) {
        console.error("Failed to parse mood data:", error);
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
  
  const saveMoodDataToLocalStorage = (updatedMoodData: MoodData[]) => {
    try {
      localStorage.setItem("moodData", JSON.stringify(updatedMoodData));
    } catch (error) {
      console.error("Failed to save mood data:", error);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Analyze sentiment
    const { sentiment, polarity } = analyzeSentiment(inputValue);
    
    // Get coping strategy
    const copingStrategy = provideCopingStrategy(sentiment);
    setLastCopingStrategy(copingStrategy);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      sentiment,
      polarity,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessagesToLocalStorage(updatedMessages);
    
    // Update mood data
    const newMoodData: MoodData = {
      message: inputValue,
      sentiment,
      polarity,
      timestamp: new Date(),
    };
    
    const updatedMoodData = [...moodData, newMoodData];
    setMoodData(updatedMoodData);
    saveMoodDataToLocalStorage(updatedMoodData);
    
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

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "Very Positive":
        return "text-green-600";
      case "Positive":
        return "text-green-500";
      case "Neutral":
        return "text-gray-500";
      case "Negative":
        return "text-orange-500";
      case "Very Negative":
        return "text-red-600";
      default:
        return "text-gray-500";
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
  
  const toggleMoodChart = () => {
    setShowMoodChart(!showMoodChart);
    setShowResources(false);
  };
  
  const toggleResources = () => {
    setShowResources(!showResources);
    setShowMoodChart(false);
  };
  
  const renderMoodChart = () => {
    if (moodData.length === 0) {
      return <p className="text-center p-4 text-gray-500">No mood data available yet.</p>;
    }
    
    const chartHeight = 150;
    const chartWidth = moodData.length * 40;
    
    return (
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Your Mood History</h3>
          <p className="text-sm text-gray-500">This chart shows your emotional state over time based on our sentiment analysis.</p>
        </div>
        
        <div className="relative h-[200px] w-full overflow-x-auto">
          <div className="absolute inset-0" style={{ width: `${Math.max(100, chartWidth)}%` }}>
            <div className="flex h-full items-end">
              {moodData.map((data, index) => {
                const barHeight = Math.abs(data.polarity) * chartHeight;
                const isPositive = data.polarity >= 0;
                
                return (
                  <div key={index} className="flex flex-col items-center mx-1 flex-1" title={`${data.message}: ${data.sentiment}`}>
                    <div className="text-xs mb-1 truncate max-w-[60px]" style={{ color: isPositive ? 'green' : 'red' }}>
                      {data.sentiment}
                    </div>
                    <div 
                      className={`w-8 ${isPositive ? 'bg-green-400' : 'bg-red-400'} rounded-t`}
                      style={{ height: `${barHeight}px` }}
                    ></div>
                    <div className="text-xs mt-1">
                      {data.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute top-1/2 w-full h-[1px] bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderResources = () => {
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Mental Health Resources</h3>
        
        <div className="space-y-4">
          <div className="rounded-lg border p-3">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Immediate Help
            </h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>National Suicide Prevention Lifeline:</span>
                <span className="font-medium">1-800-273-8255</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Crisis Text Line:</span>
                <span className="font-medium">Text 'HELLO' to 741741</span>
              </li>
            </ul>
          </div>
          
          <div className="rounded-lg border p-3">
            <h4 className="font-medium flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-blue-500" />
              Online Resources
            </h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <a 
                  href="https://www.mentalhealth.gov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-1"
                >
                  MentalHealth.gov
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nami.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-1"
                >
                  National Alliance on Mental Illness
                </a>
              </li>
              <li>
                <a 
                  href="https://www.psychologytoday.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-1"
                >
                  Psychology Today
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-3">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Data Privacy Note:</span> This application stores your chat and mood data locally on your device only. 
              This data is not transmitted to any servers and is used solely to provide you with a better experience.
            </p>
          </div>
        </div>
      </div>
    );
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleMoodChart}
            className={showMoodChart ? "bg-mindease text-white" : ""}
          >
            <LineChart className="h-4 w-4 mr-1" />
            Mood Tracker
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleResources}
            className={showResources ? "bg-mindease text-white" : ""}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Resources
          </Button>
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
        {showMoodChart ? (
          <div className="h-full overflow-auto bg-white rounded-lg border p-2">
            {renderMoodChart()}
          </div>
        ) : showResources ? (
          <div className="h-full overflow-auto bg-white rounded-lg border p-2">
            {renderResources()}
          </div>
        ) : (
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
                      {message.sentiment && (
                        <p className={`text-xs mt-1 ${getSentimentColor(message.sentiment)}`}>
                          Sentiment: {message.sentiment}
                        </p>
                      )}
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
              
              {lastCopingStrategy && !isTyping && (
                <div className="flex justify-center">
                  <div className="max-w-[90%] rounded-lg border border-mindease bg-mindease-light p-3 text-sm text-center">
                    <strong>Suggested Coping Strategy:</strong> {lastCopingStrategy}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}

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
