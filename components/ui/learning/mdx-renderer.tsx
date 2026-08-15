"use client";

import React, { ElementType } from "react";
import Markdown from "markdown-to-jsx";
import { Callout } from "./callout";
import { QuestionRenderer } from "@/components/ui/question-renderer";
import { ZoomableImage } from "./zoomable-image";
import { Mindmap } from "./mindmap";

interface MdxRendererProps {
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

const HeadingWithId = ({ level, children, ...props }: { level: 1 | 2 | 3 | 4 | 5 | 6, children: React.ReactNode }) => {
  // Extract string content to generate ID
  let text = "";
  React.Children.forEach(children, (child) => {
    if (typeof child === "string") text += child;
  });
  
  const id = slugify(text);
  const Tag = `h${level}` as ElementType;
  
  return (
    <Tag id={id} className="scroll-mt-24" {...props}>
      {children}
    </Tag>
  );
};

const customComponents = {
  Callout: { component: Callout },
  ZoomableImage: { component: ZoomableImage },
  Mindmap: { component: Mindmap },
  img: { component: (props: any) => <ZoomableImage src={props.src} alt={props.alt} className={props.className} /> },
  h1: { component: HeadingWithId, props: { level: 1 } },
  h2: { component: HeadingWithId, props: { level: 2 } },
  h3: { component: HeadingWithId, props: { level: 3 } },
  p: { component: (props: any) => <div className="my-5 leading-relaxed text-slate-600" {...props} /> },
};

export function MdxRenderer({ source }: MdxRendererProps) {
  return (
    <div className="prose prose-base md:prose-lg xl:prose-xl prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-p:text-slate-600 prose-li:marker:text-primary prose-li:text-slate-600 prose-strong:text-slate-900 prose-hr:border-border">
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
