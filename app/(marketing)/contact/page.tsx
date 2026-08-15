import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Code Zest Academy support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have questions about our mock tests? Need help with your subscription? Our support team is here for you.
            </p>
            
            <div className="space-y-4">
              <div>
                <strong className="block text-sm">Email</strong>
                <a href="mailto:support@codezest-ssc.com" className="text-primary hover:underline">support@codezest-ssc.com</a>
              </div>
              <div>
                <strong className="block text-sm">Address</strong>
                <p className="text-muted-foreground">
                  [Company Address Line 1]<br/>
                  [City, State, ZIP]<br/>
                  India
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full border rounded-md p-2 bg-background" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full border rounded-md p-2 bg-background" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea className="w-full border rounded-md p-2 bg-background h-32 resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <Button type="button" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
