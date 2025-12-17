"use client";

import React, { useEffect, useState } from "react";
import { FiTag, FiPackage, FiPercent, FiDollarSign, FiImage, FiPlus } from "react-icons/fi";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression";
import ColorPickerTags from "./ColorPicker";
import { BiAddToQueue } from "react-icons/bi";


export default function AddProduct() {

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [upLoadingData, setUploadingData] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [regularPrice, setRegularPrice] = useState(0);
    const [availableColors, setAvailableColors] = useState([]);



    // Fetch Categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories`, {
                    next: { tags: ['admin-categories'], revalidate: 3600 }
                });
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        fetchCategories();
    }, []);


    // calculate regular price
    useEffect(() => {
        const rp = Math.round(parseFloat(
            (discountedPrice / (1 - discount / 100)).toFixed(2)
        ));

        setRegularPrice(rp);
    }, [discount, discountedPrice]);



    // handle photo upload
    const uploadImage = async (files) => {
        setLoading(true);
        const uploadedPhotos = [];

        const options = {
            maxSizeMB: 0.4,
            maxWidthOrHeight: 1000,
            useWebWorker: true,
        };

        for (const file of files) {
            const compressed = await imageCompression(file, options);

            const fd = new FormData();
            fd.append("image", compressed);

            // Send to backend
            const res = await fetch("/api/upload-webp-imgbb", {
                method: "POST",
                body: fd
            });

            const result = await res.json();

            if (result.success) {
                uploadedPhotos.push(result.url);
            }
        }

        setPhotos([...photos, ...uploadedPhotos]);
        setLoading(false);
    };




    // handle delete photo
    const handleDeletePhoto = (src) => {
        const deletedPhotos = photos.filter((photo) => photo !== src);
        setPhotos(deletedPhotos)
    }


    // handle category change
    const handleCategoryChange = (e) => {
        const categoryName = e.target.value;
        setSelectedCategory(categoryName);

        const category = categories.find((c) => c.name === categoryName);
        setSubCategories(category?.subCategories || []);
    };




    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUploadingData(true)
            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const finalData = {
                ...data,
                isFeatured: data.isFeatured === 'on',
                isFreeDelivery: data.isFreeDelivery === 'on',
                images: photos,
                regularPrice: data.discount ? Math.round(parseFloat(((parseFloat(data.discountedPrice) / (1 - data.discount / 100))))) : '',
                salesCount: 0,
                createdAt: new Date().toISOString(),
                stock: parseInt(data.stock),
                discount: data.discount ? parseFloat(data?.discount) : '',
                discountedPrice: parseFloat(data.discountedPrice),
                features: data.features ? data.features.split(',').map((f) => f.trim()) : '',
                availableColors,
            }
            if (data.availableSizes) {
                finalData.availableSizes = data.availableSizes.split(",").map(s => s.trim())
            }



            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/manage-products`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(finalData)
            });

            const result = await res.json();
            if (result.success === true) {
                form.reset();
                setPhotos([]);
                setAvailableColors([]);
                Swal.fire('Success', result.message, 'success');
            } else {
                Swal.fire('Error', 'Something went wrong', 'error')
            }

        } catch (error) {
            Swal.fire('Error', 'Something went wrong', 'error')
        } finally {
            setUploadingData(false)
        }

    };

    console.log(photos)

    return (
        <section className="max-w-4xl mx-auto  py-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className=" mb-8 flex gap-5">
                    <div className="text-4xl text-main">
                        <BiAddToQueue />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-main"> Add New Product</h2>
                        <p className="text-gray-500 text-sm">Add a new product to your store</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">Product Title *</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="title"
                                required
                                className="w-full border py-3 px-4 pl-11 rounded-lg"
                                placeholder="Enter product title"
                            />
                            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Category *</label>
                        <div className="relative">
                            <select
                                name="category"
                                required
                                onChange={handleCategoryChange}
                                className="w-full border py-3 px-4 pl-11 rounded-lg"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                    </div>

                    {/* Sub Category */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Sub Category *</label>
                        <div className="relative">
                            <select
                                name="subCategory"
                                disabled={subCategories.length === 0}
                                className="w-full border py-3 px-4 pl-11 rounded-lg"
                                required
                            >
                                <option value="">Select Sub Category</option>
                                {subCategories.map((sc) => (
                                    <option key={sc._id} value={sc.name}>
                                        {sc.name}
                                    </option>
                                ))}
                            </select>
                            <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Brand *</label>
                        <input type="text" name="brand" required className="w-full border py-3 px-4 rounded-lg" placeholder="Enter brand name" />
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Stock *</label>
                        <input type="number" name="stock" required className="w-full border py-3 px-4 rounded-lg" placeholder="Stock quantity" />
                    </div>

                    {/* Discount */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Discount %</label>
                        <input type="number" name="discount" className="w-full border py-3 px-4 rounded-lg" placeholder="Discount %" onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
                        {regularPrice > 0 && <p className="text-xs text-gray-500 mt-1">Regular Price will ৳{regularPrice}</p>}
                    </div>

                    {/* Discounted Price */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Discounted Price *</label>
                        <input type="number" name="discountedPrice" required className="w-full border py-3 px-4 rounded-lg" placeholder="Enter discounted price" onChange={(e) => setDiscountedPrice(parseFloat(e.target.value) || 0)} />
                    </div>


                    {/* available sizes */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold mb-2">Available Sizes</label>
                        <input
                            type="text"
                            name="availableSizes"
                            className="w-full border py-3 px-4 rounded-lg"
                            placeholder="Example: S, M, L, XL"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter sizes separated by commas</p>
                    </div>

                    {/* Available Colors */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold mb-2">Available Colors</label>
                        <ColorPickerTags onChange={setAvailableColors} availableColors={availableColors}></ColorPickerTags>
                    </div>


                    {/* images */}
                    <div className="md:col-span-2">
                        {photos.length > 0 && (<div className="flex flex-wrap gap-5">
                            {
                                photos.map((photo, i) =>
                                    <div className="mt-2 relative w-32 h-32" key={i}>
                                        <img
                                            src={photo}
                                            className="rounded-xl border w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeletePhoto(photo)}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8"
                                        >
                                            ×
                                        </button>
                                    </div>)
                            }
                        </div>)}
                        <label className="block text-sm font-semibold mb-2">Category Image *</label>
                        <div className="p-3 border rounded-xl mt-2">

                            <input
                                type="file"
                                accept="image/*"
                                className="cursor-pointer w-full"
                                onChange={(e) => uploadImage(e.target.files)}
                                multiple
                                required
                            />
                            {loading && <p className="text-main text-sm mt-2">Uploading...</p>}
                        </div>
                    </div>


                    {/* warrenty */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold mb-2">Warrenty</label>
                        <input
                            type="text"
                            name="warrenty"
                            className="w-full border py-3 px-4 rounded-lg"
                            placeholder="10 years warrenty"
                        />
                    </div>

                    {/* Video Link */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold mb-2">Video Link</label>
                        <input
                            type="text"
                            name="video"
                            className="w-full border py-3 px-4 rounded-lg"
                            placeholder="https://youtube.com/videos?123"
                        />
                    </div>

                    {/* features */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">Features *</label>
                        <textarea name="features" required rows="4" className="w-full border py-3 px-4 rounded-lg" placeholder="Product features"></textarea>
                        <p className="text-xs text-gray-500 mt-1">Enter Features separated by commas</p>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">Description *</label>
                        <textarea name="description" required rows="4" className="w-full border py-3 px-4 rounded-lg" placeholder="Product description"></textarea>
                    </div>

                    {/* Featured */}
                    <div className="md:col-span-2 flex gap-10">
                        <label className="flex items-center">
                            <input type="checkbox" name="isFeatured" className="w-4 h-4" />
                            <span className="ml-2">Mark as Featured</span>
                        </label>

                        <label className="flex items-center">
                            <input type="checkbox" name="isFreeDelivery" className="w-4 h-4" />
                            <span className="ml-2">Free Delivery</span>
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="mt-8 text-center">
                    <button type="submit" className="bg-main text-white px-8 py-3 rounded-xl  gap-2 mx-auto min-w-25">
                        {upLoadingData ? <div className="flex justify-center">
                            <span className="loading loading-spinner text-white"></span>
                        </div>
                            : <div className="flex items-center">
                                <FiPlus className="w-5 h-5" />
                                Add Product
                            </div>
                        }
                    </button>
                </div>
            </form>
        </section>
    );
}
