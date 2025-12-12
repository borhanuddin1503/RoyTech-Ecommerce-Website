import useProducts from '@/app/customHooks/useProducts'
import React from 'react'

export default function SizeSelector() {
    const { product, selectedSize, setSelectedSize } = useProducts();
    return (
        <div>
            {
                product.availableSizes && product.availableSizes.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">Available Sizes</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.availableSizes.map((size, index) => (
                                <button
                                    key={index}
                                    className={`px-4 py-2 border-2 border-gray-300 rounded-lg font-medium  cursor-pointer ${selectedSize === size ? "border-2 border-main text-main" : ""
                                        }`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }
        </div>
    )
}
