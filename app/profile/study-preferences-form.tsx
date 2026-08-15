"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, CheckCircle2, GraduationCap, Clock, CalendarDays } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const studyPrefsSchema = z.object({
  targetExam: z.array(z.string()).min(1, "Select at least one exam"),
  examYear: z.coerce.number().int().min(2025).max(2035),
  dailyStudyTime: z.enum(["LESS_THAN_2_HOURS", "TWO_TO_FOUR_HOURS", "MORE_THAN_4_HOURS"]),
});

type StudyPrefsFormValues = z.infer<typeof studyPrefsSchema>;

const EXAM_OPTIONS = [
  { id: "SSC_CGL", label: "SSC CGL", color: "bg-exam-cgl", text: "text-exam-cgl" },
  { id: "SSC_CHSL", label: "SSC CHSL", color: "bg-exam-chsl", text: "text-exam-chsl" },
  { id: "SSC_MTS", label: "SSC MTS", color: "bg-exam-mts", text: "text-exam-mts" },
  { id: "SSC_CPO", label: "SSC CPO", color: "bg-exam-cpo", text: "text-exam-cpo" },
  { id: "SSC_GD", label: "SSC GD", color: "bg-exam-gd", text: "text-exam-gd" },
];

export default function StudyPreferencesForm({ user }: { user: any }) {
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StudyPrefsFormValues>({
    resolver: zodResolver(studyPrefsSchema),
    defaultValues: {
      targetExam: Array.isArray(user.targetExam) ? user.targetExam : user.targetExam ? [user.targetExam] : [],
      examYear: user.examYear || 2026,
      dailyStudyTime: user.dailyStudyTime || "TWO_TO_FOUR_HOURS",
    },
  });

  const onSubmit = async (data: StudyPrefsFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.patch("/users/me", data);
      setUser(response.data.data.user);
      toast.success("Study preferences updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update study preferences");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        
        {/* Target Exams */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-black text-foreground">Target Exams</Label>
            <p className="text-xs text-muted-foreground mt-1">Select all the exams you are preparing for.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {EXAM_OPTIONS.map((exam) => {
              const currentExams = form.watch("targetExam");
              const isChecked = currentExams.includes(exam.id);

              return (
                <label
                  key={exam.id}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-300 overflow-hidden group ${
                    isChecked
                      ? "border-primary bg-primary/5 shadow-md -translate-y-1"
                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 ${exam.color}/20 rounded-bl-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity`} />
                  
                  {isChecked && (
                    <div className={`absolute top-3 right-3 ${exam.text} animate-in zoom-in`}>
                      <CheckCircle2 className="w-5 h-5 fill-current text-card" />
                    </div>
                  )}

                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        form.setValue("targetExam", [...currentExams, exam.id]);
                      } else {
                        form.setValue(
                          "targetExam",
                          currentExams.filter((e) => e !== exam.id)
                        );
                      }
                    }}
                    className="sr-only"
                  />
                  <span className={`text-lg font-black tracking-tight mt-2 ${isChecked ? exam.text : "text-foreground"}`}>
                    {exam.label}
                  </span>
                </label>
              );
            })}
          </div>
          {form.formState.errors.targetExam && (
            <p className="text-[10px] text-destructive font-bold">{form.formState.errors.targetExam.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2.5">
            <Label htmlFor="examYear" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Exam Year</Label>
            <div className="relative">
              <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
              <Select 
                value={form.watch("examYear").toString()} 
                onValueChange={(val) => form.setValue("examYear", parseInt(val))}
              >
                <SelectTrigger className="rounded-2xl pl-10 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary transition-all h-12">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="dailyStudyTime" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Daily Study Time</Label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
              <Select 
                value={form.watch("dailyStudyTime")} 
                onValueChange={(val) => form.setValue("dailyStudyTime", val as any)}
              >
                <SelectTrigger className="rounded-2xl pl-10 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary transition-all h-12">
                  <SelectValue placeholder="Select study time" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="LESS_THAN_2_HOURS">Less than 2 hours</SelectItem>
                  <SelectItem value="TWO_TO_FOUR_HOURS">2-4 hours</SelectItem>
                  <SelectItem value="MORE_THAN_4_HOURS">More than 4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isLoading} className="rounded-2xl h-12 font-bold px-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all w-full md:w-auto">
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
