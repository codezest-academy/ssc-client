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
  _count: {
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
          {mockTests.map((test) => (
            <Link key={test.id} href={`/dashboard/mock-tests/${test.id}`} className="block group">
              <Card className="h-full border-border hover:border-primary/50 hover:bg-slate-50 transition-colors duration-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/80 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                    {test.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {test.description || "Full-length mock test."}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      {test.examType}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-slate-500 font-medium">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {test.durationMinutes} mins
                    </span>
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {test._count.sections} Sections
                    </span>
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
