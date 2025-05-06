import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlaneTakeoff, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const publicNavLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#destinations", label: "Destinations" },
  { href: "/#testimonials", label: "Testimonials" },
];

const authenticatedNavLinks = [
  ...publicNavLinks,
  { href: "/saved-trips", label: "My Trips" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const isHomePage = location === "/";

  const navLinks = currentUser ? authenticatedNavLinks : publicNavLinks;

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging out.",
        variant: "destructive",
      });
    }
  };

  const scrollToSection = (id: string) => {
    if (isHomePage) {
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded">
            <PlaneTakeoff className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">Trip<span className="text-primary">Toss</span></span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            link.href.startsWith("/#") && isHomePage ? (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href.substring(1))}
                className="text-foreground hover:text-primary font-medium"
              >
                {link.label}
              </button>
            ) : (
              <Link 
                key={link.href}
                href={link.href.startsWith("/#") ? (isHomePage ? link.href.substring(1) : "/") : link.href}
                className="text-foreground hover:text-primary font-medium"
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>
        
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <>
              <Link href="/plan-trip">
                <Button variant="default" size="sm">Plan a Trip</Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(currentUser.email || "User")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {currentUser.email && (
                        <p className="font-medium">{currentUser.email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/saved-trips" className="cursor-pointer w-full">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>My Trips</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">Log in</Button>
              </Link>
              <Link href="/signup" className="hidden sm:inline-block">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                    <div className="bg-primary text-primary-foreground p-1.5 rounded">
                      <PlaneTakeoff className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold">Trip<span className="text-primary">Toss</span></span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <nav className="flex flex-col space-y-6 mb-auto">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href.startsWith("/#") ? (isHomePage ? link.href.substring(1) : "/") : link.href}
                      className="text-foreground hover:text-primary font-medium text-xl"
                      onClick={() => {
                        setIsOpen(false);
                        if (link.href.startsWith("/#") && isHomePage) {
                          setTimeout(() => scrollToSection(link.href.substring(1)), 100);
                        }
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  {currentUser ? (
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }} 
                      className="text-foreground hover:text-primary font-medium text-xl flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-foreground hover:text-primary font-medium text-xl"
                        onClick={() => setIsOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link
                        href="/signup"
                        className="text-foreground hover:text-primary font-medium text-xl"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </nav>
                
                <div className="py-6">
                  <Link href="/plan-trip" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">{currentUser ? "Plan a Trip" : "Get Started"}</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
