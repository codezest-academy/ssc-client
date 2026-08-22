"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

interface QuadrantDataPoint {
  questionId: string;
  timeTaken: number;
  isCorrect: number; // 0 or 1
  isAnswered: boolean;
  subjectName: string;
  chapterName: string;
}

interface Props {
  data: QuadrantDataPoint[];
  avgTime: number;
}

export function TimeAccuracyQuadrant({ data, avgTime }: Props) {
  // We only plot answered questions
  const answeredData = data.filter(d => d.isAnswered);

  // Group by correctness to render different colors
  const correctData = answeredData.filter(d => d.isCorrect === 1);
  const incorrectData = answeredData.filter(d => d.isCorrect === 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as QuadrantDataPoint;
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-md text-sm">
          <p className="font-bold mb-1">{dataPoint.subjectName} - {dataPoint.chapterName}</p>
          <p>Time Taken: <span className="font-semibold">{dataPoint.timeTaken}s</span></p>
          <p>Status: <span className={dataPoint.isCorrect ? "text-success" : "text-destructive font-semibold"}>
            {dataPoint.isCorrect ? "Correct" : "Incorrect"}
          </span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            type="number" 
            dataKey="timeTaken" 
            name="Time Taken" 
            unit="s" 
            label={{ value: 'Time Taken (seconds)', position: 'insideBottom', offset: -10 }} 
          />
          <YAxis 
            type="number" 
            dataKey="isCorrect" 
            name="Accuracy" 
            domain={[-0.2, 1.2]}
            ticks={[0, 1]}
            tickFormatter={(val) => val === 1 ? 'Correct' : val === 0 ? 'Incorrect' : ''}
          />
          <ZAxis type="number" range={[100, 100]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          
          <ReferenceLine x={avgTime} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: 'Avg Time', position: 'top', fill: 'hsl(var(--muted-foreground))' }} />
          
          <Scatter name="Incorrect" data={incorrectData} fill="hsl(var(--destructive))">
            {incorrectData.map((entry, index) => (
              <Cell key={`cell-incorrect-${index}`} fill={entry.timeTaken > avgTime ? "hsl(var(--destructive))" : "hsl(var(--warning))"} />
            ))}
          </Scatter>
          
          <Scatter name="Correct" data={correctData} fill="hsl(var(--success))">
            {correctData.map((entry, index) => (
              <Cell key={`cell-correct-${index}`} fill={entry.timeTaken > avgTime ? "hsl(var(--info))" : "hsl(var(--success))"} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
