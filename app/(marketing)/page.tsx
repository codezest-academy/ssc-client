import Link from "next/link";
import {
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Clock,
  PlayCircle,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestimonialsSection } from "@/components/marketing/testimonials";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://codezest-ssc.com/#organization",
        name: "Code Zest Academy",
        url: "https://codezest-ssc.com",
        logo: "https://codezest-ssc.com/logo.png",
        description:
          "The only premium, AI-driven platform that diagnoses your exact weaknesses and generates a personalized, daily micro-learning path to 160+ for SSC CGL.",
      },
      {
        "@type": "WebSite",
        "@id": "https://codezest-ssc.com/#website",
        url: "https://codezest-ssc.com",
        name: "Code Zest",
        publisher: {
          "@id": "https://codezest-ssc.com/#organization",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <>
        {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40 border-b">
        {/* Animated Background from globals.css logic */}
        <div className="absolute inset-0 z-0 bg-[#0a0a0f] hidden dark:block">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#0a0a0f] to-[#0a0a0f] opacity-80" />
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-float-slow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px] animate-float-slower" />
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 shadow-sm">
            New SSC CGL Tier-1 Mock Tests Available
          </div>

          <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
            Master SSC Exams with{" "}
            <span className="text-primary">AI-Powered Insights</span>
          </h1>

          <p className="max-w-2xl text-xl text-muted-foreground mb-10 leading-relaxed">
            The most advanced preparation platform for SSC CGL, CHSL, and MTS.
            Experience real exam interfaces, deep analytics, and bilingual video
            solutions.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-bold rounded-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-bold rounded-xl border-2 shadow-sm hover:bg-accent hover:-translate-y-1 transition-all"
              >
                Explore Features
              </Button>
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-border/50 flex flex-col items-center">
            <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">
              Trusted by top aspirants across India
            </p>
            <div className="flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Dummy logos for social proof */}
              <div className="font-bold text-xl">TopRankers</div>
              <div className="font-bold text-xl">SSCAdda</div>
              <div className="font-bold text-xl">TestBook</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features (Bento Grid) */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Why Choose Code Zest Academy?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to crack SSC exams in your first attempt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="md:col-span-2 bg-card border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI-Driven Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our smart platform identifies your weak topics and suggests
                personalized practice sets. Stop wasting time on what you
                already know and focus on maximizing your score.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="md:col-span-1 bg-card border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-subject-quant/10 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-subject-quant" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real Exam Interface</h3>
              <p className="text-muted-foreground">
                Practice on an interface identical to the actual TCS exam
                pattern.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="md:col-span-1 bg-card border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-subject-english/10 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-subject-english" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bilingual Content</h3>
              <p className="text-muted-foreground">
                All questions and solutions are available in both Hindi and
                English.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-2 bg-card border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-subject-science/10 rounded-2xl flex items-center justify-center mb-6">
                <PlayCircle className="w-6 h-6 text-subject-science" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Video Solutions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Stuck on a tough question? Access high-quality video
                explanations from top educators for every single mock test
                question.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 Testimonials */}
      <TestimonialsSection />

      {/* 4. Pricing Section */}
      <section id="pricing" className="py-24 border-t">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Invest in your career with our affordable plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Free Tier */}
            <div className="bg-card border rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-2">Basic</h3>
              <div className="text-4xl font-extrabold mb-6">
                Free
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  /forever
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />{" "}
                  1 Free Mock Test per week
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />{" "}
                  Basic Score Analysis
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-muted mr-3 shrink-0" />{" "}
                  No Video Solutions
                </li>
              </ul>
              <Link href="/pricing" className="block">
                <Button variant="outline" className="w-full font-bold">
                  Know More
                </Button>
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-card border-2 border-primary rounded-3xl p-8 shadow-2xl relative scale-100 md:scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Recommended
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary">Pro Pass</h3>
              <div className="text-4xl font-extrabold mb-6">
                ₹499
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  /month
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />{" "}
                  Unlimited Mock Tests
                </li>
                <li className="flex items-center text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />{" "}
                  Sectional & Chapter Tests
                </li>
                <li className="flex items-center text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />{" "}
                  Advanced AI Analytics
                </li>
                <li className="flex items-center text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />{" "}
                  Text Solutions
                </li>
              </ul>
              <Link href="/pricing" className="block">
                <Button className="w-full font-bold shadow-lg shadow-primary/20">
                  Know More
                </Button>
              </Link>
            </div>

            {/* Elite Tier */}
            <div className="bg-card border rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-2">Infinity</h3>
              <div className="text-4xl font-extrabold mb-6">
                ₹999
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  /month
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />{" "}
                  Everything in Pro
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />{" "}
                  Full Video Courses
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />{" "}
                  Live Doubt Solving
                </li>
              </ul>
              <Link href="/pricing" className="block">
                <Button variant="outline" className="w-full font-bold">
                  Know More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </>
    </>
  );
}
