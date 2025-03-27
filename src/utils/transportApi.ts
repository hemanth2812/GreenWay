import { toast } from 'sonner';
import { getTransportApiAppId, getTransportApiKey, setTransportApiAppId, setTransportApiKey } from './env';
import { findNearbyStops, findBestRoute } from './gtfsUtils';
import { hyderabadLandmarkCoordinates } from './openaiApi';

// Get Transport API credentials
export const getTransportApiCredentials = () => {
  const appId = getTransportApiAppId();
  const key = getTransportApiKey();
  return { appId, key };
};

// Set Transport API credentials
export const setTransportApiCredentials = (appId: string, key: string) => {
  setTransportApiAppId(appId);
  setTransportApiKey(key);
};

interface TransportOption {
  type: string;
  operator?: string;
  departure?: string;
  arrival?: string;
  duration?: string;
  carbonFootprint?: number;
  price?: string;
  route?: string;
  mapPath?: Array<[number, number]>;
}

export const getPublicTransportOptions = async (
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): Promise<TransportOption[]> => {
  const { appId, key } = getTransportApiCredentials();
  
  try {
    // Check if this is in Hyderabad by checking if coordinates are within Hyderabad bounds
    const isHyderabad = 
      fromLat > 17.2 && fromLat < 17.6 && 
      fromLon > 78.2 && fromLon < 78.7;
    
    if (isHyderabad) {
      // For Hyderabad, provide structured transport options based on mock data
      const options: TransportOption[] = [];
      
      // Create Metro option
      options.push({
        type: 'train',
        operator: 'Hyderabad Metro Rail',
        departure: '08:30 AM',
        arrival: '09:10 AM',
        duration: '40 min',
        carbonFootprint: 0.5,
        price: '₹45',
        route: 'Blue Line',
        mapPath: [
          [fromLat, fromLon],
          [17.4355, 78.4477], // Random point for route curvature
          [toLat, toLon]
        ]
      });
      
      // Create Bus option
      options.push({
        type: 'bus',
        operator: 'TSRTC City Bus',
        departure: '08:15 AM',
        arrival: '09:05 AM',
        duration: '50 min',
        carbonFootprint: 1.2,
        price: '₹35',
        route: 'City Route 216',
        mapPath: [
          [fromLat, fromLon],
          [17.4155, 78.4577], // Random point for route variation
          [17.4255, 78.4377], // Another random point
          [toLat, toLon]
        ]
      });
      
      // Create bike option (electric bike sharing)
      options.push({
        type: 'bike',
        operator: 'Hyderabad Bike Share',
        departure: 'Flexible',
        arrival: 'Flexible',
        duration: '30 min',
        carbonFootprint: 0,
        price: '₹60 (all day pass)',
        route: 'Cycling Lane Network',
        mapPath: [
          [fromLat, fromLon],
          [toLat, toLon]
        ]
      });
      
      // Create walking option
      options.push({
        type: 'walk',
        duration: '60 min',
        carbonFootprint: 0,
        price: 'Free',
        route: 'Walking Path',
        mapPath: [
          [fromLat, fromLon],
          [toLat, toLon]
        ]
      });
      
      // Create a shared electric car option
      options.push({
        type: 'car',
        operator: 'Sustainable Ride Share',
        departure: 'On Demand',
        arrival: 'On Demand',
        duration: '25 min',
        carbonFootprint: 0.8,
        price: '₹150',
        route: 'Direct Route',
        mapPath: [
          [fromLat, fromLon],
          [17.4055, 78.4577], // Random point for route variation
          [toLat, toLon]
        ]
      });
      
      return options;
    }
    
    // For non-Hyderabad locations, use original code
    // Find nearby metro stops
    const fromStops = findNearbyStops(fromLat, fromLon);
    const toStops = findNearbyStops(toLat, toLon);
    
    // Generate transport options
    const options: TransportOption[] = [];
    
    // Add metro options if stops are found
    if (fromStops.length > 0 && toStops.length > 0) {
      const route = findBestRoute(fromStops[0], toStops[0]);
      if (route) {
        options.push({
          type: 'train',
          operator: 'Metro',
          departure: '08:30',
          arrival: '09:00',
          duration: `${route.duration} min`,
          carbonFootprint: 0.5,
          price: `₹${route.fare}`,
          route: route.route.route_name,
          mapPath: [
            [fromStops[0].stop_lat, fromStops[0].stop_lon],
            [toStops[0].stop_lat, toStops[0].stop_lon]
          ]
        });
      }
    }
    
    // Add mock bus option
    options.push({
      type: 'bus',
      operator: 'City Transit',
      departure: '08:15',
      arrival: '09:00',
      duration: '45 min',
      carbonFootprint: 1.2,
      price: '₹35',
      route: 'City Bus 5',
      mapPath: [
        [fromLat, fromLon],
        [fromLat + 0.01, fromLon + 0.01],
        [toLat, toLon]
      ]
    });
    
    // Add bike option
    options.push({
      type: 'bike',
      duration: '30 min',
      carbonFootprint: 0,
      price: 'Free',
      route: 'Bike Path',
      mapPath: [
        [fromLat, fromLon],
        [toLat, toLon]
      ]
    });
    
    // Add walking option
    options.push({
      type: 'walk',
      duration: '1h 10min',
      carbonFootprint: 0,
      price: 'Free',
      route: 'Walking Path',
      mapPath: [
        [fromLat, fromLon],
        [toLat, toLon]
      ]
    });
    
    return options;
    
  } catch (error) {
    console.error('Transport API error:', error);
    toast.error('Failed to get public transport options');
    
    // Return basic mock data in case of error
    return getMockTransportOptions(fromLat, fromLon, toLat, toLon);
  }
};

// Mock data for development
function getMockTransportOptions(
  fromLat: number,
  fromLon: number,
  toLat: number, 
  toLon: number
): TransportOption[] {
  return [
    {
      type: 'bus',
      operator: 'City Transit',
      departure: '08:15',
      arrival: '08:45',
      duration: '30 min',
      carbonFootprint: 1.2,
      price: '₹30',
      route: 'Route 42',
      mapPath: [
        [fromLat, fromLon],
        [fromLat + 0.005, fromLon + 0.005],
        [toLat, toLon]
      ]
    },
    {
      type: 'train',
      operator: 'Metro Rail',
      departure: '08:05',
      arrival: '08:35',
      duration: '30 min',
      carbonFootprint: 0.8,
      price: '₹25',
      route: 'Blue Line',
      mapPath: [
        [fromLat, fromLon],
        [toLat, toLon]
      ]
    },
    {
      type: 'bike',
      duration: '45 min',
      carbonFootprint: 0,
      price: 'Free',
      route: 'Bike Path B',
      mapPath: [
        [fromLat, fromLon],
        [toLat, toLon]
      ]
    },
    {
      type: 'walk',
      duration: '1h 20min',
      carbonFootprint: 0,
      price: 'Free',
      route: 'Pedestrian Route',
      mapPath: [
        [fromLat, fromLon],
        [toLat, toLon]
      ]
    }
  ];
}
