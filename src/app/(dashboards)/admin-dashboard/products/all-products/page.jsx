"use client";

import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiAlertTriangle } from "react-icons/fi";
import ProductsLoading from "./productsLoading";
import Swal from "sweetalert2";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LuNotebookPen } from "react-icons/lu";

export default function AllProducts() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const queryClient = useQueryClient();

  // DELETE STATE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const [deleteProcessing, setDeleteProcessing] = useState(false);

  // Fetch Products
  const fetchProducts = async (pageNumber = page) => {
    const res = await fetch(`/api/products?page=${pageNumber}&limit=${limit}`);
    const data = await res.json();
    return data;
  };



  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products', page],
    queryFn: () => fetchProducts(page),
    staleTime: 1000 * 60 * 20,
  })

  const products = data?.products || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Open delete modal
  const confirmDelete = (item) => {
    setConfirmData(item);
    setShowDeleteModal(true);
  };

  // DELETE ITEM FUNCTION
  const handleDelete = async (id) => {
    try {
      setDeleteProcessing(true);

      const res = await fetch(`/api/admin/manage-products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        Swal.fire('Error', 'Something went wrong', 'error')
      }

      const result = await res.json();

      // Close modal after success
      setShowDeleteModal(false);
      setConfirmData(null);
      fetchProducts(page);
      queryClient.invalidateQueries(['products'])
      Swal.fire('Deleted', 'Products Deleted Successfully', 'warning')
    } catch (err) {
      Swal.fire('Error', 'Something went wrong', 'error')
    } finally {
      setDeleteProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 items-center mb-6">
        <LuNotebookPen className="text-2xl text-main"/>
        <h1 className="text-2xl text-main font-semibold">All Products</h1>
      </div>

      <div className="rounded-2xl shadow-md overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <ProductsLoading />
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-lg">
                    No Products Found
                  </td>
                </tr>
              ) : (
                products.map((item, idx) => (
                  <tr
                    key={item?._id ?? idx}
                    className="hover:bg-gray-50 border-t"
                  >
                    <td className="font-semibold p-3">
                      {(page - 1) * limit + idx + 1}
                    </td>

                    <td className="p-3">
                      <img
                        src={item?.image || item.images[0]}
                        alt="product"
                        className="w-[60px] h-[60px] rounded-xl object-cover"
                      />
                    </td>

                    <td className="font-medium p-3">{item?.title}</td>
                    <td className="p-3">{item?.category}</td>

                    <td className="font-semibold text-blue-600 p-3">
                      ৳{item?.discountedPrice ?? item?.regularPrice}
                    </td>

                    <td className="p-3">{item?.stock}</td>

                    <td className="p-3 flex gap-3">
                      <Link href={`/admin-dashboard/products/update/${item._id}`}>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white rounded-xl p-2 cursor-pointer"
                        >
                          <FiEdit size={18} />
                        </button>
                      </Link>

                      <button
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl p-2 cursor-pointer"
                        onClick={() => confirmDelete(item)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl ${page === 1
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
              }`}
          >
            <FiChevronLeft /> Prev
          </button>

          <span className="text-gray-600 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl ${page === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
              }`}
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>

      {/* ✔ FIXED DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FiAlertTriangle className="w-8 h-8 text-red-500" />
              </div>

              <h3 className="text-xl font-bold mb-2">Delete Product</h3>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <strong>"{confirmData?.title}"</strong>? <br />
                This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
                  disabled={deleteProcessing}
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDelete(confirmData._id)}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2 cursor-pointer"
                  disabled={deleteProcessing}
                >
                  {deleteProcessing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiTrash2 size={16} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
