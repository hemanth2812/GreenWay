
import { toast } from 'sonner';
import { 
  generateAITrip, 
  getAirQualityData, 
  getCarbonFootprintEstimate, 
  mockSustainableVenues, 
  saveTrip,
} from './mockData';
import { getOpenAIApiKey } from './env';
import { geocodeLocation } from './mapApi';
import { 
  generateSustainableTravelPlan, 
  parseHyderabadMockItinerary,
  hyderabadLandmarkCoordinates
} from './openaiApi';
import { Trip, Activity, ItineraryDay } from '../types';

// Simulated API delay
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Prevent notifications during active trips
export const shouldShowNotifications = (tripStatus?: string) => {
  return false; // Always return false to prevent notifications
};

// List of famous places in Hyderabad with coordinates
const hyderabadLandmarks = [
  { name: "Charminar", coordinates: { lat: 17.3616, lon: 78.4747 } },
  { name: "Golconda Fort", coordinates: { lat: 17.3833, lon: 78.4011 } },
  { name: "Hussain Sagar Lake", coordinates: { lat: 17.4239, lon: 78.4738 } },
  { name: "Ramoji Film City", coordinates: { lat: 17.2543, lon: 78.6808 } },
  { name: "Birla Mandir", coordinates: { lat: 17.4062, lon: 78.4691 } },
  { name: "Lumbini Park", coordinates: { lat: 17.4165, lon: 78.4720 } },
  { name: "Nehru Zoological Park", coordinates: { lat: 17.3511, lon: 78.4489 } },
  { name: "Salar Jung Museum", coordinates: { lat: 17.3714, lon: 78.4804 } },
  { name: "Chowmahalla Palace", coordinates: { lat: 17.3582, lon: 78.4710 } },
  { name: "Qutb Shahi Tombs", coordinates: { lat: 17.3947, lon: 78.3984 } },
  { name: "Mecca Masjid", coordinates: { lat: 17.3604, lon: 78.4736 } },
  { name: "KBR National Park", coordinates: { lat: 17.4256, lon: 78.4269 } },
  { name: "Durgam Cheruvu", coordinates: { lat: 17.4275, lon: 78.3890 } },
  { name: "Shilparamam", coordinates: { lat: 17.4529, lon: 78.3813 } },
  { name: "Tank Bund", coordinates: { lat: 17.4254, lon: 78.4718 } }
];

// Extract location information from AI text to create an activity with coordinates
const processLocationFromAI = (activityText: string): Activity => {
  // Default activity with placeholder
  let activity = {
    time: "12:00",
    title: "Explore Local Attraction",
    description: "Visit a local attraction and explore the area",
    location: "Hyderabad City Center",
    duration: "2 hours",
    cost: 500,
    tags: ["cultural", "sustainable"],
    coordinates: { lat: 17.3850, lon: 78.4867 } // Default Hyderabad coordinates
  };
  
  // Try to extract time
  const timeMatch = activityText.match(/(\d{1,2}:\d{2}(?: [AP]M)?)/i);
  if (timeMatch) {
    activity.time = timeMatch[1];
  }
  
  // Try to extract title
  const titleMatch = activityText.match(/^(.+?)(?:\n|Visit|Explore|at|in)/m);
  if (titleMatch && titleMatch[1].length < 100) {
    activity.title = titleMatch[1].trim();
  }
  
  // Try to extract description
  let description = "";
  const lines = activityText.split('\n').filter(line => line.trim().length > 0);
  if (lines.length > 1) {
    description = lines.slice(1).join(' ').substring(0, 200);
    activity.description = description;
  }
  
  // Try to extract location
  for (const landmark of hyderabadLandmarks) {
    if (activityText.includes(landmark.name)) {
      activity.location = landmark.name;
      activity.coordinates = landmark.coordinates;
      break;
    }
  }
  
  // Try to extract duration
  const durationMatch = activityText.match(/(\d+)\s*(hour|hr|minute|min)/i);
  if (durationMatch) {
    const value = durationMatch[1];
    const unit = durationMatch[2].toLowerCase().startsWith('h') ? 'hours' : 'minutes';
    activity.duration = `${value} ${unit}`;
  }
  
  // Try to extract cost
  const costMatch = activityText.match(/(?:₹|Rs\.?|Rupees?)\s*(\d+)/i);
  if (costMatch) {
    activity.cost = parseInt(costMatch[1]);
  }
  
  // Set some reasonable tags
  activity.tags = [];
  if (activityText.toLowerCase().includes('hike') || activityText.toLowerCase().includes('walk') || activityText.toLowerCase().includes('trek')) {
    activity.tags.push('hiking');
  }
  if (activityText.toLowerCase().includes('food') || activityText.toLowerCase().includes('eat') || activityText.toLowerCase().includes('restaurant')) {
    activity.tags.push('food');
  }
  if (activityText.toLowerCase().includes('museum') || activityText.toLowerCase().includes('heritage') || activityText.toLowerCase().includes('historical')) {
    activity.tags.push('cultural');
  }
  if (activityText.toLowerCase().includes('park') || activityText.toLowerCase().includes('garden') || activityText.toLowerCase().includes('lake')) {
    activity.tags.push('nature');
  }
  if (activity.tags.length === 0) {
    activity.tags.push('sightseeing');
  }
  
  return activity;
};

