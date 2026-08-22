import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratePYQButton } from "./GeneratePYQButton";

export async function generateMetadata({
  params,
}: {
  params: { subject: string; chapter: string };
}): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const absoluteUrl = baseUrl.startsWith('/') ? `http://localhost:5000${baseUrl}` : baseUrl;
    const response = await fetch(`${absoluteUrl}/subjects/${params.subject}`, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error("Not found");
    const json = await response.json();
    const subject = json.data;
    const chapter = subject.chapters?.find((c: any) => c.id === params.chapter);

    if (!chapter) throw new Error("Not found");

    return {
      title: `${chapter.name} PYQs | ${subject.name} | SSC CGL`,
      description: `Practice live topic-wise Previous Year Questions (PYQs) for ${chapter.name} in SSC CGL. Free online mock tests.`,
    };
  } catch {
    return { title: "Topic PYQs" };
  }
}

export default async function ChapterPYQPage({
  params,
}: {
  params: { subject: string; chapter: string };
}) {
  let subject: any = null;
  let chapter: any = null;
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const absoluteUrl = baseUrl.startsWith('/') ? `http://localhost:5000${baseUrl}` : baseUrl;
    const response = await fetch(`${absoluteUrl}/subjects/${params.subject}`, { next: { revalidate: 3600 } });
    if (response.ok) {
      const json = await response.json();
      subject = json.data;
      chapter = subject.chapters?.find((c: any) => c.id === params.chapter);
    }
  } catch (error) {
    console.error("Failed to fetch subject details", error);
  }

  if (!subject || !chapter) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Topic not found</h1>
        <Link href={`/pyq/${params.subject}`}>
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Subject</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6">
      <Link href={`/pyq/${subject.slug}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to {subject.name}
      </Link>

      <div className="bg-card border border-primary/20 rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-6">
            PYQ Practice Set
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            {chapter.name}
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {chapter.description || `Test your knowledge with 20 real Previous Year Questions from SSC CGL specifically covering ${chapter.name}.`}
          </p>
          
          <div className="flex flex-col items-center justify-center space-y-6">
            <GeneratePYQButton chapterId={chapter.id} />
            
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-1.5 justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>20 Random PYQs</span>
              </div>
              <div className="hidden sm:block text-border">•</div>
              <div className="flex items-center gap-1.5 justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Instant Results</span>
              </div>
              <div className="hidden sm:block text-border">•</div>
              <div className="flex items-center gap-1.5 justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Detailed Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
