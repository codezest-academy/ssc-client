"use client";

import Markdown from "markdown-to-jsx";
import { Callout } from "./callout";
import { QuestionRenderer } from "@/components/ui/question-renderer";

interface MdxRendererProps {
  source: string;
}

const customComponents = {
  Callout: { component: Callout },
};

export function MdxRenderer({ source }: MdxRendererProps) {
  return (
    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-p:text-slate-600 prose-li:marker:text-primary prose-li:text-slate-600 prose-strong:text-slate-900 prose-hr:border-border">
      <Markdown
        options={{
          overrides: customComponents,
        }}
      >
        {source}
      </Markdown>
    </div>
  );
}
