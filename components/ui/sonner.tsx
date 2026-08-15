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
      position="top-center"
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
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "1rem", // rounded-2xl
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast transition-all bg-card text-card-foreground border border-border shadow-lg rounded-xl p-4",
          title: "text-foreground font-medium",
          description: "text-muted-foreground text-sm",
          actionButton: "bg-primary text-primary-foreground font-medium rounded-md px-3 py-1.5",
          cancelButton: "bg-muted text-muted-foreground font-medium rounded-md px-3 py-1.5",
          success: "!bg-success/10 !border-success/30 [&_[data-title]]:!text-foreground [&_[data-description]]:!text-muted-foreground",
          error: "!bg-destructive/10 !border-destructive/30 [&_[data-title]]:!text-foreground [&_[data-description]]:!text-muted-foreground",
          warning: "!bg-warning/10 !border-warning/30 [&_[data-title]]:!text-foreground [&_[data-description]]:!text-muted-foreground",
          info: "!bg-info/10 !border-info/30 [&_[data-title]]:!text-foreground [&_[data-description]]:!text-muted-foreground",
          loading: "!bg-muted !text-foreground !border-border",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
