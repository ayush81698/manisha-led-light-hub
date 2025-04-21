
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ColorPicker } from 'lucide-react';
import type { SectionSettings } from '@/lib/types';

const FeaturedSettings = () => {
  const [settings, setSettings] = useState<SectionSettings>({
    backgroundType: 'color',
    backgroundValue: '#f9fafb'
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('featuredSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error parsing featured settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    // In a real app, this would save to a database
    localStorage.setItem('featuredSettings', JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Featured products section settings have been updated successfully."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Products Section Settings</CardTitle>
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
              <RadioGroupItem value="color" id="featured-color" />
              <Label htmlFor="featured-color">Color</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="image" id="featured-image" />
              <Label htmlFor="featured-image">Image URL</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="video" id="featured-video" />
              <Label htmlFor="featured-video">YouTube Video ID</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>
            {settings.backgroundType === 'color' ? 'Color Value' :
             settings.backgroundType === 'image' ? 'Image URL' :
             'YouTube Video ID'}
          </Label>
          {settings.backgroundType === 'color' ? (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.backgroundValue}
                onChange={(e) => setSettings({ ...settings, backgroundValue: e.target.value })}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <Input
                value={settings.backgroundValue}
                onChange={(e) => setSettings({ ...settings, backgroundValue: e.target.value })}
                className="font-mono"
              />
            </div>
          ) : (
            <Input
              value={settings.backgroundValue}
              onChange={(e) => setSettings({ ...settings, backgroundValue: e.target.value })}
              placeholder={
                settings.backgroundType === 'image' ? 'https://example.com/image.jpg' :
                'dQw4w9WgXcQ'
              }
            />
          )}
        </div>

        <Button onClick={handleSave}>Save Changes</Button>
      </CardContent>
    </Card>
  );
};

export default FeaturedSettings;
