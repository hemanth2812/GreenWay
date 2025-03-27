import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, NavigationIcon } from 'lucide-react';
import { format, isFuture, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { getSavedTrips } from '@/utils/mockData';
import { Trip } from '@/types';

const MyTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Get trips from local storage or API
    const savedTrips = getSavedTrips();
    setTrips(savedTrips);
    setLoading(false);
  }, []);

  // Filter trips based on selected filter and search query
  const filteredTrips = trips.filter(trip => {
    const matchesFilter = 
      filter === 'all' ? true : 
      filter === 'upcoming' ? isFuture(new Date(trip.startDate)) : 
      isPast(new Date(trip.endDate));
    
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         trip.locations.some(location => location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 page-transition">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Trips</h1>
          <p className="text-foreground/80">
            View and manage all your sustainable travel plans
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link to="/planner">
            <Button className="button-primary">Plan New Trip</Button>
          </Link>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              filter === 'all' 
                ? "bg-green-50 text-green-700" 
                : "bg-white text-foreground/70 hover:bg-gray-50"
            )}
          >
            All Trips
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              filter === 'upcoming' 
                ? "bg-green-50 text-green-700" 
                : "bg-white text-foreground/70 hover:bg-gray-50"
            )}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              filter === 'past' 
                ? "bg-green-50 text-green-700" 
                : "bg-white text-foreground/70 hover:bg-gray-50"
            )}
          >
            Past
          </button>
        </div>
        
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/40"
            />
            <button className="absolute right-2 top-2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Trips display */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Link to={`/trips/${trip.id}`} key={trip.id}>
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-elevation hover:translate-y-[-4px]">
                <div className="relative h-48">
                  <img
                    src={trip.imageUrl}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white text-xl font-bold mb-1">{trip.title}</h3>
                    <div className="flex items-center text-white/90 text-sm">
                      <NavigationIcon className="w-4 h-4 mr-1" />
                      <span>{trip.locations[0]}</span>
                    </div>
                  </div>
                  
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      isFuture(new Date(trip.startDate))
                        ? "bg-green-100 text-green-800"
                        : isPast(new Date(trip.endDate))
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-100 text-blue-800"
                    )}>
                      {isFuture(new Date(trip.startDate))
                        ? "Upcoming"
                        : isPast(new Date(trip.endDate))
                        ? "Past"
                        : "Active"}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center text-sm text-foreground/80 mb-3">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>
                      {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <p className="text-foreground/80 text-sm mb-3 line-clamp-2">{trip.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-600 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598-.542 1.865-1.345l.215-.688c.082-.264.418-.406.675-.22l.001.001c.245.176.356.505.27.8l-.001.002-.278.903c-.293.95.055 1.96.94 2.418.349.18.648.29.956.29.308 0 .584-.11.851-.29.974-.456 1.333-1.463 1.057-2.41l-.276-.903c-.086-.296.024-.625.27-.801l.001-.001c.257-.185.593-.043.675.221l.214.687c.267.803 1.02 1.345 1.866 1.345.48 0 .89-.347.97-.821l.073-.438c.094-.565-.25-1.11-.8-1.267l-.99-.282a1.586 1.586 0 01-.982-.816l-.036-.073a1.453 1.453 0 00-2.328-.377L16.5 15h-.628a2.25 2.25 0 00-2.223 1.892l-.176.529m0 0H6.75M4.5 15.75l-.612.153c-.5.125-.826.6-.826 1.114 0 .568.335 1.079.871 1.248h.01z" />
                      </svg>
                      <span className="text-green-700">
                        {trip.carbonSaved} kg CO₂ saved
                      </span>
                    </div>
                    
                    <span className="text-primary text-sm font-medium">View details</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No trips found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? "No trips match your search criteria" 
              : "You haven't planned any trips yet"}
          </p>
          <Link to="/planner">
            <Button className="button-primary">Plan Your First Trip</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyTrips;
