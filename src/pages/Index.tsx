
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user in localStorage as a simple alternative
    const user = localStorage.getItem("user");
    
    if (user) {
      // Redirect to dashboard if user is logged in
      navigate("/dashboard");
    } else {
      // Redirect to login if user is not logged in
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-pulse text-mindease text-xl">Loading...</div>
    </div>
  );
};

export default Index;
