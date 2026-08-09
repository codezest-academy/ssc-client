import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Code Zest Academy.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-muted-foreground text-sm">Last Updated: [Date]</p>
          
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
  );
}
