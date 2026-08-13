"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  source: string;
}

const slugify = (str: string) => {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export function TableOfContents({ source }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Parse markdown (## or ###) AND html (<h2>...</h2> or <h3>...</h3>)
    const parsedHeadings: Heading[] = [];
    
    // 1. Markdown headings (h1, h2, h3)
    const mdMatches = Array.from(source.matchAll(/^(#{1,3})\s+(.+)$/gm));
    mdMatches.forEach((match) => {
      const level = match[1].length;
      const rawText = match[2].replace(/[\[\]_*\`]/g, '').trim(); 
      parsedHeadings.push({
        level,
        text: rawText,
        id: slugify(rawText),
      });
    });

    // 2. HTML headings (h1, h2, h3)
    const htmlMatches = Array.from(source.matchAll(/<h([123])[^>]*>([\s\S]*?)<\/h\1>/gi));
    htmlMatches.forEach((match) => {
      const level = parseInt(match[1], 10);
      // Strip nested html tags from text
      const rawText = match[2].replace(/<[^>]+>/g, '').trim();
      parsedHeadings.push({
        level,
        text: rawText,
        id: slugify(rawText),
      });
    });

    // Sort headings by their order of appearance in the source text
    parsedHeadings.sort((a, b) => {
      return source.indexOf(a.text) - source.indexOf(b.text);
    });

    setHeadings(parsedHeadings);
  }, [source]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">On This Page</h4>
      <div className="text-sm space-y-2.5">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(heading.id);
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                setActiveId(heading.id);
              }
            }}
            className={cn(
              "block transition-colors cursor-pointer",
              heading.level === 1 ? "font-bold text-slate-800" : heading.level === 3 ? "pl-4 text-[13px]" : "font-medium",
              activeId === heading.id
                ? "text-primary"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </div>
  );
}
