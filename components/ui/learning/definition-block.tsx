import React from "react";
import { cn } from "@/lib/utils";

interface DefinitionBlockProps {
  term: string;
  children: React.ReactNode;
  className?: string;
}

export function DefinitionBlock({ term, children, className }: DefinitionBlockProps) {
  return (
    <div className={cn("my-4 bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row items-stretch", className)}>
      <div className="bg-primary/5 px-4 py-3 md:w-1/4 flex items-center md:border-r border-b md:border-b-0">
        <h4 className="text-base font-bold text-primary m-0">{term}</h4>
      </div>
      <div className="px-4 py-3 md:w-3/4 flex items-center text-muted-foreground leading-relaxed text-sm">
        <div className="prose-p:m-0 w-full">{children}</div>
      </div>
    </div>
  );
}
