
import { format, addDays } from 'date-fns';
import { Trip, ItineraryDay, Activity } from '../types';

// Types
export interface SustainableVenue {
  id: string;
  name: string;
  type: string;
  address: string;
  description: string;
  sustainabilityFeatures: string[];
  imageUrl: string;
  rating: number;
  distance?: string;
  estimatedCost?: number;
}

// Export Trip interface for use in other files
export type { Trip, ItineraryDay, Activity };

// Mock data for air quality
export const getAirQualityData = (location: string) => {
  const aqi = Math.floor(Math.random() * 150);
  let category = 'Moderate';
  if (aqi <= 50) category = 'Good';
  else if (aqi <= 100) category = 'Acceptable';
  else if (aqi <= 200) category = 'Unhealthy';
  else category = 'Very Unhealthy';

  return {
    location,
    aqi,
    category,
    healthImplications: 'Minor irritation for sensitive groups',
    precautionaryMeasures: 'Reduce prolonged or heavy exertion'
  };
};

// Mock data for carbon footprint
export const getCarbonFootprintEstimate = (distance: number, transportMode: string) => {
  let emissionFactor = 0.2; // kg CO2 per km for a generic car
  if (transportMode === 'bus') emissionFactor = 0.1;
  else if (transportMode === 'train') emissionFactor = 0.05;
  else if (transportMode === 'bike') emissionFactor = 0;
  else if (transportMode === 'walk') emissionFactor = 0;

  const carbonFootprint = distance * emissionFactor;
  return {
    transportMode,
    distance,
    carbonFootprint: carbonFootprint.toFixed(2) + ' kg CO2'
  };
};

