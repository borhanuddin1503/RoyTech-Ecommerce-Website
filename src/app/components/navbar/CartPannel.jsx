"use client";

import useCart from "@/app/customHooks/useCart";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiShoppingCart, FiX } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import emptyCart from '@/app/assets/images/empty-cart.png';


export default function CartPannel() {
    const [showCartPannel, setShowCartPannel] = useState(false);
    const { cart, deleteFromCart } = useCart();
    const router = useRouter();


    const handleCheckout = () => {
        const checkoutData = cart.map(item => ({
            _id: item._id,
            quantity: item.quantity,
            selectedColor: item.selectedColor || null,
            selectedSize: item.selectedSize || null
        }));

        // stringify + encodeURIComponent
        const encoded = encodeURIComponent(JSON.stringify(checkoutData));

        // Next.js router push
        router.push(`/checkout?products=${encoded}`);
    };



    return (
        <>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group cursor-pointer" onClick={() => setShowCartPannel(!showCartPannel)}>
                <FiShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-cyan-600 transition-colors duration-200" />

                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cart?.length || 0}
                </span>
            </button>


            {showCartPannel && <div className="fixed inset-0 bg-transparent backdrop-blur-xs" onClick={() => setShowCartPannel(false)}></div>}
            <div
                className={`fixed top-0 right-0 h-full md:w-100 w-90 bg-white shadow-2xl z-50 transform transition-transform duration-300 py-6 px-5 flex flex-col ${showCartPannel ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-main flex items-center gap-2">
                        <FiShoppingCart className="w-6 h-6" />
                        Cart Items
                    </h2>
                    <button
                        onClick={() => setShowCartPannel(false)}
                        className="text-gray-500 hover:text-main transition-colors duration-200 cursor-pointer"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto">
                    {cart.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div>
                                <Image
                                    src={emptyCart}
                                    width={150}
                                    height={150}
                                    alt="empty-cart"
                                >

                                </Image>
                                <p className="text-center text-gray-500 font-semibold"><span className="text-lg text-black">Ooops </span><br /> No items here</p>
                            </div>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between py-3 gap-2 border-b last:border-b-0"
                            >
                                <div className="flex gap-2 items-center">
                                    <div className="shrink-0">
                                        <Image src={item.image || item.images[0]}
                                            width={52}
                                            height={52}
                                            className="object-cover min-h-13 min-w-13"
                                            alt={item.title}
                                        ></Image>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="font-semibold text-gray-800 ">{item.title}</span>
                                        <div className="flex flex-row gap-2">
                                            {item.selectedColor && (
                                                <div className="w-5 h-5 rounded-full border border-gray"
                                                    style={{ backgroundColor: item.selectedColor }}
                                                ></div>
                                            )}
                                            {item.selectedSize && (
                                                <span className="text-sm text-gray-500">Size: {item.selectedSize}</span>
                                            )}
                                            <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">৳{item.discountedPrice} * {item.quantity} = ৳{item.discountedPrice * item.quantity}</span>
                                    </div>
                                </div>
                                <div className="shrink-0 text-2xl cursor-pointer hover:text-main" onClick={() => deleteFromCart(item)}><MdDeleteOutline /></div>
                            </div>
                        ))
                    )}
                </div>

                {/* Checkout / Total */}
                {cart.length > 0 && (
                    <div className="mt-6">
                        <p className="p-3 my-2 border rounded-xl border-gray-400 flex justify-between"><span>Total </span> ৳{cart.reduce((acc, item) => acc + item.discountedPrice * item.quantity, 0)}</p>
                        <button className="w-full bg-main text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-300 cursor-pointer"
                            onClick={() => {handleCheckout();
                                    setShowCartPannel(false)
                            }}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}


