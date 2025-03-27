
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page-transition">
      {/* Hero section */}
      <Hero />
      
      {/* Features section */}
      <Features />
      
      {/* How it works section */}
      <section className="bg-green-50/50 section-padding" id="about">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How GreenWay Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
              Our intelligent platform makes sustainable travel planning simple and rewarding.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-xl p-6 shadow-subtle border border-green-100 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">1. Tell us your plans</h3>
              <p className="text-foreground/80">
                Input your destination, dates, and preferences for sustainable travel options.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-subtle border border-green-100 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">2. Get smart suggestions</h3>
              <p className="text-foreground/80">
                Our AI generates a personalized itinerary with eco-friendly transportation and venues.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-subtle border border-green-100 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">3. Travel and earn rewards</h3>
              <p className="text-foreground/80">
                Follow your plan, earn Green Score points, and receive rewards for sustainable choices.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            {isAuthenticated ? (
              <Link to="/planner">
                <Button className="button-primary">Start Your Green Journey</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="button-primary">Create Account</Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Stats section */}
      <section className="section-padding bg-gradient-to-b from-white to-green-50/50">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">92%</p>
              <p className="text-foreground/80">of users reduced their carbon footprint</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">1.2M</p>
              <p className="text-foreground/80">kg of CO₂ saved by our community</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">4.8/5</p>
              <p className="text-foreground/80">average user satisfaction rating</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">50k+</p>
              <p className="text-foreground/80">eco-friendly trips planned</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-padding mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to travel greener?</h2>
          <p className="text-lg mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
            Join thousands of eco-conscious travelers using GreenWay to reduce their environmental impact while enjoying amazing experiences.
          </p>
          {isAuthenticated ? (
            <Link to="/planner">
              <Button className="bg-white text-primary hover:bg-white/90 shadow-md py-6 px-8 text-base">
                Plan Your First Trip
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="bg-white text-primary hover:bg-white/90 shadow-md py-6 px-8 text-base">
                Get Started for Free
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
