
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 page-transition">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-6">About GreenWay</h1>
        
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-lg text-foreground/80 mb-8">
            GreenWay is a sustainable travel planning app designed to help travelers make eco-friendly choices while exploring the world. Our mission is to reduce the environmental impact of tourism while enhancing the travel experience.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-10">Our Mission</h2>
          <p className="text-foreground/80 mb-6">
            At GreenWay, we believe that travel can be both enriching and sustainable. We're committed to helping travelers:
          </p>
          
          <ul className="space-y-2 mb-8 list-disc pl-6">
            <li>Find eco-friendly transportation options</li>
            <li>Discover sustainable accommodations and attractions</li>
            <li>Reduce their carbon footprint while traveling</li>
            <li>Make informed decisions about environmental impacts</li>
            <li>Support local communities and sustainable businesses</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4 mt-10">Our Technology</h2>
          <p className="text-foreground/80 mb-6">
            GreenWay combines advanced AI with real-time environmental data to provide personalized sustainable travel recommendations. Our platform includes:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-2">AI-Powered Planning</h3>
                <p className="text-sm text-foreground/80">
                  Our AI analyzes your preferences and suggests itineraries that minimize environmental impact while maximizing enjoyment.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-2">Environmental Insights</h3>
                <p className="text-sm text-foreground/80">
                  Access real-time data on air quality, carbon emissions, and sustainable transportation options at your destination.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-2">Green Score System</h3>
                <p className="text-sm text-foreground/80">
                  Track and improve your travel sustainability with our gamified scoring system that rewards eco-friendly choices.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-2">Community Recommendations</h3>
                <p className="text-sm text-foreground/80">
                  Discover sustainable businesses, accommodations, and experiences recommended by our community of eco-conscious travelers.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-10 mb-8">
            <Link to="/contact">
              <Button size="lg">Contact Us for More Information</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
