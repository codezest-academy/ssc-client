import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function DashboardNotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={FileQuestion}
        title="Page Not Found"
        description="We couldn't find the specific lesson, chapter, or page you were looking for."
      />
      <div className="mt-8">
        <Link href="/dashboard">
          <Button size="lg" className="rounded-full px-8">
            <Home className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
