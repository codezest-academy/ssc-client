import { PremiumGate } from "@/components/gates/PremiumGate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Dashboard</h2>
        <p className="text-slate-500 mt-2">Resume your learning and track your progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Subject</CardTitle>
            <CardDescription>Mathematics - Quantitative Aptitude</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[45%]" />
              </div>
              <p className="text-sm text-slate-600">45% completed. Next chapter: Algebra Basics.</p>
              <Button>Resume Learning</Button>
            </div>
          </CardContent>
        </Card>

        <PremiumGate>
          <Card className="border-blue-100 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="text-blue-900">SSC CGL Tier 1 Mock Test</CardTitle>
              <CardDescription className="text-blue-700">Full length test with 100 questions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 mb-4">
                Test your preparation with our premium mock tests designed by experts.
              </p>
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700">Start Test Now</Button>
            </CardContent>
          </Card>
        </PremiumGate>
      </div>
    </div>
  );
}
