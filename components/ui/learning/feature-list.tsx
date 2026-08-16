import { cn } from "@/lib/utils";

interface FeatureListProps {
  title?: string;
  children: React.ReactNode;
}

export function FeatureList({ title, children }: FeatureListProps) {
  return (
    <div className="my-8">
      {title && (
        <div className="mb-4 text-lg font-bold text-foreground font-display tracking-tight">
          {title}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

interface FeatureItemProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function FeatureItem({ title, subtitle, children }: FeatureItemProps) {
  return (
    <div className="flex flex-col p-4 rounded-xl border border-border/50 bg-card shadow-sm hover:border-primary/30 transition-colors">
      <div className="font-bold text-foreground text-base leading-tight mb-1">{title}</div>
      {subtitle && <div className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">{subtitle}</div>}
      <div className="text-sm text-muted-foreground leading-relaxed prose-p:my-0 prose-ul:my-0">
        {children}
      </div>
    </div>
  );
}
