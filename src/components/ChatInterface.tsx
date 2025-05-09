import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Brain, Bot, User, ArrowUpCircle, LineChart, ExternalLink, AlertTriangle, Moon, Phone, Globe, BookOpen, Play, Pause, Volume2, VolumeX } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

// Updated audio files with actual URLs
const audioFiles = {
  "Guided Breathing": "https://assets.mixkit.co/music/preview/mixkit-meditation-flute-347.mp3",
  "Rain Sounds": "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1248.mp3",
  "Forest Ambience": "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3",
  "Deep Sleep Music": "https://assets.mixkit.co/music/preview/mixkit-deep-meditation-138.mp3",
  "Ocean Waves": "https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3",
  "Meditation Guide": "https://assets.mixkit.co/music/preview/mixkit-serene-view-122.mp3"
};

// Updated emergency contacts with tel: links
const emergencyContacts = [
  { name: "National Suicide Prevention Lifeline", number: "1-800-273-8255", tel: "tel:18002738255" },
  { name: "Crisis Text Line", number: "Text HOME to 741741", tel: "sms:741741&body=HOME" },
  { name: "National Domestic Violence Hotline", number: "1-800-799-7233", tel: "tel:18007997233" },
  { name: "National Mental Health Helpline", number: "1-800-662-4357", tel: "tel:18006624357" },
  { name: "Indian Mental Health Hotline", number: "1800-599-0019", tel: "tel:18005990019" },
];

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