// Mock data for sustainable venues
export const mockSustainableVenues: SustainableVenue[] = [
  {
    id: 'venue-1',
    name: 'The Green Cafe',
    type: 'restaurant',
    address: '123 Eco Street, Greenway',
    description: 'A cafe committed to using locally sourced, organic ingredients and reducing waste.',
    sustainabilityFeatures: ['Organic ingredients', 'Composting', 'Recycling program'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?cafe,sustainable',
    rating: 4.5,
    distance: '0.5 miles',
    estimatedCost: 25
  },
  {
    id: 'venue-2',
    name: 'EcoPlex Cinema',
    type: 'entertainment',
    address: '456 Earth Ave, Greenway',
    description: 'A cinema that uses solar power and offers vegan snacks.',
    sustainabilityFeatures: ['Solar power', 'Vegan options', 'Recycled materials'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?cinema,solar',
    rating: 4.2,
    distance: '1.2 miles',
    estimatedCost: 15
  },
  {
    id: 'venue-3',
    name: 'Sustainable Hotel',
    type: 'lodging',
    address: '789 Planet Rd, Greenway',
    description: 'A hotel built with sustainable materials and practices water conservation.',
    sustainabilityFeatures: ['Sustainable building', 'Water conservation', 'Energy efficiency'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?hotel,eco',
    rating: 4.8,
    distance: '2.1 miles',
    estimatedCost: 150
  },
  {
    id: 'venue-4',
    name: 'Organic Farmers Market',
    type: 'shopping',
    address: '101 Fresh Ln, Greenway',
    description: 'A market selling locally grown, organic produce and handmade goods.',
    sustainabilityFeatures: ['Local produce', 'Organic farming', 'Handmade crafts'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?market,organic',
    rating: 4.6,
    distance: '0.8 miles',
    estimatedCost: 10
  },
  {
    id: 'venue-5',
    name: 'GreenTech Co-working',
    type: 'workplace',
    address: '222 Innovate Blvd, Greenway',
    description: 'A co-working space powered by renewable energy and promoting green business practices.',
    sustainabilityFeatures: ['Renewable energy', 'Green business', 'Community programs'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?office,green',
    rating: 4.9,
    distance: '1.5 miles',
    estimatedCost: 30
  }
];

// Mock function to generate a sustainable trip
export const generateAITrip = (
  title: string,
  startLocation: string,
  startDate: Date,
  endDate: Date,
  preferences: string[]
): Trip => {
  const numDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const itinerary: ItineraryDay[] = [];

  for (let i = 0; i < numDays; i++) {
    const currentDate = addDays(startDate, i);
    const dateStr = format(currentDate, 'yyyy-MM-dd');

    const activities: Activity[] = [
      {
        time: '9:00 AM',
        title: 'Sustainable Breakfast',
        location: 'The Green Cafe',
        description: 'Enjoy a locally sourced, organic breakfast.',
        transportMode: 'walk',
        transportDetails: '5 min walk',
        duration: '1 hour',
        cost: 15,
        tags: ['food', 'organic']
      },
      {
        time: '10:30 AM',
        title: 'Eco Tour',
        location: 'Local Eco-Tourism Center',
        description: 'Take a guided tour to learn about local conservation efforts.',
        transportMode: 'bus',
        transportDetails: '15 min bus ride',
        duration: '2 hours',
        cost: 20,
        tags: ['nature', 'conservation']
      },
      {
        time: '1:00 PM',
        title: 'Sustainable Lunch',
        location: 'Organic Farmers Market',
        description: 'Have lunch at the farmers market with fresh, local produce.',
        transportMode: 'bike',
        transportDetails: '10 min bike ride',
        duration: '1.5 hours',
        cost: 20,
        tags: ['food', 'local']
      },
      {
        time: '3:00 PM',
        title: 'Renewable Energy Workshop',
        location: 'GreenTech Co-working',
        description: 'Participate in a workshop on renewable energy solutions.',
        transportMode: 'bus',
        transportDetails: '20 min bus ride',
        duration: '2.5 hours',
        cost: 25,
        tags: ['education', 'technology']
      },
      {
        time: '6:00 PM',
        title: 'Eco-Friendly Dinner',
        location: 'The Green Cafe',
        description: 'Enjoy a sustainable dinner at The Green Cafe.',
        transportMode: 'walk',
        transportDetails: '5 min walk',
        duration: '2 hours',
        cost: 30,
        tags: ['food', 'organic']
      }
    ];

    itinerary.push({
      day: i + 1,
      title: `Day ${i + 1}`,
      date: dateStr,
      activities: activities
    });
  }

  const trip: Trip = {
    id: `trip-${Date.now()}`,
    title: title,
    description: `AI-generated eco-friendly trip to ${startLocation} based on your sustainable travel preferences.`,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    locations: [startLocation],
    status: "upcoming",
    budget: 500,
    travelType: "leisure",
    travelers: 1,
    mapCoordinates: [],
    itinerary: itinerary,
    carbonSaved: Math.floor(Math.random() * 200) + 100, // Random value between 100-300
    imageUrl: `https://source.unsplash.com/random/1920x1080/?${startLocation},landmark`
  };

  return trip;
};

// Mock function to save a trip
export const saveTrip = (trip: Trip) => {
  try {
    const savedTrips = getSavedTrips();
    savedTrips.push(trip);
    localStorage.setItem('greenway_trips', JSON.stringify(savedTrips));
  } catch (error) {
    console.error('Failed to save trip to local storage:', error);
  }
};

// Mock function to get saved trips
export const getSavedTrips = (): Trip[] => {
  try {
    const trips = localStorage.getItem('greenway_trips');
    return trips ? JSON.parse(trips) : [];
  } catch (error) {
    console.error('Failed to parse saved trips from local storage:', error);
    return [];
  }
};

// Mock function to get a trip by ID
export const getTripById = (tripId: string): Trip | undefined => {
  const trips = getSavedTrips();
  return trips.find(trip => trip.id === tripId);
};

// Alias getTripById as findTripById for compatibility with existing imports
export const findTripById = getTripById;
