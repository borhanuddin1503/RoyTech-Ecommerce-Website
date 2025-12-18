import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { TbCategory } from 'react-icons/tb';

// Fetch categories from API
async function getCategories() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
        next: { tags: ['categories'], revalidate: 3600 }
    });

    return res.json();
}

const CategoriesBrowse = async () => {
    const categories = await getCategories();

    if (categories.length < 1) return;

    return (
        <section className="min-h-screen bg-gray-50 py-4">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className=" mb-5">
                    <div className='text-2xl font-bold text-main flex gap-3 items-center'>
                        <div>
                            <TbCategory />
                        </div>
                        <h1 className="">
                            Browse by Category
                        </h1>
                    </div>
                    <p className="text-gray-600  text-sm">
                        Explore our wide range of products across different categories
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6 mb-12">
                    {categories.map((category) => (
                        <div key={category._id} >
                            <Link
                                href={`${process.env.NEXT_PUBLIC_BASE_URL}/products?category=${category.name}`}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:border-main transition-all duration-300 transform group-hover:-translate-y-2 text-center h-full">
                                    {/* Icon from your category data */}
                                    <div className="w-16 h-16 mx-auto mb-4 relative">
                                        <Image
                                            src={category.icon}
                                            alt={category.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* Category Name */}
                                    <h3 className=" text-sm font-semibold text-gray-800 group-hover:text-main transition-colors duration-200">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Description Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Find What You Need</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            Click on any category above to browse products. Each category contains carefully
                            selected items to meet your needs. From electronics to home essentials,
                            we have everything you're looking for.
                        </p>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-8 py-3 border border-main text-main rounded-xl font-semibold hover:bg-main hover:text-white transform hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-lg"
                    >
                        View All Products
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategoriesBrowse;