
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface GreenScoreCardProps {
  name: string | undefined;
  greenScore: number | undefined;
}

const GreenScoreCard = ({ name, greenScore = 0 }: GreenScoreCardProps) => {
  const level = Math.floor((greenScore || 0) / 100) + 1;
  const pointsToNextReward = 100 - ((greenScore || 0) % 100);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Green Score</CardTitle>
        <CardDescription>Your sustainability impact</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-2xl">
            {greenScore || 0}
          </div>
          <div>
            <p className="text-sm text-foreground/80">Level: {level}</p>
            <p className="text-sm text-foreground/80">Next reward: {pointsToNextReward} points</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/profile" className="text-sm text-primary hover:underline">
          View your sustainability profile
        </Link>
      </CardFooter>
    </Card>
  );
};

export default GreenScoreCard;
