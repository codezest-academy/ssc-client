"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, ChevronRight, Layers } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

interface PracticeSet {
  id: string;
  title: string;
  description: string;
  subject?: { name: string };
  chapter?: { name: string };
  _count: {
    questions: number;
  };
}

export default function PracticeSetsPage() {
  const [practiceSets, setPracticeSets] = useState<PracticeSet[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchPracticeSets = async () => {
      try {
        const response = await api.get("/practice-sets");
        setPracticeSets(response.data.data);
      } catch (error) {
        console.error("Failed to load practice sets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPracticeSets();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Practice Sets</h2>
        <p className="text-slate-500 mt-2">Test your knowledge and practice MCQ questions.</p>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading practice sets...</div>
      ) : practiceSets.length === 0 ? (
        <div className="text-slate-400 p-8 text-center border-2 border-dashed rounded-xl">
          No practice sets available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practiceSets.map((set) => (
            <Link key={set.id} href={`/dashboard/practice-sets/${set.id}`} className="block group">
              <Card className="h-full border-border hover:border-primary/50 hover:bg-slate-50 transition-colors duration-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/80 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                    {set.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {set.description || "Practice questions for this topic."}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {set.subject && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {set.subject.name}
                      </span>
                    )}
                    {set.chapter && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        <Layers className="w-3 h-3 mr-1" />
                        {set.chapter.name}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-border">
                  <div className="flex items-center text-slate-500 font-medium">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {set._count.questions} Questions
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
