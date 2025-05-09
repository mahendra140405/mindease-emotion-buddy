
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Brain } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import OTPVerification from "@/components/OTPVerification";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTPVerification, setShowOTPVerification] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number format (simple check)
    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    
    // Show OTP verification
    setShowOTPVerification(true);
    toast.info(`Sending OTP to ${phoneNumber}`);
  };
  
  const handleGoogleLogin = () => {
    // In a real implementation, this would redirect to Google OAuth
    toast.info("Redirecting to Google login...");
    // Simulate delay and then login
    setTimeout(() => {
      toast.success("Google login successful!");
      navigate("/dashboard");
    }, 1500);
  };
  
  const handleOTPVerified = (isVerified: boolean) => {
    if (isVerified) {
      // Mock successful login
      navigate("/dashboard");
    }
    setShowOTPVerification(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-mindease-light px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center text-center">
          <Logo className="mb-6" />
          <h2 className="text-3xl font-bold tracking-tight text-mindease">Welcome to Mindease</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Your companion for mental wellbeing
          </p>
        </div>
        
        <div className="mt-8 bg-white p-8 shadow-md rounded-2xl">
          {showOTPVerification ? (
            <OTPVerification 
              phoneNumber={phoneNumber}
              onVerified={handleOTPVerified}
              onCancel={() => setShowOTPVerification(false)}
            />
          ) : (
            <>
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                  <TabsTrigger value="google">Google</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email">
                  <form className="space-y-6" onSubmit={handleEmailSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button
                          type="button"
                          className="text-xs text-mindease hover:text-mindease-mid"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="rounded-lg"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-mindease hover:bg-mindease-mid"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <Brain className="mr-2 h-4 w-4 animate-pulse" />
                          Signing in...
                        </span>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="phone">
                  <form className="space-y-6" onSubmit={handlePhoneSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your 10-digit phone number"
                        required
                        className="rounded-lg"
                        pattern="[0-9]{10}"
                      />
                      <p className="text-xs text-muted-foreground">
                        We'll send a one-time password to this number
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-mindease hover:bg-mindease-mid"
                    >
                      Send OTP
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="google">
                  <div className="flex flex-col items-center justify-center py-4">
                    <p className="mb-4 text-sm text-muted-foreground">
                      Continue with your Google account
                    </p>
                    <Button
                      onClick={handleGoogleLogin}
                      variant="outline"
                      className="w-full py-6 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <svg
                        className="mr-2 h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Sign in with Google
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <button 
                  className="font-medium text-mindease hover:text-mindease-mid"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
