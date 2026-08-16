"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calculator, Brain, MessageSquare, Globe, FlaskConical, BookOpen,
  ChevronDown, ChevronUp, BookText, Hash, Calendar
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface TargetExam {
  id: string;
  name: string;
  examYear: number | null;
  description: string | null;
  _count: { syllabusNodes: number };
}

interface SyllabusSubject {
  subject: { id: string; name: string; slug: string; description: string | null };
  chapters: { id: string; name: string; slug: string }[];
  weightage: number;
}

// ─── Subject Icon/Color Map ──────────────────────────────────────────────────

interface SubjectMeta { icon: LucideIcon; colorClass: string }

function getSubjectMeta(name: string): SubjectMeta {
  const lower = name.toLowerCase();
  if (lower.includes("quant") || lower.includes("math") || lower.includes("numerical")) {
    return { icon: Calculator, colorClass: "text-subject-quant bg-subject-quant/10" };
  }
  if (lower.includes("reason") || lower.includes("intelligence") || lower.includes("logic")) {
    return { icon: Brain, colorClass: "text-subject-reason bg-subject-reason/10" };
  }
  if (lower.includes("english") || lower.includes("language") || lower.includes("comprehension")) {
    return { icon: MessageSquare, colorClass: "text-subject-english bg-subject-english/10" };
  }
  if (lower.includes("awareness") || lower.includes("general knowledge") || lower.includes("gk") || lower.includes("current")) {
    return { icon: Globe, colorClass: "text-subject-ga bg-subject-ga/10" };
  }
  if (lower.includes("science") || lower.includes("biology") || lower.includes("chemistry") || lower.includes("physics")) {
    return { icon: FlaskConical, colorClass: "text-subject-science bg-subject-science/10" };
  }
  return { icon: BookOpen, colorClass: "text-primary bg-primary/10" };
}

// ─── Syllabus Accordion ──────────────────────────────────────────────────────

function SyllabusAccordion({ examId }: { examId: string }) {
  const [data, setData] = useState<SyllabusSubject[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/exams/${examId}/syllabus`);
        if (!cancelled) setData(res.data.data);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err : new Error("Failed to load syllabus"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [examId]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-4 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load syllabus"
        description={error.message}
        retry={() => setData(null)}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={BookText}
        title="No syllabus content yet"
        description="The syllabus topics for this exam have not been added yet."
      />
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 pt-5">
      {data.map(({ subject, chapters, weightage }) => {
        const { icon: Icon, colorClass } = getSubjectMeta(subject.name);
        return (
          <Card key={subject.id} className="border-border shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
            <CardHeader className="pb-3 bg-muted/30 border-b border-border rounded-t-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      {subject.name}
                    </CardTitle>
                    {subject.description && (
                      <CardDescription className="text-xs mt-0.5 text-muted-foreground line-clamp-1">
                        {subject.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
                {weightage > 0 && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground whitespace-nowrap shrink-0 text-xs">
                    {weightage} Marks
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-4">
              {chapters.length > 0 ? (
                <>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Hash className="w-3 h-3" />
                    Topics to cover
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {chapters.map((chapter) => (
                      <li
                        key={chapter.id}
                        className="flex items-start gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
                      >
                        <Hash className="w-3.5 h-3.5 text-primary/40 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium text-foreground leading-snug">
                          {chapter.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-muted-foreground italic">No specific topics listed.</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Exam Group Row ──────────────────────────────────────────────────────────

function ExamGroupRow({ name, exams }: { name: string; exams: TargetExam[] }) {
  const [openExamId, setOpenExamId] = useState<string | null>(null);

  const toggleYear = (id: string) => {
    setOpenExamId((prev) => (prev === id ? null : id));
  };

  return (
    <Card className="border-border shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="pb-4 bg-muted/30 border-b border-border rounded-t-xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">{name}</CardTitle>
            {exams[0]?.description && (
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                {exams[0].description}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {exams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => toggleYear(exam.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                  openExamId === exam.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {exam.examYear ?? "General"}
                {openExamId === exam.id ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      {openExamId && (
        <CardContent className="px-6 pb-6">
          <SyllabusAccordion examId={openExamId} />
        </CardContent>
      )}
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SyllabusPage() {
  const [exams, setExams] = useState<TargetExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/exams");
      setExams(res.data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error("Failed to load exams"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Group exams by name (e.g., all years of "SSC CGL Tier 1" together)
  const grouped = exams.reduce<Record<string, TargetExam[]>>((acc, exam) => {
    if (!acc[exam.name]) acc[exam.name] = [];
    acc[exam.name].push(exam);
    return acc;
  }, {});

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display tracking-tight flex items-center gap-2">
            <BookText className="w-8 h-8 text-primary" />
            Official Syllabus Reference
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Select an exam and a year to view the complete syllabus breakdown.
          </p>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <ErrorState
          title="Failed to load exams"
          description={error.message}
          retry={fetchExams}
        />
      ) : loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <EmptyState
          icon={BookText}
          title="No exams available"
          description="No target exams have been configured yet. Check back later."
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([name, examList]) => (
            <ExamGroupRow key={name} name={name} exams={examList} />
          ))}
        </div>
      )}
    </div>
  );
}
