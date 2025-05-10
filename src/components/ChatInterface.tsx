
import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Brain, Volume2, Info, Heart, Trash2, Save, Database, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MultilingualInput from "@/components/MultilingualInput";
import { useNavigate } from "react-router-dom";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date | string;
  emotion?: string;
}

interface SuggestedArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
}

interface ExerciseSuggestion {
  id: string;
  name: string;
  description: string;
  duration: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content: "Hello! I'm your mental wellness assistant. How can I help you today?",
    timestamp: new Date(),
  },
];

// Initial suggested articles
const INITIAL_ARTICLES: SuggestedArticle[] = [
  {
    id: "1",
    title: "Understanding Anxiety",
    summary: "Learn about common anxiety symptoms and coping strategies",
    url: "#",
  },
  {
    id: "2",
    title: "Mindfulness for Beginners",
    summary: "Simple mindfulness practices you can incorporate into your daily routine",
    url: "#",
  },
  {
    id: "3",
    title: "Improving Sleep Quality",
    summary: "Tips for better sleep hygiene and overcoming insomnia",
    url: "#",
  },
];

// Exercise suggestions
const EXERCISE_SUGGESTIONS: ExerciseSuggestion[] = [
  {
    id: "1",
    name: "5-Minute Breathing Exercise",
    description: "A simple breathing technique to reduce anxiety and bring focus to the present moment.",
    duration: "5 minutes"
  },
  {
    id: "2",
    name: "Progressive Muscle Relaxation",
    description: "Tense and relax each muscle group to release physical tension and mental stress.",
    duration: "15 minutes"
  },
  {
    id: "3",
    name: "Guided Body Scan Meditation",
    description: "Bring awareness to each part of your body to promote relaxation and mindfulness.",
    duration: "10 minutes"
  },
  {
    id: "4",
    name: "Gratitude Journaling",
    description: "Write down three things you're grateful for to shift focus towards positivity.",
    duration: "5 minutes"
  }
];

