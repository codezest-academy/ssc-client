"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function GeneratePYQButton({ chapterId }: { chapterId: string }) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  const generatePYQTest = async () => {
    try {
      setGenerating(true);
      const res = await api.post("/attempts/pyq", {
        chapterId,
        limit: 20,
      });
      router.push(`/tests/attempt/${res.data.data.id}`);
    } catch (e: any) {
      alert(
        e.response?.data?.message ||
          "Failed to generate test. There might not be enough PYQs in this chapter yet."
      );
      setGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePYQTest}
      disabled={generating}
      size="lg"
      className="rounded-full font-bold shadow-lg hover:shadow-xl transition-all h-14 px-8 text-lg"
    >
      <Play className="w-5 h-5 mr-2" />
      {generating ? "Generating Your Test..." : "Start Live Practice Now"}
    </Button>
  );
}
