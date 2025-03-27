
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  getOpenAIApiKey,
  setOpenAIApiKey
} from '@/utils/env';
import { 
  getTransportApiCredentials,
  setTransportApiCredentials
} from '@/utils/transportApi';
import { 
  setAirQualityApiKey, 
  getAirQualityApiKey 
} from '@/utils/airQualityApi';

const ApiKeysForm = () => {
  const [deepseekKey, setDeepseekKey] = useState('');
  const [transportAppId, setTransportAppId] = useState('');
  const [transportKey, setTransportKey] = useState('');
  const [airQualityKey, setAirQualityKey] = useState('');
  
  useEffect(() => {
    // Load saved API keys from local storage
    setDeepseekKey(getOpenAIApiKey());
    
    const transportCredentials = getTransportApiCredentials();
    setTransportAppId(transportCredentials.appId);
    setTransportKey(transportCredentials.key);
    
    setAirQualityKey(getAirQualityApiKey());
  }, []);
  
  const handleSaveDeepSeek = () => {
    if (!deepseekKey.trim()) {
      toast.error('Please enter a valid DeepSeek API key');
      return;
    }
    
    setOpenAIApiKey(deepseekKey.trim());
    toast.success('DeepSeek API key saved successfully');
  };
  
  const handleSaveTransport = () => {
    if (!transportAppId.trim() || !transportKey.trim()) {
      toast.error('Please enter both Transport API App ID and API key');
      return;
    }
    
    setTransportApiCredentials(transportAppId.trim(), transportKey.trim());
    toast.success('Transport API credentials saved successfully');
  };
  
  const handleSaveAirQuality = () => {
    if (!airQualityKey.trim()) {
      toast.error('Please enter a valid Air Quality API key');
      return;
    }
    
    setAirQualityApiKey(airQualityKey.trim());
    toast.success('Air Quality API key saved successfully');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>DeepSeek API Configuration</CardTitle>
          <CardDescription>
            Enter your DeepSeek API key to enable AI-powered travel planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deepseek-key">DeepSeek API Key</Label>
              <Input
                id="deepseek-key"
                type="password"
                placeholder="sk-..."
                value={deepseekKey}
                onChange={(e) => setDeepseekKey(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Get your API key from the DeepSeek dashboard
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveDeepSeek}>Save DeepSeek Key</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Transport API Configuration</CardTitle>
          <CardDescription>
            Enter your Transport API credentials for public transport data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transport-app-id">Transport API App ID</Label>
              <Input
                id="transport-app-id"
                placeholder="your-app-id"
                value={transportAppId}
                onChange={(e) => setTransportAppId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transport-key">Transport API Key</Label>
              <Input
                id="transport-key"
                type="password"
                placeholder="your-api-key"
                value={transportKey}
                onChange={(e) => setTransportKey(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Get your credentials from the Transport API provider
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveTransport}>Save Transport API Credentials</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Air Quality API Configuration</CardTitle>
          <CardDescription>
            Enter your Air Quality API key for environmental data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="air-quality-key">Air Quality API Key</Label>
              <Input
                id="air-quality-key"
                type="password"
                placeholder="your-api-key"
                value={airQualityKey}
                onChange={(e) => setAirQualityKey(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Get your API key from your Air Quality data provider
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveAirQuality}>Save Air Quality Key</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApiKeysForm;
