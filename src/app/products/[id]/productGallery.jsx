"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images = [], title, image }) {

    // combine images: if images exist use them; else use single image
    const allImages = images.length > 0 ? images : [image];

    const [activeImg, setActiveImg] = useState(allImages[0]);

    return (
        <div className="space-y-4">

            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <Image
                    src={activeImg}
                    alt={title}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover transition-all duration-300"
                />
            </div>

            {/* Thumbnails */}
            {allImages.length > 0 && (
                <div className="flex gap-3 overflow-x-auto">
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveImg(img)}
                            className={`w-20 h-20 rounded-xl overflow-hidden border-2 
                                ${activeImg === img ? "border-main" : "border-gray-300"}
                            `}
                        >
                            <Image
                                src={img}
                                alt="thumbnail"
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
