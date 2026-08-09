import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Code Zest Academy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-muted-foreground text-sm">Last Updated: [Date]</p>
          
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
  );
}
