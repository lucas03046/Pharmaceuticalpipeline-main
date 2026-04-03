import React from 'react';
import { Settings, Save, RefreshCw, Shield, Bell, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';

export default function SettingsPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-semibold mb-2 flex items-center gap-2">
            <Settings className="size-8" />
            Settings
          </h1>
          <p className="text-slate-600">
            Configure the local Python backend, ingestion engine, and operator preferences.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Scraping Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="size-5 text-blue-600" />
                Scraping Schedule
              </CardTitle>
              <CardDescription>
                Configure how often the platform synchronizes with external data sources.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automated Sync</Label>
                  <p className="text-sm text-slate-500">Enable recurring local synchronization jobs.</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sync-time">Preferred Sync Time (Local)</Label>
                  <Input id="sync-time" type="time" defaultValue="02:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concurrency">Max Concurrent Ingest Jobs</Label>
                  <Input id="concurrency" type="number" defaultValue="3" min="1" max="10" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5 text-green-600" />
                API Credentials
              </CardTitle>
              <CardDescription>
                Configure local backend endpoints and optional source credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ct-api-key">ClinicalTrials.gov API Key (Optional)</Label>
                <Input id="ct-api-key" type="password" placeholder="Enter API key..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backend-url">Local Backend URL</Label>
                <Input id="backend-url" placeholder="http://127.0.0.1:8000" />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5 text-purple-600" />
                Sync Notifications
              </CardTitle>
              <CardDescription>
                Receive alerts about scraping jobs and data updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Notify on Success</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Notify on Failure</Label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button className="flex items-center gap-2">
              <Save className="size-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
