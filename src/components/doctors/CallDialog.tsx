
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Doctor } from "@/types/doctor";

interface CallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDoctor: Doctor | null;
  callType: "video" | "audio" | null;
  onEndCall: () => void;
}

const CallDialog = ({ 
  open, 
  onOpenChange, 
  selectedDoctor, 
  callType, 
  onEndCall 
}: CallDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={onEndCall}
            className="w-full sm:w-auto"
          >
            End Call
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;
