import { Metadata } from "next";
import { api } from "@/lib/axios";
import Link from "next/link";
import { ArrowLeft, PlayCircle, Trophy, BarChart3, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: { subject: string; chapter: string };
}): Promise<Metadata> {
  try {
    const response = await api.get(`/chapters/${params.chapter}`);
    const chapter = response.data.data;
    
    return {
      title: `${chapter.name} PYQs | SSC CGL Practice`,
      description: `Practice ${chapter.name} Previous Year Questions (PYQs) for SSC CGL. Get instant solutions, time analysis, and performance tracking.`,
    };
  } catch (error) {
    return {
      title: "Chapter PYQs",
    };
  }
}

interface Chapter {
  id: string;
  name: string;
  description: string;
  subject: {
    name: string;
    slug: string;
  };
}

interface Question {
  id: string;
  content: string;
  pyqYear: string | null;
  pyqShift: string | null;
  difficulty: string;
}

export default async function ChapterPYQPage({
  params,
}: {
  params: { subject: string; chapter: string };
}) {
  let chapter: Chapter | null = null;
  let questions: Question[] = [];

  try {
    const response = await api.get(`/chapters/${params.chapter}`);
    chapter = response.data.data;

    // We can fetch a preview of questions if we have an endpoint. Let's mock a few for SEO.
    // In a real scenario we'd fetch top 5 PYQs from an API.
    questions = [
      { id: "1", content: "<p>Sample PYQ Question 1 for this chapter.</p>", pyqYear: "2023", pyqShift: "Shift 1", difficulty: "MEDIUM" },
      { id: "2", content: "<p>Sample PYQ Question 2 for this chapter.</p>", pyqYear: "2022", pyqShift: "Shift 3", difficulty: "HARD" },
      { id: "3", content: "<p>Sample PYQ Question 3 for this chapter.</p>", pyqYear: "2022", pyqShift: "Shift 2", difficulty: "EASY" }
    ];
  } catch (error) {
    console.error("Failed to fetch chapter", error);
  }

  if (!chapter) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
        <Link href={`/pyq/${params.subject}`}>
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Subject</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Link href={`/pyq/${chapter.subject.slug}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to {chapter.subject.name}
      </Link>
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
          {chapter.name} PYQs for SSC CGL
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          {chapter.description || `Practice all Previous Year Questions from ${chapter.name} with detailed solutions and time analytics.`}
        </p>
        
        <Link href={`/dashboard/subjects/${chapter.subject.slug}/chapters/${chapter.id}`}>
          <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1">
            <PlayCircle className="w-6 h-6 mr-2" />
            Start Practicing Now
          </Button>
        </Link>
        <p className="text-sm text-slate-500 mt-4">Free to start. No credit card required.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Detailed Solutions</h3>
          <p className="text-sm text-slate-600">Learn why the wrong options are traps with our unique rationale system.</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Time Analytics</h3>
          <p className="text-sm text-slate-600">Compare your time taken per question against the topper average.</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Real Exam Feel</h3>
          <p className="text-sm text-slate-600">Experience the TCS interface and conquer exam anxiety.</p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Sample Questions ({chapter.name})</h2>
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">Question {i + 1}</span>
                <div className="flex gap-2">
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">SSC CGL {q.pyqYear}</span>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">{q.pyqShift}</span>
                </div>
              </div>
              <div className="prose prose-slate max-w-none text-slate-900 mb-6" dangerouslySetInnerHTML={{ __html: q.content }} />
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">Difficulty: <span className="font-medium text-slate-900">{q.difficulty}</span></span>
                <Link href={`/dashboard/subjects/${chapter!.subject.slug}/chapters/${chapter!.id}`}>
                  <Button variant="outline" size="sm">View Solution</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center py-12 bg-primary/5 rounded-3xl border border-primary/10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to master {chapter.name}?</h2>
        <p className="text-slate-600 mb-8 max-w-lg mx-auto">Sign up now to access 50+ more PYQs for this chapter, complete with detailed analytics and personalized weak-topic recommendations.</p>
        <Link href="/register">
          <Button size="lg" className="rounded-full px-8">Create Free Account</Button>
        </Link>
      </div>
    </div>
  );
}
