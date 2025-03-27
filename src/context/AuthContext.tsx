
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock users data
const mockUsers = [
  { id: 1, name: 'Vibhas Goud', username: 'vibhas', password: 'vibhas', email: 'vibhas@example.com', greenScore: 756 },
  { id: 2, name: 'Hemanth Sai', username: 'hemanth', password: 'hemanth', email: 'hemanth@example.com', greenScore: 892 },
  { id: 3, name: 'Sowmya', username: 'sowmya', password: 'sowmya', email: 'sowmya@example.com', greenScore: 621 },
  { id: 4, name: 'Maneesh Reddy', username: 'maneesh', password: 'maneesh', email: 'maneesh@example.com', greenScore: 548 },
];

// User type
export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  greenScore: number;
};

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateGreenScore: (points: number) => void;
  spendGreenPoints: (points: number, item: string) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for saved user on initial load
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('greenway_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse saved user:', error);
          localStorage.removeItem('greenway_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) => u.username === username && u.password === password
        );

        if (foundUser) {
          // Remove password from user object before saving
          const { password, ...secureUser } = foundUser;
          setUser(secureUser);
          setIsAuthenticated(true);
          localStorage.setItem('greenway_user', JSON.stringify(secureUser));
          toast.success(`Welcome back, ${secureUser.name}!`);
          resolve(true);
        } else {
          toast.error('Invalid username or password');
          resolve(false);
        }
      }, 800);
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('greenway_user');
    navigate('/');
    toast.success('You have been logged out');
  };

  // Update green score
  const updateGreenScore = (points: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        greenScore: user.greenScore + points
      };
      setUser(updatedUser);
      localStorage.setItem('greenway_user', JSON.stringify(updatedUser));
      
      if (points > 0) {
        toast.success(`You earned ${points} green points!`);
      }
    }
  };

  // Spend green points on items
  const spendGreenPoints = (points: number, item: string): boolean => {
    if (!user || user.greenScore < points) {
      toast.error("Not enough green points for this purchase");
      return false;
    }

    const updatedUser = {
      ...user,
      greenScore: user.greenScore - points
    };
    
    setUser(updatedUser);
    localStorage.setItem('greenway_user', JSON.stringify(updatedUser));
    toast.success(`You redeemed ${item} for ${points} green points!`);
    return true;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        logout,
        updateGreenScore,
        spendGreenPoints
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
