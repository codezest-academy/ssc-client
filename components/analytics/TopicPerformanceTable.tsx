"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TopicPerformance {
  subjectName: string;
  chapterName: string;
  total: number;
  accuracy: number;
  avgTime: number;
}

interface Props {
  data: TopicPerformance[];
}

export function TopicPerformanceTable({ data }: Props) {
  // Sort by lowest accuracy first, then by highest time taken
  const sortedData = [...data].sort((a, b) => {
    if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
    return b.avgTime - a.avgTime;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Topic (Subject - Chapter)</TableHead>
            <TableHead className="text-right">Questions</TableHead>
            <TableHead className="text-right">Accuracy</TableHead>
            <TableHead className="text-right">Avg Time/Q</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((topic, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">
                {topic.subjectName} <span className="text-muted-foreground mx-1">/</span> {topic.chapterName}
              </TableCell>
              <TableCell className="text-right">{topic.total}</TableCell>
              <TableCell className="text-right">
                <Badge variant={topic.accuracy < 50 ? "destructive" : topic.accuracy >= 80 ? "default" : "secondary"}>
                  {topic.accuracy}%
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {topic.avgTime}s
              </TableCell>
            </TableRow>
          ))}
          {sortedData.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No performance data available for this attempt.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
