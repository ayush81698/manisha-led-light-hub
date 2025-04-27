
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { HeroSettings as HeroSettingsType } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

const HeroSettings = () => {
  const [settings, setSettings] = useState<HeroSettingsType>({
    backgroundType: 'color',
    backgroundValue: '#0047AB'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: settingsData, error } = await supabase
          .from('settings')
          .select('value')
          .eq('name', 'heroSettings')
          .maybeSingle();
          
        if (error) {
          console.error('Error loading hero settings from DB:', error);
          const savedSettings = localStorage.getItem('heroSettings');
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
          }
        } else if (settingsData?.value) {
          // Cast to unknown first, then to the expected type
          const parsedSettings = settingsData.value as unknown as HeroSettingsType;
          
          // Validate that the parsed settings have the expected structure
          if (
            parsedSettings && 
            typeof parsedSettings === 'object' && 
            'backgroundType' in parsedSettings && 
            'backgroundValue' in parsedSettings
          ) {
            setSettings(parsedSettings);
          }
        }
      } catch (error) {
        console.error('Failed to load hero settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Clean up YouTube URL if applicable
      let finalSettings = {...settings};
      if (settings.backgroundType === 'video' && settings.backgroundValue) {
        try {
          finalSettings.backgroundValue = cleanYoutubeUrl(settings.backgroundValue);
        } catch (error) {
          console.error('Error cleaning YouTube URL:', error);
          toast({
            title: "Invalid YouTube URL",
            description: "Please enter a valid YouTube URL",
            variant: "destructive"
          });
          setIsSaving(false);
          return;
        }
      }

      console.log("Saving settings to Supabase:", finalSettings);
      const { error } = await supabase
        .from('settings')
        .upsert({
          name: 'heroSettings',
          value: finalSettings as unknown as Json
        });

      if (error) {
        console.error('Error saving settings to DB:', error);
        throw error;
      }

      localStorage.setItem('heroSettings', JSON.stringify(finalSettings));
      toast({
        title: "Settings saved",
        description: "Hero section settings have been updated successfully."
      });
    } catch (error) {
      console.error('Failed to save hero settings:', error);
      toast({
        title: "Error saving settings",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getYoutubeId = (url: string): string | null => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  // Function to clean and validate YouTube URLs
  const cleanYoutubeUrl = (url: string): string => {
    const videoId = getYoutubeId(url);
    if (videoId) {
      // Return a standardized YouTube URL format
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    throw new Error("Invalid YouTube URL");
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
              <Label htmlFor="video">YouTube Video URL</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>
            {settings.backgroundType === 'color' ? 'Color Value' :
             settings.backgroundType === 'image' ? 'Image URL' :
             'YouTube Video URL'}
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
                'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
              }
            />
          )}
          
          {settings.backgroundType === 'video' && settings.backgroundValue && (
            <div className="mt-4 p-2 bg-gray-50 rounded-md dark:bg-gray-700 dark:text-white">
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">Preview YouTube Video ID:</p>
              <code className="text-xs bg-gray-100 p-1 rounded dark:bg-gray-800">
                {getYoutubeId(settings.backgroundValue) || "Invalid URL"}
              </code>
              {!getYoutubeId(settings.backgroundValue) && (
                <p className="text-xs text-red-500 mt-1">
                  Warning: This doesn't appear to be a valid YouTube video ID. Please provide a valid YouTube URL.
                </p>
              )}
            </div>
          )}
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HeroSettings;
