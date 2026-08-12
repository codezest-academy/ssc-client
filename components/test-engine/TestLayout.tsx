'use client';

import React, { useState, useEffect } from 'react';
import { useTestEngineStore } from '@/store/useTestEngineStore';
import { TestTimer } from './TestTimer';
import { Button } from '@/components/ui/button';
import { LayoutGrid, X, Maximize, Minimize } from 'lucide-react';
import { QuestionPalette } from './QuestionPalette';
import { cn } from '@/lib/utils';
import { usePostHog } from 'posthog-js/react';

interface TestLayoutProps {
  children: React.ReactNode;
  testTitle: string;
}

export function TestLayout({ children, testTitle }: TestLayoutProps) {
  const { status, submitTest } = useTestEngineStore();
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Focus Mode toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Error attempting to enable full-screen mode:", err.message);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  // Listen to fullscreen changes outside of react
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const posthog = usePostHog();
  const hasTrackedSubmit = React.useRef(false);

  useEffect(() => {
    if (status === 'SUBMITTED' && !hasTrackedSubmit.current) {
      posthog?.capture('mock_test_completed', {
        testTitle,
      });
      hasTrackedSubmit.current = true;
    }
  }, [status, posthog, testTitle]);

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* Test Header */}
      <header className="flex-none h-16 border-b border-border bg-card shadow-sm z-10 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
            CZ
          </div>
          <h1 className="font-semibold text-lg hidden sm:block">{testTitle}</h1>
        </div>

        <div className="flex items-center gap-4">
          <TestTimer />
          
          <Button
            onClick={() => {
              if (confirm('Are you sure you want to submit the test?')) {
                submitTest();
              }
            }}
            disabled={status === 'SUBMITTED'}
            className="hidden sm:flex"
          >
            {status === 'SUBMITTED' ? 'Submitted' : 'Submit Test'}
          </Button>

          {/* Focus Mode Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Focus Mode" : "Enter Focus Mode"}
          >
            {isFullscreen ? <Minimize className="w-5 h-5 text-primary" /> : <Maximize className="w-5 h-5 text-muted-foreground" />}
          </Button>

          {/* Mobile Palette Toggle */}
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobilePaletteOpen(!isMobilePaletteOpen)}
          >
            {isMobilePaletteOpen ? <X className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side: Question Viewer */}
        <main className="flex-1 overflow-hidden relative z-0">
          {children}
        </main>

        {/* Right Side: Question Palette (Desktop) */}
        <aside className="hidden lg:block w-[320px] flex-none border-l border-border bg-muted/10 p-4 overflow-y-auto z-10 shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.1)]">
          <QuestionPalette />
        </aside>

        {/* Mobile Palette Drawer Overlay */}
        {isMobilePaletteOpen && (
          <div className="absolute inset-0 z-20 flex lg:hidden">
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
              onClick={() => setIsMobilePaletteOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-background border-l border-border shadow-2xl p-4 animate-in slide-in-from-right-full duration-200">
              <QuestionPalette />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
