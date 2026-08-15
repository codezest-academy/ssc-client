import { api } from './axios';

interface ErrorReportPayload {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const recentErrors = new Set<string>();

/**
 * Normalizes error messages and creates a local string fingerprint for rate-limiting.
 */
function createLocalFingerprint(message: string, stack?: string): string {
  const normMessage = message.replace(/\b[0-9a-f]{8,}\b/gi, '<id>').replace(/\b\d{4,}\b/g, '<n>');
  const firstFrame = stack?.split('\n').find((line) => line.includes('at ') && !line.includes('node_modules'))?.trim() ?? '';
  return `${normMessage}|${firstFrame}`;
}

/**
 * Sends an error report to the backend.
 * Includes local deduplication (rate limiting) to prevent spamming the API 
 * if a component crashes in a render loop.
 */
export async function reportClientError(payload: ErrorReportPayload) {
  const fingerprint = createLocalFingerprint(payload.message, payload.stack);

  // 60-second local deduplication
  if (recentErrors.has(fingerprint)) {
    console.debug('Error reporter: Skipping duplicate error', fingerprint);
    return;
  }
  
  recentErrors.add(fingerprint);
  setTimeout(() => recentErrors.delete(fingerprint), 60 * 1000);

  try {
    await api.post(
      '/errors',
      {
        fingerprint: fingerprint.slice(0, 64),
        severity: payload.severity || 'HIGH',
        message: payload.message,
        stack: payload.stack,
        componentStack: payload.componentStack,
        errorBoundary: payload.errorBoundary || 'page',
        url: window.location.href,
        routePath: window.location.pathname, // Note: Next.js router.pathname would be better but this is fine for fallback
        userAgent: navigator.userAgent,
        // appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
      },
      { _isErrorReport: true } as any
    );
  } catch (err) {
    console.error('Failed to report client error:', err);
  }
}
