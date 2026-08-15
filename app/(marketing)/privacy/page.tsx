import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Code Zest Academy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground bg-grid-pattern">
      <main className="flex-1 relative flex flex-col py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-display">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Last Updated: August 2026
            </p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-xl border border-border/60 rounded-3xl p-8 md:p-12 shadow-floating">
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary">
              <h2>1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account, update your profile, participate in mock tests, or communicate with us.</p>
              
              <h2>2. How We Use Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, to personalize your experience (e.g., AI recommendations), and to process transactions.</p>
              
              <h2>3. Data Sharing and Disclosure</h2>
              <p>We do not share your personal information with third parties except as necessary to provide our services (e.g., payment processors like Razorpay/Stripe) or to comply with the law.</p>
              
              <h2>4. Security</h2>
              <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.</p>
              
              <h2>5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at support@codezest-ssc.com.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
