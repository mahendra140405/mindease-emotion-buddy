
import NavBar from "@/components/NavBar";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wind, Brain, Heart, Music, Flower, Moon, ArrowLeft, Check, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  icon: React.ReactNode;
  steps: string[];
  benefits: string[];
}

const exercisesData: Exercise[] = [
  {
    id: 1,
    title: "Deep Breathing",
    description: "Practice deep breathing to reduce stress and anxiety.",
    duration: "5 minutes",
    category: "breathing",
    icon: <Wind className="h-6 w-6" />,
    steps: [
      "Find a comfortable seated position",
      "Place one hand on your chest and one on your abdomen",
      "Breathe in slowly through your nose for 4 counts",
      "Hold your breath for 2 counts",
      "Exhale slowly through your mouth for 6 counts",
      "Repeat for 5 minutes"
    ],
    benefits: [
      "Reduces anxiety and stress",
      "Lowers blood pressure",
      "Improves focus and concentration",
      "Helps with emotional regulation"
    ]
  },
  {
    id: 2,
    title: "Mindful Meditation",
    description: "Learn to focus on the present moment and calm your mind.",
    duration: "10 minutes",
    category: "meditation",
    icon: <Flower className="h-6 w-6" />,
    steps: [
      "Find a quiet place to sit comfortably",
      "Close your eyes and focus on your breath",
      "Notice sensations in your body without judgment",
      "When your mind wanders, gently bring focus back to your breath",
      "Continue for 10 minutes"
    ],
    benefits: [
      "Reduces rumination and negative thinking",
      "Enhances self-awareness",
      "Improves emotional health",
      "Lengthens attention span"
    ]
  },
  {
    id: 3,
    title: "Progressive Muscle Relaxation",
    description: "Tense and relax each muscle group to reduce physical tension.",
    duration: "15 minutes",
    category: "relaxation",
    icon: <Moon className="h-6 w-6" />,
    steps: [
      "Lie down in a comfortable position",
      "Starting with your feet, tense the muscles for 5 seconds",
      "Release the tension and notice how your muscles feel",
      "Move up to your calves, thighs, and continue through your body",
      "End with facial muscles"
    ],
    benefits: [
      "Relieves physical tension",
      "Improves body awareness",
      "Helps with insomnia",
      "Reduces headaches and other physical symptoms of stress"
    ]
  },
  {
    id: 4,
    title: "Gratitude Practice",
    description: "Reflect on things you're grateful for to boost positive emotions.",
    duration: "5 minutes",
    category: "mindfulness",
    icon: <Heart className="h-6 w-6" />,
    steps: [
      "Find a quiet moment in your day",
      "Think of three things you're grateful for today",
      "Write them down in a journal if possible",
      "Reflect on why these things bring you gratitude",
      "Notice how you feel after the practice"
    ],
    benefits: [
      "Increases positive emotions",
      "Improves social relationships",
      "Reduces comparison with others",
      "Enhances overall well-being"
    ]
  },
  {
    id: 5,
    title: "Thought Challenging",
    description: "Learn to identify and challenge negative thought patterns.",
    duration: "15 minutes",
    category: "cognitive",
    icon: <Brain className="h-6 w-6" />,
    steps: [
      "Identify a negative thought you've had recently",
      "Write down evidence that supports this thought",
      "Write down evidence that contradicts this thought",
      "Create a more balanced, realistic thought",
      "Practice replacing negative thoughts with balanced ones"
    ],
    benefits: [
      "Reduces cognitive distortions",
      "Improves problem-solving skills",
      "Increases emotional resilience",
      "Helps manage anxiety and depression"
    ]
  },
  {
    id: 6,
    title: "Music Therapy",
    description: "Use music to improve your mood and reduce stress.",
    duration: "10 minutes",
    category: "relaxation",
    icon: <Music className="h-6 w-6" />,
    steps: [
      "Choose music that matches your desired mood",
      "Find a comfortable place to sit or lie down",
      "Close your eyes and focus solely on the music",
      "Notice how different elements of the music make you feel",
      "Allow yourself to be fully present with the sounds"
    ],
    benefits: [
      "Reduces stress hormones",
      "Improves mood",
      "Enhances relaxation",
      "Provides emotional release"
    ]
  }
];

const ExerciseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
      return;
    }
    
    // Find the exercise by ID
    const foundExercise = exercisesData.find(
      (ex) => ex.id === parseInt(id || "0")
    );
    
    if (foundExercise) {
      setExercise(foundExercise);
    } else {
      // If exercise not found, go back to exercises list
      navigate("/exercises");
    }
  }, [id, navigate]);

  useEffect(() => {
    // Timer for exercise session
    let timer: number | null = null;
    
    if (sessionStarted && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (sessionStarted && timeRemaining === 0 && currentStep < (exercise?.steps.length || 0) - 1) {
      // Move to next step when time is up
      setCurrentStep((prev) => prev + 1);
      setTimeRemaining(30); // Reset timer for next step
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sessionStarted, timeRemaining, currentStep, exercise]);

  const handleBack = () => {
    if (sessionStarted) {
      // Confirm before leaving exercise session
      const confirmed = window.confirm("Are you sure you want to end your exercise session?");
      if (confirmed) {
        setSessionStarted(false);
      }
    } else {
      navigate("/exercises");
    }
  };

  const startExerciseSession = () => {
    setSessionStarted(true);
    setCurrentStep(0);
    setTimeRemaining(30); // Start with 30 seconds per step
    toast({
      title: "Exercise session started",
      description: "Follow each step to complete your session",
    });
  };

  const completeExercise = () => {
    setSessionStarted(false);
    toast({
      title: "Exercise completed!",
      description: "Great job completing your exercise session",
      variant: "success",
    });
  };

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg dark:text-white">Loading exercise...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto py-8 px-4 animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="mb-6 flex items-center text-mindease dark:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {sessionStarted ? "End Session" : "Back to Exercises"}
        </Button>
        
        {sessionStarted ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm animate-fade-in">
            <div className="flex items-center mb-6">
              <div className="bg-mindease-light dark:bg-mindease-dark p-3 rounded-full mr-4 text-mindease dark:text-white">
                {exercise.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold dark:text-white">{exercise.title}</h1>
                <p className="text-muted-foreground">Step {currentStep + 1} of {exercise.steps.length}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Timer className="h-5 w-5 mr-2 text-mindease" />
                <span className="text-xl font-semibold">{timeRemaining}s</span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 w-1/2 h-2 rounded-full">
                <div 
                  className="bg-mindease h-2 rounded-full" 
                  style={{ 
                    width: `${(currentStep / exercise.steps.length) * 100}%` 
                  }}
                />
              </div>
            </div>
            
            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">Current Step</h2>
              <p className="text-gray-700 dark:text-gray-200 text-lg">{exercise.steps[currentStep]}</p>
            </div>
            
            <div className="pt-4 flex justify-end">
              {currentStep === exercise.steps.length - 1 ? (
                <Button onClick={completeExercise} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Complete Exercise
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    setCurrentStep((prev) => prev + 1);
                    setTimeRemaining(30);
                  }} 
                  className="bg-mindease hover:bg-mindease-mid"
                >
                  Next Step
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-6">
              <div className="bg-mindease-light dark:bg-mindease-dark p-3 rounded-full mr-4 text-mindease dark:text-white">
                {exercise.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold dark:text-white">{exercise.title}</h1>
                <p className="text-muted-foreground dark:text-gray-400">{exercise.duration} • {exercise.category}</p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">{exercise.description}</p>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 dark:text-white">How to Practice</h2>
                <ol className="space-y-2 list-decimal list-inside">
                  {exercise.steps.map((step, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{step}</li>
                  ))}
                </ol>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 dark:text-white">Benefits</h2>
                <ul className="space-y-2 list-disc list-inside">
                  {exercise.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{benefit}</li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={startExerciseSession} 
                  className="w-full bg-mindease hover:bg-mindease-mid"
                >
                  Start Exercise Session
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
