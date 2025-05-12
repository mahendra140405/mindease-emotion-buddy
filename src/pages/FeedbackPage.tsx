import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Star, Check } from "lucide-react";

const FeedbackPage = () => {
  const { user, loading } = useAuth();
  
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<string>("3");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send data to a backend
    console.log("Submitted feedback:", { feedback, rating });
    
    toast("Thank you for your valuable feedback!");
    
    setSubmitted(true);
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
        <h1 className="text-2xl font-bold mb-6">Your Feedback</h1>
        
        {submitted ? (
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900 mb-4">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
                <p className="text-center text-muted-foreground mb-6">
                  Your feedback has been submitted successfully. We appreciate your input!
                </p>
                <Button 
                  onClick={() => setSubmitted(false)}
                  className="bg-mindease hover:bg-mindease-dark"
                >
                  Submit Another Response
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle>Share Your Experience</CardTitle>
              <CardDescription>
                Your feedback helps us improve our services and provide better mental health support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="rating">How would you rate your overall experience?</Label>
                  <div className="flex items-center justify-center py-4">
                    <RadioGroup 
                      defaultValue="3" 
                      className="flex space-x-2" 
                      onValueChange={setRating}
                      value={rating}
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="flex flex-col items-center space-y-1">
                          <RadioGroupItem 
                            value={value.toString()} 
                            id={`rating-${value}`} 
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`rating-${value}`}
                            className={`cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                              parseInt(rating) >= value 
                                ? 'text-yellow-400' 
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          >
                            <Star className="h-8 w-8 fill-current" />
                          </Label>
                          <span className="text-xs">{value}</span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feedback">Tell us about your experience</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your thoughts, suggestions, or concerns..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-mindease hover:bg-mindease-dark"
                >
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
