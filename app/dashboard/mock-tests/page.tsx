"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";

interface MockTest {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  examType: string;
  _count?: {
    sections: number;
  };
}

export default function MockTestsPage() {
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const user = useAuthStore((state) => state.user);

  const fetchMockTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/mock-tests");
      setMockTests(response.data.data);
    } catch (err: any) {
      console.error("Failed to load mock tests:", err);
      setError(err instanceof Error ? err : new Error(err.response?.data?.message || err.message || "Failed to load mock tests"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockTests();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground font-display tracking-tight">Mock Tests</h2>
        <p className="text-muted-foreground mt-2">Take full-length mock exams under timed conditions.</p>
      </div>

      {error ? (
        <ErrorState 
          title="Failed to load mock tests" 
          description={error.message} 
          retry={fetchMockTests} 
        />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      ) : mockTests.length === 0 ? (
        <EmptyState 
          icon={FileText}
          title="No mock tests available"
          description="Check back later for new mock exams."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map((test, index) => (
            <Link key={test.id} href={`/dashboard/mock-tests/${test.id}`} className="group block h-full">
              <Card className="h-full border-border hover:border-primary/50 transition-colors shadow-sm rounded-xl overflow-hidden bg-card flex flex-col relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/80 scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
                <CardContent className="p-5 flex flex-col h-full gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
                        {test.title}
                      </h3>
                    </div>
                    <span className="text-4xl font-black text-muted-foreground/10 group-hover:text-muted-foreground/20 transition-colors shrink-0 leading-none">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {test.description || "Full-length mock test."}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        {test.examType}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {test.durationMinutes} mins
                      </span>
                      <span className="flex items-center">
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        {test._count?.sections || 0} Sections
                      </span>
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
