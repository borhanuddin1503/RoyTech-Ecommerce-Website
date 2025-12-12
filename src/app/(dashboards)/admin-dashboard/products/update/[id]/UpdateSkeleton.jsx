"use client";

import React from "react";

export default function UpdateSkeleton() {
  return (
    <section className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-8">
          <div className="mx-auto h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <p className="mx-auto mt-3 h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title (full width) */}
          <div className="md:col-span-2">
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Category */}
          <div>
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Sub Category */}
          <div>
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Brand */}
          <div>
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Stock */}
          <div>
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Discount */}
          <div>
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Discounted Price */}
          <div>
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Image block (full width) */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 bg-gray-200 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Featured */}
          <div className="md:col-span-2 flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 text-center">
          <div className="mx-auto h-12 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </section>
  );
}
