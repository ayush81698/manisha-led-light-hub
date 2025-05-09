import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { HeroSettings as HeroSettingsType } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

const HeroSettings = () => {
  const [settings, setSettings] = useState<HeroSettingsType>({
    backgroundType: 'color',
    backgroundValue: '#0047AB'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMode, setSaveMode] = useState<'both' | 'local'>('both');
  const [dbError, setDbError] = useState<string | null>(null);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: settingsData, error } = await supabase
          .from('settings')
          .select('id, value')
          .eq('name', 'heroSettings')
          .maybeSingle();
          
        if (error) {
          console.error('Error loading hero settings from DB:', error);
          setDbError(`Database access error: ${error.message}`);
          setSaveMode('local');
          
          // Try to load from localStorage instead
          const savedSettings = localStorage.getItem('heroSettings');
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
          }
        } else if (settingsData) {
          // Store the ID for updates
          setSettingsId(settingsData.id);
          
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
            // Reset error state if we successfully loaded from DB
            setDbError(null);
            setSaveMode('both');
          }
        }
      } catch (error) {
        console.error('Failed to load hero settings:', error);
        
        // Try to load from localStorage as fallback
        const savedSettings = localStorage.getItem('heroSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
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

      // Always save to localStorage
      localStorage.setItem('heroSettings', JSON.stringify(finalSettings));
      
      // Only attempt to save to database if in 'both' mode
      if (saveMode === 'both') {
        console.log("Saving settings to Supabase:", finalSettings);
        let error;
        
        if (settingsId) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('settings')
            .update({
              value: finalSettings as unknown as Json,
              updated_at: new Date().toISOString()
            })
            .eq('id', settingsId);
          
          error = updateError;
        } else {
          // Check if the setting already exists with a different ID
          const { data: existingSettings } = await supabase
            .from('settings')
            .select('id')
            .eq('name', 'heroSettings')
            .maybeSingle();
            
          if (existingSettings) {
            // Update if exists
            const { error: updateError } = await supabase
              .from('settings')
              .update({
                value: finalSettings as unknown as Json,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingSettings.id);
            
            error = updateError;
            if (!error) {
              setSettingsId(existingSettings.id);
            }
          } else {
            // Insert new record
            const { error: insertError } = await supabase
              .from('settings')
              .insert({
                name: 'heroSettings',
                value: finalSettings as unknown as Json
              });
            
            error = insertError;
          }
        }

        if (error) {
          console.error('Error saving settings to DB:', error);
          setDbError(`Database save error: ${error.message}`);
          setSaveMode('local');
          
          toast({
            title: "Settings saved locally only",
            description: "Could not save to database due to permissions. Settings saved to browser storage.",
            variant: "destructive"
          });
          
          return;
        } else {
          // Reset error state if save was successful
          setDbError(null);
          setSaveMode('both');
        }
      }
      
      toast({
        title: "Settings saved",
        description: saveMode === 'both' 
          ? "Hero section settings have been updated successfully."
          : "Settings saved to browser storage only.",
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
        {dbError && (
          <CardDescription className="text-amber-500">
            Using local storage mode due to database access restrictions
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {dbError && (
          <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Access Restricted</AlertTitle>
            <AlertDescription>
              {dbError}
              <p className="mt-2">Your settings will be saved to browser local storage only and will not persist across devices.</p>
            </AlertDescription>
          </Alert>
        )}

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
          {isSaving ? 'Saving...' : `Save Changes${saveMode === 'local' ? ' (Local Only)' : ''}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HeroSettings;
