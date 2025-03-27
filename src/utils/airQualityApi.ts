
import { toast } from 'sonner';

// Air Quality API configuration
let airQualityApiKey = '';

export const setAirQualityApiKey = (key: string) => {
  airQualityApiKey = key;
  localStorage.setItem('air_quality_api_key', key);
};

export const getAirQualityApiKey = (): string => {
  if (!airQualityApiKey) {
    airQualityApiKey = localStorage.getItem('air_quality_api_key') || '';
  }
  return airQualityApiKey;
};

export interface AirQualityData {
  aqi: number;
  status: string;
  pollutants: {
    pm25: number;
    o3: number;
    no2?: number;
    so2?: number;
    co?: number;
  };
  location: string;
  timestamp: string;
}

export const getAirQualityForLocation = async (
  lat: number,
  lon: number
): Promise<AirQualityData> => {
  const apiKey = getAirQualityApiKey();
  
  if (!apiKey) {
    toast.error('Air Quality API key is not configured');
    return getMockAirQualityData(); // Return mock data if API key not available
  }

  try {
    // In a real application, you would make an actual API call here
    // This is a placeholder for the real Air Quality API implementation
    
    // For demo purposes, we're returning mock data
    return getMockAirQualityData();
    
    /* Real implementation would look something like:
    const response = await fetch(
      `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch air quality data');
    }
    
    const data = await response.json();
    
    // Process and return the air quality data
    return {
      aqi: data.data.aqi,
      status: getAirQualityStatus(data.data.aqi),
      pollutants: {
        pm25: data.data.iaqi.pm25?.v || 0,
        o3: data.data.iaqi.o3?.v || 0,
        no2: data.data.iaqi.no2?.v || 0,
        so2: data.data.iaqi.so2?.v || 0,
        co: data.data.iaqi.co?.v || 0
      },
      location: data.data.city.name,
      timestamp: data.data.time.iso
    };
    */
  } catch (error) {
    console.error('Air Quality API error:', error);
    toast.error('Failed to get air quality data');
    
    // Return mock data in case of error
    return getMockAirQualityData();
  }
};

// Get air quality status based on AQI value
function getAirQualityStatus(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

// Mock data for development
function getMockAirQualityData(): AirQualityData {
  return {
    aqi: 42,
    status: 'Good',
    pollutants: {
      pm25: 12.5,
      o3: 68,
      no2: 15,
      so2: 3,
      co: 0.5
    },
    location: 'Sample City',
    timestamp: new Date().toISOString()
  };
}
