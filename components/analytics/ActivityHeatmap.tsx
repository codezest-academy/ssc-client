"use client";

import { useMemo } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { Flame, Trophy, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityHeatmapProps {
  data: { date: string; count: number }[];
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
}

export function ActivityHeatmap({ data, currentStreak, longestStreak, totalContributions }: ActivityHeatmapProps) {
  // Generate last 30 days for the chart
  const chartData = useMemo(() => {
    const today = startOfDay(new Date());
    const daysToShow = 30;
    const pastDays = Array.from({ length: daysToShow }, (_, i) => {
      const d = subDays(today, daysToShow - 1 - i);
      return format(d, 'yyyy-MM-dd');
    });

    const countMap = new Map(data.map(d => [d.date, d.count]));
    
    return pastDays.map(date => {
      return { 
        date, 
        displayDate: format(new Date(date), 'MMM d'),
        count: countMap.get(date) || 0 
      };
    });
  }, [data]);

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b border-border bg-muted/20 pb-5">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Progress & Consistency
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
            <p className="text-3xl font-black text-foreground mb-1">{totalContributions.toLocaleString()}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Contributions</p>
          </div>
          
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 text-center flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-[3px] border-primary/20 border-t-primary flex items-center justify-center mb-2 group-hover:rotate-180 transition-transform duration-700">
                <div className="group-hover:-rotate-180 transition-transform duration-700">
                  <Flame className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-black text-foreground mb-1">{currentStreak}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Current Streak</p>
            </div>
          </div>

          <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-full border-[3px] border-border flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-black text-foreground mb-1">{longestStreak}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Longest Streak</p>
          </div>
        </div>

        <div className="h-[250px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="displayDate" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                dy={10}
                minTickGap={20}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ color: 'hsl(var(--primary))' }}
                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                name="Contributions"
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ r: 4, fill: 'hsl(var(--background))', stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
