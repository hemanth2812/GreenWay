
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { shouldShowNotifications } from '@/utils/api';

interface TripData {
  id: string | number;
  title: string;
  startDate: string;
  locations: string[];
  status: string;
}

interface NextTripCardProps {
  nextTrip: TripData | null;
}

const NextTripCard = ({ nextTrip }: NextTripCardProps) => {
  // Use the shouldShowNotifications function to determine if we should show notifications
  const showNotifications = nextTrip ? shouldShowNotifications(nextTrip.status) : true;
  
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Next Trip</CardTitle>
        <CardDescription>Your upcoming journey</CardDescription>
      </CardHeader>
      <CardContent>
        {nextTrip ? (
          <div>
            <div className="mb-3 font-medium">{nextTrip.title}</div>
            <div className="flex items-center text-sm text-foreground/80 mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{nextTrip.startDate}</span>
            </div>
            <div className="flex items-center text-sm text-foreground/80">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{nextTrip.locations[0]}</span>
            </div>
            {!showNotifications && (
              <div className="mt-2 text-xs bg-yellow-50 text-yellow-700 p-2 rounded">
                Notifications paused during active trip
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-foreground/80 mb-2">No upcoming trips</p>
            <Link to="/planner">
              <Button variant="outline" className="text-sm">Plan a Trip</Button>
            </Link>
          </div>
        )}
      </CardContent>
      {nextTrip && (
        <CardFooter>
          <Link to={`/trips/${nextTrip.id}`} className="text-sm text-primary hover:underline">
            View trip details
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default NextTripCard;
