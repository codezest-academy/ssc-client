"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MindmapProps {
  chart: string;
  className?: string;
}

export function Mindmap({ chart, className }: MindmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        fontFamily: "inherit",
        primaryColor: "#e0e7ff",
        primaryBorderColor: "#818cf8",
        primaryTextColor: "#1e1b4b",
        lineColor: "#94a3b8",
        nodeBorder: "#818cf8",
      }
    });

    const renderChart = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Generate a unique ID for this instance
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        
        const { svg } = await mermaid.render(id, chart);
        setSvgContent(svg);
      } catch (err: any) {
        console.error("Mermaid parsing error:", err);
        setError(err.message || "Failed to render diagram.");
      } finally {
        setLoading(false);
      }
    };

    if (chart) {
      renderChart();
    }
  }, [chart]);

  return (
    <div className={cn("relative my-8 border border-border/50 rounded-xl bg-card overflow-x-auto min-h-[200px] flex items-center justify-center p-6", className)}>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-background/50 backdrop-blur-sm z-10">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <span className="text-sm font-medium">Generating Diagram...</span>
        </div>
      )}
      
      {error && (
        <div className="text-destructive text-sm bg-destructive/10 p-4 rounded-lg border border-destructive/20 w-full max-w-lg">
          <strong>Diagram Syntax Error:</strong> {error}
        </div>
      )}
      
      {!error && svgContent && (
        <div 
          ref={containerRef}
          className="w-full flex justify-center mermaid-container transition-opacity duration-500 [&>svg]:max-w-full [&>svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svgContent }} 
        />
      )}
    </div>
  );
}
