import React from 'react';
import Link from 'next/link';
import { FiHome, FiSearch, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="text-center max-w-2xl">
                {/* Error Code */}
                <div className="mb-8 relative">
                    <h1 className="text-9xl font-bold text-gray-300 opacity-30">404</h1>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-32 h-32 bg-main/10 rounded-full flex items-center justify-center">
                            <FiSearch className="w-16 h-16 text-main" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Page Not Found</h2>
                    <p className="text-gray-600 text-lg max-w-lg mx-auto">
                        Oops! The page you're looking for seems to have wandered off into the digital unknown.
                    </p>
                    <p className="text-gray-500">
                        It might have been moved, deleted, or perhaps never existed.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Link href="/">
                        <button className="group bg-main text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-main/25 flex items-center justify-center gap-3">
                            <FiHome className="w-5 h-5" />
                            Back to Home
                        </button>
                    </Link>
                    <Link href="/products">
                        <button className="group border-2 border-main text-main px-8 py-4 rounded-xl font-semibold hover:bg-main hover:text-white transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3">
                            <FiShoppingBag className="w-5 h-5" />
                            Browse Products
                        </button>
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Link 
                            href="/products?sort=newest" 
                            className="p-3 rounded-lg border border-gray-200 hover:border-main hover:text-main transition-colors duration-200 text-sm"
                        >
                            New Arrivals
                        </Link>
                        <Link 
                            href="/products?sort=best-selling" 
                            className="p-3 rounded-lg border border-gray-200 hover:border-main hover:text-main transition-colors duration-200 text-sm"
                        >
                            Best Sellers
                        </Link>
                        <Link 
                            href="/categories" 
                            className="p-3 rounded-lg border border-gray-200 hover:border-main hover:text-main transition-colors duration-200 text-sm"
                        >
                            Categories
                        </Link>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-8 text-sm text-gray-500">
                    <p>Need help? <Link href="/contact" className="text-main hover:underline">Contact our support team</Link></p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
