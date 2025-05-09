import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { generateAIResponse } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

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
  language?: string;
}

// Updated language options with proper translation support
const languageOptions = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "te", label: "Telugu" },
  { value: "ta", label: "Tamil" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

// Updated mental health topics
const mentalhealthTopics = [
  { value: "general", label: "General Support" },
  { value: "anxiety", label: "Anxiety" },
  { value: "depression", label: "Depression" },
  { value: "stress", label: "Stress Management" },
  { value: "sleep", label: "Sleep Issues" },
  { value: "relationships", label: "Relationships" },
];

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
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [lastCopingStrategy, setLastCopingStrategy] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [selectedTopic, setSelectedTopic] = useState<string>("general");
  const [storeLocally, setStoreLocally] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if localStorage has previous chat history
    if (storeLocally) {
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
    }
  }, [storeLocally]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveMessagesToLocalStorage = (updatedMessages: Message[]) => {
    if (!storeLocally) return;
    
    try {
      localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  };
  
  const saveMoodDataToLocalStorage = (updatedMoodData: MoodData[]) => {
    if (!storeLocally) return;
    
    try {
      localStorage.setItem("moodData", JSON.stringify(updatedMoodData));
    } catch (error) {
      console.error("Failed to save mood data:", error);
    }
  };

  // Enhanced translation function with more robust translations
  const translateText = async (text: string, targetLanguage: string) => {
    if (targetLanguage === 'en') return text;
    
    // In a real app, you would use a translation API
    // This is a more robust mock implementation with more phrases
    const translations: Record<string, Record<string, string>> = {
      hi: {
        "Hi there! I'm your Mindease companion. How are you feeling today?": "नमस्ते! मैं आपका Mindease साथी हूँ। आज आप कैसा महसूस कर रहे हैं?",
        "Thank you for sharing. I'm here to support you with your mental wellbeing.": "साझा करने के लिए धन्यवाद। मैं आपके मानसिक स्वास्थ्य का समर्थन करने के लिए यहां हूं।",
        "I'm sorry to hear that you're feeling this way. Would you like to talk more about it?": "मुझे यह सुनकर दुख है कि आप ऐसा महसूस कर रहे हैं। क्या आप इसके बारे में और बात करना चाहेंगे?",
        "It seems like you've been having a difficult time. Remember that it's okay to ask for help.": "ऐसा लगता है कि आपका समय कठिन रहा है। याद रखें कि मदद मांगना ठीक है।",
        "What activities help you feel better when you're stressed?": "जब आप तनाव में होते हैं तो कौन सी गतिविधियां आपको बेहतर महसूस कराती हैं?",
        "I'm having trouble connecting right now. Can we try again in a moment?": "मुझे अभी कनेक्ट करने में समस्या हो रही है। क्या हम थोड़ी देर में फिर से प्रयास कर सकते हैं?"
      },
      te: {
        "Hi there! I'm your Mindease companion. How are you feeling today?": "నమస్కారం! నేను మీ Mindease సహచరుడిని. ఈరోజు మీరు ఎలా అనుభవిస్తున్నారు?",
        "Thank you for sharing. I'm here to support you with your mental wellbeing.": "పంచుకున్నందుకు ధన్యవాదాలు. మీ మానసిక ఆరోగ్యానికి మద్దతుగా నేను ఇక్కడ ఉన్నాను.",
        "I'm sorry to hear that you're feeling this way. Would you like to talk more about it?": "మీరు ఈ విధంగా భావిస్తున్నారని తెలుసుకుని నాకు బాధగా ఉంది. దీని గురించి మరింత మాట్లాడాలనుకుంటున్నారా?",
        "It seems like you've been having a difficult time. Remember that it's okay to ask for help.": "మీరు కష్టమైన సమయం గడుపుతున్నట్లు కనిపిస్తోంది. సహాయం అడగడం సరైనదే అని గుర్తుంచుకోండి.",
        "I'm having trouble connecting right now. Can we try again in a moment?": "నాకు ఇప్పుడు కనెక్ట్ చేయడంలో సమస్య ఉంది. మనం కొద్దిసేపు తర్వాత మళ్లీ ప్రయత్నించవచ్చా?"
      },
      es: {
        "Hi there! I'm your Mindease companion. How are you feeling today?": "¡Hola! Soy tu compañero Mindease. ¿Cómo te sientes hoy?",
        "Thank you for sharing. I'm here to support you with your mental wellbeing.": "Gracias por compartir. Estoy aquí para apoyarte con tu bienestar mental.",
        "I'm sorry to hear that you're feeling this way. Would you like to talk more about it?": "Lamento que te sientas así. ¿Te gustaría hablar más sobre esto?",
        "I'm having trouble connecting right now. Can we try again in a moment?": "Estoy teniendo problemas para conectarme ahora mismo. ¿Podemos intentarlo de nuevo en un momento?"
      }
    };
    
    // Try to find the specific translation
    if (translations[targetLanguage]?.[text]) {
      return translations[targetLanguage][text];
    }
    
    // If not found, use a generic translation based on sentiment analysis
    const { sentiment } = analyzeSentiment(text);
    const genericResponses: Record<string, Record<string, string>> = {
      hi: {
        "positive": "यह अच्छी बात है! क्या आप और बताना चाहेंगे?",
        "neutral": "मैं समझता हूँ। क्या आप और बताना चाहेंगे?",
        "negative": "मुझे खेद है कि आप ऐसा महसूस कर रहे हैं। क्या मैं किसी तरह से मदद कर सकता हूँ?"
      },
      te: {
        "positive": "అది మంచిది! మీరు ఇంకా చెప్పాలనుకుంటున్నారా?",
        "neutral": "నేను అర్థం చేసుకుంటున్నాను. మీరు ఇంకేమైనా చెప్పాలనుకుంటున్నారా?",
        "negative": "మీరు అలా భావిస్తున్నారని నాకు బాధగా ఉంది. నేను ఏదైనా సహాయం చేయగలనా?"
      },
      es: {
        "positive": "¡Eso es bueno! ¿Te gustaría contarme más?",
        "neutral": "Entiendo. ¿Hay algo más que quieras compartir?",
        "negative": "Siento que te sientas así. ¿Puedo ayudarte de alguna manera?"
      }
    };
    
    // Return generic response based on sentiment or original text if no translation is available
    if (sentiment.includes("Positive")) {
      return genericResponses[targetLanguage]?.["positive"] || text;
    } else if (sentiment.includes("Negative")) {
      return genericResponses[targetLanguage]?.["negative"] || text;
    } else {
      return genericResponses[targetLanguage]?.["neutral"] || text;
    }
  };

  // Enhanced handleSend for better responsiveness
  const handleSend = async () => {
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
      language: selectedLanguage
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

    try {
      // Get AI response
      const aiResponse = await generateAIResponse(inputValue);
      
      // Update recommended articles based on user message
      updateSuggestedArticles(inputValue);
      
      // Check if sentiment is very negative
      if (polarity < -0.3) {
        // Show suggestion for breathing exercise or resources
        setTimeout(() => {
          toast.info(
            "It seems you may be feeling low. Would you like to try a breathing exercise or check our resources?",
            {
              action: {
                label: "Try Breathing",
                onClick: () => playAudio("Guided Breathing"),
              },
            }
          );
        }, 1500);
      }
      
      // Translate response if needed
      let responseText = aiResponse.text;
      if (selectedLanguage !== 'en') {
        responseText = await translateText(responseText, selectedLanguage);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "bot",
        emotion: aiResponse.emotion,
        timestamp: new Date(),
        language: selectedLanguage
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveMessagesToLocalStorage(finalMessages);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Can we try again in a moment?",
        sender: "bot",
        emotion: "neutral",
        timestamp: new Date(),
        language: selectedLanguage
      };
      
      const finalMessages = [...updatedMessages, fallbackMessage];
      setMessages(finalMessages);
      saveMessagesToLocalStorage(finalMessages);
    } finally {
      setIsTyping(false);
    }
  };

  const updateSuggestedArticles = (message: string) => {
    // This function is now only used to track topic interests
    // We'll use this data in the future to personalize recommendations
    const lowerMessage = message.toLowerCase();
    
    // Log topics of interest for future use
    mentalhealthTopics.forEach(topic => {
      if (lowerMessage.includes(topic.value) && topic.value !== 'general') {
        console.log(`User showed interest in topic: ${topic.label}`);
      }
    });
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
  
  const toggleStorageMode = () => {
    if (storeLocally) {
      const confirmChange = window.confirm(
        "Switching to server storage mode will upload your conversation data to our servers. Do you want to proceed?"
      );
      if (!confirmChange) return;
    } else {
      toast.success("Switched to local storage mode. Your data stays on your device.");
    }
    setStoreLocally(!storeLocally);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <ScrollArea ref={scrollAreaRef}>
          <div className="p-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`flex items-start gap-2 p-3 rounded-lg ${
                    message.sender === "user" 
                      ? "bg-primary/10 text-primary-foreground" 
                      : "bg-muted text-foreground"
                  }`}
                >
                  <div className="mt-1">
                    {message.sender === "user" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm">{message.text}</div>
                    {message.sentiment && (
                      <div className={`text-xs mt-1 ${getSentimentColor(message.sentiment)}`}>
                        {message.sentiment}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-5 w-5" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
      
      {/* Resources link banner */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border-t border-blue-100 dark:border-blue-800 p-2 text-center">
        <Link to="/resources" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
          Access mood chart, emergency contacts, relaxation tools & resources →
        </Link>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-24">
            <Select 
              value={selectedLanguage} 
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-24">
            <Select 
              value={selectedTopic} 
              onValueChange={setSelectedTopic}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                {mentalhealthTopics.map(topic => (
                  <SelectItem key={topic.value} value={topic.value}>
                    {topic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={toggleInputType} variant="outline" size="sm">
                  {longMessage ? "Short Input" : "Long Input"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {longMessage ? "Switch to single line input" : "Switch to multi-line input"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={clearChat} variant="outline" size="sm" className="ml-auto">
                  Clear Chat
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Clear conversation history
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {longMessage ? (
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-h-[100px] resize-none"
            />
            <Button onClick={handleSend} className="bg-primary">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSend} className="bg-primary">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
