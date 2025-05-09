
import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Brain, Volume2, Info, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MultilingualInput from "@/components/MultilingualInput";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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

const EXERCISE_SUGGESTIONS: ExerciseSuggestion[] = [
  {
    id: "1",
    name: "Deep Breathing",
    description: "Slow, deep breaths to reduce stress and anxiety",
    duration: "5 min",
  },
  {
    id: "2",
    name: "Progressive Muscle Relaxation",
    description: "Tensing and relaxing muscle groups for stress relief",
    duration: "10 min",
  },
  {
    id: "3",
    name: "Guided Meditation",
    description: "Focus your mind and promote relaxation",
    duration: "15 min",
  },
];

const RELAXATION_AUDIOS = [
  { 
    id: "1", 
    title: "Calm Forest Sounds", 
    description: "Peaceful forest ambience with birds and gentle breeze",
    duration: "10 min",
    audioSrc: "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambient-2532.mp3"
  },
  { 
    id: "2", 
    title: "Ocean Waves", 
    description: "Soothing ocean waves for relaxation",
    duration: "15 min",
    audioSrc: "https://assets.mixkit.co/sfx/preview/mixkit-beach-waves-loop-1196.mp3"
  },
  { 
    id: "3", 
    title: "Gentle Rain", 
    description: "Calming rain sounds for focus and sleep",
    duration: "20 min",
    audioSrc: "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3"
  }
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [suggestedArticles, setSuggestedArticles] = useState<SuggestedArticle[]>(INITIAL_ARTICLES);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Check for depression-related keywords to suggest exercises
      const depressedKeywords = [
        "depressed",
        "sad",
        "unhappy",
        "miserable",
        "down",
        "blue",
        "hopeless",
        "helpless",
        "worthless",
        "empty",
        "numb",
        "alone",
        "lonely",
        "tired",
        "exhausted",
        "no energy",
        "can't sleep",
        "don't feel like",
        "don't want to",
        "suicidal",
        "kill myself"
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
            content: "I'm sorry to hear you're feeling this way. It's important to remember that you're not alone. Would you like to try a relaxation exercise? These can help reduce feelings of stress and improve your mood. You can also click on the 'Exercises' tab to see our recommended exercises.",
            timestamp: new Date(),
          };
          
          // Update suggested articles to depression-focused content
          const newSuggestedArticles = [
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
          
          setSuggestedArticles(newSuggestedArticles);
          
        } else {
          // General response
          assistantResponse = {
            role: "assistant",
            content: `Thanks for sharing. I'm here to support you on your wellness journey. How else can I assist you today?`,
            timestamp: new Date(),
          };
        }
        
        setMessages((prev) => [...prev, assistantResponse]);
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
    // If there's already audio playing, stop it
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }
    
    // Create new audio player
    const newPlayer = new Audio(audioSrc);
    newPlayer.loop = true;
    newPlayer.play().catch(err => {
      console.error("Error playing audio:", err);
      toast({
        title: "Audio Error",
        description: "There was a problem playing the audio. Please try again.",
        variant: "destructive",
      });
    });
    
    setAudioPlayer(newPlayer);
    setCurrentAudio(audioSrc);
    setIsPlaying(true);
    
    toast({
      title: "Audio Playing",
      description: "Relaxation audio has started playing.",
    });
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
      audioPlayer?.play();
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
        <Tabs defaultValue="chat" className="h-full flex flex-col">
          <div className="border-b px-4">
            <TabsList className="w-full justify-start h-16">
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
          </div>
          
          <TabsContent value="chat" className="flex-1 flex flex-col px-4 pt-4 pb-2 overflow-hidden">
            <div className="flex-1 overflow-auto">
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
                        <div
                          className={`text-xs mt-1 ${
                            message.role === "user" ? "text-white/70" : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
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
