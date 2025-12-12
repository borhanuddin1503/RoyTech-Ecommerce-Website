import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import banner1 from '@/app/assets/images/banner-mobile.webp';
import banner2 from '@/app/assets/images/banner-2.webp';
import banner3 from '@/app/assets/images/banner-3.webp';

export default function BannerGrid() {
    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-4">
                {/* Main Large Banner - 9/12 width, 2 rows */}
                <Link href="/categories/smartphones" className="lg:col-span-9 row-span-2 col-span-2 group">
                    <div className="relative h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
                        <Image
                            src={banner1}
                            alt="Latest Smartphones"
                            className="object-cover group-hover:scale-105 transition-transform duration-700 h-full"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300"></div>
                    </div>
                </Link>

                {/* First Small Banner - 3/12 width, 1 row */}
                <Link href="/categories/laptops" className="lg:col-span-3 group">
                    <div className="relative h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
                        <Image
                            src={banner2}
                            alt="Premium Laptops"
                            className="object-cover group-hover:scale-105 transition-transform duration-700 h-full w-full"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300"></div>
                    </div>
                </Link>

                {/* Second Small Banner - 3/12 width, 1 row */}
                <Link href="/categories/accessories" className="lg:col-span-3 group">
                    <div className="relative h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
                        <Image
                            src={banner3}
                            alt="Tech Accessories"
                            className=" group-hover:scale-105 transition-transform duration-700 h-full object-cover w-full"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300"></div>
                    </div>
                </Link>
            </div>
        </div>
    );
}