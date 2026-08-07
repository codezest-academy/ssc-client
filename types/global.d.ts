export {};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
      open: () => void;
    };
  }
}
