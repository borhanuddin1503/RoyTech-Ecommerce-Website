"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import { FiCreditCard, FiPackage, FiLock, FiCheck } from "react-icons/fi";
import Swal from "sweetalert2";

export default function CheckoutSummary({ items, total }) {
    const [paymentMethod, setPaymentMethod] = useState("online");
    const [loading, setLoading] = useState(false);



    const handlePayment = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const customerData = Object.fromEntries(formData.entries());
        const finalData = {
            customer: customerData,
            products: items.map((i) => ({
                _id: i._id,
                selectedSize: i?.selectedSize,
                selectedColor: i?.selectedColor,
                quantity: i?.quantity,
            })),
            paymentMethod,
        }

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(finalData)
        })
        const result = await res.json();
        if (result.success) {
            if (result.redirect_url) {
                return redirect(result.redirect_url)
            }
            Swal.fire('Success', result.message, 'success')
        } else {
            Swal.fire('Error', result.message, 'error')
        }

    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                <p className="text-gray-600 text-sm mt-1">Review your items and payment details</p>
            </div>

            <div className="flex flex-col md:flex-row gap-5 py-5 border-b border-b-gray-300">
                {/* left side div */}
                <div className="flex-1">
                    {/* Items List */}
                    <div className="space-y-4 mb-6">
                        <h3 className="font-semibold text-gray-800 text-lg">Items ({items.length})</h3>
                        {items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-main transition-colors duration-200">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-20 h-20 shrink-0">
                                        <Image
                                            src={item?.image || item?.images?.[0] || "/placeholder.jpg"}
                                            alt={item.title || "Product"}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                        {item.quantity > 1 && (
                                            <div className="absolute -top-2 -right-2 bg-main text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <span className="font-semibold text-gray-800 line-clamp-1">{item.title}</span>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            {item.selectedColor && (
                                                <div className="flex items-center gap-1">
                                                    <div
                                                        className="w-4 h-4 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: item.selectedColor }}
                                                    />
                                                    <span>{item.selectedColor}</span>
                                                </div>
                                            )}
                                            {item.selectedSize && (
                                                <span className="bg-gray-100 px-2 py-1 rounded">Size: {item.selectedSize}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-gray-900 text-lg">
                                        ৳{(item.discountedPrice || 0) * (item.quantity || 1)}
                                    </span>
                                    {item.discountedPrice < item.regularPrice && (
                                        <p className="text-sm text-gray-500 line-through">
                                            ৳{item.regularPrice * (item.quantity || 1)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total Amount */}
                    <div className="bg-gray-50 rounded-xl p-5 mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-semibold">৳{total}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-semibold">৳120</span>
                        </div>
                        <div className="border-t border-gray-300 pt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-main">৳{total + 120}</span>
                                    <p className="text-sm text-gray-500">including VAT</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 text-lg mb-4">Payment Method</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setPaymentMethod("online")}
                                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${paymentMethod === "online"
                                    ? "border-main bg-main/5"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${paymentMethod === "online" ? "bg-main" : "bg-gray-100"}`}>
                                        <FiCreditCard className={`w-5 h-5 ${paymentMethod === "online       " ? "text-white" : "text-gray-600"}`} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold">Card / Debit / Credit</p>
                                        <p className="text-sm text-gray-500">Pay securely with your card</p>
                                    </div>
                                </div>
                                {paymentMethod === "online" && <FiCheck className="w-5 h-5 text-main" />}
                            </button>

                            <button
                                onClick={() => setPaymentMethod("cod")}
                                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${paymentMethod === "cod"
                                    ? "border-main bg-main/5"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${paymentMethod === "cod" ? "bg-main" : "bg-gray-100"}`}>
                                        <FiPackage className={`w-5 h-5 ${paymentMethod === "cod" ? "text-white" : "text-gray-600"}`} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold">Cash on Delivery</p>
                                        <p className="text-sm text-gray-500">Pay when you receive</p>
                                    </div>
                                </div>
                                {paymentMethod === "cod" && <FiCheck className="w-5 h-5 text-main" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* right side div */}
                <div className="flex-1 flex flex-col justify-between">

                    {/* TOP FORM */}
                    <form onSubmit={handlePayment} id="checkout-form" className="space-y-3">

                        <h2 className="text-lg font-semibold mb-2">Customer Information</h2>

                        {/* Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-500 font-medium">Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="py-3 px-5 rounded-lg border border-gray-400 focus:border-main outline-none"
                                placeholder="Your Name"
                            />
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-500 font-medium">Phone *</label>
                            <input
                                type="number"
                                name="phone"
                                required
                                className="py-3 px-5 rounded-lg border border-gray-400 focus:border-main outline-none"
                                placeholder="Your Phone Number"
                                onWheel={(e) => e.target.blur()}
                            />
                        </div>

                        {/* Address */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-500 font-medium">Address *</label>
                            <input
                                type="text"
                                name="address"
                                required
                                className="py-3 px-5 rounded-lg border border-gray-400 focus:border-main outline-none"
                                placeholder="Your Address"
                            />
                        </div>

                        {/* Upazila */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-500 font-medium">Upazila / Thana *</label>
                            <input
                                type="text"
                                name="upazila"
                                required
                                className="py-3 px-5 rounded-lg border border-gray-400 focus:border-main outline-none"
                                placeholder="Upazila / Thana"
                            />
                        </div>

                        {/* District */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-500 font-medium">District *</label>
                            <input
                                type="text"
                                name="district"
                                required
                                className="py-3 px-5 rounded-lg border border-gray-400 focus:border-main outline-none"
                                placeholder="District"
                            />
                        </div>


                        {/* comment */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-500 font-medium">Comment</label>
                            <textarea
                                name="comment"
                                id=""
                                rows={5}
                                className="py-3 px-5 rounded-lg border border-gray-400 focus:border-main outline-none resize-none"

                            ></textarea>

                        </div>
                    </form>
                </div>
            </div>

            {/* Security & Pay Button */}
            <div className="space-y-4 my-6">


                <p className="text-center text-xs text-gray-500">
                    By completing your purchase you agree to our Terms & Conditions
                </p>
                {/* BOTTOM BUTTON */}
                <div className="">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-3">
                        <FiLock className="w-4 h-4" />
                        <span>Secure payment encrypted</span>
                    </div>

                    <button
                        type="submit"
                        form="checkout-form"
                        disabled={loading}
                        className="w-full bg-main text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Processing..." : `Confirm Order`}
                    </button>
                </div>
            </div>
        </div>
    );
}