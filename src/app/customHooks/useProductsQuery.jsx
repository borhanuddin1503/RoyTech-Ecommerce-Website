"use client";
import { useQuery } from "@tanstack/react-query";

export default function useProductsQuery({ page, limit, category, brand, min, max , search }) {
    const params = new URLSearchParams();

    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (category) params.append("category", category);
    if (brand) params.append("brand", brand);
    if (min) params.append("min", min);
    if (max) params.append("max", max);
    if(search) params.append("search" , search);

    return useQuery({
        queryKey: ["all-products", page, limit, category, brand, min, max , search],
        queryFn: async () => {
            const res = await fetch(`/api/products?${params.toString()}`);
            return res.json();
        },
        staleTime: 1000 * 60 * 20,
        cacheTime: 1000 * 60 * 20
    });
}
