import { cn } from "@/lib/utils";
import { AlertCircle, BookOpen, Lightbulb, TriangleAlert } from "lucide-react";

interface CalloutProps {
  children: React.ReactNode;
  variant?: "info" | "warning" | "exam" | "tip";
  title?: string;
}

export function Callout({ children, variant = "info", title }: CalloutProps) {
  const styles = {
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-900",
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      defaultTitle: "Note",
    },
    warning: {
      container: "bg-amber-50 border-amber-200 text-amber-900",
      icon: <TriangleAlert className="w-5 h-5 text-amber-600" />,
      defaultTitle: "Warning",
    },
    exam: {
      container: "bg-red-50 border-red-200 text-red-900",
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      defaultTitle: "Exam Alert",
    },
    tip: {
      container: "bg-emerald-50 border-emerald-200 text-emerald-900",
      icon: <Lightbulb className="w-5 h-5 text-emerald-600" />,
      defaultTitle: "Pro Tip",
    },
  };

  const style = styles[variant];

  return (
    <div className={cn("my-6 flex gap-4 rounded-xl border p-4 shadow-sm", style.container)}>
      <div className="shrink-0 mt-0.5">{style.icon}</div>
      <div className="flex-1">
        <h4 className="font-semibold mb-1 text-inherit">{title || style.defaultTitle}</h4>
        <div className="text-inherit opacity-90 prose-p:my-0 prose-p:leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
