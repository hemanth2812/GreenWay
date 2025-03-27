
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const GreenPointsIndicator = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Link to="/store">
      <Badge variant="outline" className="flex items-center gap-1.5 bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
        <Leaf className="h-3.5 w-3.5" />
        <span>{user.greenScore}</span>
      </Badge>
    </Link>
  );
};

export default GreenPointsIndicator;
