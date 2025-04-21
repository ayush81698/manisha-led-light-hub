
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { HeroSettings as HeroSettingsType } from '@/lib/types';

const HeroSettings = () => {
  const [settings, setSettings] = useState<HeroSettingsType>({
    backgroundType: 'color',
    backgroundValue: '#0047AB'
  });

  const handleSave = () => {
    // In a real app, this would save to a database
    localStorage.setItem('heroSettings', JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Hero section settings have been updated successfully."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <RadioGroup
            value={settings.backgroundType}
            onValueChange={(value: 'image' | 'video' | 'color') => 
              setSettings({ ...settings, backgroundType: value })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="color" id="color" />
              <Label htmlFor="color">Color</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="image" id="image" />
              <Label htmlFor="image">Image URL</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="video" id="video" />
              <Label htmlFor="video">YouTube Video ID</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>
            {settings.backgroundType === 'color' ? 'Color Value' :
             settings.backgroundType === 'image' ? 'Image URL' :
             'YouTube Video ID'}
          </Label>
          <Input
            value={settings.backgroundValue}
            onChange={(e) => setSettings({ ...settings, backgroundValue: e.target.value })}
            placeholder={
              settings.backgroundType === 'color' ? '#000000' :
              settings.backgroundType === 'image' ? 'https://example.com/image.jpg' :
              'dQw4w9WgXcQ'
            }
          />
        </div>

        <Button onClick={handleSave}>Save Changes</Button>
      </CardContent>
    </Card>
  );
};

export default HeroSettings;
