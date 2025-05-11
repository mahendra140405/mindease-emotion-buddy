
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CBTExercises from "@/components/exercises/CBTExercises";
import GratitudePractices from "@/components/exercises/GratitudePractices";
import { ExternalLink, Lightbulb, HeartHandshake } from "lucide-react";

const ExercisesPage = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("cbt");

  useEffect(() => {
    // You can add analytics tracking or preferences saving here
    const savedTab = localStorage.getItem("preferred-exercise");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("preferred-exercise", value);
  };

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Mental Wellness Exercises</h1>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <TabsList className="flex space-x-4 mb-6">
            <TabsTrigger value="cbt" className="flex items-center">
              <Lightbulb className="mr-2 h-4 w-4" />
              CBT Exercises
            </TabsTrigger>
            <TabsTrigger value="gratitude" className="flex items-center">
              <HeartHandshake className="mr-2 h-4 w-4" />
              Gratitude Practice
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <TabsContent value="cbt">
              <CBTExercises />
            </TabsContent>
            
            <TabsContent value="gratitude">
              <GratitudePractices />
            </TabsContent>
          </div>
        </Tabs>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Need additional support? <a href="/contact" className="text-mindease hover:underline flex items-center justify-center mt-1"><ExternalLink className="h-3 w-3 mr-1" /> Contact a mental health professional</a></p>
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;
