"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export default function ChapterRouterPage({
  params,
}: {
  params: Promise<{ subjectSlug: string; chapterSlug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const { data: chapters, isLoading } = useQuery({
    queryKey: ["subject", resolvedParams.subjectSlug],
    queryFn: async () => {
      const response = await api.get(`/subjects/${resolvedParams.subjectSlug}`);
      return response.data.data.chapters;
    },
    enabled: !!resolvedParams.subjectSlug,
  });

  useEffect(() => {
    if (isLoading || !chapters) return;

    const currentChapter = chapters.find((c: any) => c.slug === resolvedParams.chapterSlug);
    if (!currentChapter) {
      router.push("/dashboard");
      return;
    }

    // Always redirect to the Chapter Dashboard so students can see the syllabus and practice sets
    router.replace(`/dashboard/subjects/${resolvedParams.subjectSlug}/chapters/${resolvedParams.chapterSlug}`);
  }, [chapters, isLoading, resolvedParams, router]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading chapter...</p>
      </div>
    </div>
  );
}