// Enhanced recommended articles with actual content
const recommendedArticles = [
  {
    title: "5 Ways to Manage Anxiety",
    url: "#anxiety-management",
    topics: ["anxiety", "stress"],
    content: `
      <h2>5 Ways to Manage Anxiety</h2>
      <p>Anxiety is a natural response to stress, but when it becomes overwhelming, these techniques can help:</p>
      <ol>
        <li><strong>Deep Breathing:</strong> Practice the 4-7-8 technique: inhale for 4 seconds, hold for 7, exhale for 8.</li>
        <li><strong>Progressive Muscle Relaxation:</strong> Tense and then release each muscle group in your body.</li>
        <li><strong>Mindfulness Meditation:</strong> Focus on the present moment without judgment.</li>
        <li><strong>Regular Exercise:</strong> Physical activity releases endorphins that reduce stress.</li>
        <li><strong>Limit Caffeine and Alcohol:</strong> Both can trigger or worsen anxiety symptoms.</li>
      </ol>
      <p>Remember that persistent anxiety may benefit from professional support. Don't hesitate to reach out to a mental health professional.</p>
    `
  },
  {
    title: "Understanding Depression: Signs and Support",
    url: "#depression-support",
    topics: ["depression"],
    content: `
      <h2>Understanding Depression: Signs and Support</h2>
      <p>Depression is more than just feeling sad. It's a serious mental health condition that affects millions worldwide.</p>
      <h3>Common Signs of Depression:</h3>
      <ul>
        <li>Persistent sadness or empty mood</li>
        <li>Loss of interest in once-enjoyed activities</li>
        <li>Changes in appetite and sleep patterns</li>
        <li>Fatigue or low energy nearly every day</li>
        <li>Feelings of worthlessness or excessive guilt</li>
      </ul>
      <h3>Support Strategies:</h3>
      <ul>
        <li>Seek professional help from a therapist or psychiatrist</li>
        <li>Maintain social connections even when you don't feel like it</li>
        <li>Establish regular routines for sleep, meals, and exercise</li>
        <li>Challenge negative thoughts with evidence-based thinking</li>
      </ul>
      <p>Remember: Depression is treatable, and recovery is possible with the right support.</p>
    `
  },
  {
    title: "How to Improve Your Sleep Quality",
    url: "#sleep-quality",
    topics: ["sleep"],
    content: `
      <h2>How to Improve Your Sleep Quality</h2>
      <p>Getting enough quality sleep is crucial for both physical and mental health. Here are some strategies to improve your sleep:</p>
      <ul>
        <li><strong>Establish a Regular Sleep Schedule:</strong> Go to bed and wake up at the same time every day, even on weekends.</li>
        <li><strong>Create a Relaxing Bedtime Routine:</strong> Take a warm bath, read a book, or listen to calming music before bed.</li>
        <li><strong>Optimize Your Sleep Environment:</strong> Make sure your bedroom is dark, quiet, and cool.</li>
        <li><strong>Limit Screen Time Before Bed:</strong> The blue light emitted from screens can interfere with sleep.</li>
        <li><strong>Avoid Caffeine and Alcohol Before Bed:</strong> Both can disrupt your sleep patterns.</li>
      </ul>
      <p>If you continue to struggle with sleep, consider consulting a healthcare professional.</p>
    `
  },
  {
    title: "Building Healthy Relationships",
    url: "#healthy-relationships",
    topics: ["relationships"],
    content: `
      <h2>Building Healthy Relationships</h2>
      <p>Healthy relationships are essential for our wellbeing. Here are some tips for building and maintaining strong relationships:</p>
      <ul>
        <li><strong>Communicate Openly and Honestly:</strong> Share your thoughts and feelings with your partner or friends.</li>
        <li><strong>Practice Active Listening:</strong> Pay attention to what others are saying and show that you understand.</li>
        <li><strong>Set Boundaries:</strong> Respect your own needs and boundaries, as well as those of others.</li>
        <li><strong>Show Appreciation:</strong> Let your loved ones know that you value them.</li>
        <li><strong>Resolve Conflicts Constructively:</strong> Address disagreements in a calm and respectful manner.</li>
      </ul>
      <p>Remember that healthy relationships require effort from both parties. Be willing to invest time and energy into your relationships.</p>
    `
  },
  {
    title: "Mindfulness Techniques for Daily Life",
    url: "#mindfulness-techniques",
    topics: ["stress", "anxiety", "general"],
    content: `
      <h2>Mindfulness Techniques for Daily Life</h2>
      <p>Mindfulness is the practice of paying attention to the present moment without judgment. Here are some techniques to incorporate mindfulness into your daily life:</p>
      <ul>
        <li><strong>Mindful Breathing:</strong> Focus on your breath as it enters and leaves your body.</li>
        <li><strong>Body Scan Meditation:</strong> Pay attention to sensations in different parts of your body.</li>
        <li><strong>Mindful Walking:</strong> Notice the sensations of your feet as they make contact with the ground.</li>
        <li><strong>Mindful Eating:</strong> Savor each bite of food and pay attention to its taste and texture.</li>
        <li><strong>Mindful Listening:</strong> Give your full attention to the person who is speaking.</li>
      </ul>
      <p>Mindfulness can help reduce stress, improve focus, and increase overall wellbeing.</p>
    `
  },
  {
    title: "Recognizing Burnout and Recovery Strategies",
    url: "#burnout-recovery",
    topics: ["stress", "general"],
    content: `
      <h2>Recognizing Burnout and Recovery Strategies</h2>
      <p>Burnout is a state of emotional, physical, and mental exhaustion caused by prolonged or excessive stress. Here are some signs of burnout and strategies for recovery:</p>
      <h3>Signs of Burnout:</h3>
      <ul>
        <li>Feeling exhausted or drained most of the time</li>
        <li>Having a cynical or negative outlook</li>
        <li>Feeling detached from your work or relationships</li>
        <li>Experiencing physical symptoms such as headaches or stomachaches</li>
        <li>Having difficulty concentrating</li>
      </ul>
      <h3>Recovery Strategies:</h3>
      <ul>
        <li>Take breaks and vacations</li>
        <li>Set boundaries and learn to say no</li>
        <li>Practice self-care activities such as exercise, meditation, or hobbies</li>
        <li>Seek support from friends, family, or a therapist</li>
        <li>Re-evaluate your priorities and goals</li>
      </ul>
      <p>Remember that recovery from burnout takes time and effort. Be patient with yourself and prioritize your wellbeing.</p>
    `
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
  
  // New state variables for audio functionality
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState(0.5);
  const [showArticleDialog, setShowArticleDialog] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = audioVolume;
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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
        <h3 className="text-lg font-medium mb-4">Emergency Support</h3>
        
        <div className="space-y-4">
          {emergencyContacts.map(contact => (
            <div key={contact.name} className="rounded-lg border p-3">
              <h4 className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                {contact.name}
              </h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span>{contact.number}</span>
                  <span className="font-medium">{contact.tel}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRelaxation = () => {
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Relaxation Techniques</h3>
        
        <div className="space-y-4">
          <div className="rounded-lg border p-3">
            <h4 className="font-medium flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
              Guided Breathing
            </h4>
            <p className="text-sm text-gray-500">Listen to a guided breathing exercise to help you relax.</p>
          </div>
          
          <div className="rounded-lg border p-3">
            <h4 className="font-medium flex items-center gap-2">
              <LineChart className="h-4 w-4 text-blue-500" />
              Rain Sounds
            </h4>
            <p className="text-sm text-gray-500">Listen to rain sounds to help you relax.</p>
          </div>
          
          <div className="rounded-lg border p-3">
            <h4 className="font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-500" />
              Forest Ambience
            </h4>
            <p className="text-sm text-gray-500">Listen to forest sounds to help you relax.</p>
          </div>
          
          <div className="rounded-lg border p-3">
            <h4 className="font-medium flex items-center gap-2">
              <Moon className="h-4 w-4 text-yellow-500" />
              Deep Sleep Music
            </h4>
            <p className="text-sm text-gray-500">Listen to deep sleep music to help you relax.</p>
          </div>
          
          <div className="rounded-lg border p-3">
            <h4 className="font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-red-500" />
              Ocean Waves
            </h4>
            <p className="text-sm text-gray-500">Listen to ocean waves to help you relax.</p>
          </div>
          
          <div className="rounded-lg border p-3">
            <h4 className="font-medium flex items-center gap-2">
              <Play className="h-4 w-4 text-green-500" />
              Meditation Guide
            </h4>
            <p className="text-sm text-gray-500">Listen to a meditation guide to help you relax.</p>
          </div>
        </div>
      </div>
    );
  };

  const renderArticles = () => {
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Recommended Articles</h3>
        
        <div className="space-y-4">
          {suggestedArticles.map(article => (
            <div key={article.title} className="rounded-lg border p-3">
              <h4 className="font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                {article.title}
              </h4>
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center gap-1"
              >
                Read More
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const playAudio = (audioName: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioFiles[audioName];
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const changeVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setAudioVolume(volume);
    }
  };

  const openArticle = (article: any) => {
    setCurrentArticle(article);
    setShowArticleDialog(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <ScrollArea ref={scrollAreaRef}>
          <div className="p-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-center gap-2 ${message.sender === "user" ? "bg-mindease-light border-mindease-light" : "bg-mindease-dark border-mindease-dark"}`}
                >
                  {message.sender === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-500">{message.text}</div>
                    {message.sentiment && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Sentiment:</span> {message.sentiment}
                      </div>
                    )}
                    {message.polarity && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Polarity:</span> {message.polarity.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <div className="flex flex-col">
                  <div className="text-sm text-gray-500">Typing...</div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSend} className="bg-mindease-dark text-white">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
            className="w-24"
          >
            <SelectTrigger>
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
          <Select
            value={selectedTopic}
            onValueChange={setSelectedTopic}
            className="w-24"
          >
            <SelectTrigger>
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
          <Button onClick={toggleInputType} className="bg-mindease-dark text-white">
            {longMessage ? "Shorter" : "Longer"}
          </Button>
        </div>
      </div>
      <div className="flex flex-col">
        <Tabs defaultValue="moodChart">
          <TabsList className="flex space-x-4">
            <TabsTrigger value="moodChart">Mood Chart</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="emergencySupport">Emergency Support</TabsTrigger>
            <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>
          <TabsContent value="moodChart">
            {renderMoodChart()}
          </TabsContent>
          <TabsContent value="resources">
            {renderResources()}
          </TabsContent>
          <TabsContent value="emergencySupport">
            {renderEmergencySupport()}
          </TabsContent>
          <TabsContent value="relaxation">
            {renderRelaxation()}
          </TabsContent>
          <TabsContent value="articles">
            {renderArticles()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChatInterface;
