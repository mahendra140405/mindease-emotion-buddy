
import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { AlertTriangle, ExternalLink, Moon, Phone, Globe, BookOpen, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Audio files with actual URLs
const audioFiles = {
  "Guided Breathing": "https://assets.mixkit.co/music/preview/mixkit-meditation-flute-347.mp3",
  "Rain Sounds": "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1248.mp3",
  "Forest Ambience": "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3",
  "Deep Sleep Music": "https://assets.mixkit.co/music/preview/mixkit-deep-meditation-138.mp3",
  "Ocean Waves": "https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3",
  "Meditation Guide": "https://assets.mixkit.co/music/preview/mixkit-serene-view-122.mp3"
};

// Emergency contacts with tel: links
const emergencyContacts = [
  { name: "National Suicide Prevention Lifeline", number: "1-800-273-8255", tel: "tel:18002738255" },
  { name: "Crisis Text Line", number: "Text HOME to 741741", tel: "sms:741741&body=HOME" },
  { name: "National Domestic Violence Hotline", number: "1-800-799-7233", tel: "tel:18007997233" },
  { name: "National Mental Health Helpline", number: "1-800-662-4357", tel: "tel:18006624357" },
  { name: "Indian Mental Health Hotline", number: "1800-599-0019", tel: "tel:18005990019" },
];

// Recommended articles with actual content
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

interface MoodData {
  message: string;
  sentiment: string;
  polarity: number;
  timestamp: Date;
}

const ResourcesPage = () => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState(0.5);
  const [showArticleDialog, setShowArticleDialog] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    // Load mood data from localStorage
    const savedMoodData = localStorage.getItem("moodData");
    
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
  
  // Update audio volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
    }
  }, [audioVolume]);

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

  const playAudio = (audioName: string) => {
    if (audioRef.current) {
      // Stop current audio if playing
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Set new audio
      audioRef.current.src = audioFiles[audioName as keyof typeof audioFiles];
      
      // Play new audio
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setCurrentAudio(audioName);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Failed to play audio. Please try again.");
        });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeVolume = (value: number[]) => {
    const newVolume = value[0];
    setAudioVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const openArticle = (article: any) => {
    setCurrentArticle(article);
    setShowArticleDialog(true);
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
              <span className="font-medium">Data Privacy Note:</span> This application stores your mood data locally on your device only.
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
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>{contact.number}</span>
                  <a 
                    href={contact.tel} 
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                  >
                    <Phone className="h-4 w-4" />
                    Call Now
                  </a>
                </div>
              </div>
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
          {Object.entries(audioFiles).map(([name, url]) => (
            <div key={name} className="rounded-lg border p-3">
              <h4 className="font-medium flex items-center gap-2">
                {currentAudio === name ? 
                  <Volume2 className="h-4 w-4 text-green-500" /> : 
                  <BookOpen className="h-4 w-4 text-blue-500" />
                }
                {name}
              </h4>
              <div className="mt-3 flex items-center gap-3">
                {currentAudio === name ? (
                  <Button 
                    onClick={togglePlayPause} 
                    variant="outline" 
                    size="sm" 
                    className="w-10 h-10 p-0 flex items-center justify-center"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => playAudio(name)} 
                    variant="outline" 
                    size="sm" 
                    className="w-10 h-10 p-0 flex items-center justify-center"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                
                {currentAudio === name && (
                  <>
                    <div className="flex items-center gap-2 w-full max-w-md">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setAudioVolume(0)}
                        className="w-8 h-8 p-0 flex items-center justify-center"
                      >
                        {audioVolume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      
                      <Slider 
                        value={[audioVolume]} 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        onValueChange={changeVolume}
                        className="w-full"
                      />
                    </div>
                    
                    <Button 
                      onClick={stopAudio} 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700"
                    >
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderArticles = () => {
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Recommended Articles</h3>
        
        <div className="space-y-4">
          {recommendedArticles.map(article => (
            <div key={article.title} className="rounded-lg border p-3">
              <h4 className="font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                {article.title}
              </h4>
              <div className="mt-2">
                <Button 
                  onClick={() => openArticle(article)} 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-500 hover:text-blue-700"
                >
                  Read Full Article
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Mental Health Resources</h1>

        <Tabs defaultValue="moodChart">
          <TabsList className="flex space-x-4 mb-6">
            <TabsTrigger value="moodChart">Mood Chart</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="emergencySupport">Emergency Support</TabsTrigger>
            <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
          </div>
        </Tabs>
      </div>

      {/* Article Dialog */}
      <Dialog open={showArticleDialog} onOpenChange={setShowArticleDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentArticle?.title || "Article"}</DialogTitle>
          </DialogHeader>
          <div className="prose dark:prose-invert max-w-none mt-4">
            {currentArticle && (
              <div dangerouslySetInnerHTML={{ __html: currentArticle.content }} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourcesPage;
