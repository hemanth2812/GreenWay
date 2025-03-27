
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DailyChallengeCardProps {
  onCompleteChallenge: () => void;
}

const DailyChallengeCard = ({ onCompleteChallenge }: DailyChallengeCardProps) => {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Daily Challenge</CardTitle>
        <CardDescription>Earn points with this eco-challenge</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 border border-green-200 rounded-lg bg-green-50/50">
          <h4 className="font-medium text-green-800 mb-1">Choose public transit today</h4>
          <p className="text-sm text-foreground/80 mb-3">
            Take public transportation instead of driving and earn 20 green points.
          </p>
          <div className="flex justify-between text-xs text-foreground/70">
            <span>Reward: 20 points</span>
            <span>Expires in 10 hours</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full text-sm" 
          onClick={onCompleteChallenge}
        >
          Mark as Completed
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyChallengeCard;
