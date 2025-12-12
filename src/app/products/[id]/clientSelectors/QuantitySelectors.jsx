"use client";

import useProducts from "@/app/customHooks/useProducts";



export default function QuantitySelector() {
    const { quantity, increaseQty, decreaseQty, product } = useProducts();

    return (
        <>
            <h2 className="text-lg font-semibold text-gray-900 m-0">Quantity</h2>
            <div className="flex items-center gap-1 mt-2">
                {/* Decrease Button */}
                <button
                    onClick={decreaseQty}
                    disabled={quantity <= 1}
                    className={`px-3 py-1 border rounded ${quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    −
                </button>

                {/* Quantity Display */}
                <span className="px-8 py-1 border rounded bg-gray-50">{quantity}</span>

                {/* Increase Button */}
                <button
                    onClick={increaseQty}
                    disabled={quantity >= product.stock}
                    className={`px-3 py-1 border rounded ${quantity >= product.stock ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    +
                </button>
            </div>
        </>
    );
}
