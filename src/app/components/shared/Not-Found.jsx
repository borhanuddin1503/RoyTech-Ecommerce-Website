"use client";

import Link from "next/link";
import { MdErrorOutline } from "react-icons/md";

export default function ProductsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-5">
      <MdErrorOutline className="text-6xl text-gray-500 mb-4" />

      <h2 className="text-3xl font-bold text-gray-800 mb-2">Products Not Found</h2>
      <p className="text-gray-500 mb-6 max-w-md">
        The Products you are looking for doesn't exist or has been moved.
      </p>

      <Link
        href="/"
        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
