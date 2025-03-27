
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getOpenAIApiKey, setOpenAIApiKey, getTransportApiAppId, setTransportApiAppId, getTransportApiKey, setTransportApiKey } from '@/utils/env';

const ApiSettings = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [transportAppId, setTransportAppId] = useState('');
  const [transportApiKey, setTransportApiKey] = useState('');

  useEffect(() => {
    // Load saved API keys from localStorage
    setOpenaiKey(getOpenAIApiKey());
    setTransportAppId(getTransportApiAppId());
    setTransportApiKey(getTransportApiKey());
    
    // Show notification if any API key is missing
    if (!getOpenAIApiKey() || !getTransportApiAppId() || !getTransportApiKey()) {
      toast.info('Please configure your API keys to enable all features', {
        duration: 5000,
      });
    }
  }, []);

  const handleSaveOpenAIKey = () => {
    setOpenAIApiKey(openaiKey);
    toast.success('AI API key saved');
  };

  const handleSaveTransportKeys = () => {
    setTransportApiAppId(transportAppId);
    setTransportApiKey(transportApiKey);
    toast.success('Transport API credentials saved');
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 page-transition">
      <h1 className="text-3xl font-bold mb-2">API Settings</h1>
      <p className="text-foreground/80 mb-8">
        Configure your API keys to enable full functionality
      </p>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">OpenAI API Key</CardTitle>
            <CardDescription>Required for AI-powered trip planning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                />
                <p className="text-xs text-foreground/70">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
              <Button onClick={handleSaveOpenAIKey}>Save OpenAI Key</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Transport API Credentials</CardTitle>
            <CardDescription>Used for public transit options and routing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transport-app-id">App ID</Label>
                <Input
                  id="transport-app-id"
                  value={transportAppId}
                  onChange={(e) => setTransportAppId(e.target.value)}
                  placeholder="Your Transport API App ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transport-api-key">API Key</Label>
                <Input
                  id="transport-api-key"
                  type="password"
                  value={transportApiKey}
                  onChange={(e) => setTransportApiKey(e.target.value)}
                  placeholder="Your Transport API Key"
                />
              </div>
              <Button onClick={handleSaveTransportKeys}>Save Transport API Credentials</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiSettings;
