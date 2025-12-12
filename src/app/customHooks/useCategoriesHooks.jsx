'use client'
import { useQuery } from "@tanstack/react-query"


export default function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`);
      return res.json();
    },
    staleTime : 1000 * 60 * 20
  })
}
