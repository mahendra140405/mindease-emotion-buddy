
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { HeartHandshake, Calendar, Star, Sparkles } from "lucide-react";

interface GratitudeEntry {
  id: string;
  date: string;
  entries: string[];
  reflection: string;
}

const GRATITUDE_PROMPTS = [
  "What made you smile today?",
  "Who are you grateful for today and why?",
  "What's something beautiful you noticed today?",
  "What's a lesson you learned recently that you're thankful for?",
  "What's something you're looking forward to?",
  "What's a small pleasure you enjoyed today?",
  "What's something you're proud of accomplishing recently?",
  "What's something in nature you appreciate?",
  "What's a quality in yourself that you're grateful for?",
  "What's something that made your life easier today?",
];

const GratitudePractices = () => {
  const [entries, setEntries] = useState<string[]>(["", "", ""]);
  const [reflection, setReflection] = useState("");
  const [journalEntries, setJournalEntries] = useState<GratitudeEntry[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  
  useEffect(() => {
    // Load saved entries from localStorage
    try {
      const saved = localStorage.getItem('gratitudeEntries');
      if (saved) {
        setJournalEntries(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading gratitude entries:", error);
    }
    
    // Select random prompts
    const randomPrompts = [...GRATITUDE_PROMPTS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setSelectedPrompts(randomPrompts);
  }, []);
  
  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };
  
  const saveEntry = () => {
    // Validate entries
    if (entries.every(entry => entry.trim() === "")) {
      toast.error("Please write at least one thing you're grateful for");
      return;
    }
    
    // Create new entry
    const newEntry: GratitudeEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      entries: entries.filter(e => e.trim() !== ""),
      reflection
    };
    
    // Update state and localStorage
    const updatedEntries = [newEntry, ...journalEntries];
    setJournalEntries(updatedEntries);
    
    try {
      localStorage.setItem('gratitudeEntries', JSON.stringify(updatedEntries));
    } catch (error) {
      console.error("Error saving gratitude entries:", error);
    }
    
    // Reset form
    setEntries(["", "", ""]);
    setReflection("");
    
    // New prompts for next time
    const randomPrompts = [...GRATITUDE_PROMPTS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setSelectedPrompts(randomPrompts);
    
    toast.success("Gratitude entry saved!");
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <HeartHandshake className="mr-2 h-6 w-6 text-pink-500" />
          Gratitude Practice
        </h2>
        <p className="text-muted-foreground">
          Regularly practicing gratitude has been shown to increase happiness and well-being.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Today's Gratitude Journal</CardTitle>
          <CardDescription>
            List three things you're grateful for today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {entries.map((entry, index) => (
            <div key={index}>
              <div className="flex items-center mb-2">
                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                <p className="text-sm text-muted-foreground italic">{selectedPrompts[index] || "What are you grateful for?"}</p>
              </div>
              <Textarea
                value={entry}
                onChange={(e) => handleEntryChange(index, e.target.value)}
                placeholder={`I'm grateful for...`}
                className="w-full"
              />
            </div>
          ))}
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              How did writing these make you feel? (optional)
            </p>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Reflect on how focusing on gratitude affected your mood..."
              className="w-full"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={saveEntry} 
            className="w-full bg-mindease hover:bg-mindease-mid"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Save Today's Gratitude
          </Button>
        </CardFooter>
      </Card>
      
      {journalEntries.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Gratitude Journal</h3>
          <div className="space-y-4">
            {journalEntries.slice(0, 5).map((entry) => (
              <Card key={entry.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      <Calendar className="inline mr-2 h-4 w-4" />
                      {entry.date}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {entry.entries.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  {entry.reflection && (
                    <div className="mt-2 italic text-muted-foreground">
                      "{entry.reflection}"
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Benefits of Gratitude</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Improved mental health and reduced depression symptoms</li>
            <li>Enhanced empathy and reduced aggression</li>
            <li>Better sleep quality and reduced stress</li>
            <li>Increased self-esteem and resilience</li>
            <li>Stronger relationships and social connections</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GratitudePractices;
