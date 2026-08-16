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
          "--normal-bg": "transparent",
          "--normal-text": "var(--foreground)",
          "--normal-border": "rgba(255, 255, 255, 0.1)",
          "--border-radius": "9999px", // rounded-full
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast transition-all flex items-center gap-3 bg-black/40 backdrop-blur-2xl text-foreground border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-full py-3 px-5 font-sans",
          title: "text-foreground font-semibold text-sm",
          description: "text-slate-300 text-xs font-medium ml-1",
          actionButton: "bg-primary text-primary-foreground font-semibold rounded-full px-4 py-1.5 shadow-sm text-xs ml-auto",
          cancelButton: "bg-white/10 text-white hover:bg-white/20 font-semibold rounded-full px-4 py-1.5 text-xs ml-2 transition-colors",
          success: "!border-success/30 !bg-success/5 shadow-[0_0_20px_rgba(34,197,94,0.15)]",
          error: "!border-destructive/30 !bg-destructive/5 shadow-[0_0_20px_rgba(239,68,68,0.15)]",
          warning: "!border-warning/30 !bg-warning/5 shadow-[0_0_20px_rgba(245,158,11,0.15)]",
          info: "!border-info/30 !bg-info/5 shadow-[0_0_20px_rgba(59,130,246,0.15)]",
          loading: "!border-white/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
