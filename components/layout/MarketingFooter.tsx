import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="w-full bg-[#0a0a0f] text-slate-300 py-16 md:py-20 border-t border-white/5 mt-auto">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Code Zest Academy
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              Empowering students to achieve their government job dreams through
              technology and quality education.
            </p>
          </div>

          <div>
          <h4 className="font-semibold mb-6 text-white tracking-wide">Exams</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-foreground">
                SSC CGL
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                SSC CHSL
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                SSC MTS
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                SSC CPO
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6 text-white tracking-wide">Company</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >  Terms of Service
              </Link>
            </li>
          </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Code Zest Academy. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Placeholder for social links if needed */}
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">LinkedIn</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
