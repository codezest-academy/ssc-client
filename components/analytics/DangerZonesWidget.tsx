"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowRight, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DangerZone {
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterName: string;
  accuracy: number;
  avgTimeSeconds: number;
  totalAttempted: number;
}

export function DangerZonesWidget() {
  const [zones, setZones] = useState<DangerZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDangerZones = async () => {
      try {
        const response = await api.get("/analytics/danger-zones");
        setZones(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch danger zones", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDangerZones();
  }, []);

  if (loading) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            AI Danger Zones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (zones.length === 0) {
    return null; // Don't show the widget if there are no danger zones!
  }

  return (
    <Card className="border-destructive/20 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-destructive/50" />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
          <AlertCircle className="w-5 h-5 text-destructive" />
          Priority Danger Zones
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Our AI has identified these topics as chronic weaknesses based on your recent tests.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {zones.slice(0, 3).map((zone) => (
          <div 
            key={zone.chapterId}
            className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 rounded-xl border border-destructive/10 bg-destructive/5"
          >
            <div>
              <div className="text-xs font-semibold text-destructive uppercase tracking-wider mb-1">
                {zone.subjectName}
              </div>
              <h4 className="font-medium text-foreground">{zone.chapterName}</h4>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {zone.accuracy}% Acc
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {zone.avgTimeSeconds}s / Q
                </span>
              </div>
            </div>
            
            <Link href={`/dashboard/practice-sets/dynamic?subjectId=${zone.subjectId}&chapterId=${zone.chapterId}`}>
              <Button size="sm" variant="destructive" className="w-full sm:w-auto gap-2">
                Targeted Practice
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
