import { Skeleton } from "@/components/ui/skeleton";

function SubjectCardSkeleton() {
  return (
    <div className="h-full bg-card border border-primary/10 rounded-3xl p-5 flex flex-col relative overflow-hidden">
      <div className="relative z-10 flex justify-end mb-4">
        <Skeleton className="w-16 h-6 rounded-xl" />
      </div>
      <div className="relative z-10 space-y-2 flex-1 mb-5">
        <Skeleton className="w-3/4 h-6 rounded-md" />
        <Skeleton className="w-full h-4 rounded-md mt-2" />
        <Skeleton className="w-5/6 h-4 rounded-md" />
      </div>
      <div className="relative z-10 flex flex-col gap-2 mt-auto">
        <div className="flex justify-between items-end">
          <Skeleton className="w-16 h-3 rounded-md" />
          <Skeleton className="w-6 h-3 rounded-md" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Persona-Aware Hero Skeleton */}
      <div className="relative rounded-3xl overflow-hidden bg-card border border-primary/10 p-5 md:p-6 shadow-sm">
        <div className="relative flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-7 h-7 rounded-xl" />
              <Skeleton className="w-24 h-3" />
            </div>
            <Skeleton className="w-64 h-8 mb-4" />
            <Skeleton className="w-80 h-4 mb-2" />
            <Skeleton className="w-72 h-4 mb-6" />
            
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Skeleton className="w-28 h-9 rounded-2xl" />
              <Skeleton className="w-24 h-9 rounded-2xl" />
            </div>
          </div>
          
          <div className="flex flex-row md:flex-col gap-2 shrink-0">
            <Skeleton className="w-32 h-16 rounded-2xl" />
            <Skeleton className="w-32 h-16 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Gamification and Target Widgets Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Gamification Widget Skeleton */}
        <div className="bg-card border border-primary/10 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-xl" />
              <Skeleton className="w-24 h-6" />
            </div>
            <Skeleton className="w-20 h-4" />
          </div>
          
          <div className="flex items-end justify-between mb-4">
            <div>
              <Skeleton className="w-16 h-3 mb-2" />
              <Skeleton className="w-32 h-8" />
            </div>
            <Skeleton className="w-24 h-4 mb-1" />
          </div>

          <Skeleton className="h-2.5 w-full rounded-full mb-2" />
          <div className="flex justify-end">
            <Skeleton className="w-32 h-3" />
          </div>
        </div>
        
        {/* Daily Target Widget Skeleton */}
        <div className="bg-card border border-primary/10 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
          <div className="relative flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-8 h-8 rounded-xl" />
              <Skeleton className="w-48 h-6" />
            </div>
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-3/4 h-4" />
          </div>
          <div className="shrink-0 relative">
            <Skeleton className="w-36 h-14 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Weak Topics Widget Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="w-56 h-7 mb-2" />
            <Skeleton className="w-80 h-4" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card border border-primary/10 rounded-3xl p-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="w-16 h-5 rounded-full" />
                  <Skeleton className="w-16 h-3" />
                </div>
                <Skeleton className="w-3/4 h-6 mb-3" />
                <Skeleton className="w-24 h-4" />
              </div>
              <Skeleton className="w-full h-9 rounded-2xl mt-5" />
            </div>
          ))}
        </div>
      </div>

      {/* Subjects Section Skeleton */}
      <div className="space-y-10">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <Skeleton className="w-48 h-7 mb-2" />
              <Skeleton className="w-64 h-4" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <SubjectCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
