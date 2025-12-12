"use client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Swal from "sweetalert2";

const IMGBB_KEY = "4333f4ac023df73b1c7ff23dfa7f2b03";

export default function CreateCategory({ onSuccess }) {
    const [name, setName] = useState("");
    const [photo, setPhoto] = useState("");
    const [loading, setLoading] = useState(false);
    const [upLoadingData, setUploadingData] = useState(false);
    const queryClient = useQueryClient();

    const uploadImage = async (file) => {
        setLoading(true);
        const fd = new FormData();
        fd.append("image", file);

        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
            { method: "POST", body: fd }
        );
        const data = await res.json();
        setLoading(false);

        if (data?.success) {
            setPhoto(data.data.url);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setUploadingData(true)
        try {
            const payload = {
                name,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
                icon: photo,
                description: "",
                subCategories: [],
                createdAt: new Date().toISOString(),
            };

            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (result.isSuccess === true) {
                queryClient.invalidateQueries(['categories'])
                Swal.fire('Success', result.message, 'success');
                setName("");
                setPhoto("");
                onSuccess();
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Something went Wrong', 'error');
        } finally {
            setUploadingData(false);
        }
    };


    return (
        <form onSubmit={submit} className="space-y-4">

            <div>
                <label className="font-medium">Category Name *</label>
                <input
                    className="w-full border rounded-xl p-3 mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Electronics"
                    required
                />
            </div>

            {/* image */}
            <div>
                <label className="font-medium">Category Image *</label>

                {photo ? (
                    <div className="mt-2 relative w-32 h-32">
                        <img
                            src={photo}
                            className="rounded-xl border w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => setPhoto("")}
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8"
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <div className="p-3 border rounded-xl mt-2">
                        <input
                            type="file"
                            accept="image/*"
                            className="cursor-pointer"
                            onChange={(e) => uploadImage(e.target.files[0])}
                            required
                        />
                        {loading && <p className="text-main text-sm mt-2">Uploading...</p>}
                    </div>
                )}
            </div>

            <button
                className="px-5 py-2 rounded-xl bg-main text-white cursor-pointer min-w-50"
            >
                {
                    upLoadingData ? <span className="loading loading-spinner text-white"></span> :
                        'Create Category'
                }
            </button>
        </form>
    );
}
