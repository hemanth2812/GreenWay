
export interface GTFSStop {
  stop_id: string;
  stop_name: string;
  stop_desc?: string;
  stop_lat: number;
  stop_lon: number;
  routes?: string[];
}

export interface TransitInfo {
  schedule: string;
  carbonFootprint: number;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  locations: string[];
  carbonSaved: number;
  imageUrl: string;
  status: 'upcoming' | 'active' | 'completed';
  itinerary: ItineraryDay[];
  budget?: number;
  travelType?: string;
  travelers?: number;
  mapCoordinates?: any[];
}

export interface ItineraryDay {
  day?: number;
  title?: string;
  date: string;
  activities: Activity[];
}

export interface Activity {
  id?: string;
  time: string;
  title?: string;
  name?: string;
  location: string;
  description: string;
  transportMode?: 'walk' | 'bike' | 'bus' | 'train' | 'car' | 'other';
  transportDetails?: string;
  duration?: string;
  distance?: string;
  carbonFootprint?: number;
  sustainabilityScore?: number;
  cost?: number;
  tags?: string[];
  coordinates?: {
    lat: number;
    lon: number;
  };
  imageUrl?: string;
}
