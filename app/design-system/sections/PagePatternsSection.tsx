import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Search, Settings, Users, FileText } from "lucide-react";
import { ThemePreview } from "../components/ThemePreview";
export function PagePatternsSection() {
  return (
    <section id="patterns" className="space-y-8 pt-12 border-t mt-12">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Composed Page Patterns</h2>
        <p className="text-muted-foreground mt-2">How components assemble into complex interfaces.</p>
      </div>
      <ThemePreview title="Data Grid (Table)" description="Standard table pattern with status badges.">
        <div className="rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Mock Test</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Enrolled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow><TableCell className="font-medium">SSC CGL Tier-1</TableCell><TableCell><Badge className="bg-success/20 text-success hover:bg-success/30 border-none">Active</Badge></TableCell><TableCell className="text-right">1,234</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">SSC CHSL Mini Mock</TableCell><TableCell><Badge className="bg-warning/20 text-warning hover:bg-warning/30 border-none">Draft</Badge></TableCell><TableCell className="text-right">—</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Old 2025 Pattern</TableCell><TableCell><Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30 border-none">Archived</Badge></TableCell><TableCell className="text-right">5,432</TableCell></TableRow>
            </TableBody>
          </Table>
        </div>
      </ThemePreview>
      <ThemePreview title="Sidebar Navigation" description="The core navigation using --sidebar-* tokens.">
        <div className="bg-sidebar border border-sidebar-border/50 rounded-3xl p-4 w-64 text-sidebar-foreground shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all">
          <div className="flex items-center gap-2 mb-8 px-2 font-bold text-lg"><BookOpen className="text-sidebar-primary" />CodeZest</div>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-md font-medium text-sm"><Search className="h-4 w-4" />Dashboard</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground rounded-md font-medium text-sm transition-colors"><FileText className="h-4 w-4" />Question Bank</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground rounded-md font-medium text-sm transition-colors"><Users className="h-4 w-4" />Students</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground rounded-md font-medium text-sm transition-colors"><Settings className="h-4 w-4" />Settings</a>
          </nav>
        </div>
      </ThemePreview>
      <ThemePreview title="Premium Login Layout" description="Full-screen dynamic background with a solid center card to ensure WCAG legibility while maintaining a 'wow' factor.">
        <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-[#0a0a0f] rounded-3xl border">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#0a0a0f] to-[#0a0a0f] opacity-80" />
            <div className="absolute top-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-primary/20 blur-[80px] animate-float-slow" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px] animate-float-slower" />
            <div className="absolute top-[30%] left-[60%] w-[200px] h-[200px] rounded-full bg-primary/10 blur-[70px] animate-float-slow" style={{ animationDelay: '-5s' }} />
          </div>
          <div className="relative z-10 w-full max-w-[280px]">
            <div className="bg-card text-card-foreground border shadow-xl rounded-2xl p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold tracking-tight">Log In</h3>
                <p className="text-xs text-muted-foreground mt-1">Student Portal</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-10 w-full bg-background/50 border rounded-md" />
                </div>
                <div className="space-y-1">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-10 w-full bg-background/50 border rounded-md" />
                </div>
                <div className="h-10 w-full bg-primary rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </ThemePreview>
    </section>
  );
}
