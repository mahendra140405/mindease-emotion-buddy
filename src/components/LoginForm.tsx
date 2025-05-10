
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Brain } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    try {
      const result = await signIn(email, password);
      if (result && result.error) {
        setErrorMessage("Incorrect email or password. Please try again.");
        toast.error("Login failed. Please check your credentials.");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage("An error occurred during sign in. Please try again.");
      toast.error("Login failed. Please try again later.");
    }
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
          <form className="space-y-6" onSubmit={handleEmailSubmit}>
            {errorMessage && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                {errorMessage}
              </div>
            )}
            
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

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button 
              className="font-medium text-mindease hover:text-mindease-mid"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
