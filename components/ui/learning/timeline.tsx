import React from "react";
import { cn } from "@/lib/utils";

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

export function Timeline({ children, className }: TimelineProps) {
  return (
    <div className={cn("relative border-l border-border ml-3 my-4 space-y-4", className)}>
      {children}
    </div>
  );
}

interface TimelineItemProps {
  period?: string;
  title: string;
  children?: React.ReactNode;
}

export function TimelineItem({ period, title, children }: TimelineItemProps) {
  return (
    <div className="relative pl-6">
      <div className="absolute w-3 h-3 bg-primary/20 border-2 border-primary rounded-full -left-[6.5px] top-1.5"></div>
      <div className="flex flex-col mb-1">
        {period && (
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">
            {period}
          </span>
        )}
        <div className="text-lg font-bold text-foreground m-0 leading-tight">{title}</div>
      </div>
      {children && <div className="text-muted-foreground leading-relaxed text-sm prose-p:my-1">{children}</div>}
    </div>
  );
}
