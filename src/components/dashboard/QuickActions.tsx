
import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, Settings, Users, Map } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Link to="/planner" className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
          <div className="bg-green-100 p-3 rounded-full mb-3">
            <CalendarDays className="h-6 w-6 text-green-600" />
          </div>
          <span className="text-center font-medium">Plan Trip</span>
        </Link>
        
        <Link to="/trips" className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            <Map className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-center font-medium">My Trips</span>
        </Link>
        
        <Link to="/profile" className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
          <div className="bg-purple-100 p-3 rounded-full mb-3">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <span className="text-center font-medium">Profile</span>
        </Link>
        
        <Link to="/api-settings" className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all">
          <div className="bg-amber-100 p-3 rounded-full mb-3">
            <Settings className="h-6 w-6 text-amber-600" />
          </div>
          <span className="text-center font-medium">API Settings</span>
        </Link>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer">
          <div className="bg-teal-100 p-3 rounded-full mb-3">
            <MapPin className="h-6 w-6 text-teal-600" />
          </div>
          <span className="text-center font-medium">Explore Nearby</span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
