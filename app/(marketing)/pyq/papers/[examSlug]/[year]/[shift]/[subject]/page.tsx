import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionRenderer } from "@/components/ui/question-renderer";
import { FreemiumPaperGate } from "./FreemiumPaperGate";

export async function generateMetadata({
  params,
}: {
  params: { examSlug: string; year: string; shift: string; subject: string };
}): Promise<Metadata> {
  const formattedExam = params.examSlug.replace(/-/g, " ").toUpperCase();
  const formattedShift = params.shift.replace(/-/g, " ");
  const formattedSubject =
    params.subject.charAt(0).toUpperCase() + params.subject.slice(1);

  return {
    title: `${formattedExam} ${params.year} ${formattedShift} ${formattedSubject} Detailed Solutions | PYQ`,
    description: `Practice ${formattedExam} ${params.year} ${formattedShift} Previous Year Questions for ${formattedSubject}. Get instant solutions, rationale for wrong options, and time analysis.`,
  };
}

interface QuestionOption {
  key: string;
  text: string;
  rationale?: string;
}

interface Question {
  id: string;
  content: string;
  difficulty: string;
  options: QuestionOption[];
  correctOption: string;
}

// Number of questions shown publicly (without login)
const PUBLIC_QUESTION_PREVIEW_COUNT = 2;

export default async function PaperPYQPage({
  params,
}: {
  params: { examSlug: string; year: string; shift: string; subject: string };
}) {
  const formattedExam = params.examSlug.replace(/-/g, " ").toUpperCase();
  const formattedShift = params.shift.replace(/-/g, " ");
  const formattedSubject =
    params.subject.charAt(0).toUpperCase() + params.subject.slice(1);

  // Mock questions until backend paper endpoint is ready
  // Future: replace with API call — backend will return all questions for PRO users
  // and only the first PUBLIC_QUESTION_PREVIEW_COUNT for unauthenticated requests
  const allQuestions: Question[] = [
    {
      id: "1",
      content: "<p>If A is 20% more than B, and B is 25% less than C. Then A is what percent of C?</p>",
      difficulty: "MEDIUM",
      correctOption: "A",
      options: [
        { key: "A", text: "90%", rationale: "Correct. A = 1.2B and B = 0.75C → A = 0.9C = 90% of C." },
        { key: "B", text: "85%", rationale: "You likely calculated 20% - 25% = -5%, leading to 95%, or mixed up the base." },
        { key: "C", text: "120%", rationale: "You assumed A is directly related to C without discounting B." },
        { key: "D", text: "80%", rationale: "Common calculation error when applying both percentages additively." },
      ],
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
        { key: "D", text: "240", rationale: "A multiple of all three, but not the least." },
      ],
    },
    {
      id: "3",
      content: "<p>The ratio of ages of A and B is 3:5. After 10 years, the ratio becomes 5:7. What is the present age of A?</p>",
      difficulty: "MEDIUM",
      correctOption: "B",
      options: [
        { key: "A", text: "10 years", rationale: "Solving (3x+10)/(5x+10) = 5/7 gives x = 5, so A = 15." },
        { key: "B", text: "15 years", rationale: "Correct. x = 5, A = 3×5 = 15 years." },
        { key: "C", text: "20 years", rationale: "Incorrect x substitution." },
        { key: "D", text: "25 years", rationale: "That would be B's age, not A's." },
      ],
    },
    {
      id: "4",
      content: "<p>A train of length 200m passes a platform of length 300m in 25 seconds. What is the speed of the train?</p>",
      difficulty: "MEDIUM",
      correctOption: "C",
      options: [
        { key: "A", text: "72 km/h", rationale: "Check: 72 km/h = 20 m/s. Distance = 200+300 = 500m. Time = 25s. Correct speed = 20 m/s." },
        { key: "B", text: "54 km/h", rationale: "54 km/h = 15 m/s. 15×25 = 375 ≠ 500." },
        { key: "C", text: "72 km/h", rationale: "Correct. Total distance = 500m in 25s = 20 m/s = 72 km/h." },
        { key: "D", text: "90 km/h", rationale: "90 km/h = 25 m/s. 25×25 = 625 ≠ 500." },
      ],
    },
  ];

  const publicQuestions = allQuestions.slice(0, PUBLIC_QUESTION_PREVIEW_COUNT);
  const lockedQuestions = allQuestions.slice(PUBLIC_QUESTION_PREVIEW_COUNT);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Link
        href="/pyq"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to PYQs
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
          {formattedExam} {params.year} {formattedShift} ({formattedSubject})
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Practice the exact questions that appeared in {formattedExam}{" "}
          {params.year}. Review the distractor rationales to understand why
          trap options are wrong.
        </p>

        <Link href="/dashboard">
          <Button
            size="lg"
            className="h-14 px-8 text-lg font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1"
          >
            <PlayCircle className="w-6 h-6 mr-2" />
            Start Practicing Full Paper
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground mt-4">
          Free to start. No credit card required.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Paper Questions ({formattedSubject}) —{" "}
          <span className="text-muted-foreground font-normal text-lg">
            {allQuestions.length} questions
          </span>
        </h2>

        <div className="space-y-6">
          {/* Public questions — always visible (SEO + teaser) */}
          {publicQuestions.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} examLabel={`${formattedExam} ${params.year} ${formattedShift}`} />
          ))}

          {/* Freemium gate — client component reads auth state */}
          {lockedQuestions.length > 0 && (
            <FreemiumPaperGate
              lockedQuestions={lockedQuestions}
              startIndex={publicQuestions.length}
              examLabel={`${formattedExam} ${params.year} ${formattedShift}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shared question card (server-renderable) ──────────────────────────────

function QuestionCard({
  question,
  index,
  examLabel,
}: {
  question: Question;
  index: number;
  examLabel: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-muted-foreground">
          Question {index + 1}
        </span>
        <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded">
          {examLabel}
        </span>
      </div>
      <div className="prose prose-sm max-w-none text-foreground mb-6">
        <QuestionRenderer content={question.content} />
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((opt) => (
          <div
            key={opt.key}
            className={`p-4 rounded-lg border ${
              opt.key === question.correctOption
                ? "bg-success/10 border-success/30 text-success"
                : "border-border text-foreground bg-muted/40"
            }`}
          >
            <div className="font-semibold mb-1 flex items-start gap-2">
              <span className="shrink-0 mt-0.5">Option {opt.key}:</span>
              <div className="prose prose-sm">
                <QuestionRenderer content={opt.text} />
              </div>
            </div>
            {opt.rationale && (
              <div className="text-sm opacity-90 flex items-start gap-2 mt-2">
                <strong className="shrink-0">Rationale:</strong>
                <div className="prose prose-sm">
                  <QuestionRenderer content={opt.rationale} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          Difficulty:{" "}
          <span className="font-medium text-foreground">{question.difficulty}</span>
        </span>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            Practice on Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
