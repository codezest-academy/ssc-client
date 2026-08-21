import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ChevronRight, ArrowLeft, FolderX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export async function generateMetadata({
  params,
}: {
  params: { subject: string };
}): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const absoluteUrl = baseUrl.startsWith('/') ? `http://localhost:5000${baseUrl}` : baseUrl;
    const response = await fetch(`${absoluteUrl}/subjects/${params.subject}`, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error("Not found");
    const json = await response.json();
    const subject = json.data;

    return {
      title: `${subject.name} PYQs - Topic Wise | SSC CGL`,
      description: `Practice topic-wise Previous Year Questions (PYQs) for ${subject.name} in SSC CGL. Free online mock tests.`,
    };
  } catch {
    return { title: "Subject PYQs" };
  }
}

interface Chapter {
  id: string;
  name: string;
  description: string;
  order: number;
}

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  chapters: Chapter[];
}

export default async function SubjectPYQPage({
  params,
}: {
  params: { subject: string };
}) {
  let subject: Subject | null = null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const absoluteUrl = baseUrl.startsWith('/') ? `http://localhost:5000${baseUrl}` : baseUrl;
    const response = await fetch(`${absoluteUrl}/subjects/${params.subject}`, { next: { revalidate: 3600 } });
    if (response.ok) {
      const json = await response.json();
      subject = json.data;
    }
  } catch (error) {
    console.error("Failed to fetch subject", error);
  }

  if (!subject) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Subject not found</h1>
        <Link href="/pyq">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to PYQs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <Link href="/pyq" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to All Subjects
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4">
          {subject.name} PYQs
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          {subject.description || `Master ${subject.name} with topic-wise Previous Year Questions.`}
        </p>
      </div>

      <div className="space-y-4">
        {subject.chapters.length === 0 ? (
          <EmptyState
            icon={FolderX}
            title="No chapters available"
            description="Check back later for new topics."
          />
        ) : (
          subject.chapters.map((chapter) => (
            <Link key={chapter.id} href={`/pyq/${subject.slug}/${chapter.id}`} className="block group">
              <Card className="border-border hover:border-primary/50 hover:bg-accent transition-colors duration-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-xl">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0 text-muted-foreground font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {chapter.order}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {chapter.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xl line-clamp-2">
                      {chapter.description || "Practice PYQs for this chapter."}
                    </p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 pl-16 sm:pl-0">
                  <Button variant="ghost" className="group-hover:bg-primary/5 text-muted-foreground group-hover:text-primary transition-colors w-full sm:w-auto">
                    <FileText className="w-4 h-4 mr-1.5" />
                    Start Practicing <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
