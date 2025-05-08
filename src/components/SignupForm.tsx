
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Brain } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    await signUp(email, password, name);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-mindease-light px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center text-center">
          <Logo className="mb-6" />
          <h2 className="text-3xl font-bold tracking-tight text-mindease">Join Mindease</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Create your account to start your wellness journey
          </p>
        </div>
        
        <div className="mt-8 bg-white p-8 shadow-md rounded-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="rounded-lg"
              />
            </div>
            
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validatePassword}
                placeholder="Confirm your password"
                required
                className="rounded-lg"
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-mindease hover:bg-mindease-mid"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <Brain className="mr-2 h-4 w-4 animate-pulse" />
                  Creating Account...
                </span>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <button 
              className="font-medium text-mindease hover:text-mindease-mid"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