// Relaxation audios
const RELAXATION_AUDIOS = [
  {
    id: "1",
    title: "Ocean Waves",
    description: "Calming sounds of gentle ocean waves breaking on the shore.",
    duration: "10 minutes",
    audioSrc: "/sounds/ocean-waves.mp3"
  },
  {
    id: "2",
    title: "Gentle Rain",
    description: "Soothing sounds of rainfall to help you relax and unwind.",
    duration: "15 minutes",
    audioSrc: "/sounds/gentle-rain.mp3"
  },
  {
    id: "3",
    title: "Forest Sounds",
    description: "Immerse yourself in the peaceful sounds of a forest environment.",
    duration: "20 minutes",
    audioSrc: "/sounds/forest-sounds.mp3"
  },
  {
    id: "4",
    title: "Meditation Bell",
    description: "Periodic meditation bell sounds to guide your mindfulness practice.",
    duration: "12 minutes",
    audioSrc: "https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-599.mp3"
  }
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

// Helper function to ensure timestamp is a Date object
const ensureDateTimestamp = (timestamp: Date | string): Date => {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  try {
    return new Date(timestamp);
  } catch (error) {
    // If conversion fails, return current date as fallback
    console.warn("Failed to convert timestamp to Date, using current date instead");
    return new Date();
  }
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Try to load messages from localStorage
    const savedMessages = localStorage.getItem("chat-messages");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Ensure all timestamps are converted to Date objects
        return parsedMessages.map((msg: ChatMessage) => ({
          ...msg,
          timestamp: ensureDateTimestamp(msg.timestamp)
        }));
      } catch (error) {
        console.error("Error parsing saved messages:", error);
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [suggestedArticles, setSuggestedArticles] = useState<SuggestedArticle[]>(INITIAL_ARTICLES);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [storageType, setStorageType] = useState<"local" | "server">("local");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Function to save messages based on storage type
  const saveMessages = (updatedMessages: ChatMessage[]) => {
    if (storageType === "local") {
      localStorage.setItem("chat-messages", JSON.stringify(updatedMessages));
    } else {
      // For server storage, we'd normally call an API
      // For now, we'll just simulate it with localStorage but indicate it's server-side
      localStorage.setItem("chat-messages-server", JSON.stringify(updatedMessages));
      toast({
        title: "Messages Saved",
        description: "Your messages would be saved to the server in a production environment.",
      });
    }
  };

  // Function to clear chat history
  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    
    // Clear from storage
    if (storageType === "local") {
      localStorage.removeItem("chat-messages");
    } else {
      localStorage.removeItem("chat-messages-server");
    }
    
    toast({
      title: "Chat Cleared",
      description: "Your conversation history has been cleared.",
    });
  };

  // Function to handle storage type change
  const handleStorageChange = (type: "local" | "server") => {
    setStorageType(type);
    toast({
      title: "Storage Changed",
      description: `Your messages will now be saved to ${type === "local" ? "your device" : "the server"}.`,
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

  // Function to update suggested articles based on user input
  const updateSuggestedArticles = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Check for depression-related keywords
    const depressedKeywords = [
      "depressed", "sad", "unhappy", "miserable", "down", "blue", "hopeless", 
      "helpless", "worthless", "empty", "numb", "alone", "lonely", "tired",
      "exhausted", "no energy", "can't sleep", "don't feel like", "don't want to",
      "suicidal", "kill myself"
    ];
    
    // Check for anxiety-related keywords
    const anxietyKeywords = [
      "anxious", "worried", "nervous", "stress", "panic", "fear", "phobia",
      "overwhelmed", "tense", "restless", "uneasy"
    ];
    
    // Check for sleep-related keywords
    const sleepKeywords = [
      "insomnia", "sleep", "tired", "exhausted", "fatigue", "rest", "bed",
      "nightmare", "dream", "awake", "nap"
    ];
    
    if (depressedKeywords.some(keyword => lowerInput.includes(keyword))) {
      return [
        {
          id: "d1",
          title: "Coping with Depression",
          summary: "Practical strategies to help manage depression symptoms",
          url: "/resources",
        },
        {
          id: "d2",
          title: "When to Seek Professional Help",
          summary: "Signs that indicate it's time to consult with a mental health professional",
          url: "/resources",
        },
        {
          id: "d3",
          title: "Self-Care for Mental Health",
          summary: "Daily habits that support emotional wellbeing",
          url: "/resources",
        },
      ];
    } else if (anxietyKeywords.some(keyword => lowerInput.includes(keyword))) {
      return [
        {
          id: "a1",
          title: "Understanding Anxiety",
          summary: "Learn about different types of anxiety and their symptoms",
          url: "/resources",
        },
        {
          id: "a2",
          title: "Breathing Techniques for Anxiety",
          summary: "Simple breathing exercises to calm your nervous system",
          url: "/resources",
        },
        {
          id: "a3",
          title: "Cognitive Behavioral Therapy Basics",
          summary: "Introduction to CBT techniques for managing anxious thoughts",
          url: "/resources",
        },
      ];
    } else if (sleepKeywords.some(keyword => lowerInput.includes(keyword))) {
      return [
        {
          id: "s1",
          title: "Improving Sleep Quality",
          summary: "Evidence-based strategies for better sleep",
          url: "/resources",
        },
        {
          id: "s2",
          title: "Creating a Sleep-Friendly Environment",
          summary: "How to optimize your bedroom for restful sleep",
          url: "/resources",
        },
        {
          id: "s3",
          title: "Managing Insomnia Without Medication",
          summary: "Natural approaches to overcoming sleep difficulties",
          url: "/resources",
        },
      ];
    }
    
    return INITIAL_ARTICLES;
  };

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
      // Update suggested articles based on user input
      const newSuggestedArticles = updateSuggestedArticles(inputValue);
      setSuggestedArticles(newSuggestedArticles);
      
      // Check for depression-related keywords to suggest exercises
      const depressedKeywords = [
        "depressed", "sad", "unhappy", "miserable", "down", "blue", "hopeless", 
        "helpless", "worthless", "empty", "numb", "alone", "lonely", "tired",
        "exhausted", "no energy", "can't sleep", "don't feel like", "don't want to",
        "suicidal", "kill myself"
      ];
      
      const inputLower = inputValue.toLowerCase();
      const containsDepressedKeywords = depressedKeywords.some(keyword => inputLower.includes(keyword));
      
      // Simulate API delay for more natural interaction
      setTimeout(() => {
        let assistantResponse: ChatMessage;
        
        if (containsDepressedKeywords) {
          // Depression-related response with exercise suggestion
          assistantResponse = {
            role: "assistant",
            content: "I'm sorry to hear you're feeling this way. It's important to remember that you're not alone. Would you like to try a relaxation exercise? These can help reduce feelings of stress and improve your mood. You can click on the 'Exercises' tab above to see our recommended exercises.",
            timestamp: new Date(),
          };
          
          // Auto-switch to exercises tab
          setActiveTab("exercises");
          
        } else {
          // General response
          assistantResponse = {
            role: "assistant",
            content: `Thanks for sharing. I'm here to support you on your wellness journey. How else can I assist you today?`,
            timestamp: new Date(),
          };
        }
        
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

  const playAudio = (audioSrc: string) => {
    try {
      // If there's already audio playing, stop it
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }
      
      // Create new audio player with error handling
      const newPlayer = new Audio();
      
      // Add error handler
      newPlayer.onerror = (e) => {
        console.error("Error playing audio:", e);
        toast({
          title: "Audio Error",
          description: "There was a problem playing the audio. Using fallback audio source.",
          variant: "destructive",
        });
        
        // Try fallback audio from a public CDN
        newPlayer.src = "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambient-2532.mp3";
        newPlayer.play().catch(err => {
          console.error("Error playing fallback audio:", err);
          toast({
            title: "Audio Error",
            description: "Could not play audio. Please check your browser settings.",
            variant: "destructive",
          });
        });
      };
      
      // Attempt to load actual audio first
      newPlayer.src = audioSrc;
      newPlayer.loop = true;
      
      // Play audio with proper error handling
      newPlayer.play().then(() => {
        setAudioPlayer(newPlayer);
        setCurrentAudio(audioSrc);
        setIsPlaying(true);
        
        toast({
          title: "Audio Playing",
          description: "Relaxation audio has started playing.",
        });
      }).catch(err => {
        console.error("Error playing audio:", err);
        
        // Try fallback audio from a public CDN
        newPlayer.src = "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambient-2532.mp3";
        newPlayer.play().catch(innerErr => {
          console.error("Error playing fallback audio:", innerErr);
          toast({
            title: "Audio Error",
            description: "Could not play audio. Please check your browser settings.",
            variant: "destructive",
          });
        });
      });
    } catch (error) {
      console.error("Exception when creating audio:", error);
      toast({
        title: "Audio Error",
        description: "There was a problem with the audio player.",
        variant: "destructive",
      });
    }
  };
  
  const toggleAudio = (audioSrc: string) => {
    if (currentAudio === audioSrc && isPlaying) {
      // Pause current audio
      audioPlayer?.pause();
      setIsPlaying(false);
      toast({
        title: "Audio Paused",
        description: "Relaxation audio has been paused.",
      });
    } else if (currentAudio === audioSrc) {
      // Resume current audio
      audioPlayer?.play().catch(err => {
        console.error("Error resuming audio:", err);
        toast({
          title: "Audio Error",
          description: "Could not resume audio playback.",
          variant: "destructive",
        });
      });
      setIsPlaying(true);
      toast({
        title: "Audio Resumed",
        description: "Relaxation audio has resumed playing.",
      });
    } else {
      // Play new audio
      playAudio(audioSrc);
    }
  };
  
  // Clean up audio on component unmount
  useEffect(() => {
    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }
    };
  }, [audioPlayer]);

  return (
    <div className="container mx-auto py-6 h-[calc(100vh-80px)]">
      <Card className="h-full border-0 shadow-lg overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b px-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
            <div className="flex justify-between items-center">
              <TabsList className="justify-start h-16">
                <TabsTrigger value="chat" className="data-[state=active]:bg-mindease data-[state=active]:text-white">
                  <Brain className="mr-2 h-5 w-5" />
                  Chat Assistant
                </TabsTrigger>
                <TabsTrigger value="exercises" className="data-[state=active]:bg-mindease data-[state=active]:text-white">
                  <Heart className="mr-2 h-5 w-5" />
                  Exercises
                </TabsTrigger>
                <TabsTrigger value="relax" className="data-[state=active]:bg-mindease data-[state=active]:text-white">
                  <Volume2 className="mr-2 h-5 w-5" />
                  Relaxation Audio
                </TabsTrigger>
                <TabsTrigger value="resources" className="data-[state=active]:bg-mindease data-[state=active]:text-white">
                  <Info className="mr-2 h-5 w-5" />
                  Helpful Resources
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => navigate("/contact")}
                >
                  <Share className="h-4 w-4" />
                  Contact
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearChat}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Chat
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 py-2">
              <Button 
                variant={storageType === "local" ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleStorageChange("local")}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                Local Storage
              </Button>
              <Button 
                variant={storageType === "server" ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleStorageChange("server")}
                className="flex items-center gap-1"
              >
                <Database className="h-4 w-4" />
                Server Storage
              </Button>
            </div>
          </div>
          
          <TabsContent value="chat" className="flex-1 flex flex-col px-4 pt-4 pb-2 overflow-hidden">
            <div className="flex-1 overflow-auto" ref={chatContainerRef}>
              <ScrollArea className="h-full pr-4">
                {messages.map((message, index) => {
                  // Ensure the timestamp is a Date object before using toLocaleTimeString
                  const timestampDate = ensureDateTimestamp(message.timestamp);
                  
                  return (
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
                            {timestampDate.toLocaleTimeString([], {
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
                  );
                })}
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
            <div className="mt-4 pb-3">
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
          </TabsContent>
          
          <TabsContent value="exercises" className="flex-1 p-6 overflow-auto">
            <h2 className="text-2xl font-bold text-mindease mb-6">Recommended Exercises</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {EXERCISE_SUGGESTIONS.map((exercise) => (
                <Card key={exercise.id} className="p-5 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
                  <p className="text-gray-600 mb-3">{exercise.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{exercise.duration}</span>
                    <Button className="bg-mindease hover:bg-mindease-dark">
                      Start Exercise
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="relax" className="flex-1 p-6 overflow-auto">
            <h2 className="text-2xl font-bold text-mindease mb-6">Relaxation Audio</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {RELAXATION_AUDIOS.map((audio) => (
                <Card key={audio.id} className="p-5 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{audio.title}</h3>
                  <p className="text-gray-600 mb-3">{audio.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{audio.duration}</span>
                    <Button 
                      className={`flex items-center space-x-2 ${
                        currentAudio === audio.audioSrc && isPlaying
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-mindease hover:bg-mindease-dark"
                      }`}
                      onClick={() => toggleAudio(audio.audioSrc)}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      {currentAudio === audio.audioSrc && isPlaying ? "Pause" : "Play"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="flex-1 p-6 overflow-auto">
            <h2 className="text-2xl font-bold text-mindease mb-6">Helpful Resources</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {suggestedArticles.map((article) => (
                <Card key={article.id} className="p-5 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.summary}</p>
                  <Button 
                    className="bg-mindease hover:bg-mindease-dark"
                    onClick={() => {
                      // Navigate to the article or open in new tab
                      toast({
                        title: "Article Selected",
                        description: `Opening "${article.title}"`,
                      });
                    }}
                  >
                    Read Article
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ChatInterface;
