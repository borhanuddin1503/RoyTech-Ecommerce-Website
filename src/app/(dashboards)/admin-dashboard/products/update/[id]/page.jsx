"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UpdateSkeleton from "./UpdateSkeleton";
import imageCompression from "browser-image-compression";
import ColorPickerTags from "../../add/ColorPicker";
import { revalidateProducts } from "@/app/actions/revalidateTag";


export default function UpdateProduct() {
    const { id } = useParams();

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [photos, setPhotos] = useState("");
    const [product, setProduct] = useState(null);
    const [availableColors, setAvailableColors] = useState([]);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [discount , setDiscount] = useState(0);
    const [regularPrice, setRegularPrice] = useState(0);


    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);


    // Fetch Single Product
    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/manage-products/${id}`);
            const data = await res.json();
            setProduct(data);
            setPhotos(data?.image || data?.images);
            setSelectedCategory(data.category);
            setAvailableColors(data?.availableColors)
        };
        fetchProduct();
    }, [id]);

    // Fetch Categories
    useEffect(() => {
        const loadCategories = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories`);
            const data = await res.json();
            setCategories(data);

            if (product) {
                const cat = data.find((c) => c.name === product.category);
                setSubCategories(cat?.subCategories || []);
            }
        };
        loadCategories();
    }, [product]);

    // calculat eregular price
    useEffect(() => {
        const rp = Math.round(parseFloat(
            (discountedPrice / (1 - discount / 100)).toFixed(2)
        ));

        setRegularPrice(rp);
    }, [discount, discountedPrice]);



    // Upload image
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

    // delete photos
    const handleDeletePhoto = (photo) => {
        const remainedPhoto = photos.filter((p) => p !== photo);
        setPhotos(remainedPhoto)
    }


    // Category Change
    const handleCategoryChange = (e) => {
        const categoryName = e.target.value;
        setSelectedCategory(categoryName);

        const category = categories.find((c) => c.name === categoryName);
        setSubCategories(category?.subCategories || []);
    };

    // Handle Update Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const formatted = {
            ...data,
            stock: parseInt(data.stock),
            discount: parseFloat(data.discount),
            discountedPrice: parseFloat(data.discountedPrice),
            description: data.description,
            isFeatured: data.isFeatured === "on",
            isFreeDelivery: data.isFreeDelivery === 'on',
            regularPrice: data.discount ? Math.round(parseFloat(((parseFloat(data.discountedPrice) / (1 - data.discount / 100))))) : '',
            images: photos,
            features: data.features ? data.features.split(',').map((f) => f.trim()) : '',
            availableColors,
            availableSizes: data.availableSizes ? data.availableSizes.split(",").map(s => s.trim()) : '',

        };


        // Detect Only Changed Fields
        const updatedFields = {};
        for (const key in formatted) {
            if (formatted[key] !== product[key]) {
                updatedFields[key] = formatted[key];
            }
        }

        if (Object.keys(updatedFields).length === 0) {
            Swal.fire("No Changes", "Nothing to update!", "info");
            setUpdating(false);
            return;
        }

        if (updatedFields.discount || updatedFields.discountedPrice) {
            updatedFields.regularPrice = parseFloat((formatted.discountedPrice / (1 - formatted.discount / 100)).toFixed(2))
        }


        // PATCH Request
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/manage-products/${id}`,
            {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(updatedFields),
            }
        );

        const result = await res.json();

        if (result.success) {
            Swal.fire("Success", "Product Updated Successfully", "success");
            await revalidateProducts();
        } else {
            Swal.fire("Error", result.message || "Update failed", "error");
        }

        setUpdating(false);
    };

    if (!product) return <UpdateSkeleton></UpdateSkeleton>;

    return (
        <section className="max-w-4xl mx-auto py-8">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Update Product</h2>
                    <p className="text-gray-600">Edit & update product details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">Title *</label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={product.title}
                            required
                            className="w-full border py-3 px-4 rounded-lg"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Category *</label>
                        <select
                            name="category"
                            required
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="w-full border py-3 px-4 rounded-lg"
                        >
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* SubCategory */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Sub Category *</label>
                        <select
                            name="subCategory"
                            className="w-full border py-3 px-4 rounded-lg"
                            defaultValue={product.subCategory}
                        >
                            {subCategories.map((sc) => (
                                <option key={sc._id} value={sc.name}>
                                    {sc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Brand *</label>
                        <input
                            type="text"
                            name="brand"
                            defaultValue={product.brand}
                            className="w-full border py-3 px-4 rounded-lg"
                        />
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Stock *</label>
                        <input
                            type="number"
                            name="stock"
                            defaultValue={product.stock}
                            className="w-full border py-3 px-4 rounded-lg"
                        />
                    </div>

                    {/* Discount */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Discount (%)</label>
                        <input
                            type="number"
                            name="discount"
                            defaultValue={product.discount}
                            className="w-full border py-3 px-4 rounded-lg"
                            onChange={(e)=> setDiscount(e.target.value)}
                        />
                        {regularPrice > 0 && <p className="text-xs text-gray-500 mt-1">regular price will ৳{regularPrice}</p>}

                    </div>

                    {/* Discount Price */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Discounted Price *</label>
                        <input
                            type="number"
                            step="0.01"
                            name="discountedPrice"
                            defaultValue={product.discountedPrice}
                            className="w-full border py-3 px-4 rounded-lg"
                            onChange={(e) => setDiscountedPrice(e.target.value)}
                        />
                    </div>

                    {/* available sizes */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold mb-2">Available Sizes</label>
                        <input
                            type="text"
                            name="availableSizes"
                            className="w-full border py-3 px-4 rounded-lg"
                            placeholder="Example: S, M, L, XL"
                            defaultValue={product.availableSizes && product.availableSizes.join(',')}
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter sizes separated by commas</p>
                    </div>

                    {/* Available Colors */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold mb-2">Available Colors</label>
                        <ColorPickerTags onChange={setAvailableColors} availableColors={availableColors}></ColorPickerTags>
                        <p className="text-xs text-gray-500 mt-1">Press , after type</p>
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
                        </div>
                        )}
                    </div>

                    {/* photo upload field */}
                    <div className="md:col-span-2">
                        <label className="font-medium">Image *</label>
                        <div className="p-3 border rounded-xl mt-2">
                            <input
                                type="file"
                                accept="image/*"
                                className="cursor-pointer w-full"
                                onChange={(e) => uploadImage(e.target.files)}
                                multiple
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
                            placeholder="10 months warrenty"
                            defaultValue={product?.warrenty}
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter Warrrenty</p>
                    </div>

                    {/* Video Link */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold mb-2">Video Link</label>
                        <input
                            type="text"
                            name="video"
                            defaultValue={product.video}
                            className="w-full border py-3 px-4 rounded-lg"
                            placeholder="https://youtube.com/videos?123"
                        />
                    </div>

                    {/* features */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">Features *</label>
                        <textarea name="features" required rows="4" className="w-full border py-3 px-4 rounded-lg" defaultValue={
                            Array.isArray(product?.features)
                                ? product.features.join(",")
                                : product?.features || ""
                        } placeholder="Product features"></textarea>
                        <p className="text-xs text-gray-500 mt-1">Enter Features separated by commas</p>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">Description *</label>
                        <textarea
                            name="description"
                            defaultValue={product.description}
                            rows="4"
                            className="w-full border py-3 px-4 rounded-lg"
                        ></textarea>
                    </div>

                    {/* Featured */}
                    <div className="md:col-span-2 flex gap-10">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                defaultChecked={product.isFeatured}
                                className="w-4 h-4"
                            />
                            <span className="ml-2">Mark as Featured</span>
                        </label>

                        <label className="flex items-center">
                            <input type="checkbox" name="isFreeDelivery" defaultChecked={product?.isFreeDelivery} className="w-4 h-4" />
                            <span className="ml-2">Free Delivery</span>
                        </label>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button type="submit" className="bg-main text-white px-8 py-3 rounded-xl">
                        {updating ? (
                            <span className="loading loading-spinner text-white"></span>
                        ) : (
                            "Update Product"
                        )}
                    </button>
                </div>
            </form>
        </section>
    );
}
