
import NavBar from "@/components/NavBar";
import ChatInterface from "@/components/ChatInterface";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const ChatPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-mindease text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Chat with Mindease AI</h1>
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;
