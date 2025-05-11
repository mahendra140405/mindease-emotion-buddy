
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Brain, Lightbulb, ThumbsUp } from "lucide-react";

const CBTExercises = () => {
  const [thoughtRecord, setThoughtRecord] = useState({
    situation: "",
    automaticThought: "",
    emotions: "",
    evidence: "",
    alternative: "",
    outcome: ""
  });
  
  const [activeStep, setActiveStep] = useState(0);
  const [savedRecords, setSavedRecords] = useState<Array<typeof thoughtRecord>>([]);
  
  const steps = [
    { id: 'situation', label: 'Situation', description: 'Describe the situation that triggered your negative thoughts or emotions.' },
    { id: 'automaticThought', label: 'Automatic Thoughts', description: 'What thoughts automatically came to mind in this situation?' },
    { id: 'emotions', label: 'Emotions', description: 'What emotions did you feel and how intense were they (0-100%)?' },
    { id: 'evidence', label: 'Evidence', description: 'What evidence supports and doesn\'t support your automatic thought?' },
    { id: 'alternative', label: 'Alternative Thoughts', description: 'What are alternative, more balanced ways of thinking about the situation?' },
    { id: 'outcome', label: 'Outcome', description: 'How do you feel now? How has your perspective changed?' },
  ];
  
  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // Save the completed thought record
      setSavedRecords([...savedRecords, thoughtRecord]);
      setThoughtRecord({
        situation: "",
        automaticThought: "",
        emotions: "",
        evidence: "",
        alternative: "",
        outcome: ""
      });
      setActiveStep(0);
      toast.success("Thought record saved!");
      
      // Save to localStorage
      try {
        const existingRecords = JSON.parse(localStorage.getItem('cbtRecords') || '[]');
        localStorage.setItem('cbtRecords', JSON.stringify([...existingRecords, thoughtRecord]));
      } catch (error) {
        console.error("Error saving CBT record to localStorage:", error);
      }
    }
  };
  
  const handlePreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setThoughtRecord({
      ...thoughtRecord,
      [name]: value
    });
  };
  
  const currentStep = steps[activeStep];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Cognitive Behavioral Therapy (CBT) Exercises</h2>
        <p className="text-muted-foreground">Challenge negative thoughts and develop healthier thinking patterns.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Thought Record</CardTitle>
          <CardDescription>
            Step {activeStep + 1} of {steps.length}: {currentStep.label}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-3">{currentStep.description}</p>
            <Textarea
              name={currentStep.id}
              value={thoughtRecord[currentStep.id as keyof typeof thoughtRecord]}
              onChange={handleChange}
              placeholder={`Enter your ${currentStep.label.toLowerCase()} here...`}
              rows={5}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousStep}
              disabled={activeStep === 0}
            >
              Previous
            </Button>
            <Button 
              onClick={handleNextStep}
              className="bg-mindease hover:bg-mindease-mid"
            >
              {activeStep === steps.length - 1 ? 'Save Record' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {savedRecords.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Recent Thought Records</h3>
          <div className="space-y-4">
            {savedRecords.map((record, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-mindease" />
                    Thought Record #{savedRecords.length - index}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Situation:</span> {record.situation}
                    </div>
                    <div>
                      <span className="font-semibold">Thoughts:</span> {record.automaticThought}
                    </div>
                    <div>
                      <span className="font-semibold">Emotions:</span> {record.emotions}
                    </div>
                    <div>
                      <span className="font-semibold">Alternative Thought:</span> {record.alternative}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
            CBT Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Focus on identifying and challenging negative thought patterns</li>
            <li>Look for evidence that both supports and contradicts your automatic thoughts</li>
            <li>Practice regularly to build better thinking habits</li>
            <li>Be patient with yourself - changing thought patterns takes time</li>
            <li>Use these exercises especially when feeling anxious, stressed, or depressed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CBTExercises;
