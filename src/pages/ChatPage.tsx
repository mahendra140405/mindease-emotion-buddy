
import NavBar from "@/components/NavBar";
import ChatInterface from "@/components/ChatInterface";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <ChatInterface />
    </div>
  );
};

export default ChatPage;
