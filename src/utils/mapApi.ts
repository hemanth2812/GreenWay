
import { toast } from 'sonner';

interface Coordinates {
  lat: number;
  lon: number;
}

interface LocationData {
  name: string;
  coordinates: Coordinates;
  address?: {
    city?: string;
    country?: string;
    state?: string;
    road?: string;
    postcode?: string;
  };
}

// Default center coordinates for India
export const INDIA_DEFAULT_COORDINATES = {
  lat: 20.5937,
  lon: 78.9629
};

// Geocoding API (using Nominatim for OpenStreetMap)
export const geocodeLocation = async (locationName: string): Promise<LocationData | null> => {
  try {
    // Add India to the search query for better results if not already specified
    const searchQuery = locationName.toLowerCase().includes('india') 
      ? locationName 
      : `${locationName}, India`;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchQuery
      )}&format=json&limit=1&countrycodes=in`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'GreenWay-SustainableTravel-App'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to geocode location');
    }

    const data = await response.json();
    
    if (data.length === 0) {
      console.log('No results found for:', searchQuery);
      return null;
    }

    const result = data[0];
    return {
      name: result.display_name,
      coordinates: {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon)
      },
      address: {
        city: result.address?.city || result.address?.town,
        country: result.address?.country,
        state: result.address?.state,
        road: result.address?.road,
        postcode: result.address?.postcode
      }
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Reverse geocoding - from coordinates to address
export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<LocationData | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'GreenWay-SustainableTravel-App'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to reverse geocode location');
    }

    const data = await response.json();
    
    return {
      name: data.display_name,
      coordinates: { lat, lon },
      address: data.address
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};
