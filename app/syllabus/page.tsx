"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlayCircle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SyllabusPage() {
  const [selectedExamId, setSelectedExamId] = useState<string>("");

  const { data: exams, isLoading: isLoadingExams } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const res = await api.get("/exams");
      return res.data.data;
    }
  });

  const { data: syllabus, isLoading: isLoadingSyllabus } = useQuery({
    queryKey: ["syllabus", selectedExamId],
    queryFn: async () => {
      if (!selectedExamId) return [];
      const res = await api.get(`/exams/${selectedExamId}/syllabus`);
      return res.data.data;
    },
    enabled: !!selectedExamId
  });

  // Group syllabus by subject
  const groupedSyllabus = Array.isArray(syllabus) ? syllabus.reduce((acc: any, node: any) => {
    if (!acc.has(node.subject?.name)) {
      acc.set(node.subject?.name, []);
    }
    acc.get(node.subject?.name).push(node);
    return acc;
  }, new Map()) : new Map();

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Exam Syllabus
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          View official syllabus details and start practicing chapter-wise.
        </p>
      </div>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="pb-4 border-b">
          <CardTitle>Select Target Exam</CardTitle>
          <CardDescription>Choose an exam to view its detailed syllabus.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingExams ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading exams...
            </div>
          ) : (
            <Select 
              value={selectedExamId} 
              onValueChange={setSelectedExamId}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                {exams?.map((exam: any) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name} {exam.examYear ? `(${exam.examYear})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedExamId && (
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Syllabus Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSyllabus ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : Array.from(groupedSyllabus).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No syllabus data available for this exam.
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {(Array.from(groupedSyllabus) as [string, any][]).map(([subjectName, nodes], index) => {
                  const subject = nodes[0].subject;
                  return (
                    <AccordionItem key={subject.id || index} value={`item-${index}`} className="border rounded-lg px-4 bg-card">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-semibold text-lg">{subjectName}</span>
                          <Badge variant="secondary" className="font-normal">
                            {nodes.length} Chapters
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="space-y-2">
                          {nodes.map((node: any) => (
                            <div key={node.id} className="flex items-center justify-between p-3 rounded-md border border-border/50 bg-background/50 hover:bg-accent/5 transition-colors">
                              <span className="font-medium text-foreground">
                                {node.chapter ? node.chapter.name : "General"}
                              </span>
                              <Button size="sm" className="gap-2" onClick={() => window.location.href = `/pyq/${subject.slug}/${node.chapter?.slug}`}>
                                <PlayCircle className="h-4 w-4" />
                                Practice
                              </Button>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
