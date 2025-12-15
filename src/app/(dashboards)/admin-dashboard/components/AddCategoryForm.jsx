"use client";
import React, { useState, useEffect } from "react";
import { FiFolderPlus, FiRefreshCw } from "react-icons/fi";
import CreateCategory from "./CreateCategory";
import CreateSubCategory from "./CreatSubCategory";

export default function AddCategoryForm() {
  const [mode, setMode] = useState("category"); // category | subcategory
  const [categories, setCategories] = useState([]);

  // Fetch all categories
  const fetchCategories = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories`, {
      next: { tags: ['admin-categories'], revalidate: 3600 }
    });
    const data = await res.json();

    setCategories(Array.isArray(data) ? data : data.categories || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-3xl mx-auto ">
      <div className="bg-white rounded-2xl shadow-lg border p-6">

        {/* Header */}
        <div className="flex items-center flex-col lg:flex-row gap-2 justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-main/10 rounded-full flex items-center justify-center">
              <FiFolderPlus className="text-main w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Add Category / Subcategory
              </h2>
              <p className="text-gray-500 text-sm">
                Manage categories and subcategories easily
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("category")}
              className={`cursor-pointer px-3 py-1 rounded-xl border ${mode === "category"
                ? "bg-main text-white border-main"
                : "bg-white text-gray-700"
                }`}
            >
              Category
            </button>

            <button
              onClick={() => setMode("subcategory")}
              className={`cursor-pointer px-3 py-1 rounded-xl border ${mode === "subcategory"
                ? "bg-main text-white border-main"
                : "bg-white text-gray-700"
                }`}
            >
              Subcategory
            </button>

            <button
              onClick={fetchCategories}
              className="cursor-pointer ml-2 p-2 rounded-md hover:bg-gray-100"
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>

        {/* Render Correct Form */}
        {mode === "category" ? (
          <CreateCategory onSuccess={fetchCategories} />
        ) : (
          <CreateSubCategory
            categories={categories}
            onSuccess={fetchCategories}
          />
        )}
      </div>
    </div>
  );
}
