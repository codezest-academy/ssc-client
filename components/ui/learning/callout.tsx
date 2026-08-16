import { cn } from "@/lib/utils";
import { AlertCircle, BookOpen, Lightbulb, TriangleAlert, GraduationCap } from "lucide-react";

interface CalloutProps {
  children: React.ReactNode;
  variant?: "info" | "warning" | "exam" | "tip";
  title?: string;
}

export function Callout({ children, variant = "info", title }: CalloutProps) {
  const styles = {
    info: {
      container: "bg-info/5 border-info/20 text-info",
      icon: <BookOpen className="w-5 h-5 text-info" />,
      defaultTitle: "Note",
    },
    warning: {
      container: "bg-warning/5 border-warning/20 text-warning",
      icon: <TriangleAlert className="w-5 h-5 text-warning" />,
      defaultTitle: "Warning",
    },
    exam: {
      container: "bg-primary/5 border-primary/20 text-primary",
      icon: <GraduationCap className="w-5 h-5 text-primary" />,
      defaultTitle: "Exam Alert",
    },
    tip: {
      container: "bg-success/5 border-success/20 text-success",
      icon: <Lightbulb className="w-5 h-5 text-success" />,
      defaultTitle: "Pro Tip",
    },
  };

  const style = styles[variant];

  return (
    <div className={cn("my-4 flex gap-4 rounded-xl border p-4 shadow-sm text-sm", style.container)}>
      <div className="shrink-0 mt-0.5">{style.icon}</div>
      <div className="flex-1">
        <div className="font-bold mb-2 text-inherit">{title || style.defaultTitle}</div>
        <div className="text-foreground opacity-90 prose-p:my-0 prose-p:leading-relaxed prose-li:my-0.5">
          {children}
        </div>
      </div>
    </div>
  );
}
