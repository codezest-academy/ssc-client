"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="bottom-right"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-success" />,
        info: <InfoIcon className="size-5 text-info" />,
        warning: <TriangleAlertIcon className="size-5 text-warning" />,
        error: <OctagonXIcon className="size-5 text-destructive" />,
        loading: <Loader2Icon className="size-5 animate-spin text-muted-foreground" />,
      }}
      style={
        {
          "--normal-bg": "transparent",
          "--normal-text": "var(--foreground)",
          "--normal-border": "rgba(255, 255, 255, 0.1)",
          "--border-radius": "1rem", // rounded-2xl
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast transition-all bg-background/60 backdrop-blur-xl text-foreground border border-white/10 shadow-2xl shadow-black/40 rounded-2xl p-4",
          title: "text-foreground font-semibold",
          description: "text-muted-foreground text-sm font-medium",
          actionButton: "bg-primary text-primary-foreground font-semibold rounded-md px-3 py-1.5 shadow-sm",
          cancelButton: "bg-muted text-muted-foreground font-semibold rounded-md px-3 py-1.5",
          success: "!bg-success/20 !border-success/30 [&_[data-title]]:!text-success-foreground",
          error: "!bg-destructive/20 !border-destructive/30 [&_[data-title]]:!text-destructive-foreground",
          warning: "!bg-warning/20 !border-warning/30 [&_[data-title]]:!text-warning-foreground",
          info: "!bg-info/20 !border-info/30 [&_[data-title]]:!text-info-foreground",
          loading: "!bg-muted/50 !text-foreground !border-white/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
