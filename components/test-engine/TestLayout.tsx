'use client';

import React, { useState, useEffect } from 'react';
import { useTestEngineStore } from '@/store/useTestEngineStore';
import { TestTimer } from './TestTimer';
import { Button } from '@/components/ui/button';
import { LayoutGrid, X, Maximize, Minimize } from 'lucide-react';
import { QuestionPalette } from './QuestionPalette';
import { cn } from '@/lib/utils';
import { usePostHog } from 'posthog-js/react';
import { SubmitConfirmationModal } from './SubmitConfirmationModal';

interface TestLayoutProps {
  children: React.ReactNode;
  testTitle: string;
}

export function TestLayout({ children, testTitle }: TestLayoutProps) {
  const { status, submitTest } = useTestEngineStore();
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

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

  const handleFinalSubmit = () => {
    submitTest();
    setIsSubmitModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-muted/30 dark:bg-slate-950 overflow-hidden p-3 md:p-6">
      <div className="max-w-[1440px] w-full mx-auto h-full flex flex-col gap-4 overflow-hidden relative">
        
        {/* Floating Test Header */}
        <header className="flex-none h-[72px] rounded-2xl border border-border bg-card shadow-sm z-10 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              CZ
            </div>
            <h1 className="font-semibold text-lg hidden sm:block text-foreground">{testTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            <TestTimer />
            
            <Button
              onClick={() => setIsSubmitModalOpen(true)}
              disabled={status === 'SUBMITTED'}
              className="hidden sm:flex rounded-full px-6 shadow-md"
            >
              {status === 'SUBMITTED' ? 'Submitted' : 'Submit Test'}
            </Button>

            {/* Focus Mode Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-transparent"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Focus Mode" : "Enter Focus Mode"}
            >
              {isFullscreen ? <Minimize className="w-5 h-5 text-primary" /> : <Maximize className="w-5 h-5 text-muted-foreground" />}
            </Button>

            {/* Mobile Palette Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setIsMobilePaletteOpen(!isMobilePaletteOpen)}
            >
              {isMobilePaletteOpen ? <X className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative gap-4">
          {/* Left Side: Question Viewer (Floating Card) */}
          <main className="flex-1 overflow-hidden relative z-0 bg-card rounded-2xl border border-border shadow-sm flex flex-col">
            {children}
          </main>

          {/* Right Side: Question Palette (Desktop Floating Card) */}
          <aside className="hidden lg:flex w-[320px] flex-none rounded-2xl border border-border bg-card shadow-sm overflow-hidden z-10 flex-col">
            <QuestionPalette />
          </aside>

          {/* Mobile Palette Drawer Overlay */}
          {isMobilePaletteOpen && (
            <div className="absolute inset-0 z-20 flex lg:hidden">
              <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl" 
                onClick={() => setIsMobilePaletteOpen(false)}
              />
              <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-card rounded-r-2xl border-l border-border shadow-2xl p-4 animate-in slide-in-from-right duration-300">
                <QuestionPalette />
              </div>
            </div>
          )}
        </div>
      </div>

      <SubmitConfirmationModal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)} 
        onConfirm={handleFinalSubmit} 
      />
    </div>
  );
}
