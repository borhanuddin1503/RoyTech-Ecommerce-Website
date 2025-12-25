import Link from 'next/link';
import React from 'react';
import { FiStar, FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiArrowLeft } from 'react-icons/fi';
import Image from 'next/image';
import ProductGallery from './productGallery';
import Description from './Description';
import Reviews from './Reviews';
import VideoFrame from './VideoFrame';
import ProductClient from './clientSelectors/productClient';
import ProductsNotFound from '@/app/components/shared/Not-Found';

export default async function page({ params }) {
    const { id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`, {
        next: { tags: ['single-products', id], revalidate: 3600 }
    });

    const product = await res.json();


    const relatedProductsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category=${product?.category}&limit=5`, {
        next: { tags: ['relatedProducts', product?.category], revalidate: 3600 }
    })
    const { products } = await relatedProductsRes.json();


    if(!product){
        return  <div className='min-h-[calc(100vh-100px)] flex items-center justify-center'><ProductsNotFound></ProductsNotFound></div>
    }

    return (
        <div>
            <section className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Link href="/products" className="inline-flex items-center gap-2 text-main hover:text-opacity-80 transition-colors duration-200">
                            <FiArrowLeft className="w-4 h-4" />
                            Back to Products
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8 ">
                            {/* Product Images */}
                            <div className="space-y-4">
                                {/* Main Image */}
                                <ProductGallery images={product?.images} title={product.title} image={product?.image}></ProductGallery>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-6">
                                {/* Category & Brand */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
                                        <span>{product.brand}</span>
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                        {product.title}
                                    </h1>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">{product.salesCount || 0} sold</span>
                                    </div>
                                </div>

                                {/* Price Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold text-gray-900">
                                            ৳{product.discountedPrice || product.regularPrice}
                                        </span>
                                        {product.discount > 0 && (
                                            <>
                                                <span className="text-xl text-gray-500 line-through">
                                                    ৳{product?.regularPrice}
                                                </span>
                                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                    {product.discount}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {product.discount > 0 && (
                                        <p className="text-green-600 font-semibold">
                                            You save ৳{(product.regularPrice - product.discountedPrice).toFixed(2)}
                                        </p>
                                    )}
                                </div>

                                {/* Features */}
                                {product.features &&
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
                                        <ul className='text-gray-600'>
                                            {product.features.map((feature, i) =>
                                                <li className='list-disc list-inside' key={i}>{feature}</li>
                                            )}
                                        </ul>
                                    </div>
                                }

                                {/* Stock & Actions */}
                                <div className="space-y-4">
                                    {/* Stock Info */}
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </div>

                                    {/* buy button and sizes and others  */}
                                    <ProductClient product={product}></ProductClient>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                                    {product?.isFreeDelivery && <div className="flex items-center gap-3 text-gray-600">
                                        <FiTruck className="w-5 h-5 text-main" />
                                        <span>Free shipping</span>
                                    </div>}
                                    {product?.warrenty && <div className="flex items-center gap-3 text-gray-600">
                                        <FiShield className="w-5 h-5 text-main" />
                                        <span>{product.warrenty}</span>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* descriptions Reviews and other sections */}
                    <section className='grid grid-cols-12 mt-5'>

                        {/* left side code */}
                        {/* description , reviews , rating  part */}
                        <div className='col-span-12 md:col-span-9 md:mr-5 flex flex-col'>
                            {/* description */}
                            {product.description &&
                                <div className='shadow-lg border bg-white border-gray-200 p-6 lg:p-8 rounded-2xl'>
                                    <Description description={product?.description}></Description>
                                    {product?.video && <VideoFrame url={product.video}></VideoFrame>}
                                </div>
                            }

                            <div className='shadow-lg border bg-white grow border-gray-200 p-6 lg:p-8 rounded-2xl mt-5'>
                                <Reviews productId={product._id}></Reviews>
                            </div>
                        </div>


                        {/* Right side: Related products */}
                        <div className='md:col-span-3 col-span-12 mt-5 md:mt-0 space-y-4 bg-white p-6 lg:p-8 rounded-2xl shadow-2xl'>
                            <h2 className='text-2xl md:text-lg mb-5 font-semibold text-gray-900  '>Related Products</h2>
                            {products.map((item) => (
                                <Link key={item._id} href={`/products/${item._id}`}>
                                    <div className='border border-gray-300 rounded-xl p-3 hover:shadow-md transition flex justify-between gap-2 mb-2'>
                                        <div className='shrink-0'>
                                            <Image
                                                src={item?.image || item?.images[0]}
                                                width={80}
                                                height={80}
                                                alt={item.title}
                                                className='rounded-lg w-15 h-15 object-cover'
                                            />
                                        </div>
                                        <div className='text-right'>
                                            <h3 className='text-sm font-medium mt-2'>{item.title}</h3>
                                            <span className='text-sm text-gray-500'>
                                                ৳{item.discountedPrice || item.regularPrice}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </section>
        </div>
    )
}
