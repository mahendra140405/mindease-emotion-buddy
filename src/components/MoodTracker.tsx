
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Frown,
  Smile,
  Meh,
  ArrowRight,
  Calendar,
  PenLine,
} from "lucide-react";
import { toast } from "sonner";

const moodOptions = [
  { value: 1, label: "Very Sad", icon: <Frown className="h-10 w-10" /> },
  { value: 2, label: "Sad", icon: <Frown className="h-10 w-10" /> },
  { value: 3, label: "Neutral", icon: <Meh className="h-10 w-10" /> },
  { value: 4, label: "Happy", icon: <Smile className="h-10 w-10" /> },
  { value: 5, label: "Very Happy", icon: <Smile className="h-10 w-10" /> },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<Array<{
    date: string;
    mood: number;
    note: string;
  }>>([
    {
      date: "Yesterday",
      mood: 4,
      note: "Had a good day overall. Went for a walk and met with friends.",
    },
    {
      date: "Two days ago",
      mood: 2,
      note: "Felt stressed about upcoming exams.",
    },
  ]);

  const handleSubmit = () => {
    if (selectedMood === null) {
      toast.error("Please select your mood");
      return;
    }

    // In a real app, we would send this data to the backend
    const today = new Date().toLocaleDateString();
    setHistory([
      { date: "Today", mood: selectedMood, note },
      ...history,
    ]);

    toast.success("Mood logged successfully!");
    setSelectedMood(null);
    setNote("");
  };

  return (
    <div className="mx-auto max-w-4xl animate-fade-in space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-bold">Mood Tracker</h1>
        <p className="text-muted-foreground">Track how you're feeling today</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            {moodOptions.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className={`flex h-24 w-24 flex-col items-center justify-center gap-2 border-2 ${
                  selectedMood === option.value
                    ? "border-mindease bg-mindease-light"
                    : ""
                }`}
                onClick={() => setSelectedMood(option.value)}
              >
                <div
                  className={`${
                    selectedMood === option.value ? "text-mindease" : ""
                  }`}
                >
                  {option.icon}
                </div>
                <span
                  className={`text-sm ${
                    selectedMood === option.value ? "text-mindease" : ""
                  }`}
                >
                  {option.label}
                </span>
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Add a note (optional)
            </label>
            <Textarea
              placeholder="How was your day? What made you feel this way?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <Button className="w-full bg-mindease" onClick={handleSubmit}>
            Log Mood <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Recent Mood History</h2>
        <div className="space-y-4">
          {history.map((entry, index) => (
            <Card key={index}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mindease-light text-mindease">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{entry.date}</h3>
                    <div>
                      {entry.mood === 1 && <Frown className="text-red-500" />}
                      {entry.mood === 2 && <Frown className="text-orange-500" />}
                      {entry.mood === 3 && <Meh className="text-yellow-500" />}
                      {entry.mood === 4 && <Smile className="text-green-500" />}
                      {entry.mood === 5 && <Smile className="text-green-600" />}
                    </div>
                  </div>
                  {entry.note && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                      <PenLine size={14} className="mt-0.5 flex-shrink-0" />
                      <p>{entry.note}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
