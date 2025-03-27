
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden pt-16 hero-gradient">
      <div 
        className={`container-padding mx-auto transition-opacity duration-1000 ease-smooth ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="section-padding flex flex-col items-center text-center">
          <div className="relative max-w-3xl mx-auto">
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 mb-6 animate-fade-in">
              <span className="flex h-2 w-2 mr-2">
                <span className="animate-pulse-gentle relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-green-500 opacity-75 animate-ping"></span>
              </span>
              AI-Powered Sustainable Travel
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6">
              <span className="block">Travel Smarter</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Travel Greener</span>
            </h1>
            
            <p className="mt-6 text-lg text-foreground/80 max-w-2xl mx-auto">
              GreenWay uses AI to help you make environmentally-friendly travel choices without sacrificing convenience. 
              Plan trips, find sustainable venues, earn rewards, and reduce your carbon footprint.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {isAuthenticated ? (
                <Link to="/planner">
                  <Button className="button-primary text-base py-6 px-8 shadow-md">
                    Start Planning
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="button-primary text-base py-6 px-8 shadow-md">
                    Get Started
                  </Button>
                </Link>
              )}
              <Link to="/#features" className="text-foreground/90 hover:text-primary transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="mt-16 max-w-5xl mx-auto animate-float">
            <div className="relative rounded-xl overflow-hidden shadow-elevation">
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1494783367193-149034c05e8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                alt="Sustainable travel through a city with bike paths and public transport"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative pattern */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-pattern pointer-events-none"></div>
    </div>
  );
};

export default Hero;
