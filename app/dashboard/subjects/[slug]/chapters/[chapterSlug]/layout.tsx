import { Metadata } from "next";
import { api } from "@/lib/axios";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapterSlug: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const response = await api.get(`/subjects/${resolvedParams.slug}`);
    const subject = response.data.data;
    const chapter = subject.chapters.find((c: any) => c.slug === resolvedParams.chapterSlug);
    
    if (!chapter) throw new Error("Not found");

    return {
      title: `${chapter.name} | SSC CGL PYQs & Concepts`,
      description: chapter.description || `Master ${chapter.name} with SSC CGL PYQs, mock tests, and comprehensive lessons.`,
    };
  } catch (error) {
    return {
      title: "Chapter Preparation",
    };
  }
}

export default function ChapterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
