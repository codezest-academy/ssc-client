import { Lock, PlayCircle, BookOpen, BarChart2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BuyChapterButton } from "@/components/ui/buy-chapter-button";

interface PremiumLockScreenProps {
  title?: string;
  description?: string;
  backUrl?: string;
  chapterId?: string;
  videoCount?: number;
  pdfCount?: number;
  practiceSetCount?: number;
}

export function PremiumLockScreen({ 
  title = "Premium Content", 
  description = "This chapter is part of the PRO syllabus. Upgrade your plan to unlock full access to all lessons, practice sets, and more.",
  backUrl,
  chapterId,
  videoCount,
  pdfCount,
  practiceSetCount,
}: PremiumLockScreenProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Top locked banner */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-muted/50 border-b border-border">
        <Lock className="w-4 h-4 text-primary shrink-0" />
        <span className="text-sm font-semibold text-foreground">This chapter requires a PRO subscription</span>
      </div>

      {/* Main content */}
      <div className="p-8 flex flex-col md:flex-row items-start gap-8">
        {/* Left: description */}
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>

          <div className="space-y-2.5 pt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Included in PRO:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <span>
                  {videoCount !== undefined ? (
                    <strong>{videoCount} Full HD video {videoCount === 1 ? 'lesson' : 'lessons'}</strong>
                  ) : (
                    "Full HD video lessons"
                  )}{" "}
                  with transcripts
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <span>
                  {pdfCount !== undefined ? (
                    <strong>{pdfCount} Comprehensive reading {pdfCount === 1 ? 'note' : 'notes'}</strong>
                  ) : (
                    "Comprehensive reading notes"
                  )}{" "}
                  & PDFs
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <span>
                  {practiceSetCount !== undefined ? (
                    <strong>{practiceSetCount} Chapter-level practice {practiceSetCount === 1 ? 'set' : 'sets'}</strong>
                  ) : (
                    "Chapter-level practice sets"
                  )}{" "}
                  & solutions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: CTA card */}
        <div className="w-full md:w-[340px] shrink-0 flex flex-col gap-3">
          
          <div className="rounded-2xl border border-border bg-background p-1 shadow-sm">
            {/* Main PRO Offer */}
            <div className="p-5 flex flex-col gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <p className="font-bold text-foreground text-lg">Unlock All Chapters</p>
                <p className="text-xs text-muted-foreground mt-1">Get unlimited access to the entire syllabus</p>
              </div>
              <Button
                onClick={() => router.push("/dashboard/upgrade")}
                className="w-full h-11 font-semibold rounded-xl text-base shadow-sm"
              >
                View PRO Plans
              </Button>
            </div>

            {/* A la carte Chapter Offer */}
            {chapterId && (
              <>
                <div className="relative my-2 px-5">
                  <div className="absolute inset-0 flex items-center px-5">
                    <div className="w-full border-t border-border/60"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                    <span className="bg-background px-3 text-muted-foreground/70">Or</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3 rounded-xl bg-muted/20 m-1 border border-border/40 relative overflow-hidden">
                  <div className="text-center">
                    <p className="font-semibold text-foreground text-sm">Just need this chapter?</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Pay once, get lifetime access.</p>
                  </div>
                  <BuyChapterButton 
                    chapterId={chapterId} 
                    className="w-full h-10 font-bold rounded-lg bg-foreground text-background hover:bg-foreground/90 shadow-sm" 
                    variant="default" 
                  />
                </div>
              </>
            )}
          </div>

          {backUrl && (
            <Button
              onClick={() => router.push(backUrl)}
              variant="ghost"
              className="w-full h-10 rounded-xl text-sm text-muted-foreground hover:text-foreground"
            >
              Back to Chapters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