// Process AI-generated itinerary to make more diverse activities across days
const processItineraryDays = (aiResponseText: string, startDate: Date, endDate: Date): ItineraryDay[] => {
  // First check if this is Hyderabad trip (our structured data)
  if (aiResponseText.includes("Old City & Heritage Walk") && aiResponseText.includes("Charminar")) {
    // Use our parser for the structured Hyderabad mock data
    return parseHyderabadMockItinerary(
      aiResponseText, 
      startDate.toISOString().split('T')[0], 
      endDate.toISOString().split('T')[0]
    );
  }
  
  // For other locations, use the existing parser
  const days: ItineraryDay[] = [];
  const datePattern = /(\d{4}-\d{2}-\d{2})/;
  let activitySections = aiResponseText.split(/Day \d+:/);
  
  // Skip the first element if it's empty (usually is because of the split)
  if (!activitySections[0].trim()) {
    activitySections = activitySections.slice(1);
  }
  
  // Calculate trip duration
  const tripDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Create an array of diverse activity template sets
  const diverseActivities = [
    [
      { time: "8:00 AM", title: "Sunrise Yoga", location: "Local Park", type: "wellness" },
      { time: "10:00 AM", title: "Heritage Walk", location: "Old City", type: "cultural" },
      { time: "1:00 PM", title: "Organic Lunch", location: "Green Cafe", type: "food" },
      { time: "3:00 PM", title: "Craft Workshop", location: "Artisan Market", type: "craft" },
      { time: "6:00 PM", title: "Sustainable Dinner", location: "Farm-to-Table Restaurant", type: "food" }
    ],
    [
      { time: "9:00 AM", title: "Farmer's Market Visit", location: "Local Market", type: "shopping" },
      { time: "11:00 AM", title: "Museum Tour", location: "City Museum", type: "cultural" },
      { time: "1:30 PM", title: "Street Food Exploration", location: "Food District", type: "food" },
      { time: "4:00 PM", title: "Nature Walk", location: "Botanical Garden", type: "nature" },
      { time: "7:00 PM", title: "Cultural Performance", location: "Arts Center", type: "entertainment" }
    ],
    [
      { time: "8:30 AM", title: "Cycling Tour", location: "City Outskirts", type: "active" },
      { time: "11:30 AM", title: "Historical Site Visit", location: "Monument", type: "cultural" },
      { time: "2:00 PM", title: "Vegetarian Lunch", location: "Eco Restaurant", type: "food" },
      { time: "4:30 PM", title: "Sustainable Shopping", location: "Green Market", type: "shopping" },
      { time: "7:30 PM", title: "Stargazing", location: "Observatory", type: "nature" }
    ]
  ];
  
  // Create days with diverse activities if the AI response doesn't provide enough
  for (let i = 0; i < tripDuration; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateString = date.toISOString().split('T')[0];
    
    // Try to use AI-generated section if available
    let activities: Activity[] = [];
    if (i < activitySections.length) {
      const section = activitySections[i];
      
      // Extract activities
      const activityTexts = section.split(/\d{1,2}:\d{2}/);
      
      // Process each activity
      for (let j = 1; j < activityTexts.length; j++) {
        const activityText = `${activityTexts[j-1].match(/\d{1,2}:\d{2}/)?.[0] || ''} ${activityTexts[j]}`;
        activities.push(processLocationFromAI(activityText));
      }
    }
    
    // If no activities were found or fewer than 3, use template based on day index
    if (activities.length < 3) {
      const templateIndex = i % diverseActivities.length;
      const templates = diverseActivities[templateIndex];
      
      activities = templates.map(template => {
        // Find a matching landmark for the template
        const landmarks = [...hyderabadLandmarks];
        // Shuffle landmarks to get variety
        landmarks.sort(() => Math.random() - 0.5);
        const landmark = landmarks[0];
        
        return {
          time: template.time,
          title: template.title,
          description: `Enjoy a ${template.type} experience at ${landmark.name}`,
          location: landmark.name,
          duration: "2 hours",
          cost: Math.floor(Math.random() * 500) + 300,
          tags: [template.type, "sustainable"],
          coordinates: landmark.coordinates
        };
      });
    }
    
    days.push({
      day: i + 1,
      title: `Day ${i + 1} in Hyderabad`,
      date: dateString,
      activities: activities
    });
  }
  
  return days;
};

