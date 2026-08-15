"use client";

import React, { useState, useEffect } from "react";
import { ZoomIn, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZoomableImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export function ZoomableImage({ src, alt = "", className }: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) {
        setIsZoomed(false);
      }
    };
    if (isZoomed) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isZoomed]);

  return (
    <>
      <div 
        className={cn("relative group cursor-zoom-in overflow-hidden rounded-xl border border-border/50 my-8", className)}
        onClick={() => setIsZoomed(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4 text-white" />
        </div>
      </div>

      {isZoomed && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md cursor-zoom-out p-4 md:p-12 animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <button 
            className="absolute top-6 right-6 bg-muted hover:bg-muted/80 p-2 rounded-full transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          
          <div 
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={src} 
              alt={alt} 
              className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg" 
            />
          </div>
        </div>
      )}
    </>
  );
}
