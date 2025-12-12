import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiStar } from 'react-icons/fi';
import ProductCard from '../best-selling-products/ProductCard';

async function getNewArrivals() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/new-arrivals`, {
        next: { tags: ['products'], revalidate: 3600 }
    });
    return res.json();
}

const NewArrivals = async () => {
    const products = await getNewArrivals();

    return (
        <section className='bg-white mt-17 py-15'>
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-7">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">
                        New Arrivals
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Check out our latest products
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                    {products.map((product) => (
                        <ProductCard product={product} key={product._id}></ProductCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;