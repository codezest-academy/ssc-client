import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, HelpCircle, Trophy } from "lucide-react";

export default async function ExamMockTestsLandingPage({ params }: { params: Promise<{ examSlug: string }> }) {
  const resolvedParams = await params;
  const examSlug = resolvedParams.examSlug || "";
  
  if (!examSlug) return null;

  // Format exam slug to readable title (e.g. ssc-cgl -> SSC CGL)
  const examTitle = examSlug.replace(/-/g, ' ').toUpperCase();
  
  // Fetch mock tests for this exam
  const examType = examSlug.replace(/-/g, '_').toUpperCase();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/mock-tests?examType=${examType}`, {
    cache: 'no-store'
  }).catch(() => null);
  
  const result = res ? await res.json().catch(() => null) : null;
  const mockTests: any[] = result?.data || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 sm:px-12 lg:px-24 border-b border-border bg-card">
        <div className="absolute inset-0 z-0 bg-primary/5 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-sm py-1 px-3">
            Updated for 2026 Syllabus
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            {examTitle} Mock Tests
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Boost your preparation with our industry-leading mock tests. 
            Experience the real exam interface and get detailed analytics instantly.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#tests-list">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                Start Your Free Mock Test Now
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4 text-warning" />
              Used by 50,000+ Aspirants
            </span>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 border-b border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <Clock className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Real Exam Interface</CardTitle>
              <CardDescription>
                Practice in an environment that exactly simulates the official TCS iON platform.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader>
              <HelpCircle className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Detailed Solutions</CardTitle>
              <CardDescription>
                Get step-by-step explanations and shortcut tricks for every single question.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader>
              <Trophy className="w-8 h-8 text-primary mb-2" />
              <CardTitle>All India Rank</CardTitle>
              <CardDescription>
                Compete with thousands of aspirants and know exactly where you stand.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Tests List Section */}
      <section id="tests-list" className="py-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Available {examTitle} Tests</h2>
            <p className="text-muted-foreground">Select a test below to start practicing immediately. No login required for your first test!</p>
          </div>

          <div className="space-y-4">
            {mockTests.length === 0 ? (
              <div className="text-center py-12 border border-border rounded-lg bg-card">
                <p className="text-muted-foreground">No mock tests available for {examTitle} yet. Check back soon!</p>
              </div>
            ) : (
              mockTests.map((test, index) => (
                <Card key={test.id} className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-6">
                    <div className="space-y-2 flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h3 className="font-semibold text-lg text-foreground">{test.title}</h3>
                        {index === 0 && <Badge className="bg-success/10 text-success border-success/20">FREE</Badge>}
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><HelpCircle className="w-4 h-4" /> {test.totalQuestions} Qs</span>
                        <span className="flex items-center gap-1"><Trophy className="w-4 h-4" /> {test.totalMarks} Marks</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {test.durationMinutes} Mins</span>
                      </div>
                    </div>
                    
                    <Link href={`/tests/overview/${test.id}`}>
                      <Button variant={index === 0 ? "default" : "outline"} className={index === 0 ? "w-full sm:w-auto" : "w-full sm:w-auto border-primary text-primary hover:bg-primary/10"}>
                        {index === 0 ? "Attempt Free Test" : "Unlock Test"}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
