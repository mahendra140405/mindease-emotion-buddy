
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";

interface OTPVerificationProps {
  phoneNumber: string;
  onVerified: (isVerified: boolean) => void;
  onCancel: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  phoneNumber,
  onVerified,
  onCancel
}) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);
  
  const mockVerifyOTP = (enteredOTP: string) => {
    // For demo purposes, any 6-digit code works
    return enteredOTP.length === 6;
  };
  
  const handleVerify = () => {
    // In a real implementation, this would verify the OTP with a backend service
    if (mockVerifyOTP(otp)) {
      toast.success("Phone number verified successfully!");
      onVerified(true);
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };
  
  const handleResendOTP = () => {
    setIsResending(true);
    // Mock resend OTP
    setTimeout(() => {
      toast.success(`New OTP sent to ${phoneNumber}`);
      setTimeLeft(60);
      setIsResending(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="text-center">
        <h3 className="text-lg font-medium">Verify Your Phone Number</h3>
        <p className="text-sm text-muted-foreground mt-1">
          We've sent a 6-digit code to {phoneNumber}
        </p>
      </div>
      
      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      
      <div className="flex flex-col space-y-2">
        <Button 
          onClick={handleVerify} 
          className="w-full"
          disabled={otp.length !== 6}
        >
          Verify
        </Button>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            size="sm"
          >
            Cancel
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResendOTP}
            disabled={timeLeft > 0 || isResending}
          >
            {isResending 
              ? "Sending..."
              : timeLeft > 0 
                ? `Resend in ${timeLeft}s`
                : "Resend OTP"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
