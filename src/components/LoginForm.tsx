
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { Brain } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      // Store user info in localStorage for this demo
      localStorage.setItem("user", JSON.stringify({ email }));
      toast.success("Welcome to Mindease!");
      navigate("/dashboard");
      setIsLoading(false);
    }, 1500);
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
          <form className="space-y-6" onSubmit={handleSubmit}>
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
              disabled={isLoading}
            >
              {isLoading ? (
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
            <button className="font-medium text-mindease hover:text-mindease-mid">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
