import { Metadata } from "next";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Previous Year Questions (PYQs) for SSC CGL",
  description: "Browse thousands of SSC CGL Previous Year Questions (PYQs) by subject and chapter. Practice online for free.",
};

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  _count: {
    chapters: number;
    questions: number;
  };
}

export default async function PYQIndexPage() {
  let subjects: Subject[] = [];
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    // Ensure absolute URL for server component
    const absoluteUrl = baseUrl.startsWith('/') ? `http://localhost:5000${baseUrl}` : baseUrl;
    const response = await fetch(`${absoluteUrl}/subjects`, { next: { revalidate: 3600 } });
    if (response.ok) {
      const json = await response.json();
      subjects = json.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch subjects", error);
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
          SSC CGL Previous Year Questions
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Master the exam pattern by practicing topic-wise PYQs. Select a subject to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <Link key={subject.id} href={`/pyq/${subject.slug}`} className="group">
            <Card className="h-full border-border hover:border-primary/50 hover:bg-slate-50 transition-colors shadow-sm">
              <CardContent className="p-6 flex items-start gap-4 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                    {subject.description || `Practice ${subject.name} PYQs for SSC CGL.`}
                  </p>
                </div>
                <div className="shrink-0 mt-2">
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
