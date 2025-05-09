import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Brain, Info, Bot, User, ArrowUpCircle, LineChart, ExternalLink, AlertTriangle, Moon, Phone, Globe, UserRound, BookOpen } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

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

const emergencyContacts = [
  { name: "National Suicide Prevention Lifeline", number: "1-800-273-8255" },
  { name: "Crisis Text Line", number: "Text HOME to 741741" },
  { name: "National Domestic Violence Hotline", number: "1-800-799-7233" },
  { name: "National Mental Health Helpline", number: "1-800-662-4357" },
  { name: "Indian Mental Health Hotline", number: "1800-599-0019" },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "te", label: "Telugu" },
  { value: "ta", label: "Tamil" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

const mentalhealthTopics = [
  { value: "general", label: "General Support" },
  { value: "anxiety", label: "Anxiety" },
  { value: "depression", label: "Depression" },
  { value: "stress", label: "Stress Management" },
  { value: "sleep", label: "Sleep Issues" },
  { value: "relationships", label: "Relationships" },
];

const recommendedArticles = [
  {
    title: "5 Ways to Manage Anxiety",
    url: "#",
    topics: ["anxiety", "stress"],
  },
  {
    title: "Understanding Depression: Signs and Support",
    url: "#",
    topics: ["depression"],
  },
  {
    title: "How to Improve Your Sleep Quality",
    url: "#",
    topics: ["sleep"],
  },
  {
    title: "Building Healthy Relationships",
    url: "#",
    topics: ["relationships"],
  },
  {
    title: "Mindfulness Techniques for Daily Life",
    url: "#",
    topics: ["stress", "anxiety", "general"],
  },
  {
    title: "Recognizing Burnout and Recovery Strategies",
    url: "#",
    topics: ["stress", "general"],
  }
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
  const [showMoodChart, setShowMoodChart] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showEmergencySupport, setShowEmergencySupport] = useState(false);
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [lastCopingStrategy, setLastCopingStrategy] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [selectedTopic, setSelectedTopic] = useState<string>("general");
  const [showRelaxation, setShowRelaxation] = useState(false);
  const [storeLocally, setStoreLocally] = useState(true);
  const [showArticles, setShowArticles] = useState(false);
  const [suggestedArticles, setSuggestedArticles] = useState(recommendedArticles);
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

  const translateText = async (text: string, targetLanguage: string) => {
    if (targetLanguage === 'en') return text;
    
    // In a real app, you would use a translation API
    // This is a simple mock implementation
    const translations: Record<string, Record<string, string>> = {
      hi: {
        "Hi there! I'm your Mindease companion. How are you feeling today?": "नमस्ते! मैं आपका Mindease साथी हूँ। आज आप कैसा महसूस कर रहे हैं?",
        "Thank you for sharing. I'm here to support you with your mental wellbeing.": "साझा करने के लिए धन्यवाद। मैं आपके मानसिक स्वास्थ्य का समर्थन करने के लिए यहां हूं।"
      },
      te: {
        "Hi there! I'm your Mindease companion. How are you feeling today?": "నమస్కారం! నేను మీ Mindease సహచరుడిని. ఈరోజు మీరు ఎలా అనుభవిస్తున్నారు?",
        "Thank you for sharing. I'm here to support you with your mental wellbeing.": "పంచుకున్నందుకు ధన్యవాదాలు. మీ మానసిక ఆరోగ్యానికి మద్దతుగా నేను ఇక్కడ ఉన్నాను."
      }
    };
    
    return translations[targetLanguage]?.[text] || text;
  };

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
                label: "Show Resources",
                onClick: () => setShowResources(true),
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
    const lowerMessage = message.toLowerCase();
    const filtered = recommendedArticles.filter(article => {
      return article.topics.some(topic => 
        lowerMessage.includes(topic) || 
        (selectedTopic !== 'general' && topic === selectedTopic)
      );
    });
    
    setSuggestedArticles(filtered.length > 0 ? filtered : recommendedArticles.slice(0, 3));
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
    setShowEmergencySupport(false);
    setShowRelaxation(false);
    setShowArticles(false);
  };
  
  const toggleResources = () => {
    setShowResources(!showResources);
    setShowMoodChart(false);
    setShowEmergencySupport(false);
    setShowRelaxation(false);
    setShowArticles(false);
  };

  const toggleEmergencySupport = () => {
    setShowEmergencySupport(!showEmergencySupport);
    setShowMoodChart(false);
    setShowResources(false);
    setShowRelaxation(false);
    setShowArticles(false);
  };

  const toggleRelaxation = () => {
    setShowRelaxation(!showRelaxation);
    setShowMoodChart(false);
    setShowResources(false);
    setShowEmergencySupport(false);
    setShowArticles(false);
  };

  const toggleArticles = () => {
    setShowArticles(!showArticles);
    setShowMoodChart(false);
    setShowResources(false);
    setShowEmergencySupport(false);
    setShowRelaxation(false);
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
  
  const alertGuardian = () => {
    // In a real app, this would send an alert to a pre-configured contact
    toast.info("In a real app, this would alert your emergency contact. This is just a demo.");
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

  const renderEmergencySupport = () => {
    return (
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-xl font-medium text-red-600 flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Support Contacts
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            If you're experiencing a mental health crisis, please don't hesitate to reach out for help.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {emergencyContacts.map((contact, index) => (
            <div 
              key={index}
              className="flex justify-between items-center p-3 bg-white rounded-lg border border-red-100 hover:bg-red-50 transition-colors"
            >
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-red-600 font-medium">{contact.number}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-red-200 hover:bg-red-100 hover:text-red-800"
                onClick={() => {
                  // In a real app, this would initiate a call
                  toast.info(`In a real app, this would call ${contact.number}. This is just a demo.`);
                }}
              >
                Call Now
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <h4 className="font-medium flex items-center gap-2 text-red-700 mb-2">
            <AlertTriangle className="h-4 w-4" />
            Alert a Guardian or Friend
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            With your consent, we can alert a pre-configured emergency contact when you're in distress.
          </p>
          <div className="flex justify-between items-center">
            <Button 
              variant="destructive"
              size="sm"
              onClick={alertGuardian}
              className="bg-red-600 hover:bg-red-700"
            >
              Alert My Emergency Contact
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("In a real app, this would let you manage your emergency contacts.")}
            >
              Manage Contacts
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderRelaxation = () => {
    const relaxationOptions = [
      { name: "Guided Breathing", duration: "5 min", icon: "🫁" },
      { name: "Rain Sounds", duration: "15 min", icon: "🌧️" },
      { name: "Forest Ambience", duration: "30 min", icon: "🌳" },
      { name: "Deep Sleep Music", duration: "1 hour", icon: "🌙" },
      { name: "Ocean Waves", duration: "20 min", icon: "🌊" },
      { name: "Meditation Guide", duration: "10 min", icon: "🧘" },
    ];

    return (
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-xl font-medium text-purple-600 flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Sleep & Relaxation
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Discover calming sounds and guided meditations to help you relax and sleep better.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {relaxationOptions.map((option, index) => (
            <button 
              key={index}
              className="p-4 bg-white rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors flex flex-col items-center justify-center gap-2 text-center"
              onClick={() => {
                toast.info(`Playing ${option.name} for ${option.duration}. (Demo)`, {
                  description: "In a full app, audio would start playing."
                });
              }}
            >
              <span className="text-2xl">{option.icon}</span>
              <div>
                <p className="font-medium">{option.name}</p>
                <p className="text-xs text-gray-500">{option.duration}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <h4 className="font-medium mb-2">Sleep Timer</h4>
          <div className="flex items-center gap-2">
            <Select defaultValue="15">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => toast.info("Timer set! Audio would automatically stop after the selected time.")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Set Timer
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderArticles = () => {
    return (
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-xl font-medium text-blue-600 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Recommended Articles
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Articles and resources tailored to your conversations and selected topics.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {suggestedArticles.map((article, index) => (
            <div 
              key={index}
              className="p-4 bg-white rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors"
            >
              <h4 className="font-medium text-blue-800">{article.title}</h4>
              <div className="flex gap-1 mt-1 mb-3">
                {article.topics.map((topic, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="text-blue-600 border-blue-200"
                onClick={() => {
                  toast.info(`Opening article: ${article.title} (Demo)`);
                }}
              >
                Read Article
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium mb-2">Filter by Topic</h4>
          <Select 
            value={selectedTopic} 
            onValueChange={(value) => {
              setSelectedTopic(value);
              if (value !== 'general') {
                const filtered = recommendedArticles.filter(article => 
                  article.topics.includes(value)
                );
                setSuggestedArticles(filtered.length > 0 ? filtered : recommendedArticles.slice(0, 3));
              } else {
                setSuggestedArticles(recommendedArticles.slice(0, 3));
              }
            }}
          >
            <SelectTrigger className="w-full mb-2">
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              {mentalhealthTopics.map((topic) => (
                <SelectItem key={topic.value} value={topic.value}>
                  {topic.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <div className="flex gap-2 flex-wrap justify-end">
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
            onClick={toggleEmergencySupport}
            className={showEmergencySupport ? "bg-red-600 text-white" : "text-red-600"}
          >
            <Phone className="h-4 w-4 mr-1" />
            Emergency
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleRelaxation}
            className={showRelaxation ? "bg-purple-600 text-white" : ""}
          >
            <Moon className="h-4 w-4 mr-1" />
            Sleep & Relax
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleArticles}
            className={showArticles ? "bg-blue-600 text-white" : ""}
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Articles
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleStorageMode}
                  className={storeLocally ? "bg-green-50" : ""}
                >
                  {storeLoc
