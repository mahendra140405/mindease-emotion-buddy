
import NavBar from "@/components/NavBar";
import MoodTracker from "@/components/MoodTracker";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MoodTrackerPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <MoodTracker />
    </div>
  );
};

export default MoodTrackerPage;
