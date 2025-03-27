
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getSavedTrips } from '@/utils/mockData';
import { User } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Get trips for stats
  const trips = getSavedTrips();
  
  // Calculate some statistics
  const totalTrips = trips.length;
  const totalCarbonSaved = trips.reduce((total, trip) => total + trip.carbonSaved, 0);
  
  // Activity feed (mock data)
  const activities = [
    { id: 1, type: 'trip_created', message: 'You created a new trip to Portland', date: '2 days ago' },
    { id: 2, type: 'green_points', message: 'Earned 50 green points for planning a sustainable trip', date: '2 days ago' },
    { id: 3, type: 'achievement', message: 'Unlocked "Eco Explorer" badge', date: '1 day ago' },
    { id: 4, type: 'challenge', message: 'Completed daily challenge: Public Transit', date: '10 hours ago' },
    { id: 5, type: 'green_points', message: 'Earned 20 green points for daily challenge', date: '10 hours ago' },
  ];
  
  // Badges/Achievements
  const achievements = [
    { 
      id: 1, 
      name: 'Eco Explorer', 
      description: 'Plan your first eco-friendly trip', 
      icon: '🌍', 
      unlocked: true, 
      date: '2 days ago' 
    },
    { 
      id: 2, 
      name: 'Carbon Cutter', 
      description: 'Save 100kg of CO2 with sustainable choices', 
      icon: '🌱', 
      unlocked: totalCarbonSaved >= 100, 
      date: totalCarbonSaved >= 100 ? '1 day ago' : null
    },
    { 
      id: 3, 
      name: 'Public Transit Pro', 
      description: 'Use public transportation 10 times', 
      icon: '🚆', 
      unlocked: false, 
      date: null
    },
    { 
      id: 4, 
      name: 'Walking Warrior', 
      description: 'Walk 20km on your eco trips', 
      icon: '👟', 
      unlocked: false, 
      date: null
    },
    { 
      id: 5, 
      name: 'Cycling Superstar', 
      description: 'Use bike sharing on 5 different trips', 
      icon: '🚲', 
      unlocked: false, 
      date: null
    },
  ];
  
  // Rewards
  const rewards = [
    { 
      id: 1, 
      name: '10% off at Green Leaf Cafe', 
      points: 200, 
      available: user?.greenScore && user.greenScore >= 200,
      expires: '30 days after redemption',
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 2, 
      name: 'Free bike rental (1 day)', 
      points: 350, 
      available: user?.greenScore && user.greenScore >= 350,
      expires: '60 days after redemption',
      imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 3, 
      name: 'Eco-friendly water bottle', 
      points: 500, 
      available: user?.greenScore && user.greenScore >= 500,
      expires: 'Never',
      imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 4, 
      name: 'Weekend stay at Green Lodge', 
      points: 1000, 
      available: user?.greenScore && user.greenScore >= 1000,
      expires: '90 days after redemption',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 page-transition">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - User Info */}
        <div className="w-full lg:w-1/3 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-green-700" />
                </div>
                
                <h2 className="text-2xl font-bold mb-1">{user?.name || 'User'}</h2>
                <p className="text-foreground/80 mb-4">{user?.email || 'Email not available'}</p>
                
                <div className="bg-green-50 rounded-full px-4 py-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-700 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                  </svg>
                  <span className="font-medium text-green-800">
                    {user?.greenScore || 0} Green Points
                  </span>
                </div>
              </div>
                
              <div className="mt-8 space-y-5">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <div className="text-foreground/80">Level</div>
                    <div className="font-medium">Eco Explorer {Math.floor((user?.greenScore || 0) / 100) + 1}</div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                    Level {Math.floor((user?.greenScore || 0) / 100) + 1}
                  </Badge>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground/80">Progress to next level</span>
                    <span className="font-medium">{(user?.greenScore || 0) % 100}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${(user?.greenScore || 0) % 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-800 mb-1">{totalTrips}</div>
                    <div className="text-xs text-foreground/80">Total Trips</div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-800 mb-1">{totalCarbonSaved.toFixed(1)}</div>
                    <div className="text-xs text-foreground/80">kg CO₂ Saved</div>
                  </div>
                  
                  <div className="bg-teal-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-teal-800 mb-1">
                      {achievements.filter(a => a.unlocked).length}
                    </div>
                    <div className="text-xs text-foreground/80">Achievements</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-800 mb-1">
                      {rewards.filter(r => r.available).length}
                    </div>
                    <div className="text-xs text-foreground/80">Available Rewards</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={logout}
                >
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                      activity.type === 'trip_created' ? 'bg-blue-100 text-blue-700' :
                      activity.type === 'green_points' ? 'bg-green-100 text-green-700' :
                      activity.type === 'achievement' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {activity.type === 'trip_created' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      )}
                      {activity.type === 'green_points' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598-.542 1.865-1.345l.215-.688c.082-.264.418-.406.675-.22l.001.001c.245.176.356.505.27.8l-.001.002-.278.903c-.293.95.055 1.96.94 2.418.349.18.648.29.956.29.308 0 .584-.11.851-.29.974-.456 1.333-1.463 1.057-2.41l-.276-.903c-.086-.296.024-.625.27-.801l.001-.001c.257-.185.593-.043.675.221l.214.687c.267.803 1.02 1.345 1.866 1.345.48 0 .89-.347.97-.821l.073-.438c.094-.565-.25-1.11-.8-1.267l-.99-.282a1.586 1.586 0 01-.982-.816l-.036-.073a1.453 1.453 0 00-2.328-.377L16.5 15h-.628a2.25 2.25 0 00-2.223 1.892l-.176.529m0 0H6.75M4.5 15.75l-.612.153c-.5.125-.826.6-.826 1.114 0 .568.335 1.079.871 1.248h.01z" />
                        </svg>
                      )}
                      {activity.type === 'achievement' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                        </svg>
                      )}
                      {activity.type === 'challenge' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-foreground/70">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Tabs with Achievements & Rewards */}
        <div className="w-full lg:w-2/3">
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="achievements" className="flex-1">Achievements</TabsTrigger>
              <TabsTrigger value="rewards" className="flex-1">Rewards</TabsTrigger>
            </TabsList>
            
            <TabsContent value="achievements" className="animate-fade-in">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Your Achievements</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map(achievement => (
                      <div 
                        key={achievement.id}
                        className={`p-4 rounded-lg border ${
                          achievement.unlocked 
                            ? 'bg-white border-green-200' 
                            : 'bg-gray-50 border-gray-200 opacity-70'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-green-100">
                            {achievement.icon}
                          </div>
                          {achievement.unlocked && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium mt-2">{achievement.name}</h3>
                        <p className="text-sm text-foreground/80 mb-2">{achievement.description}</p>
                        {achievement.unlocked && achievement.date && (
                          <p className="text-xs text-foreground/70">Unlocked {achievement.date}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rewards" className="animate-fade-in">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Green Rewards</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rewards.map(reward => (
                      <div 
                        key={reward.id}
                        className={`rounded-lg border overflow-hidden ${
                          reward.available
                            ? 'border-green-200'
                            : 'border-gray-200 opacity-70'
                        }`}
                      >
                        <div className="h-32 w-full">
                          <img 
                            src={reward.imageUrl} 
                            alt={reward.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{reward.name}</h3>
                            <div className="flex items-center bg-green-50 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598-.542 1.865-1.345l.215-.688c.082-.264.418-.406.675-.22l.001.001c.245.176.356.505.27.8l-.001.002-.278.903c-.293.95.055 1.96.94 2.418.349.18.648.29.956.29.308 0 .584-.11.851-.29.974-.456 1.333-1.463 1.057-2.41l-.276-.903c-.086-.296.024-.625.27-.801l.001-.001c.257-.185.593-.043.675.221l.214.687c.267.803 1.02 1.345 1.866 1.345.48 0 .89-.347.97-.821l.073-.438c.094-.565-.25-1.11-.8-1.267l-.99-.282a1.586 1.586 0 01-.982-.816l-.036-.073a1.453 1.453 0 00-2.328-.377L16.5 15h-.628a2.25 2.25 0 00-2.223 1.892l-.176.529m0 0H6.75M4.5 15.75l-.612.153c-.5.125-.826.6-.826 1.114 0 .568.335 1.079.871 1.248h.01z" />
                              </svg>
                              {reward.points} points
                            </div>
                          </div>
                          
                          <p className="text-xs text-foreground/70 mb-3">
                            Expires: {reward.expires}
                          </p>
                          
                          <Button 
                            variant={reward.available ? "default" : "outline"} 
                            className="w-full text-sm"
                            disabled={!reward.available}
                          >
                            {reward.available ? 'Redeem Reward' : `Need ${reward.points - (user?.greenScore || 0)} more points`}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
