import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import ProductCard from '../best-selling-products/ProductCard';

async function getFeaturedProducts() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/featured-products`, {
        next: { tags: ['products'] , revalidate: 3600 }
    });
    return res.json();

}

const FeaturedProducts = async () => {
    const products = await getFeaturedProducts();

    return (
        <section className='bg-white mt-17 py-15'>
            <div className="max-w-7xl mx-auto px-4 ">
                {/* Section Header */}
                <div className="text-center mb-7">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">
                        Featured Products
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Discover our most popular and trending products
                    </p>
                </div>

                {/* Products Grid - 5 cards per row */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                    {products.map((product) => (
                        <ProductCard product={product} key={product._id}></ProductCard>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-10">
                    <Link href="/products">
                        <button className="px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transform cursor-pointer transition-all duration-300 shadow-lg hover:shadow-main/25 border border-main text-main">
                            Browse More
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;