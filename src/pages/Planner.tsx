
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, User, Wallet } from 'lucide-react';
import { planTrip } from '@/utils/api';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { geocodeLocation } from '@/utils/mapApi';
import SimpleMap from '@/components/map/SimpleMap';

const transportPreferences = [
  { id: 'walk', label: 'Walking' },
  { id: 'bike', label: 'Cycling' },
  { id: 'public', label: 'Public Transit' },
  { id: 'train', label: 'Train' },
  { id: 'evcar', label: 'Electric Vehicles' },
];

const activityPreferences = [
  { id: 'nature', label: 'Nature & Outdoors' },
  { id: 'culture', label: 'Cultural Sites' },
  { id: 'food', label: 'Sustainable Dining' },
  { id: 'shopping', label: 'Eco-friendly Shopping' },
  { id: 'wellness', label: 'Wellness & Self-care' },
];

const budgetCategories = [
  { id: 'budget', label: 'Budget', description: 'Economical options, hostels, public transport', range: '₹5,000 - ₹15,000' },
  { id: 'mid', label: 'Mid-range', description: 'Comfortable hotels, some activities', range: '₹15,000 - ₹30,000' },
  { id: 'luxury', label: 'Luxury', description: 'Premium hotels, guided experiences', range: '₹30,000+' }
];

