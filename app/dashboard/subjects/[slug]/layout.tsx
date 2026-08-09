import { Metadata } from "next";
import { api } from "@/lib/axios";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const response = await api.get(`/subjects/${params.slug}`);
    const subject = response.data.data;
    
    return {
      title: `${subject.name} Preparation`,
      description: subject.description || `Prepare for ${subject.name} with SSC CGL mock tests and PYQs.`,
    };
  } catch (error) {
    return {
      title: "Subject Preparation",
    };
  }
}

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
