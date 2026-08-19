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
  GraduationCap,
  List,
  LayoutTemplate
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";

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

export function SyllabusDocument({ examId, examName }: { examId: string; examName?: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Hardcoded patterns based on exam name
  const getExamPattern = (name: string) => {
    const lowerName = name?.toLowerCase() || "";
    if (lowerName.includes("cgl tier 1") || lowerName.includes("chsl tier 1") || lowerName.includes("mts") || lowerName.includes("gd")) {
      return { q: "100", m: "200", d: "60 Mins", n: "-0.50" };
    }
    if (lowerName.includes("cgl tier 2")) {
      return { q: "130", m: "390", d: "135 Mins", n: "-1.00" };
    }
    if (lowerName.includes("chsl tier 2")) {
      return { q: "135", m: "405", d: "135 Mins", n: "-1.00" };
    }
    if (lowerName.includes("cpo tier 1")) {
      return { q: "200", m: "200", d: "120 Mins", n: "-0.25" };
    }
    if (lowerName.includes("cpo tier 2")) {
      return { q: "200", m: "200", d: "120 Mins", n: "-0.25" };
    }
    // Default fallback
    return { q: "100", m: "200", d: "60 Mins", n: "-0.50" };
  };

  const pattern = getExamPattern(examName || "");

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      setLoading(true);
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
    <div className="w-full">
        <TabsContent value="structure" className="mt-0">
          <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Exam Structure & Instructions</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Total Questions</div>
                  <div className="text-xl font-bold text-foreground">{pattern.q}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Total Marks</div>
                  <div className="text-xl font-bold text-foreground">{pattern.m}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Duration</div>
                  <div className="text-xl font-bold text-foreground">{pattern.d}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Negative Marking</div>
                  <div className="text-xl font-bold text-destructive">{pattern.n}</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-info/10 border border-info/20 text-sm text-foreground">
                <p className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-info" />
                  <span className="font-semibold text-info">Note on Exam Pattern:</span>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The exact structure varies heavily between exams and tiers (e.g., CGL Tier 1 vs Tier 2). 
                  Please refer to the official notification for detailed module-wise breakdown. 
                  Our practice tests automatically adapt to the specific format of the exam you select.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="syllabus" className="mt-0">
          <div className="space-y-12">
            {groupedData.map(({ subject, chapters, weightage }: any) => {
              const { icon: Icon, colorClass } = getSubjectMeta(subject.name);
              return (
                <div key={subject.id} className="space-y-5">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/60">
                    <div>
                      <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {chapters.length} Topics
                      </p>
                      {subject.examTypes && subject.examTypes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {subject.examTypes.map((exam: string) => (
                            <span key={exam} className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
                              {exam.replace('SSC_', '')}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {chapters.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                      {chapters.map((chapter: any, idx: number) => (
                        <li 
                          key={chapter.id} 
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/40"
                        >
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                            {idx + 1}
                          </div>
                          <span className="text-[14px] font-medium leading-snug text-foreground/90">{chapter.name}</span>
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
        </TabsContent>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SyllabusPage() {
  const [exams, setExams] = useState<TargetExam[]>([]);
  const [viewMode, setViewMode] = useState<'syllabus' | 'structure'>('syllabus');
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

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'syllabus' | 'structure')} className="w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-start mt-8">
        
        {/* Left Sidebar (Navigation) */}
        <div className="lg:col-span-3 lg:sticky lg:top-8 bg-card border border-border/60 rounded-xl shadow-sm flex flex-col py-2">
          
          {/* Target Exams Section */}
          <div className="px-5 pt-3 pb-2">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">SSC Exam Types</h2>
          </div>
          <nav className="flex flex-col px-3 gap-0.5 overflow-y-auto max-h-[50vh]">
            {examGroups.map(([baseName, groupExams]) => {
              const isActive = selectedBaseExam === baseName;
              return (
                <button
                  key={baseName}
                  onClick={() => {
                    setSelectedBaseExam(baseName);
                    setSelectedYear(groupExams[0].id); // Auto-select most recent year of the new group
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground font-medium"
                  }`}
                >
                  <span className="truncate pr-2">{baseName.replace(/^SSC\s+/i, '')}</span>
                  {isActive && <ChevronRight className="w-4 h-4 shrink-0 opacity-90" />}
                </button>
              );
            })}
          </nav>
          
          <div className="my-3 mx-4 border-t border-border/40"></div>
          
          {/* View Mode Section */}
          <div className="px-5 pt-2 pb-2">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">View Mode</h2>
          </div>
          <nav className="flex flex-col px-3 pb-3 gap-0.5">
            <button
              onClick={() => setViewMode('syllabus')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                viewMode === 'syllabus'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground font-medium'
              }`}
            >
              <span>Detailed Syllabus</span>
              {viewMode === 'syllabus' && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
            </button>
            <button
              onClick={() => setViewMode('structure')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                viewMode === 'structure'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground font-medium'
              }`}
            >
              <span>Exam Pattern</span>
              {viewMode === 'structure' && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
            </button>
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
              <SyllabusDocument examId={selectedYear} examName={currentExam.name} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
              <div className="w-32 h-32 mb-6 rounded-3xl overflow-hidden bg-background shadow-md border border-border flex items-center justify-center p-2">
                <img src="/SSC Logo.jpeg" alt="SSC Logo" className="w-full h-full object-contain opacity-90" />
              </div>
              <p className="text-lg font-medium text-muted-foreground">Select an exam from the sidebar to view its syllabus</p>
            </div>
          )}
        </div>

      </div>
      </Tabs>
    </div>
  );
}
