
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Video, PhoneCall } from "lucide-react";
import { Doctor } from "@/types/doctor";

interface DoctorCardProps {
  doctor: Doctor;
  onCallRequest: (doctor: Doctor, callType: "video" | "audio") => void;
}

const DoctorCard = ({ doctor, onCallRequest }: DoctorCardProps) => {
  return (
    <Card className="overflow-hidden">
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
              onClick={() => onCallRequest(doctor, "audio")}
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button 
              size="sm"
              className="flex items-center bg-mindease hover:bg-mindease-dark"
              onClick={() => onCallRequest(doctor, "video")}
            >
              <Video className="h-4 w-4 mr-2" />
              Video
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DoctorCard;
