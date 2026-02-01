import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, Heart, BarChart3, HeartHandshake, Settings, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { authAPI } from "@/services/api";

export const Navigation = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isAuth = location.pathname === '/auth';
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, [location.pathname]);

  const checkUserStatus = async () => {
    const authenticated = authAPI.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      try {
        const user = await authAPI.getCurrentUser();
        setIsAdmin(user.isAdmin || false);
      } catch (error) {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  };

  if (isAuth) return null;

  const links = [
    { to: '/', icon: Home, label: t('nav.home'), public: true },
    { to: '/checkin', icon: Heart, label: t('nav.checkin') },
    { to: '/dashboard', icon: BarChart3, label: t('nav.dashboard') },
    { to: '/support', icon: HeartHandshake, label: t('nav.support'), public: true },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/admin', icon: Shield, label: t('nav.admin'), adminOnly: true },
    { to: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  // Filter links based on authentication and admin status
  const visibleLinks = links.filter(link => {
    if (link.adminOnly) return isAdmin;
    if (link.public) return true;
    return isAuthenticated;
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl bg-gradient-calm bg-clip-text text-transparent">
          <Heart className="h-6 w-6 text-primary" />
          MindBridge
        </Link>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map((link) => (
              <Button
                key={link.to}
                variant={location.pathname === link.to ? 'secondary' : 'ghost'}
                size="sm"
                asChild
                className={cn(
                  "gap-2 transition-all",
                  location.pathname === link.to && "bg-primary/10 text-primary"
                )}
              >
                <Link to={link.to}>
                  <link.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{link.label}</span>
                </Link>
              </Button>
            ))}
          </div>
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
      
      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex items-center justify-around py-2">
          {visibleLinks.slice(0, 5).map((link) => (
            <Button
              key={link.to}
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "flex-col h-auto py-2 px-3",
                location.pathname === link.to && "text-primary"
              )}
            >
              <Link to={link.to}>
                <link.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{link.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};
