import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://codezest-ssc.com"),
  title: {
    template: "%s | Code Zest",
    default: "SSC CGL Preparation - Diagnostic Mocks & PYQs | Code Zest",
  },
  description: "The only premium, AI-driven platform that diagnoses your exact weaknesses and generates a personalized, daily micro-learning path to 160+ for SSC CGL. Access bilingual video solutions, test series, and advanced analytics.",
  openGraph: {
    title: "SSC CGL Preparation - Diagnostic Mocks & PYQs | Code Zest",
    description: "The only premium, AI-driven platform that diagnoses your exact weaknesses and generates a personalized, daily micro-learning path to 160+ for SSC CGL.",
    url: "https://codezest-ssc.com",
    siteName: "Code Zest",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Code Zest SSC CGL Preparation",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SSC CGL Preparation - Diagnostic Mocks & PYQs | Code Zest",
    description: "The only premium, AI-driven platform that diagnoses your exact weaknesses and generates a personalized, daily micro-learning path to 160+ for SSC CGL.",
    images: ["/og-image.jpg"],
  },
};

import { PostHogProvider } from "@/components/providers/posthog-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              {children}
              <Toaster />
            </Providers>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