const Planner = () => {
  const navigate = useNavigate();
  const { updateGreenScore } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [step, setStep] = useState(1);
  
  // Form state
  const [tripTitle, setTripTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [travelers, setTravelers] = useState(1);
  const [selectedTransport, setSelectedTransport] = useState<string[]>(['walk', 'public']);
  const [selectedActivities, setSelectedActivities] = useState<string[]>(['nature']);
  const [additionalDetails, setAdditionalDetails] = useState('');
  // New budget state
  const [budget, setBudget] = useState<number>(15000); // Default 15,000 INR
  const [budgetCategory, setBudgetCategory] = useState('mid');
  
  // Map preview state
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // India center
  const [showMap, setShowMap] = useState(false);
  
  const handleTransportToggle = (id: string) => {
    if (selectedTransport.includes(id)) {
      setSelectedTransport(selectedTransport.filter(item => item !== id));
    } else {
      setSelectedTransport([...selectedTransport, id]);
    }
  };
  
  const handleActivityToggle = (id: string) => {
    if (selectedActivities.includes(id)) {
      setSelectedActivities(selectedActivities.filter(item => item !== id));
    } else {
      setSelectedActivities([...selectedActivities, id]);
    }
  };
  
  const handleBudgetCategoryChange = (id: string) => {
    setBudgetCategory(id);
    // Set default budget values based on category
    if (id === 'budget') {
      setBudget(10000);
    } else if (id === 'mid') {
      setBudget(20000);
    } else if (id === 'luxury') {
      setBudget(40000);
    }
  };
  
  const handleDestinationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);
    
    // If user has typed enough characters, try to geocode and show preview
    if (value.length > 3) {
      try {
        const result = await geocodeLocation(value);
        if (result) {
          setMapCenter([result.coordinates.lat, result.coordinates.lon]);
          setShowMap(true);
        }
      } catch (error) {
        console.error("Failed to geocode location", error);
      }
    }
  };
  
  const validateStep = () => {
    if (step === 1) {
      if (!tripTitle) {
        toast.error('Please enter a trip title');
        return false;
      }
      if (!destination) {
        toast.error('Please enter a destination');
        return false;
      }
      if (!startDate || !endDate) {
        toast.error('Please select both start and end dates');
        return false;
      }
      if (endDate < startDate) {
        toast.error('End date must be after start date');
        return false;
      }
    }
    
    if (step === 2) {
      if (selectedTransport.length === 0) {
        toast.error('Please select at least one transportation preference');
        return false;
      }
      if (selectedActivities.length === 0) {
        toast.error('Please select at least one activity preference');
        return false;
      }
      if (budget <= 0) {
        toast.error('Please enter a valid budget amount');
        return false;
      }
    }
    
    return true;
  };
  
  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleGenerateTrip = async () => {
    if (!validateStep()) return;
    
    if (!startDate || !endDate) {
      toast.error('Please select valid dates');
      return;
    }
    
    setAiGenerating(true);
    
    try {
      // Combine preferences for API
      const preferences = [
        ...selectedTransport.map(id => transportPreferences.find(p => p.id === id)?.label || ''),
        ...selectedActivities.map(id => activityPreferences.find(p => p.id === id)?.label || ''),
      ];
      
      // Call API to generate trip with budget parameter
      const trip = await planTrip(
        tripTitle,
        destination,
        startDate,
        endDate,
        preferences,
        budget
      );
      
      // Navigate to the trip details page
      toast.success('Your eco-friendly trip has been created!');
      navigate(`/trips/${trip.id}`);
    } catch (error) {
      console.error('Failed to generate trip:', error);
      toast.error('Failed to generate trip. Please try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 page-transition">
      <h1 className="text-3xl font-bold mb-2 text-center">AI Travel Planner</h1>
      <p className="text-foreground/80 text-center mb-8">
        Create personalized, sustainable travel itineraries with our intelligent planner
      </p>
      
      <div className="bg-white rounded-xl shadow-elevation overflow-hidden border border-gray-200/50">
        {/* Progress steps */}
        <div className="bg-green-50 p-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className="text-xs mt-1">Basics</span>
            </div>
            
            <div className={`h-1 flex-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="text-xs mt-1">Preferences</span>
            </div>
            
            <div className={`h-1 flex-1 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className="text-xs mt-1">Generate</span>
            </div>
          </div>
        </div>
        
        {/* Form content */}
        <div className="p-6">
          {/* Step 1: Basic Trip Information */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="tripTitle">Trip Title</Label>
                <Input 
                  id="tripTitle" 
                  placeholder="e.g., Weekend in Delhi"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination in India</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="destination" 
                    placeholder="Enter city or location in India"
                    className="pl-10"
                    value={destination}
                    onChange={handleDestinationChange}
                  />
                </div>
              </div>
              
              {showMap && (
                <div className="mt-4">
                  <SimpleMap
                    center={mapCenter}
                    zoom={10}
                    markers={[{position: mapCenter, popupContent: destination}]}
                    className="rounded-lg border border-gray-100"
                    style={{ height: '200px' }}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < (startDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="travelers">Number of Travelers</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="travelers" 
                    type="number" 
                    min="1" 
                    max="20"
                    className="pl-10"
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Travel Preferences */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label>Budget Options</Label>
                <p className="text-sm text-foreground/70 mb-2">
                  Select your budget category:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {budgetCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleBudgetCategoryChange(cat.id)}
                      className={`px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                        budgetCategory === cat.id
                          ? 'bg-purple-50 border-purple-300 text-purple-700'
                          : 'bg-white border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <span className="font-medium text-sm">{cat.label}</span>
                      <p className="text-xs text-foreground/70 mt-1">{cat.range}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 space-y-2">
                  <Label htmlFor="custom-budget">Custom Budget (₹)</Label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="custom-budget" 
                      type="number" 
                      className="pl-10"
                      placeholder="Enter your budget in ₹"
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <p className="text-xs text-foreground/70">
                    This is your total budget for the trip, including accommodations, activities, and transportation.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Sustainable Transportation Preferences</Label>
                <p className="text-sm text-foreground/70 mb-2">
                  Select your preferred sustainable transportation options:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {transportPreferences.map((pref) => (
                    <div
                      key={pref.id}
                      onClick={() => handleTransportToggle(pref.id)}
                      className={`px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTransport.includes(pref.id)
                          ? 'bg-green-50 border-green-300 text-green-700'
                          : 'bg-white border-gray-200 hover:border-green-200'
                      }`}
                    >
                      <span className="font-medium text-sm">{pref.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Activity Preferences</Label>
                <p className="text-sm text-foreground/70 mb-2">
                  Select types of activities you're interested in:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {activityPreferences.map((pref) => (
                    <div
                      key={pref.id}
                      onClick={() => handleActivityToggle(pref.id)}
                      className={`px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedActivities.includes(pref.id)
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <span className="font-medium text-sm">{pref.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalDetails">Additional Details (Optional)</Label>
                <textarea
                  id="additionalDetails"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Any specific preferences, accessibility needs, or special requests for your trip?"
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                ></textarea>
              </div>
            </div>
          )}
          
          {/* Step 3: Generate Trip */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in text-center">
              <div className="flex items-center justify-center py-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary animate-pulse">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold">Ready to Generate Your Trip</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto">
                <div className="mb-2">
                  <span className="font-semibold">Trip:</span> {tripTitle}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Destination:</span> {destination}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Dates:</span> {startDate && format(startDate, 'PP')} to {endDate && format(endDate, 'PP')}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Travelers:</span> {travelers}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Budget:</span> ₹{budget.toLocaleString('en-IN')}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Transportation:</span> {selectedTransport.map(id => 
                    transportPreferences.find(p => p.id === id)?.label
                  ).join(', ')}
                </div>
                <div>
                  <span className="font-semibold">Activities:</span> {selectedActivities.map(id => 
                    activityPreferences.find(p => p.id === id)?.label
                  ).join(', ')}
                </div>
              </div>
              
              <p className="text-foreground/80">
                Our AI will generate a personalized, sustainable travel itinerary based on your preferences and budget.
              </p>
              
              <Button 
                onClick={handleGenerateTrip} 
                disabled={aiGenerating}
                className="button-primary text-base py-6 px-8 shadow-md"
              >
                {aiGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Your Trip...
                  </>
                ) : 'Generate My Sustainable Trip'}
              </Button>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-10">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
            
            {step < 3 && (
              <Button className="ml-auto" onClick={nextStep}>
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* AI Explanation */}
      <Card className="mt-8 bg-opacity-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">How Our AI Works</CardTitle>
          <CardDescription>
            Smart planning for eco-friendly travel
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-foreground/80 space-y-2">
          <p>
            Our AI analyzes thousands of sustainable transportation options, eco-friendly venues, and green activities to create personalized itineraries.
          </p>
          <p>
            It considers factors like carbon emissions, walking distances, public transit availability, and your personal preferences to optimize for both sustainability and enjoyment.
          </p>
          <p>
            Every generated trip includes real-time data on air quality, crowd levels, and sustainable options, with continuous updates and smart alerts during your journey.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Planner;
