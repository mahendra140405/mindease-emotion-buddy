
import NavBar from "@/components/NavBar";
import ExerciseList from "@/components/ExerciseList";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ExercisesPage = () => {
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
      <ExerciseList />
    </div>
  );
};

export default ExercisesPage;
