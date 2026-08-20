import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

interface PeerComparisonData {
  studentAccuracy: number;
  communityAverage: number;
  top10PercentAverage: number;
}

interface PeerComparisonChartProps {
  data: PeerComparisonData;
}

export function PeerComparisonChart({ data }: PeerComparisonChartProps) {
  if (!data) return null;

  const chartData = [
    { name: "You", accuracy: data.studentAccuracy, fill: "hsl(var(--primary))" },
    { name: "Community Avg", accuracy: data.communityAverage, fill: "hsl(var(--muted-foreground))" },
    { name: "Top 10%", accuracy: data.top10PercentAverage, fill: "hsl(var(--warning))" },
  ];

  return (
    <Card className="border-border shadow-sm relative overflow-hidden bg-card/50">
      <CardHeader className="border-b border-border bg-muted/20 pb-5">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Peer Comparison
        </CardTitle>
        <CardDescription>How you stack up against other aspirants.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 600 }}
                width={100}
              />
              <Tooltip 
                cursor={{ fill: "transparent" }}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  color: "hsl(var(--foreground))"
                }}
                formatter={(value: any) => [`${value}%`, "Accuracy"]}
              />
              <Bar dataKey="accuracy" radius={[0, 4, 4, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
