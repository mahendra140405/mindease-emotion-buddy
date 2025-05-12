
import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Doctor } from "@/types/doctor";
import { doctorsList } from "@/data/doctors";
import DoctorCard from "@/components/doctors/DoctorCard";
import CallDialog from "@/components/doctors/CallDialog";

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
            <DoctorCard 
              key={doctor.id}
              doctor={doctor}
              onCallRequest={handleCallRequest}
            />
          ))}
        </div>
      </div>

      <CallDialog
        open={callInProgress}
        onOpenChange={(open) => !open && endCall()}
        selectedDoctor={selectedDoctor}
        callType={callType}
        onEndCall={endCall}
      />
    </div>
  );
};

export default DoctorsContactPage;
