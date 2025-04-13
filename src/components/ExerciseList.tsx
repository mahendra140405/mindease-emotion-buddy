
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Heart, Brain, Wind, Music, Lotus, Moon } from "lucide-react";
import ExerciseCard from "@/components/dashboard/ExerciseCard";

const exercisesData = [
  {
    id: 1,
    title: "Deep Breathing",
    description: "Practice deep breathing to reduce stress and anxiety.",
    duration: "5 minutes",
    category: "breathing",
    icon: <Wind className="h-6 w-6" />,
  },
  {
    id: 2,
    title: "Mindful Meditation",
    description: "Learn to focus on the present moment and calm your mind.",
    duration: "10 minutes",
    category: "meditation",
    icon: <Lotus className="h-6 w-6" />,
  },
  {
    id: 3,
    title: "Progressive Muscle Relaxation",
    description: "Tense and relax each muscle group to reduce physical tension.",
    duration: "15 minutes",
    category: "relaxation",
    icon: <Moon className="h-6 w-6" />,
  },
  {
    id: 4,
    title: "Gratitude Practice",
    description: "Reflect on things you're grateful for to boost positive emotions.",
    duration: "5 minutes",
    category: "mindfulness",
    icon: <Heart className="h-6 w-6" />,
  },
  {
    id: 5,
    title: "Thought Challenging",
    description: "Learn to identify and challenge negative thought patterns.",
    duration: "15 minutes",
    category: "cognitive",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    id: 6,
    title: "Music Therapy",
    description: "Use music to improve your mood and reduce stress.",
    duration: "10 minutes",
    category: "relaxation",
    icon: <Music className="h-6 w-6" />,
  },
];

const ExerciseList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredExercises = exercisesData.filter((exercise) => {
    const matchesSearch = exercise.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeTab === "all" || exercise.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-5xl animate-fade-in space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-bold">Mental Health Exercises</h1>
        <p className="text-muted-foreground">
          Discover exercises to improve your mental wellbeing
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="breathing">Breathing</TabsTrigger>
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
          <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
          <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4">
          {filteredExercises.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg font-medium">No exercises found</p>
              <p className="text-muted-foreground">
                Try adjusting your search query or filter
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  title={exercise.title}
                  description={exercise.description}
                  duration={exercise.duration}
                  icon={exercise.icon}
                  link={`/exercises/${exercise.id}`}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExerciseList;
