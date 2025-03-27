
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bike, CarFront } from 'lucide-react';

const SustainableTransportCard = () => {
  return (
    <Card className="glass-card col-span-1 md:col-span-2 lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Sustainable Transport Options</CardTitle>
        <CardDescription>Eco-friendly ways to get around</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50">
            <div className="bg-green-100 p-2 rounded-full">
              <Bike className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">Bike Share</h4>
              <p className="text-sm text-foreground/80">3 stations nearby</p>
              <p className="text-xs text-foreground/70">15 bikes available</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Public Transit</h4>
              <p className="text-sm text-foreground/80">Bus Route 42 in 5 min</p>
              <p className="text-xs text-foreground/70">Train Line B in 12 min</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-teal-50">
            <div className="bg-teal-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-teal-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Walking Routes</h4>
              <p className="text-sm text-foreground/80">4 green routes nearby</p>
              <p className="text-xs text-foreground/70">Park path less crowded now</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50">
            <div className="bg-purple-100 p-2 rounded-full">
              <CarFront className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium">Carpool/EV</h4>
              <p className="text-sm text-foreground/80">3 carpools available</p>
              <p className="text-xs text-foreground/70">5 EV charging stations</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/planner" className="text-sm text-primary hover:underline">
          Plan a sustainable route
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SustainableTransportCard;
