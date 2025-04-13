
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "@/pages/Login";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return <Login />;
};

export default Index;
