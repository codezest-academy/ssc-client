import { Metadata } from "next";
import { api } from "@/lib/axios";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; chapterId: string };
}): Promise<Metadata> {
  try {
    const response = await api.get(`/chapters/${params.chapterId}`);
    const chapter = response.data.data;
    
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
