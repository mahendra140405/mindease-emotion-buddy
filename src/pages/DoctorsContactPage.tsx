import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Video, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  languages: string[];
  availability: string;
  image: string;
  rating: number;
  bio: string;
}

const doctorsList: Doctor[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialization: "Psychiatrist",
    languages: ["English", "Hindi", "Telugu"],
    availability: "Mon, Wed, Fri (10 AM - 4 PM)",
    image: "/placeholder.svg",
    rating: 4.8,
    bio: "Specializes in anxiety, depression, and stress management with 10+ years of experience."
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Clinical Psychologist",
    languages: ["English", "Mandarin", "Cantonese"],
    availability: "Tue, Thu (9 AM - 6 PM), Sat (9 AM - 1 PM)",
    image: "/placeholder.svg",
    rating: 4.6,
    bio: "Expert in cognitive behavioral therapy with special focus on trauma and PTSD."
  },
  {
    id: 3,
    name: "Dr. Sarah Johnson",
    specialization: "Therapist",
    languages: ["English", "Spanish", "French"],
    availability: "Mon-Fri (12 PM - 8 PM)",
    image: "/placeholder.svg",
    rating: 4.9,
    bio: "Specializes in relationship counseling, grief therapy, and mindfulness techniques."
  },
  {
    id: 4,
    name: "Dr. Rajesh Kumar",
    specialization: "Neuropsychiatrist",
    languages: ["English", "Hindi", "Bengali", "Telugu"],
    availability: "Wed-Sun (10 AM - 5 PM)",
    image: "/placeholder.svg",
    rating: 4.7,
    bio: "Focuses on treating anxiety disorders, OCD, and neurological conditions affecting mental health."
  },
];

const DoctorsContactPage = () => {
  const { user, loading } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [callType, setCallType] = useState<"video" | "audio" | null>(null);
  const [callInProgress, setCallInProgress] = useState(false);

  const handleCallRequest = (doctor: Doctor, type: "video" | "audio") => {
    setSelectedDoctor(doctor);
    setCallType(type);
    setCallInProgress(true);
    
    // In a real application, this would initiate a call
    toast(`${type.charAt(0).toUpperCase() + type.slice(1)} call requested - Connecting you with ${doctor.name}...`);
  };

  const endCall = () => {
    toast(`Your call with ${selectedDoctor?.name} has ended.`);
    setSelectedDoctor(null);
    setCallType(null);
    setCallInProgress(false);
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
        <h1 className="text-2xl font-bold mb-6">Mental Health Professionals</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctorsList.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={doctor.image} alt={doctor.name} />
                    <AvatarFallback className="bg-mindease text-white">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{doctor.name}</h2>
                    <p className="text-muted-foreground">{doctor.specialization}</p>
                  </div>
                </div>
                
                <p className="text-sm mb-3">{doctor.bio}</p>
                
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">Available languages:</p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((language, index) => (
                      <div key={index} className="flex items-center text-xs text-muted-foreground">
                        <Globe className="h-3 w-3 mr-1" />
                        {language}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium">Availability:</p>
                  <p className="text-xs text-muted-foreground">{doctor.availability}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="flex items-center">
                    Rating: {doctor.rating}/5
                  </Badge>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex items-center"
                      onClick={() => handleCallRequest(doctor, "audio")}
                    >
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button 
                      size="sm"
                      className="flex items-center bg-mindease hover:bg-mindease-dark"
                      onClick={() => handleCallRequest(doctor, "video")}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Call Dialog */}
      <Dialog open={callInProgress} onOpenChange={(open) => !open && endCall()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {callType === "video" ? "Video Call" : "Audio Call"} with {selectedDoctor?.name}
            </DialogTitle>
            <DialogDescription>
              {callType === "video" ? "Video" : "Audio"} session in progress...
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center items-center p-6">
            {callType === "video" ? (
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-full aspect-video flex items-center justify-center">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={selectedDoctor?.image} alt={selectedDoctor?.name} />
                  <AvatarFallback className="bg-mindease text-white text-4xl">
                    {selectedDoctor?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={selectedDoctor?.image} alt={selectedDoctor?.name} />
                  <AvatarFallback className="bg-mindease text-white text-4xl">
                    {selectedDoctor?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center mt-2">
                  <p>Call duration: 00:00</p>
                  <p className="text-sm text-muted-foreground">Audio connected</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-center">
            <Button 
              variant="destructive" 
              onClick={endCall}
              className="w-full sm:w-auto"
            >
              End Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorsContactPage;