// Simulate AI planner API call
export const planTrip = async (
  title: string, 
  startLocation: string, 
  startDate: Date, 
  endDate: Date, 
  preferences: string[],
  budget?: number
): Promise<Trip> => {
  try {
    // Simulate API call with delay
    await apiDelay(1000);
    
    // Get the API key (now DeepSeek)
    const apiKey = getOpenAIApiKey();
    if (!apiKey && !startLocation.toLowerCase().includes('hyderabad')) {
      console.warn('DeepSeek API key not found. Using mock data instead.');
      const trip = generateAITrip(title, startLocation, startDate, endDate, preferences);
      saveTrip(trip as any);
      return trip;
    }
    
    // Get coordinates for the location to improve map visualization
    let coordinates = null;
    try {
      const geoData = await geocodeLocation(startLocation);
      if (geoData) {
        coordinates = geoData.coordinates;
      }
    } catch (error) {
      console.warn('Failed to geocode location:', error);
    }
    
    try {
      // Generate travel plan prompt with more specific details
      const promptContent = `Create a detailed sustainable travel itinerary for a trip to ${startLocation} with the following details:
        - Title: ${title}
        - Start date: ${startDate.toISOString().split('T')[0]}
        - End date: ${endDate.toISOString().split('T')[0]}
        - Budget: ${budget ? `₹${budget}` : 'Flexible'}
        - Preferences: ${preferences.join(', ')}
        
        For each day and each activity, provide:
        1. Real place names (specific landmarks, not generic places)
        2. Brief descriptions of what to do there
        3. Approximate cost in rupees
        4. Duration of activity
        5. Sustainable transportation options to get there
        
        IMPORTANT: Include ONLY real, existing places with their actual locations.
        Focus on cultural sites, sustainable tourism options, and authentic local experiences.
        
        Make sure each day has DIFFERENT activities than other days. Do not repeat the same activities every day.`;
      
      // Call the API to generate the travel plan
      const aiResponse = await generateSustainableTravelPlan(promptContent);
      
      // Process the response to extract days and activities with improved diversity
      const days = processItineraryDays(aiResponse, startDate, endDate);
      
      // Create map coordinates for all the locations
      const mapCoordinates: { name: string, lat: number, lon: number }[] = [];
      const locationsSeen = new Set();
      
      // For Hyderabad trips, use our pre-defined coordinates
      if (startLocation.toLowerCase().includes('hyderabad')) {
        // Add day-wise coordinates to map
        days.forEach((day, dayIndex) => {
          day.activities.forEach(activity => {
            if (activity.coordinates && !locationsSeen.has(activity.location)) {
              mapCoordinates.push({
                name: `Day ${dayIndex + 1}: ${activity.location}`,
                lat: activity.coordinates.lat,
                lon: activity.coordinates.lon
              });
              locationsSeen.add(activity.location);
            }
          });
        });
      } else {
        // For other locations, use the original method
        days.forEach(day => {
          day.activities.forEach(activity => {
            if (activity.coordinates && !locationsSeen.has(activity.location)) {
              mapCoordinates.push({
                name: activity.location,
                lat: activity.coordinates.lat,
                lon: activity.coordinates.lon
              });
              locationsSeen.add(activity.location);
            }
          });
        });
      }
      
      // If we have no valid locations, add some defaults
      if (mapCoordinates.length === 0) {
        // Add some of location's famous locations
        if (startLocation.toLowerCase().includes('hyderabad')) {
          // Use Hyderabad landmarks
          for (const landmark in hyderabadLandmarkCoordinates) {
            const coords = hyderabadLandmarkCoordinates[landmark];
            mapCoordinates.push({
              name: landmark,
              lat: coords.lat,
              lon: coords.lon
            });
            if (mapCoordinates.length >= 5) break;
          }
        } else {
          // Use generic landmarks
          hyderabadLandmarks.slice(0, 5).forEach(landmark => {
            mapCoordinates.push({
              name: landmark.name,
              lat: landmark.coordinates.lat,
              lon: landmark.coordinates.lon
            });
          });
        }
      }
      
      // Calculate total budget from activities
      let totalBudget = 0;
      days.forEach(day => {
        day.activities.forEach(activity => {
          if (activity.cost) {
            totalBudget += activity.cost;
          }
        });
      });
      
      // Create the final trip object
      const tripResponse: Trip = {
        id: `trip-${Date.now()}`,
        title: title,
        description: `AI-generated eco-friendly trip to ${startLocation} based on your sustainable travel preferences.`,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        locations: [startLocation],
        status: "upcoming",
        budget: budget || totalBudget || 10000,
        travelType: "leisure",
        travelers: 1,
        mapCoordinates: mapCoordinates,
        itinerary: days,
        carbonSaved: Math.floor(Math.random() * 200) + 100, // Random value between 100-300
        imageUrl: `https://source.unsplash.com/random/1920x1080/?${startLocation},landmark`
      };
      
      // Save trip to local storage
      saveTrip(tripResponse as any);
      return tripResponse;
    } catch (aiError) {
      console.error('Failed to generate trip with AI:', aiError);
      // Fallback to mock data
      const trip = generateAITrip(title, startLocation, startDate, endDate, preferences);
      saveTrip(trip);
      return trip;
    }
  } catch (error) {
    console.error('Failed to generate trip:', error);
    toast.error('Failed to generate trip. Please try again.');
    throw error;
  }
};

