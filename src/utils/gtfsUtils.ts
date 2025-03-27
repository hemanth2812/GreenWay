
import { GTFSStop, TransitInfo } from '@/types';

// Simulated GTFS data for Hyderabad Metro
const GTFS_DATA = {
  stops: [
    {
      stop_id: "MGBS",
      stop_name: "MGBS Metro Station",
      stop_lat: 17.3784,
      stop_lon: 78.4839
    },
    {
      stop_id: "JUBS",
      stop_name: "JBS Metro Station",
      stop_lat: 17.4489,
      stop_lon: 78.4994
    },
    {
      stop_id: "PARA",
      stop_name: "Paradise Metro Station",
      stop_lat: 17.4374,
      stop_lon: 78.4977
    },
    {
      stop_id: "AMEERPET",
      stop_name: "Ameerpet Metro Station",
      stop_lat: 17.4374,
      stop_lon: 78.4484
    },
    {
      stop_id: "MIYAPUR",
      stop_name: "Miyapur Metro Station",
      stop_lat: 17.4969,
      stop_lon: 78.3715
    }
  ],
  routes: [
    {
      route_id: "RED",
      route_name: "Red Line",
      stops: ["MGBS", "JUBS"]
    },
    {
      route_id: "BLUE",
      route_name: "Blue Line",
      stops: ["AMEERPET", "MIYAPUR"]
    },
    {
      route_id: "GREEN",
      route_name: "Green Line",
      stops: ["PARA", "AMEERPET"]
    }
  ],
  fares: {
    base: 10,
    perKm: 2
  }
};

export interface GTFSRoute {
  route_id: string;
  route_name: string;
  stops: string[];
}

export interface TransitRoute {
  route: GTFSRoute;
  distance: number;
  fare: number;
  duration: number;
}

export const loadGTFSData = async (): Promise<Blob | null> => {
  try {
    const response = await fetch("/gtfs/Telangana_opendata_gtfs_hmrl__March_2025.zip");
    
    if (!response.ok) {
      throw new Error(`GTFS file fetch failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    console.log("✅ GTFS File Loaded:", blob);
    return blob;
  } catch (error) {
    console.error("❌ GTFS Load Error:", error);
    return null;
  }
};

export const getGTFSData = async () => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return GTFS_DATA;
};

export const findNearbyStops = (lat: number, lon: number, radius: number = 2): GTFSStop[] => {
  // Calculate distances using Haversine formula
  const R = 6371; // Earth's radius in km
  return GTFS_DATA.stops.filter(stop => {
    const dLat = (stop.stop_lat - lat) * Math.PI / 180;
    const dLon = (stop.stop_lon - lon) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat * Math.PI / 180) * Math.cos(stop.stop_lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance <= radius;
  });
};

export const findBestRoute = (fromStop: GTFSStop, toStop: GTFSStop) => {
  // Find routes containing these stops
  const routes = GTFS_DATA.routes.filter(route => 
    route.stops.includes(fromStop.stop_id) && route.stops.includes(toStop.stop_id)
  );

  if (routes.length === 0) return null;

  // Calculate distance
  const R = 6371; // Earth's radius in km
  const dLat = (toStop.stop_lat - fromStop.stop_lat) * Math.PI / 180;
  const dLon = (toStop.stop_lon - fromStop.stop_lon) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(fromStop.stop_lat * Math.PI / 180) * Math.cos(toStop.stop_lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  // Calculate fare
  const fare = Math.ceil(GTFS_DATA.fares.base + (distance * GTFS_DATA.fares.perKm));

  return {
    route: routes[0],
    distance,
    fare,
    duration: Math.ceil(distance * 3) // Rough estimate: 3 minutes per km
  };
};

export const getNearbyTransitStops = async (lat: number, lon: number): Promise<GTFSStop[]> => {
  // Mock data for nearby transit stops
  return [
    {
      stop_id: "1",
      stop_name: "Downtown Station",
      stop_desc: "Main transit hub",
      stop_lat: lat + 0.01,
      stop_lon: lon + 0.01,
      routes: ["Bus 1", "Train A"]
    },
    {
      stop_id: "2",
      stop_name: "Market Street",
      stop_desc: "Shopping district stop",
      stop_lat: lat - 0.01,
      stop_lon: lon - 0.01,
      routes: ["Bus 2", "Bus 3"]
    }
  ];
};

export const getTransitInfo = async (stopId: string): Promise<TransitInfo> => {
  // Mock transit schedule and carbon footprint data
  return {
    schedule: "Every 15 minutes from 6 AM to 10 PM",
    carbonFootprint: 0.5 // kg CO2 per trip
  };
};
