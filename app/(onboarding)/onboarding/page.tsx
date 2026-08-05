"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EXAMS = [
  { id: "SSC_CGL", name: "SSC CGL", description: "Combined Graduate Level" },
  { id: "SSC_CHSL", name: "SSC CHSL", description: "Combined Higher Secondary Level" },
  { id: "SSC_MTS", name: "SSC MTS", description: "Multi Tasking Staff" },
  { id: "SSC_CPO", name: "SSC CPO", description: "Central Police Organization" },
  { id: "SSC_GD", name: "SSC GD", description: "General Duty Constable" },
];

export default function OnboardingPage() {
  const { user, isHydrated, accessToken, setAuth } = useAuthStore();
  const router = useRouter();
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isHydrated) {
      if (!user) {
        router.replace("/login");
      } else if (user.targetExam) {
        router.replace("/dashboard");
      }
    }
  }, [user, isHydrated, router]);

  const handleSubmit = async () => {
    if (!selectedExam) {
      toast.error("Please select a target exam");
      return;
    }

    setLoading(true);
    try {
      const response = await api.patch("/users/me", { targetExam: selectedExam });
      const updatedUser = response.data.data;
      
      // Update store with new user data containing targetExam
      if (accessToken) {
        setAuth({ ...user, ...updatedUser }, accessToken);
      }
      
      toast.success("Profile updated successfully!");
      router.push("/dashboard");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated || !user || user.targetExam) {
    return null;
  }

  return (
    <div className="bg-card text-card-foreground border shadow-xl rounded-2xl p-8 sm:p-10 w-full">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold tracking-tight">Select Your Target Exam</h2>
        <p className="text-muted-foreground mt-2">
          Choose the exam you are primarily preparing for. This helps us personalize your curriculum and study plan.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {EXAMS.map((exam) => {
          const isSelected = selectedExam === exam.id;
          return (
            <button
              key={exam.id}
              type="button"
              onClick={() => setSelectedExam(exam.id)}
              className={cn(
                "relative flex flex-col text-left p-5 rounded-xl border-2 transition-all duration-200 overflow-hidden group min-h-[44px]",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900/50"
              )}
            >
              <div className="flex justify-between items-center w-full">
                <span className={cn("font-bold text-lg", isSelected ? "text-primary" : "text-foreground")}>
                  {exam.name}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in-50 duration-300" />
                )}
              </div>
              <span className="text-sm text-muted-foreground mt-1">{exam.description}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedExam || loading}
          className="h-12 px-8 text-base font-bold rounded-lg group"
        >
          {loading ? "Saving..." : "Continue"}
          {!loading && <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </div>
    </div>
  );
}
