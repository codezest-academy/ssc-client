'use client';

import { useEffect } from 'react';
import { useTestEngineStore } from '@/store/useTestEngineStore';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TestTimer() {
  const { timeRemaining, status, tickTimer } = useTestEngineStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'IN_PROGRESS') {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, tickTimer]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = timeRemaining < 300 && timeRemaining >= 60; // Less than 5 min
  const isCritical = timeRemaining < 60; // Less than 1 min

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full border border-border font-mono font-medium transition-colors',
        isCritical
          ? 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse'
          : isWarning
          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
          : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
      )}
    >
      <Clock className="w-4 h-4" />
      <span>{formatTime(timeRemaining)}</span>
    </div>
  );
}
