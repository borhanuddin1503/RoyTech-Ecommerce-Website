"use client";

import { useEffect, useState } from "react";
import ProductCard from "../components/home/best-selling-products/ProductCard";
import useProductsQuery from "../customHooks/useProductsQuery";
import useCategoriesQuery from "../customHooks/useCategoriesHooks";
import ProductsNotFound from "../components/shared/Not-Found";
import FeaturedProductsSkeleton from "../components/home/featured-products/FeaturedProductsSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { CiFilter } from "react-icons/ci";
import { AiOutlineProduct } from "react-icons/ai";

export default function ProductsPage() {
    const [page, setPage] = useState(1);
    const limit = 10;

    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const [showFilterOption, setShowFilterOption] = useState(false);

    const searchParams = useSearchParams();
    const search = searchParams.get('search');
    const queryCategory = searchParams.get('category');

    useEffect(() => {
        if(queryCategory){
            setCategory(queryCategory)
        }
    } , [])

    const { data: categories } = useCategoriesQuery();
    const { data, isLoading } = useProductsQuery({
        page,
        limit,
        category,
        brand,
        min,
        max,
        search
    });

    const products = data?.products || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const { data: brands } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`/api/brands`);
            return res.json();
        },
        staleTime: 1000 * 60 * 20,
        cacheTime: 1000 * 60 * 20
    })

    console.log(showFilterOption)

    return (
        <div className="bg-white">
            <div className="px-5 py-4 max-w-7xl mx-auto">

                {/* button */}
                <button className={`flex gap-2 items-center font-semibold py-3 px-6 bg-main rounded-lg mb-5 text-white md:hidden ${showFilterOption && 'hidden'}`} onClick={() => setShowFilterOption(!showFilterOption)}><CiFilter /> Filter</button>


                <div className="grid grid-cols-12 gap-6 ">
                    {/* ================= SIDEBAR ================= */}
                    {<aside className={`col-span-12 md:col-span-3 bg-white shadow-lg rounded-2xl p-6 h-fit border border-gray-200  md:block 
    ${showFilterOption ? "block" : "hidden"} `}>
                        <div className="flex justify-between border-b border-gray-200 mb-6 pb-4">
                            <h3 className="font-bold text-xl text-gray-900   flex items-center gap-2">
                                <svg className="w-5 h-5 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filters
                            </h3>

                            <p className="text-gray-500 font-bold md:hidden" onClick={() => setShowFilterOption(false)}>x</p>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-7">
                            <h4 className="font-semibold text-gray-800 mb-3">Category</h4>
                            <select
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:border-main focus:ring-2 focus:ring-main/20 transition-all duration-200 outline-none bg-white hover:border-gray-300 cursor-pointer"
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="">All Categories</option>
                                {categories?.map((cat) => (
                                    <option key={cat._id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Brand Filter */}
                        <div className="mb-7">
                            <h4 className="font-semibold text-gray-800 mb-3">Brand</h4>
                            <select
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:border-main focus:ring-2 focus:ring-main/20 transition-all duration-200 outline-none bg-white hover:border-gray-300 cursor-pointer"
                                value={brand}
                                onChange={(e) => {
                                    setBrand(e.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="">All Brands</option>
                                {brands?.map((brand) => (
                                    <option key={brand} value={brand}>
                                        {brand}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Price Range (৳)</h4>
                            <div className="space-y-3 mb-5">
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:border-main focus:ring-2 focus:ring-main/20 transition-all duration-200 outline-none bg-white hover:border-gray-300"
                                        value={min}
                                        onChange={(e) => setMin(e.target.value)}
                                    />
                                    <span className="text-gray-500 font-medium text-center">to</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:border-main focus:ring-2 focus:ring-main/20 transition-all duration-200 outline-none bg-white hover:border-gray-300"
                                        value={max}
                                        onChange={(e) => setMax(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>}

                    {/* ================= PRODUCTS ================= */}

                    <main className="col-span-12 md:col-span-9">
                        {isLoading === true ? <FeaturedProductsSkeleton></FeaturedProductsSkeleton> : products.length === 0 ? <ProductsNotFound></ProductsNotFound> :
                            <div>
                                <div className="flex gap-3 items-center text-main  mb-5">
                                    <AiOutlineProduct className="text-2xl"/>
                                    <h2 className="text-2xl text-main font-semibold">All Products</h2>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {!isLoading &&
                                        products.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                </div>

                                {/* ================= PAGINATION ================= */}
                                {/* Pagination Container */}
                                <div className="mt-10 flex justify-center items-center gap-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-300 flex items-center gap-1 ${page === 1
                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                            : "bg-white text-gray-700 border-gray-300 hover:border-main hover:text-main hover:shadow-md transform hover:-translate-y-0.5"
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Prev
                                    </button>

                                    {/* Page Numbers */}
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 ${page === i + 1
                                                ? "bg-main text-white border-main shadow-lg shadow-main/25"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-main hover:text-main hover:shadow-md"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    {/* Next Button */}
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                        className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-300 flex items-center gap-1 ${page === totalPages
                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                            : "bg-white text-gray-700 border-gray-300 hover:border-main hover:text-main hover:shadow-md transform hover:-translate-y-0.5"
                                            }`}
                                    >
                                        Next
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        }
                    </main>
                </div>
            </div>
        </div>
    );
}
