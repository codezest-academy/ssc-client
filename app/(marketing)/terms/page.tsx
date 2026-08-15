import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Code Zest Academy.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground bg-grid-pattern">
      <main className="flex-1 relative flex flex-col py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-display">
              Terms of Service
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Last Updated: August 2026
            </p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-xl border border-border/60 rounded-3xl p-8 md:p-12 shadow-floating">
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary">
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing and using Code Zest Academy, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h2>2. User Accounts</h2>
              <p>You must create an account to use certain features. You are responsible for maintaining the confidentiality of your account information.</p>
              
              <h2>3. Subscriptions and Payments</h2>
              <p>Certain services are provided for a fee. By subscribing, you agree to our pricing and payment terms. Payments are processed securely via third-party providers.</p>
              
              <h2>4. Intellectual Property</h2>
              <p>All content, mock tests, video solutions, and software on this platform are the property of Code Zest Academy and are protected by copyright laws.</p>
              
              <h2>5. Limitation of Liability</h2>
              <p>Code Zest Academy is provided "as is". We make no warranties regarding the accuracy, completeness, or reliability of the content.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
