
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
} from "lucide-react";
import Logo from "@/components/Logo";
import { toast } from "sonner";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
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
          : "text-gray-700 hover:bg-mindease-light hover:text-mindease"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
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
            onClick={() => {}}
          >
            <Moon size={20} />
          </Button>
          <span className="text-sm font-medium text-gray-700">
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
          <div className="absolute right-0 h-screen w-64 bg-white p-4 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-semibold">Menu</span>
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
              
              <div className="my-4 border-t border-gray-200"></div>
              
              <div className="flex items-center space-x-2 rounded-lg px-3 py-2">
                <User size={20} />
                <span className="text-sm">{user?.email}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
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
