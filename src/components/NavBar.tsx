
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BarChart,
  Brain,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Activity,
  User,
  X,
  Sun,
} from "lucide-react";
import Logo from "@/components/Logo";
import { toast } from "sonner";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    
    // Check if dark mode preference is saved
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    
    // Apply dark mode class if enabled
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem("darkMode", String(newDarkMode));
    
    // Toggle dark mode class on html element
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    toast.success(`${newDarkMode ? "Dark" : "Light"} mode enabled`);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavItem = ({
    to,
    icon: Icon,
    label,
  }: {
    to: string;
    icon: React.ElementType;
    label: string;
  }) => (
    <Link
      to={to}
      onClick={closeMenu}
      className={`flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors ${
        isActive(to)
          ? "bg-mindease text-white"
          : "text-gray-700 hover:bg-mindease-light hover:text-mindease dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <NavItem to="/dashboard" icon={Home} label="Dashboard" />
          <NavItem to="/mood-tracker" icon={Activity} label="Mood Tracker" />
          <NavItem to="/exercises" icon={Brain} label="Exercises" />
          <NavItem to="/chat" icon={MessageCircle} label="Chat" />
        </div>

        {/* Profile & Logout (Desktop) */}
        <div className="hidden md:flex md:items-center md:space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.email}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="absolute right-0 h-screen w-64 bg-white p-4 shadow-lg dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-semibold dark:text-white">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>

            <div className="space-y-2">
              <NavItem to="/dashboard" icon={Home} label="Dashboard" />
              <NavItem to="/mood-tracker" icon={Activity} label="Mood Tracker" />
              <NavItem to="/exercises" icon={Brain} label="Exercises" />
              <NavItem to="/chat" icon={MessageCircle} label="Chat" />
              
              <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex w-full items-center justify-start space-x-2 px-3 py-2"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
              </Button>
              
              <div className="flex items-center space-x-2 rounded-lg px-3 py-2">
                <User size={20} />
                <span className="text-sm dark:text-gray-300">{user?.email}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900 dark:hover:text-red-400"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
