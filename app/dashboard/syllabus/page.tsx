"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  BookText, 
  Brain, 
  Calculator, 
  Globe, 
  BookOpen, 
  MessageSquare, 
  FlaskConical, 
  ChevronRight,
  GraduationCap
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface TargetExam {
  id: string;
  name: string;
  examYear: number | null;
  description: string | null;
  baseExamName: string | null;
}

interface SyllabusNode {
  id: string;
  examId: string;
  subjectId: string;
  chapterId?: string;
  weightage: number;
  order: number;
  subject: { id: string; name: string; slug: string; description: string | null };
  chapter?: { id: string; name: string; slug: string };
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function getSubjectMeta(subjectName: string) {
  const lower = subjectName.toLowerCase();
  if (lower.includes("quant") || lower.includes("math")) {
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

// ─── Syllabus Document (Right Column) ─────────────────────────────────────────

function SyllabusDocument({ examId }: { examId: string }) {
  const [data, setData] = useState<SyllabusNode[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
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
      <div className="space-y-8 pt-2">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-[120px] w-full" />
          </div>
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

  const groupedData = data ? Array.from(data.reduce((acc: any, node: any) => {
    if (!acc.has(node.subject?.id)) {
      acc.set(node.subject?.id, { subject: node.subject, chapters: [], weightage: node.weightage });
    }
    if (node.chapter) {
      acc.get(node.subject?.id).chapters.push(node.chapter);
    }
    return acc;
  }, new Map()).values()) : [];

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
    <div className="space-y-12">
      {groupedData.map(({ subject, chapters, weightage }: any) => {
        const { icon: Icon, colorClass } = getSubjectMeta(subject.name);
        return (
          <div key={subject.id} className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-border/60">
              
              <div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">{subject.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {chapters.length} Topics • {weightage} Marks
                </p>
              </div>
            </div>
            
            {chapters.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 pt-2">
                {chapters.map((chapter: any) => (
                  <li 
                    key={chapter.id} 
                    className="flex items-start gap-3 text-foreground/80 hover:text-foreground transition-colors"
                  >
                    <span className="text-muted-foreground/60 shrink-0 mt-1">•</span>
                    <span className="text-[15px] leading-snug">{chapter.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic pt-2">No topics detailed for this subject.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SyllabusPage() {
  const [exams, setExams] = useState<TargetExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Selection State
  const [selectedBaseExam, setSelectedBaseExam] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const fetchExams = async () => {
    try {
      const res = await api.get("/exams");
      setExams(res.data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error("Failed to load exams"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {


    (async () => {


      await fetchExams();


    })();


  }, []);

  // Group exams by base name for the sidebar
  const examGroups = useMemo(() => {
    const groups = new Map<string, TargetExam[]>();
    for (const exam of exams) {
      const baseName = exam.baseExamName || exam.name;
      if (!groups.has(baseName)) {
        groups.set(baseName, []);
      }
      groups.get(baseName)!.push(exam);
    }
    // Sort years descending
    for (const group of groups.values()) {
      group.sort((a, b) => (b.examYear || 0) - (a.examYear || 0));
    }
    return Array.from(groups.entries());
  }, [exams]);

  // Auto-select first exam on load
  useEffect(() => {
    if (examGroups.length > 0 && !selectedBaseExam) {
      const firstGroupName = examGroups[0][0];
      const firstGroupExams = examGroups[0][1];
      Promise.resolve().then(() => {
        setSelectedBaseExam(firstGroupName);
        setSelectedYear(firstGroupExams[0].id); // Use exam ID as year selector value
      });
    }
  }, [examGroups, selectedBaseExam]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-12">
        <ErrorState
          title="Failed to load syllabus data"
          description={error.message}
          retry={() => {
          setLoading(true);
          setError(null);
          fetchExams();
        }}
        />
      </div>
    );
  }

  const currentGroupExams = examGroups.find((g) => g[0] === selectedBaseExam)?.[1] || [];
  const currentExam = currentGroupExams.find((e) => e.id === selectedYear);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Syllabus Reference
        </h1>
        <p className="text-muted-foreground mt-2">
          Select an exam from the sidebar to view the complete, official syllabus breakdown.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar (Exam Selector) */}
        <div className="lg:col-span-3 lg:sticky lg:top-8 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border bg-muted/20">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Target Exams</h2>
          </div>
          <nav className="flex flex-col p-2 gap-1 overflow-y-auto max-h-[60vh]">
            {examGroups.map(([baseName, groupExams]) => {
              const isActive = selectedBaseExam === baseName;
              return (
                <button
                  key={baseName}
                  onClick={() => {
                    setSelectedBaseExam(baseName);
                    setSelectedYear(groupExams[0].id); // Auto-select most recent year of the new group
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <span className="truncate pr-2">{baseName}</span>
                  {isActive && <ChevronRight className="w-4 h-4 shrink-0 opacity-80" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area (Right Column) */}
        <div className="lg:col-span-9 bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8 min-h-[500px]">
          {selectedBaseExam && selectedYear && currentExam ? (
            <div className="space-y-10">
              {/* Header & Year Selector */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    
                    {currentExam.name}
                  </h2>
                  {currentExam.description && (
                    <p className="text-muted-foreground mt-1.5 leading-relaxed">
                      {currentExam.description}
                    </p>
                  )}
                </div>
                
                {/* Year Dropdown */}
                {currentGroupExams.length > 0 && (
                  <div className="shrink-0">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-[140px] font-semibold bg-background">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentGroupExams.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.examYear ? `Year ${exam.examYear}` : "General Year"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Document Body */}
              <SyllabusDocument examId={selectedYear} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
              <BookText className="w-16 h-16 mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">Select an exam to view syllabus</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
