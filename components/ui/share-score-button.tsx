'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareScoreButtonProps {
  testName: string;
  score: number;
  totalMarks: number;
}

export function ShareScoreButton({ testName, score, totalMarks }: ShareScoreButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `I just scored ${score}/${totalMarks} on the ${testName} mock test on Code Zest! 🚀\n\nCan you beat my score? Take the free diagnostic test here: https://codezest.in`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Code Zest Score',
          text,
        });
        return;
      } catch (err) {
        // Fallback to copy if user cancels or share fails
        console.error('Share failed:', err);
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button onClick={handleShare} variant="outline" className="gap-2">
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span>Share Score</span>
        </>
      )}
    </Button>
  );
}
