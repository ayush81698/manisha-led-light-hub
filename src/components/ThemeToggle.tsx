
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme} 
      className="rounded-full border-secondary/20 dark:border-secondary/20"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-primary dark:text-secondary" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-secondary" />
      )}
    </Button>
  );
};
