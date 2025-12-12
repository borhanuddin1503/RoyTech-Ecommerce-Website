import React from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

async function getBestSellingProducts() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/best-sale`, {
       next: { tags: ['products'] , revalidate: 3600 }
    });
    return (res.json());
}



const BestSales = async () => {
    const products = await getBestSellingProducts();
    if (products.length === 0) {
        return <p>No Products here</p>
    }

    return (
        <section className="max-w-7xl mx-auto px-4 mt-17">
            {/* Section Header */}
            <div className="text-center mb-7">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    Best Selling Products
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Most popular products loved by our customers
                </p>
            </div>

            {/* Products Grid - 5 cards per row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-10">
                <Link href="/products">
                    <button className=" px-8 py-3 rounded-lg font-semibold  transform cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl border border-main text-main">
                        Browse More
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default BestSales;