import { FiShoppingCart, FiStar, FiTrendingUp } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
    return (
        <div className="group h-full">
            <Link className="h-full" href={`products/${product._id}`}>
                <div className="bg-white h-full rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-xl hover:border-main transition-all duration-300 transform group-hover:-translate-y-2">
                    {/* Product Image */}
                    <div className="relative mb-4">
                        <div className="rounded-xl overflow-hidden bg-gray-100">
                            <Image
                                src={product?.image || product?.images[0]}
                                alt={product.title}
                                width={200}
                                height={200}
                                className="object-cover w-full h-40 group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Sales Count Badge */}
                        <div className="absolute top-2 left-2 bg-main text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <FiTrendingUp className="w-3 h-3" />
                            {product.salesCount}+ sold
                        </div>

                        {/* Discount Badge */}
                        {product.discount > 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                -{product.discount}%
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                        {/* Brand */}
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                            {product.brand}
                        </p>

                        {/* Title */}
                        <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2 group-hover:text-main transition-colors duration-200">
                            {product.title}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            
                            <span className="text-xs text-gray-500">
                                • {product.stock} left
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                                ৳{product.discountedPrice}
                            </span>
                            {product.discount > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                    ৳{product.regularPrice}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
};