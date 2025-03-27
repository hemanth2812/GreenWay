import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Navigation items based on authentication status
  const publicNav = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' },
    { name: 'Contact', to: '/contact' },
  ];

  const privateNav = [
    { name: 'Dashboard', to: '/dashboard' },
    { name: 'Trip Planner', to: '/planner' },
    { name: 'My Trips', to: '/trips' },
  ];

  const navItems = isAuthenticated ? [...publicNav, ...privateNav] : publicNav;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary mr-2"
                >
                  <path d="M18 8c0 5-4 5-4 10a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1c0-5-4-5-4-10a2 2 0 0 0-4 0c0 5-4 5-4 10a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1c0-5-4-5-4-10a2 2 0 0 0-4 0c0 5-4 5-4 10a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1c0-5-4-5-4-10" />
                </svg>
                <span className="text-xl font-semibold text-foreground">GreenWay</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    location.pathname === item.to
                      ? 'text-foreground bg-accent'
                      : 'text-foreground/70 hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Desktop right nav section */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <>
                <Link to="/api-settings">
                  <Button variant="ghost" size="sm">
                    API Settings
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="ml-2">
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout} className="ml-2">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu panel */}
      {isOpen && (
        <div className="sm:hidden bg-background border-b border-border">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={`block px-3 py-2 text-base font-medium ${
                  location.pathname === item.to
                    ? 'text-foreground bg-accent'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile menu auth buttons */}
          <div className="pt-4 pb-3 border-t border-border">
            {isAuthenticated ? (
              <div className="space-y-1 px-3">
                <Link to="/api-settings">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    API Settings
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout} className="w-full justify-start">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="px-3 pb-2">
                <Link to="/login">
                  <Button className="w-full">Login</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
