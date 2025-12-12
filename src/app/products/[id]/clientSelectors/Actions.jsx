'use client'
import useCart from '@/app/customHooks/useCart';
import getCartItems from '@/app/customHooks/useCart';
import useProducts from '@/app/customHooks/useProducts'
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react'
import { FiHeart, FiShare2, FiShoppingCart } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function Actions() {
    const { selectedColor, selectedSize, product, quantity } = useProducts();
    const [errors, setErrors] = useState('');
    const router = useRouter();


    // handle share
    const handleShare = async () => {
        const shareData = {
            title: product.title || "Check this product",
            text: "Check out this product!",
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log("Share cancelled");
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied!");
        }
    };

    const { addToCart } = useCart();


    // handle add to cart
    const handleAddtoCart = (e) => {
        e.preventDefault();
        setErrors('');
        if (product.availableColors?.length > 0) {
            if (!selectedColor) {
                return setErrors('please select a color')
            }
        }
        if (product.availableSizes?.length > 0) {
            if (!selectedSize) {
                return setErrors('please select a size')
            }
        };

        const finalData = {
            ...product,
            selectedColor,
            selectedSize,
            quantity,
        }

        addToCart(finalData);
        Swal.fire('CART', product.title + ' added successfully', 'success')
    }

    const handleBuyNow = (e) => {
        e.preventDefault();
        setErrors('');
        if (product.availableColors?.length > 0) {
            if (!selectedColor) {
                return setErrors('please select a color')
            }
        }
        if (product.availableSizes?.length > 0) {
            if (!selectedSize) {
                return setErrors('please select a size')
            }
        };
        const productData = [{
            _id: product._id,
            quantity: quantity || 1,
            selectedColor: selectedColor || null,
            selectedSize: selectedSize || null
        }];

        // stringify + encodeURIComponent
        const encoded = encodeURIComponent(JSON.stringify(productData));

        // Push to checkout
        router.push(`/checkout?products=${encoded}`);
    }


    return (
        // button
        <div className='mt-5'>

            {errors && <p className='text-sm font-bold text-red-500 leading-6'>{errors}</p>}
            < div className="flex flex-row gap-4 " >
                <button
                    className="flex-1 border-2 border-gray-300 hover:border-main hover:text-main py-4 px-6 rounded-xl font-semibold text-lg  transition-all duration-300  flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    disabled={product.stock === 0}
                    onClick={handleAddtoCart}
                >
                    <FiShoppingCart className="w-6 h-6" />
                    Add to Cart
                </button>

                <div className="flex gap-2 flex-1">

                    {/* share button */}
                    <button className="p-4 border-2 w-full flex items-center justify-center cursor-pointer border-gray-300 rounded-xl hover:border-main hover:text-main transition-colors duration-200"
                        onClick={() => handleShare()}
                    >
                        <FiShare2 className="w-6 h-6" />
                    </button>
                </div>
            </div >
            <button
                className="flex-1 w-full mt-5 bg-main text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={product.stock === 0}
                onClick={handleBuyNow}
            >
                <FiShoppingCart className="w-6 h-6" />
                Buy Now
            </button>
        </div>
    )
}
