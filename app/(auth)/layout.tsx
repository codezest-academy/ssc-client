import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { DotPattern } from "@/components/ui/pattern";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      {/* Animated Deep Indigo Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#0a0a0f] to-[#0a0a0f] opacity-80" />
        
        {/* Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-float-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px] animate-float-slower" />
        <div className="absolute top-[30%] left-[60%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] animate-float-slow" style={{ animationDelay: '-5s' }} />

        <DotPattern />
      </div>

      {/* Solid Login Card Container */}
      <div className="relative z-10 w-full max-w-[420px] px-4 sm:px-0 py-12">
        
        {/* Header/Logo above the card with slight glass feel */}
        <Link href="/" className="flex flex-col items-center justify-center mb-8 group hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:bg-white/10 transition-colors">
            <GraduationCap className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Code Zest Academy</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Master the SSC Exams.</p>
        </Link>

        {children}
        
        {/* Bottom Navigation */}
        <div className="mt-8 flex justify-center">
          <Link href="/" className="flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Website
          </Link>
        </div>
        
      </div>
    </div>
  );
}
