"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Book, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  _count: {
    chapters: number;
  };
}

export default function DashboardPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get("/subjects");
        setSubjects(response.data.data);
      } catch (error) {
        console.error("Failed to load subjects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          {user?.targetExam ? `${user.targetExam.replace('_', ' ')} Curriculum` : 'Your Dashboard'}
        </h2>
        <p className="text-slate-500 mt-2">Pick up where you left off or start a new subject.</p>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading curriculum...</div>
      ) : subjects.length === 0 ? (
        <div className="text-slate-400">No subjects available yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/dashboard/subjects/${subject.slug}`} className="block group">
              <Card className="h-full border-border hover:border-primary/50 hover:bg-slate-50 transition-colors duration-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/80 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                <CardHeader>
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Book className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                    {subject.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {subject.description || "Master the concepts of this subject."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-slate-500 font-medium">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {subject._count.chapters} Chapters
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
