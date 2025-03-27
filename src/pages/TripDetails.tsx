
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Bike, 
  Train, 
  Bus,
  Car,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { findTripById } from '@/utils/mockData';
import { Trip } from '@/types';
import SimpleMap from '@/components/map/SimpleMap';
import { getAirQualityForLocation } from '@/utils/airQualityApi';
import { getPublicTransportOptions } from '@/utils/transportApi';
import { geocodeLocation } from '@/utils/mapApi';

const TripDetails = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { updateGreenScore } = useAuth();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [airQuality, setAirQuality] = useState(null);
  const [transportOptions, setTransportOptions] = useState([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([17.3850, 78.4867]); // Default to Hyderabad
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);
  const [mapRoutes, setMapRoutes] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedTransportOption, setSelectedTransportOption] = useState<any>(null);
  
  const focusMapOnLocation = (locationName: string, lat: number, lon: number) => {
    setSelectedLocation(locationName);
    setMapCenter([lat, lon]);
    
    const updatedMarkers = mapMarkers.map(marker => {
      if (marker.position[0] === lat && marker.position[1] === lon) {
        return {
          ...marker,
          highlighted: true
        };
      }
      return {
        ...marker,
        highlighted: false
      };
    });
    
    setMapMarkers(updatedMarkers);
    
    const mapElement = document.querySelector('.trip-map-section');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    toast.info(`Showing ${locationName} on the map`);
  };
  
  useEffect(() => {
    const loadTripDetails = async () => {
      try {
        if (!tripId) return;
        
        const tripData = findTripById(tripId);
        setTrip(tripData);
        
        if (!tripData) {
          setLoading(false);
          return;
        }
        
        let markers: any[] = [];
        let routes: any[] = [];
        let mainLocation = tripData.locations[0];
        
        if (tripData.mapCoordinates && tripData.mapCoordinates.length > 0) {
          tripData.mapCoordinates.forEach((location: any) => {
            markers.push({
              position: [location.lat, location.lon] as [number, number],
              popupContent: location.name,
              highlighted: false
            });
          });
          
          setMapCenter([tripData.mapCoordinates[0].lat, tripData.mapCoordinates[0].lon]);
        } else {
          try {
            const mainLocationData = await geocodeLocation(mainLocation);
            if (mainLocationData && mainLocationData.coordinates) {
              markers.push({
                position: [mainLocationData.coordinates.lat, mainLocationData.coordinates.lon] as [number, number],
                popupContent: mainLocation,
                highlighted: false
              });
              
              setMapCenter([mainLocationData.coordinates.lat, mainLocationData.coordinates.lon]);
            }
          } catch (error) {
            console.error('Failed to geocode location:', error);
          }
        }
        
        if (tripData.itinerary) {
          const activityCoordinates: any[] = [];
          
          tripData.itinerary.forEach((day: any) => {
            day.activities.forEach((activity: any) => {
              if (activity.coordinates) {
                activityCoordinates.push({
                  position: [activity.coordinates.lat, activity.coordinates.lon] as [number, number],
                  popupContent: `${activity.title} at ${activity.location}`,
                  highlighted: false
                });
              }
            });
          });
          
          activityCoordinates.forEach(coord => {
            const exists = markers.some(marker => 
              marker.position[0] === coord.position[0] && 
              marker.position[1] === coord.position[1]
            );
            
            if (!exists) {
              markers.push(coord);
            }
          });
          
          if (activityCoordinates.length >= 2) {
            const routePoints = activityCoordinates.map(marker => marker.position);
            
            routes.push({
              points: routePoints,
              color: '#10b981',
              weight: 4,
              popup: 'Trip Route'
            });
          }
        }
        
        setMapMarkers(markers);
        setMapRoutes(routes);
        
        if (markers.length > 0) {
          const [lat, lon] = markers[0].position;
          const airQualityData = await getAirQualityForLocation(lat, lon);
          setAirQuality(airQualityData);
          
          if (markers.length >= 2) {
            const [fromLat, fromLon] = markers[0].position;
            const [toLat, toLon] = markers[1].position;
            
            const transportData = await getPublicTransportOptions(
              fromLat,
              fromLon,
              toLat,
              toLon
            );
            
            const transportOptionsWithRoutes = transportData.map(option => {
              if (option.mapPath) {
                routes.push({
                  points: option.mapPath,
                  color: option.type === 'train' ? '#3b82f6' : 
                         option.type === 'bus' ? '#f59e0b' : 
                         option.type === 'bike' ? '#10b981' : '#6b7280',
                  weight: 3,
                  popup: `${option.type}: ${option.route}`
                });
              }
              return option;
            });
            
            setTransportOptions(transportOptionsWithRoutes);
            setMapRoutes(routes);
          }
        }
      } catch (error) {
        console.error('Error loading trip details:', error);
        toast.error('Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };
    
    loadTripDetails();
  }, [tripId]);
  
  const handleShareTrip = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Trip link copied to clipboard!');
  };
  
  const handleSaveToFavorites = () => {
    updateGreenScore(10);
    toast.success('Trip saved to favorites and you earned 10 green points!');
  };
  
  const handleViewTransportRoute = (option: any) => {
    setSelectedTransportOption(option);
    
    if (option.mapPath) {
      const newRoutes = [...mapRoutes];
      const filteredRoutes = newRoutes.filter(route => !route.isTransportRoute);
      
      filteredRoutes.push({
        points: option.mapPath,
        color: option.type === 'train' ? '#3b82f6' : 
               option.type === 'bus' ? '#f59e0b' : 
               option.type === 'bike' ? '#10b981' : '#6b7280',
        weight: 5,
        popup: `${option.type}: ${option.route}`,
        isTransportRoute: true,
        highlighted: true
      });
      
      setMapRoutes(filteredRoutes);
      
      const mapElement = document.querySelector('.trip-map-section');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  const handleSelectTransport = (option: any) => {
    toast.success(`Selected ${option.type} as your transport option`);
    updateGreenScore(option.type === 'bike' || option.type === 'walk' ? 15 : 5);
    setSelectedTransportOption(option);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-foreground/80">Loading trip details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!trip) {
    return (
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Trip Not Found</h2>
          <p className="mb-8 text-foreground/80">The trip you're looking for doesn't exist or has been removed.</p>
          <Link to="/trips">
            <Button>Back to My Trips</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 page-transition">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <div className="flex items-center mb-2">
            <Link to="/trips" className="text-primary hover:underline mr-2">
              My Trips
            </Link>
            <span className="text-foreground/50">/</span>
            <span className="ml-2 text-foreground/80">{trip.title}</span>
          </div>
          <h1 className="text-3xl font-bold">{trip.title}</h1>
          <div className="flex flex-wrap items-center mt-2 text-foreground/80">
            <div className="flex items-center mr-4 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{trip.startDate} - {trip.endDate}</span>
            </div>
            <div className="flex items-center mr-4 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{trip.locations.join(' • ')}</span>
            </div>
            <div className="flex items-center mb-2">
              <Users className="h-4 w-4 mr-1" />
              <span>{trip.travelers || 1} {trip.travelers === 1 ? 'traveler' : 'travelers'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex mt-4 md:mt-0 space-x-2">
          <Button variant="outline" onClick={handleShareTrip}>
            Share Trip
          </Button>
          <Button onClick={handleSaveToFavorites}>
            <Star className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      
      <Card className="mb-8 trip-map-section">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Trip Map</CardTitle>
          <CardDescription>
            {selectedLocation ? `Showing: ${selectedLocation}` : "Visual overview of your journey"}
            {selectedTransportOption && ` - Transport: ${selectedTransportOption.type} (${selectedTransportOption.route})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleMap
            center={mapCenter}
            zoom={13}
            markers={mapMarkers}
            routes={mapRoutes}
            className="rounded-lg border border-gray-100"
            style={{ height: '400px' }}
          />
        </CardContent>
      </Card>
      
      <Tabs defaultValue="itinerary">
        <TabsList className="mb-6">
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="transport">Transport Options</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>
        
        <TabsContent value="itinerary" className="space-y-6">
          {trip.itinerary && trip.itinerary.map((day: any, index: number) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  Day {index + 1}: {day.title}
                </CardTitle>
                <CardDescription>{day.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {day.activities && day.activities.map((activity: any, activityIndex: number) => (
                    <div key={activityIndex} className="flex border-l-2 border-green-400 pl-4">
                      <div className="min-w-[80px] text-foreground/70">
                        {activity.time}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-foreground/80">{activity.description}</p>
                        
                        {activity.location && (
                          <div className="flex items-center mt-1 text-xs text-foreground/70">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{activity.location}</span>
                            {activity.coordinates && (
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="h-auto p-0 ml-2 text-xs text-primary"
                                onClick={() => focusMapOnLocation(
                                  activity.location,
                                  activity.coordinates.lat,
                                  activity.coordinates.lon
                                )}
                              >
                                Show on map
                              </Button>
                            )}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-x-3 mt-1">
                          {activity.duration && (
                            <div className="flex items-center text-xs text-foreground/70">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{activity.duration}</span>
                            </div>
                          )}
                          
                          {activity.cost && (
                            <div className="flex items-center text-xs text-foreground/70">
                              <span>₹{activity.cost}</span>
                            </div>
                          )}
                        </div>
                        
                        {activity.tags && activity.tags.length > 0 && (
                          <div className="mt-2">
                            {activity.tags.map((tag: string, tagIndex: number) => (
                              <Badge key={tagIndex} variant="outline" className="mr-1 mb-1">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="transport">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportOptions.map((option: any, index: number) => (
              <Card key={index} className={`overflow-hidden ${selectedTransportOption === option ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {option.type === 'bus' && (
                          <div className="bg-amber-100 p-2 rounded-full mr-3">
                            <Bus className="h-5 w-5 text-amber-600" />
                          </div>
                        )}
                        {option.type === 'train' && (
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Train className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        {option.type === 'bike' && (
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <Bike className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                        {option.type === 'car' && (
                          <div className="bg-gray-100 p-2 rounded-full mr-3">
                            <Car className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                        
                        <div>
                          <h3 className="font-medium capitalize">{option.type}</h3>
                          {option.operator && (
                            <p className="text-sm text-foreground/80">{option.operator}</p>
                          )}
                        </div>
                      </div>
                      
                      <Badge variant="outline">
                        {option.carbonFootprint === 0 
                          ? 'Zero Emission' 
                          : `${option.carbonFootprint} kg CO₂`}
                      </Badge>
                    </div>
                    
                    {(option.departure && option.arrival) && (
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{option.departure}</div>
                          <div className="text-xs text-foreground/70">Departure</div>
                        </div>
                        
                        <div className="flex-1 px-2">
                          <div className="relative flex items-center">
                            <div className="flex-grow border-t border-dashed border-gray-300"></div>
                            <div className="mx-2 text-foreground/70">{option.duration}</div>
                            <div className="flex-grow border-t border-dashed border-gray-300"></div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="font-medium">{option.arrival}</div>
                          <div className="text-xs text-foreground/70">Arrival</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      {option.price && (
                        <div>
                          <span className="text-foreground/70">Price:</span> {option.price}
                        </div>
                      )}
                      
                      {option.route && (
                        <div>
                          <span className="text-foreground/70">Route:</span> {option.route}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 p-2 bg-gray-50">
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewTransportRoute(option)}
                      >
                        View Route
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => handleSelectTransport(option)}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sustainability">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Estimated Carbon Footprint</CardTitle>
                <CardDescription>Based on your chosen transportation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <Bike className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Cycling</h4>
                        <p className="text-sm text-foreground/80">0 kg CO₂</p>
                      </div>
                    </div>
                    <Badge variant="outline">Best Choice</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Train className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Public Transit</h4>
                        <p className="text-sm text-foreground/80">1.5 kg CO₂</p>
                      </div>
                    </div>
                    <Badge variant="outline">Good Choice</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <Car className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Car (Gasoline)</h4>
                        <p className="text-sm text-foreground/80">12.8 kg CO₂</p>
                      </div>
                    </div>
                    <Badge variant="destructive">High Impact</Badge>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-foreground/80">
                    By choosing sustainable options, you could save up to 11.3 kg of CO₂ emissions on this trip.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Air Quality Information</CardTitle>
                <CardDescription>Current conditions at your destination</CardDescription>
              </CardHeader>
              <CardContent>
                {airQuality ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">{airQuality.aqi}</h3>
                        <p className="text-sm">Air Quality Index</p>
                      </div>
                      <Badge 
                        className={`text-sm px-3 py-1 ${
                          airQuality.status === 'Good' 
                            ? 'bg-green-100 text-green-800' 
                            : airQuality.status === 'Moderate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {airQuality.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="text-sm font-medium text-green-800">PM2.5</h4>
                        <p className="text-xl font-bold">{airQuality.pollutants.pm25} µg/m³</p>
                        <p className="text-xs text-foreground/70">Fine particulate matter</p>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800">O3</h4>
                        <p className="text-xl font-bold">{airQuality.pollutants.o3} ppb</p>
                        <p className="text-xs text-foreground/70">Ozone level</p>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium">Health Recommendations:</p>
                      {airQuality.status === 'Good' ? (
                        <p className="mt-1 text-foreground/80">
                          Air quality is considered satisfactory, and air pollution poses little or no risk.
                        </p>
                      ) : airQuality.status === 'Moderate' ? (
                        <p className="mt-1 text-foreground/80">
                          Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.
                        </p>
                      ) : (
                        <p className="mt-1 text-foreground/80">
                          Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-foreground/80">Loading air quality data...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripDetails;
