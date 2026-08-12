import { Metadata } from "next";
import { api } from "@/lib/axios";
import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionRenderer } from "@/components/ui/question-renderer";

export async function generateMetadata({
  params,
}: {
  params: { examSlug: string; year: string; shift: string; subject: string };
}): Promise<Metadata> {
  // Format the params for a clean title
  const formattedExam = params.examSlug.replace(/-/g, " ").toUpperCase();
  const formattedShift = params.shift.replace(/-/g, " ");
  const formattedSubject = params.subject.charAt(0).toUpperCase() + params.subject.slice(1);
  
  return {
    title: `${formattedExam} ${params.year} ${formattedShift} ${formattedSubject} Detailed Solutions | PYQ`,
    description: `Practice ${formattedExam} ${params.year} ${formattedShift} Previous Year Questions for ${formattedSubject}. Get instant solutions, rationale for wrong options, and time analysis.`,
  };
}

interface Question {
  id: string;
  content: string;
  difficulty: string;
  options: { key: string; text: string; rationale?: string }[];
  correctOption: string;
}

export default async function PaperPYQPage({
  params,
}: {
  params: { examSlug: string; year: string; shift: string; subject: string };
}) {
  const formattedExam = params.examSlug.replace(/-/g, " ").toUpperCase();
  const formattedShift = params.shift.replace(/-/g, " ");
  const formattedSubject = params.subject.charAt(0).toUpperCase() + params.subject.slice(1);

  // Mocking questions for SEO until backend endpoint for fetching by paper is ready
  const questions: Question[] = [
    { 
      id: "1", 
      content: "<p>If A is 20% more than B, and B is 25% less than C. Then A is what percent of C?</p>", 
      difficulty: "MEDIUM",
      correctOption: "A",
      options: [
        { key: "A", text: "90%", rationale: "Correct." },
        { key: "B", text: "85%", rationale: "You likely calculated 20% - 25% = -5%, leading to 95%, or mixed up the base." },
        { key: "C", text: "120%", rationale: "You assumed A is directly related to C without discounting B." },
        { key: "D", text: "80%", rationale: "Common calculation error." }
      ]
    },
    { 
      id: "2", 
      content: "<p>Find the LCM of 12, 15, and 20.</p>", 
      difficulty: "EASY",
      correctOption: "C",
      options: [
        { key: "A", text: "120", rationale: "This is a common multiple but not the least common multiple." },
        { key: "B", text: "30", rationale: "30 is divisible by 15 but not 12 or 20." },
        { key: "C", text: "60", rationale: "Correct. 60 is the lowest number divisible by 12, 15, and 20." },
        { key: "D", text: "240", rationale: "A multiple, but not the least." }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Link href={`/pyq`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to PYQs
      </Link>
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
          {formattedExam} {params.year} {formattedShift} ({formattedSubject})
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Practice the exact questions that appeared in {formattedExam} {params.year}. Review the distractor rationales to understand why trap options are wrong.
        </p>
        
        <Link href={`/dashboard`}>
          <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1">
            <PlayCircle className="w-6 h-6 mr-2" />
            Start Practicing Full Paper
          </Button>
        </Link>
        <p className="text-sm text-slate-500 mt-4">Free to start. No credit card required.</p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Paper Questions ({formattedSubject})</h2>
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">Question {i + 1}</span>
                <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">{formattedExam} {params.year} {formattedShift}</span>
              </div>
              <div className="prose prose-slate max-w-none text-slate-900 mb-6">
                <QuestionRenderer content={q.content} />
              </div>
              
              <div className="space-y-3 mb-6">
                {q.options.map((opt) => (
                  <div key={opt.key} className={`p-4 rounded-lg border ${opt.key === q.correctOption ? "bg-success/10 border-success/30 text-success" : "border-border text-slate-700 bg-slate-50"}`}>
                    <div className="font-semibold mb-1">Option {opt.key}: {opt.text}</div>
                    {opt.rationale && (
                       <p className="text-sm opacity-90">
                         <strong>Rationale:</strong> {opt.rationale}
                       </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">Difficulty: <span className="font-medium text-slate-900">{q.difficulty}</span></span>
                <Link href={`/dashboard`}>
                  <Button variant="outline" size="sm">Practice on Dashboard</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
