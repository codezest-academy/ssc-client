"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { BookOpen, Layers, Target, ChevronRight } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  _count: { chapters: number };
}

const EXAMS = [
  { id: "SSC_CGL", name: "SSC CGL" },
  { id: "SSC_CHSL", name: "SSC CHSL" },
  { id: "SSC_MTS", name: "SSC MTS" },
  { id: "SSC_CPO", name: "SSC CPO" },
  { id: "SSC_GD", name: "SSC GD" },
];

export default function SyllabusPage() {
  const { user } = useAuthStore();
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize with user's primary target exam if available
  useEffect(() => {
    if (user && user.targetExam && user.targetExam.length > 0 && !selectedExam) {
      setSelectedExam(user.targetExam[0]);
    } else if (!selectedExam) {
      setSelectedExam("SSC_CGL"); // Default fallback
    }
  }, [user, selectedExam]);

  useEffect(() => {
    async function fetchSubjects() {
      if (!selectedExam) return;
      setLoading(true);
      try {
        const res = await api.get(`/subjects?examType=${selectedExam}`);
        setSubjects(res.data.data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, [selectedExam]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">Syllabus</h1>
          <p className="text-slate-400">Master the syllabus for your target exam.</p>
        </div>
        
        {/* EXAM SWITCHER */}
        <div className="w-full md:w-64">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Viewing Syllabus For
          </label>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-full h-11 bg-white/5 border-white/10 text-white font-medium focus:ring-0 focus:border-primary">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <SelectValue placeholder="Select Exam" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {EXAMS.map((exam) => (
                <SelectItem key={exam.id} value={exam.id} className="font-medium">
                  {exam.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse border border-white/10" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/dashboard/syllabus/${subject.slug}?exam=${selectedExam}`}>
              <Card className="h-full border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">
                    {subject.name}
                  </CardTitle>
                  <CardDescription className="text-slate-400 line-clamp-2 mt-2">
                    {subject.description || `Complete syllabus for ${subject.name}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Layers className="w-4 h-4 text-slate-500" />
                      <span>{subject._count.chapters} Chapters</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!loading && subjects.length === 0 && (
        <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-white mb-2">No subjects found</h3>
          <p className="text-slate-400">There are no subjects mapped to {EXAMS.find(e => e.id === selectedExam)?.name} yet.</p>
        </div>
      )}
    </div>
  );
}
