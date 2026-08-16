"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, BookOpen, ChevronRight, Hash, Bookmark, BookText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Temporary Mock Data for Syllabus Reference
const MOCK_EXAM_SYLLABUS = {
  examName: "SSC CGL Tier 1",
  examYear: "2024",
  subjects: [
    {
      id: "subj-1",
      name: "Quantitative Aptitude",
      weightage: "50 Marks (25 Qs)",
      description: "Tests numerical ability and number sense.",
      chapters: [
        { id: "chap-1", name: "Number System" },
        { id: "chap-2", name: "Percentages" },
        { id: "chap-3", name: "Profit and Loss" },
        { id: "chap-4", name: "Time and Work" },
        { id: "chap-15", name: "Ratio and Proportion" },
      ]
    },
    {
      id: "subj-2",
      name: "General Intelligence & Reasoning",
      weightage: "50 Marks (25 Qs)",
      description: "Evaluates logical thinking and problem-solving skills.",
      chapters: [
        { id: "chap-5", name: "Analogies" },
        { id: "chap-6", name: "Coding-Decoding" },
        { id: "chap-7", name: "Blood Relations" },
        { id: "chap-8", name: "Syllogism" },
      ]
    },
    {
      id: "subj-3",
      name: "English Comprehension",
      weightage: "50 Marks (25 Qs)",
      description: "Assesses understanding of English language and vocabulary.",
      chapters: [
        { id: "chap-9", name: "Reading Comprehension" },
        { id: "chap-10", name: "Error Spotting" },
        { id: "chap-11", name: "Synonyms & Antonyms" },
        { id: "chap-16", name: "Active / Passive Voice" },
      ]
    },
    {
      id: "subj-4",
      name: "General Awareness",
      weightage: "50 Marks (25 Qs)",
      description: "Tests knowledge of current events and general knowledge.",
      chapters: [
        { id: "chap-12", name: "Current Affairs" },
        { id: "chap-13", name: "History" },
        { id: "chap-14", name: "Polity" },
        { id: "chap-17", name: "Geography" },
      ]
    }
  ]
};

export default function SyllabusPage() {
  const [loading, setLoading] = useState(false);

  const PageHeader = (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold text-foreground font-display tracking-tight flex items-center gap-2">
          <BookText className="w-8 h-8 text-primary" />
          Official Syllabus Reference
        </h2>
        <p className="text-muted-foreground mt-2">
          View the complete syllabus breakdown and topic list for your exams.
        </p>
      </div>
      <Badge variant="outline" className="px-4 py-1.5 bg-primary/5 text-primary border-primary/20 text-sm w-fit">
        <Target className="w-4 h-4 mr-2 inline" />
        {MOCK_EXAM_SYLLABUS.examName} {MOCK_EXAM_SYLLABUS.examYear}
      </Badge>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-4 w-[250px]" />
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {PageHeader}

      {/* Subject Wise breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_EXAM_SYLLABUS.subjects.map((subject, idx) => (
          <Card key={subject.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2 text-slate-900">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    {subject.name}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm text-slate-500">
                    {subject.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-slate-200/50 text-slate-700 whitespace-nowrap">
                  {subject.weightage}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                <Bookmark className="w-4 h-4 text-slate-400" />
                Topics to Cover
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subject.chapters.map((chapter) => (
                  <li key={chapter.id} className="flex items-start gap-2 p-3 rounded-lg border border-slate-100 bg-white hover:border-primary/30 transition-colors">
                    <Hash className="w-4 h-4 text-primary/40 mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-slate-700 leading-tight">
                      {chapter.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
