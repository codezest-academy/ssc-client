"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, ChevronRight, Layers } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";

interface PracticeSet {
  id: string;
  title: string;
  description: string;
  subject?: { name: string };
  chapter?: { name: string };
  _count?: {
    questions: number;
  };
}

export default function PracticeSetsPage() {
  const [practiceSets, setPracticeSets] = useState<PracticeSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const user = useAuthStore((state) => state.user);

  const fetchPracticeSets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/practice-sets");
      setPracticeSets(response.data.data);
    } catch (err: any) {
      console.error("Failed to load practice sets:", err);
      setError(err instanceof Error ? err : new Error(err.response?.data?.message || err.message || "Failed to load practice sets"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPracticeSets();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-display tracking-tight">Practice Sets</h1>
        <p className="text-muted-foreground mt-2">Test your knowledge and practice MCQ questions.</p>
      </div>

      {error ? (
        <ErrorState 
          title="Failed to load practice sets" 
          description={error.message} 
          retry={fetchPracticeSets} 
        />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      ) : practiceSets.length === 0 ? (
        <EmptyState 
          icon={Target}
          title="No practice sets available"
          description="Check back later for new practice tests."
          action={
            <div className="flex flex-col items-start gap-2.5">
              <Button variant="default" className="group rounded-full px-7 shadow-sm hover:shadow-md transition-all duration-300" asChild>
                <Link href="/dashboard/curriculum">
                  Browse Curriculum
                </Link>
              </Button>
              <span className="text-[13px] text-muted-foreground/80 font-medium pl-2">
                New content added weekly
              </span>
            </div>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practiceSets.map((set, index) => (
            <Link key={set.id} href={`/dashboard/practice-sets/${set.id}`} className="group block h-full">
              <Card className="h-full border-border hover:border-primary/50 transition-colors shadow-sm rounded-xl overflow-hidden bg-card flex flex-col relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/80 scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
                <CardContent className="p-5 flex flex-col h-full gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
                        {set.title}
                      </h3>
                    </div>
                    <span className="text-4xl font-black text-muted-foreground/10 group-hover:text-muted-foreground/20 transition-colors shrink-0 leading-none">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {set.description || "Practice questions for this topic."}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {set.subject && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {set.subject.name}
                        </span>
                      )}
                      {set.chapter && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                          <Layers className="w-3 h-3 mr-1" />
                          {set.chapter.name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center text-xs font-medium text-muted-foreground">
                      <Target className="w-3.5 h-3.5 mr-1" />
                      {set._count?.questions || 0} Questions
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
