"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { reportClientError } from "../../lib/error-reporter";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  boundaryName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    // Auto-report to backend
    reportClientError({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack || undefined,
      errorBoundary: this.props.boundaryName || "inline",
      severity: "HIGH",
    });
  }

  private resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === "function") {
          return this.props.fallback(this.state.error, this.resetError);
        }
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 flex flex-col items-center justify-center text-center space-y-4 my-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Something went wrong
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              A problem occurred while rendering this section. Our team has been notified.
            </p>
            {process.env.NODE_ENV === "development" && (
              <div className="text-left bg-background/50 p-4 rounded-lg overflow-auto max-h-[300px] w-full text-xs font-mono text-muted-foreground mb-4">
                <p className="font-bold text-destructive mb-2">{this.state.error.toString()}</p>
                <pre>{this.state.error.stack}</pre>
              </div>
            )}
            <button
              onClick={this.resetError}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
