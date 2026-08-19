import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Product } from "@/types/api";

export function useChapterProduct(chapterId: string | undefined) {
  return useQuery({
    queryKey: ["chapter-product", chapterId],
    queryFn: async () => {
      if (!chapterId) return null;
      try {
        const res = await api.get(`/chapters/${chapterId}/product`);
        return res.data.data as Product | null;
      } catch (err) {
        return null;
      }
    },
    enabled: !!chapterId,
  });
}
