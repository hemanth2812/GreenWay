
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud } from 'lucide-react';

interface AirQualityData {
  aqi: number;
  status: string;
  pollutants: {
    pm25: number;
    o3: number;
  };
}

interface AirQualityCardProps {
  airQuality: AirQualityData | null;
}

const AirQualityCard = ({ airQuality }: AirQualityCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
        return 'bg-green-100 text-green-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Air Quality</CardTitle>
        <CardDescription>Current conditions</CardDescription>
      </CardHeader>
      <CardContent>
        {airQuality ? (
          <div>
            <div className="flex items-center mb-2">
              <Cloud className="h-5 w-5 mr-2" />
              <span className="font-medium">AQI: {airQuality.aqi}</span>
              <span 
                className={`ml-2 text-sm px-2 py-0.5 rounded-full ${getStatusColor(airQuality.status)}`}
              >
                {airQuality.status}
              </span>
            </div>
            {/* Add null check for pollutants */}
            {airQuality.pollutants && (
              <>
                <p className="text-sm text-foreground/80">PM2.5: {airQuality.pollutants.pm25} µg/m³</p>
                <p className="text-sm text-foreground/80">O3: {airQuality.pollutants.o3} ppb</p>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-foreground/80">Loading air quality data...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AirQualityCard;
