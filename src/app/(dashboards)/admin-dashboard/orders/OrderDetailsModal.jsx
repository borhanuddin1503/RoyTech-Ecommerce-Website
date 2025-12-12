"use client";

import { FiX, FiPackage, FiCreditCard, FiUser, FiCalendar, FiDollarSign, FiCheckCircle, FiClock, FiShoppingBag } from "react-icons/fi";
import { useState } from "react";

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
    if (!isOpen || !order) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case "paid": return "text-green-600 bg-green-100";
            case "un-paid": return "text-red-600 bg-red-100";
            case "pending": return "text-yellow-600 bg-yellow-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case "online": return <FiCreditCard className="w-5 h-5" />;
            case "cod": return <FiDollarSign className="w-5 h-5" />;
            default: return <FiCreditCard className="w-5 h-5" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-main/10">
                            <FiPackage className="w-6 h-6 text-main" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                            <p className="text-sm text-gray-500">Order ID: {order._id || order.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onClose(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                        <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto p-6 space-y-6">
                    {/* Order Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <FiCheckCircle className="w-5 h-5 text-gray-600" />
                                <span className="font-semibold text-gray-700">Payment Status</span>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.paymentStatus)}`}>
                                {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <FiClock className="w-5 h-5 text-gray-600" />
                                <span className="font-semibold text-gray-700">Order Status</span>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-xl p-5">
                        <h3 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Order Date</span>
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="w-4 h-4 text-gray-500" />
                                    <span className="font-medium">{formatDate(order.orderedAt)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Payment Method</span>
                                <div className="flex items-center gap-2">
                                    {getPaymentMethodIcon(order.paymentMethod)}
                                    <span className="font-medium">
                                        {order.paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Amount</span>
                                <div className="flex items-center gap-2">
                                    <FiDollarSign className="w-4 h-4 text-main" />
                                    <span className="text-xl font-bold text-main">৳{order.amount || order.customer?.amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-gray-50 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-main/10">
                                <FiUser className="w-5 h-5 text-main" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Customer Information</h3>
                        </div>
                        <div className="space-y-3">
                            {/* email */}
                            {order.email && <div className="flex justify-between">
                                <span className="text-gray-600">Email</span>
                                <span className="font-medium">{order.email}</span>
                            </div>}

                            {/* visitors id */}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Customer ID</span>
                                <span className="font-medium text-sm">{order?.visitorsId}</span>
                            </div>

                            {/* name */}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Name</span>
                                <span className="font-medium text-sm">{order?.customer?.name}</span>
                            </div>

                            {/* phone */}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phone</span>
                                <span className="font-medium text-sm">{order?.customer?.phone}</span>
                            </div>

                            {/* Address */}
                            <div className="flex justify-between gap-6">
                                <span className="text-gray-600">Address</span>
                                <span className="font-medium text-sm">{order?.customer?.address}</span>
                            </div>

                            {/* Upazila */}
                            <div className="flex justify-between gap-6">
                                <span className="text-gray-600">Upazila</span>
                                <span className="font-medium text-sm">{order?.customer?.upazila}</span>
                            </div>
                            {/* dIST */}
                            <div className="flex justify-between gap-6">
                                <span className="text-gray-600">Dist</span>
                                <span className="font-medium text-sm">{order?.customer?.district}</span>
                            </div>
                            {/* comment */}
                            {
                                order?.customer?.comment && <div className="flex justify-between gap-6">
                                    <span className="text-gray-600">Comment</span>
                                    <span className="font-medium text-sm">{order?.customer?.comment}</span>
                                </div>
                            }
                        </div>
                    </div>

                    {/* Products */}
                    <div className="bg-gray-50 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-main/10">
                                <FiShoppingBag className="w-5 h-5 text-main" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Products ({order.products?.length || 0})</h3>
                        </div>
                        <div className="space-y-3">
                            {order.products?.map((product, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="">
                                        <div>
                                            <p className="font-medium text-gray-800">{product.title || "Product"}</p>
                                            <p className="text-sm text-gray-500">Qty: {product.quantity || 1}</p>
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {product.selectedSize && <p>Size: {product?.selectedSize}</p>}
                                            {product.selectedColor && <div className="flex gap-2">
                                                <p>color: </p>
                                                <div className={`h-5 w-5 rounded-full border`} style={{
                                                    backgroundColor: product.selectedColor
                                                }}></div>
                                            </div>}
                                        </div>
                                    </div>
                                    <span className="font-semibold">৳{product.price || product.discountedPrice}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Details (if online payment) */}
                    {order.paymentMethod === "online" && order.paymentStatus === "paid" && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-4">Payment Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Gateway</span>
                                    <span className="font-medium">{order.card_issuer}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transaction ID</span>
                                    <span className="font-medium text-sm">{order.transactionId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Validation ID</span>
                                    <span className="font-medium text-sm">{order.validationId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Paid Amount</span>
                                    <span className="font-bold text-green-600">৳{order.paid_amount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Time</span>
                                    <span className="font-medium">{order.updatedAt}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 bg-white">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => onClose(false)}
                            className="px-6 py-2 border-2 cursor-pointer border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;