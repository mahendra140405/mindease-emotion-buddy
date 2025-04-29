
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import StatCard from "@/components/dashboard/StatCard";
import MoodOverview from "@/components/dashboard/MoodOverview";
import ExerciseCard from "@/components/dashboard/ExerciseCard";
import { 
  Activity, Brain, Clock, MessageCircle, 
  Wind, Flower, Music, Heart 
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="mx-auto max-w-6xl animate-fade-in p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your mental wellness dashboard
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Avg. Mood Score"
            value="3.8"
            icon={<Activity className="h-4 w-4" />}
            description="Slightly above neutral"
          />
          <StatCard
            title="Completed Exercises"
            value="42"
            icon={<Brain className="h-4 w-4" />}
            description="8 this week"
          />
          <StatCard
            title="Time on Platform"
            value="5.2 hrs"
            icon={<Clock className="h-4 w-4" />}
            description="Weekly average"
          />
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <MoodOverview />
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <Activity size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Mood logged</p>
                    <p className="text-sm text-muted-foreground">
                      Today at 9:42 AM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <Brain size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Completed Meditation</p>
                    <p className="text-sm text-muted-foreground">
                      Yesterday at 4:30 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Chat Session</p>
                    <p className="text-sm text-muted-foreground">
                      2 days ago at 2:15 PM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold">Recommended Exercises</h2>
          <p className="text-sm text-muted-foreground">
            Based on your recent mood patterns
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ExerciseCard
            title="Deep Breathing"
            description="A simple yet effective technique to reduce stress and anxiety."
            duration="5 minutes"
            icon={<Wind className="h-6 w-6" />}
            link="/exercises/1"
          />
          <ExerciseCard
            title="Mindful Meditation"
            description="Learn to focus on the present moment and calm your mind."
            duration="10 minutes"
            icon={<Flower className="h-6 w-6" />}
            link="/exercises/2"
          />
          <ExerciseCard
            title="Music Therapy"
            description="Use music to improve your mood and reduce stress."
            duration="10 minutes"
            icon={<Music className="h-6 w-6" />}
            link="/exercises/6"
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
