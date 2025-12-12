"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
    FiTrash2,
    FiAlertTriangle,
    FiChevronDown,
    FiChevronUp,
} from "react-icons/fi";
import Swal from "sweetalert2";

export default function DeleteCategory() {
    const [openCategory, setOpenCategory] = useState(null);
    const [confirmData, setConfirmData] = useState(null);
    const [processing, setProcessing] = useState(false);

    // -------------------------------
    // Fetch Categories
    // -------------------------------
    const fetchCategories = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories`
            );
            const data = await res.json();
            return data;
    };

    const {data:categories=[] , isLoading , refetch} = useQuery({
        queryKey: ['categories'],
        queryFn: () => fetchCategories(),
        staleTime: 1000 * 60 * 20,
    })


    // -------------------------------
    // Delete Category
    // -------------------------------
    const handleDelete = async (id) => {
        setProcessing(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories/${id}`,
                { method: "DELETE" }
            );

            const result = await res.json();

            if (result.success) {
                refetch();
                Swal.fire("Success", result.message, "success");
            } else {
                Swal.fire("Error", result.message, "error");
            }
        } catch {
            Swal.fire("Error", "Failed to delete category", "error");
        }

        setConfirmData(null);
        setProcessing(false);
    };

    // -------------------------------
    // Delete Sub Category
    // -------------------------------
    const handleSubDelete = async (subId, categoryId) => {
        const previous = categories;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/sub-categories/${subId}?categoryId=${categoryId}`,
                { method: "DELETE" }
            );

            const result = await res.json();

            if (!result.success) {
                Swal.fire("Error", result.message, "error");
            } else {
                refetch();
                Swal.fire("Success", result.message, "success");
            }
        } catch {
            Swal.fire("Error", "Server error", "error");
        }
    };

    // -------------------------------
    // UI — Skeleton Loader
    // -------------------------------
    const Skeleton = () => (
        <div className="flex items-center justify-between border border-gray-200 p-4 rounded-xl animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-300"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                </div>
            </div>
            <div className="w-20 h-10 bg-gray-300 rounded-lg"></div>
        </div>
    );


    // -------------------------------
    // UI — Category Row
    // -------------------------------
    const CategoryRow = ({ cat }) => (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
                {/* Left side */}
                <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() =>
                        setOpenCategory(
                            openCategory === cat._id ? null : cat._id
                        )
                    }
                >
                    {cat.icon ? (
                        <Image
                            src={cat.icon}
                            alt={cat.name}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-lg font-semibold">
                                {cat.name.charAt(0)}
                            </span>
                        </div>
                    )}

                    <div>
                        <p className="font-semibold text-gray-900 text-lg">
                            {cat.name}
                        </p>
                        <p className="text-sm text-gray-500">/{cat.slug}</p>
                    </div>
                </div>

                {/* Right side buttons */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() =>{
                            setOpenCategory(
                                openCategory === cat._id ? null : cat._id
                            )
                        }}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer"
                    >
                        {openCategory === cat._id ? (
                            <FiChevronUp className="w-5 h-5" />
                        ) : (
                            <FiChevronDown className="w-5 h-5" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setConfirmData(cat)}
                        className="p-3 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                        <FiTrash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Subcategories */}
            {openCategory == cat._id && (
                <div className="mt-4 pl-4 border-l-2 border-main/20 space-y-2">
                    {cat.subCategories?.length ? (
                        cat.subCategories.map((sub) => (
                            <div
                                key={sub._id}
                                className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
                            >
                                <div className="flex flex-row gap-4 items-center">
                                    <div>
                                        <Image src={sub.image} width={32} height={32} alt={sub.name} className="max-h-8 "></Image>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {sub.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            /{sub.slug}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSubDelete(sub._id, cat._id)
                                    }
                                    className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm">
                            No subcategories
                        </p>
                    )}
                </div>
            )}
        </div>
    );

    // -------------------------------
    // UI — Delete Modal
    // -------------------------------
    const DeleteModal = () =>
        confirmData && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <FiAlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Delete Category
                        </h3>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete{" "}
                            <strong>"{confirmData.name}"</strong>? <br />
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-3 justify-center">
                            <button
                                type="button"
                                onClick={() => setConfirmData(null)}
                                disabled={processing}
                                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleDelete(confirmData._id)
                                }
                                disabled={processing}
                                className="px-6 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl font-medium flex items-center gap-2"
                            >
                                {processing ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <FiTrash2 className="w-4 h-4" />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );

    // -------------------------------
    // MAIN RETURN
    // -------------------------------
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Manage Categories
                </h2>
                <p className="text-gray-600">
                    Delete unwanted categories & subcategories
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {categories.map((cat) => (
                        <CategoryRow key={cat._id} cat={cat} />
                    ))}
                </div>
            )}

            <DeleteModal />
        </div>
    );
}
