
// components/dashboard/Header.tsx
'use client';

import { Bell, Settings, Moon, Sun } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/themeStore';

interface HeaderProps {
  profile: {
    name: string;
    bloodGroup: string;
    available: boolean;
  };
}

export default function Header({ profile }: HeaderProps) {
  const [notificationCount] = useState(3); // Mock notification count
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <header className="sticky top-0 z-30 bg-background border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Title or breadcrumb */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden w-12" /> {/* Spacer for mobile menu button */}
          <div>
            <h1 className="text-xl font-semibold text-foreground hidden sm:block">
              Welcome back, {profile.name.split(' ')[0]}!
            </h1>
            <p className="text-sm text-muted-foreground hidden md:block">
              Help save lives by donating blood
            </p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-accent transition">
            <Bell size={20} className="text-foreground" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-accent transition">
            <Settings size={20} className="text-foreground" />
          </button>

          {/* User Menu (Clerk) */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10',
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}