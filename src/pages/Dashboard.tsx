import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSavedTrips } from '@/utils/mockData';
import { getAirQualityForLocation } from '@/utils/airQualityApi';
import { shouldShowNotifications } from '@/utils/api';

// Import dashboard components
import GreenScoreCard from '@/components/dashboard/GreenScoreCard';
import NextTripCard from '@/components/dashboard/NextTripCard';
import AirQualityCard from '@/components/dashboard/AirQualityCard';
import SustainableTransportCard from '@/components/dashboard/SustainableTransportCard';
import DailyChallengeCard from '@/components/dashboard/DailyChallengeCard';
import QuickActions from '@/components/dashboard/QuickActions';

const Dashboard = () => {
  const { user } = useAuth(); // Remove updateGreenScore to prevent notifications
  const [trips, setTrips] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get saved trips
        const savedTrips = getSavedTrips();
        setTrips(savedTrips);
        
        // Get air quality data for current location
        // Using the actual API function that returns proper data format
        const coordinates = { lat: 51.5074, lon: 0.1278 }; // Default to London coordinates
        const airQualityData = await getAirQualityForLocation(coordinates.lat, coordinates.lon);
        setAirQuality(airQualityData);
        
        // Removed points notification logic
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []); // Removed updateGreenScore dependency

  // Get next upcoming trip
  const nextTrip = trips.length > 0 
    ? trips.find((trip) => trip.status === 'upcoming') 
    : null;

  // Handle completing daily challenge
  const handleCompleteChallenge = () => {
    // Keep the function but don't show notifications for dashboard load
  };

  return (
    <div className="container-padding mx-auto max-w-7xl py-8 page-transition">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'Traveler'}</h1>
        <p className="text-foreground/80">
          Your sustainable journey continues. Here's your travel dashboard.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Green Score Card */}
        <GreenScoreCard name={user?.name} greenScore={user?.greenScore} />
        
        {/* Next Trip Card */}
        <NextTripCard nextTrip={nextTrip} />
        
        {/* Air Quality Card */}
        <AirQualityCard airQuality={airQuality} />
        
        {/* Sustainable Transport Card */}
        <SustainableTransportCard />
        
        {/* Daily Challenge Card */}
        <DailyChallengeCard onCompleteChallenge={handleCompleteChallenge} />
      </div>
      
      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default Dashboard;
