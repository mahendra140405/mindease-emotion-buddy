
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, BarChart, MessageSquare, Book, Dumbbell, Headphones, PhoneCall, Star, Mail } from "lucide-react";

const NavBar = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  // Reordered navigation links as requested
  const navLinks = [
    { to: "/dashboard", label: "Home", icon: <BarChart className="h-4 w-4 mr-2" /> },
    { to: "/mood-tracker", label: "Mood Tracker", icon: <BarChart className="h-4 w-4 mr-2" /> },
    { to: "/exercises", label: "Exercises", icon: <Dumbbell className="h-4 w-4 mr-2" /> },
    { to: "/relaxation", label: "Relaxation Audio", icon: <Headphones className="h-4 w-4 mr-2" /> },
    { to: "/chat", label: "Chat", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { to: "/doctors", label: "Doctor Contacts", icon: <PhoneCall className="h-4 w-4 mr-2" /> },
    { to: "/contact", label: "Contact", icon: <Mail className="h-4 w-4 mr-2" /> },
    { to: "/resources", label: "Resources", icon: <Book className="h-4 w-4 mr-2" /> },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <Logo className="h-8 w-8" />
              <span className="ml-2 font-semibold text-lg text-gray-900 dark:text-white">Mindease</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-4">
            {user && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-mindease dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt="User avatar"
                      />
                      <AvatarFallback className="bg-mindease text-white">
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/mood-tracker">Mood Tracker</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/feedback">Feedback</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="inline-flex md:hidden items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Mindease</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {user && (
                    <div className="space-y-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-mindease hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      ))}
                      <div className="pt-4">
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={handleSignOut}
                        >
                          Log out
                        </Button>
                      </div>
                    </div>
                  )}

                  {!user && (
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        variant="default"
                        asChild
                      >
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          Log in
                        </Link>
                      </Button>
                      <Button
                        className="w-full"
                        variant="outline"
                        asChild
                      >
                        <Link to="/signup" onClick={() => setIsOpen(false)}>
                          Sign up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
