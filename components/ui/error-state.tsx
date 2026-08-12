import * as React from "react"
import { LucideIcon, ServerCrash } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title?: string
  description?: string
  onRetry?: () => void
  fullPage?: boolean
}

export function ErrorState({
  icon: Icon = ServerCrash,
  title = "Something went wrong",
  description = "Please check your connection and try again.",
  onRetry,
  fullPage,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-3xl bg-destructive/5 p-8 text-center animate-in fade-in-50",
        fullPage ? "min-h-[60vh]" : "min-h-[300px]",
        className
      )}
      {...props}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="h-10 w-10 text-destructive" strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
      <p className="mb-8 max-w-sm text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-full bg-destructive px-6 py-2.5 text-sm font-medium text-destructive-foreground transition-all hover:bg-destructive/90 active:scale-95"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