// Simulate getting air quality data for a location
export const getAirQuality = async (location: string) => {
  try {
    await apiDelay(800);
    return getAirQualityData(location);
  } catch (error) {
    console.error('Failed to fetch air quality data:', error);
    toast.error('Could not fetch air quality data');
    throw error;
  }
};

// Simulate getting carbon footprint for a journey
export const getCarbonFootprint = async (
  distance: number,
  transportMode: 'walk' | 'bike' | 'bus' | 'train' | 'car' | 'other'
) => {
  try {
    await apiDelay(600);
    return getCarbonFootprintEstimate(distance, transportMode);
  } catch (error) {
    console.error('Failed to calculate carbon footprint:', error);
    toast.error('Could not calculate carbon footprint');
    throw error;
  }
};

// Simulate getting sustainable venues near a location
export const getSustainableVenues = async (
  location: string,
  radius: number,
  types: string[] = [],
  maxBudget?: number
) => {
  try {
    await apiDelay(1000);
    
    // Filter venues based on type if provided
    let venues = [...mockSustainableVenues];
    
    if (types.length > 0) {
      venues = venues.filter(venue => 
        types.includes(venue.type)
      );
    }
    
    // Filter by budget if provided - need to check custom property for budget
    if (maxBudget) {
      venues = venues.filter(venue => {
        // Check if the venue has an estimated cost or use a default pricing mechanism
        const venueCost = venue.estimatedCost || 0;
        return !venueCost || venueCost <= maxBudget;
      });
    }
    
    // Randomize distance a bit to simulate different locations
    venues = venues.map(venue => ({
      ...venue,
      distance: `${(Math.random() * radius).toFixed(1)} miles`
    }));
    
    return venues;
  } catch (error) {
    console.error('Failed to fetch sustainable venues:', error);
    toast.error('Could not fetch sustainable venues');
    throw error;
  }
};
