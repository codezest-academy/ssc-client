import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type SubjectColor = 'quant' | 'reason' | 'english' | 'ga' | 'science' | 'primary'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  subjectColor?: SubjectColor
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  subjectColor = 'primary',
  className,
  ...props
}: EmptyStateProps) {
  
  const colorStyles: Record<SubjectColor, { bg: string, text: string }> = {
    quant: { bg: 'bg-subject-quant/10', text: 'text-subject-quant' },
    reason: { bg: 'bg-subject-reason/10', text: 'text-subject-reason' },
    english: { bg: 'bg-subject-english/10', text: 'text-subject-english' },
    ga: { bg: 'bg-subject-ga/10', text: 'text-subject-ga' },
    science: { bg: 'bg-subject-science/10', text: 'text-subject-science' },
    primary: { bg: 'bg-primary/10', text: 'text-primary' },
  }
  
  const activeStyles = colorStyles[subjectColor]

  return (
    <div
      className={cn(
        "relative flex w-full flex-col md:flex-row items-center md:items-start justify-between rounded-3xl bg-muted/40 p-8 md:p-10 shadow-sm overflow-hidden animate-in fade-in-50",
        className
      )}
      {...props}
    >
      {/* Decorative Watermark (Right-Aligned & Vertically Centered) */}
      <Icon 
        className={cn("absolute -right-8 top-1/2 -translate-y-1/2 h-72 w-72 opacity-5 pointer-events-none", activeStyles.text)} 
        aria-hidden="true" 
      />

      <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left max-w-xl">
        {/* Premium Icon Block (Glass Token) */}
        <div 
          className={cn(
            "flex h-[72px] w-[72px] items-center justify-center rounded-[1.25rem] border border-glass-edge shadow-sm mb-5 backdrop-blur-md",
            activeStyles.bg
          )}
        >
          <Icon 
            className={cn("h-9 w-9", activeStyles.text)} 
            strokeWidth={1.5} 
          />
        </div>
        
        <h3 className="mb-2 text-2xl font-semibold text-foreground tracking-tight">{title}</h3>
        {description && (
          <p className="max-w-md text-base text-foreground/70 leading-relaxed">
            {description}
          </p>
        )}
        {action && (
          <div className="mt-10">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}
