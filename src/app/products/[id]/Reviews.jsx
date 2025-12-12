'use client'
import React from "react";
import Image from "next/image";
import { FiStar, FiUser } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Reviews({ productId }) {

    const { data: userInfo } = useSession();
    const queryClient = useQueryClient();


    // get reviews for this products
    const { data: reviews } = useQuery({
        queryKey: ['reviews', productId],
        queryFn: async () => {
            const res = await fetch(`/api/reviews/${productId}`);
            return res.json();
        },
        staleTime: 1000 * 60 * 20
    })

    console.log(reviews)

    // handle comment submit
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const form = e.target;
        const comment = form.comment.value;
        const finalData = {
            productId: productId,
            userEmail: userInfo?.user?.email,
            comment,
            userImage: userInfo?.user?.image,
        }


        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(finalData)
        });

        const result = await res.json();

        if (result.success) {
            Swal.fire('Success', result.message, 'success');
            queryClient.invalidateQueries(['reviews'])
            form.reset();
        } else {
            Swal.fire('Error', result.message, 'error')
        }
    }

    return (
        <div className="">
            {reviews?.length < 1 || !reviews ?
                <div className="" >
                    <p className="text-gray-500 flex items-center gap-2 font-bold"><FiStar className="text-yellow-400"></FiStar> No reviews yet.</p>
                </div> :
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-5">Customer Reviews</h2>

                    <div className="space-y-4">
                        {reviews?.map((rev) => (
                            <div
                                key={rev._id}
                                className="border border-gray-200 rounded-xl p-4 flex gap-4 items-start hover:shadow-sm transition"
                            >
                                {/* Avatar */}
                                {rev.userImage ? (
                                    <Image
                                        src={rev?.userImage}
                                        alt={rev.userEmail}
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <FiUser className="text-gray-400 text-xl" />
                                    </div>
                                )}

                                {/* Review Content */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {rev.userEmail}
                                                {/* Review Text */}
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                {rev.comment}
                                            </p>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(rev.createdAt).toLocaleDateString(
                                                "en-US",
                                                { year: "numeric", month: "short", day: "numeric" }
                                            )}
                                        </span>
                                    </div>


                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
            {/* write a review */}
            <form
                onSubmit={(e) => handleSubmitComment(e)}
                className="mt-6  rounded-xl"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Write a Review
                </h3>

                {/* If user not logged in */}
                {!userInfo ? (
                    <p className="text-red-500 font-medium">
                        You must be logged in to write a review.
                    </p>
                ) : (
                    <>
                        {/* Textarea */}
                        <textarea
                            placeholder="Share your experience..."
                            className="w-full h-28 p-3 border border-gray-300  rounded-xl outline-none focus:ring-2 focus:ring-main/40 resize-none"
                            name="comment"
                            required
                        ></textarea>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="mt-3 w-full bg-main text-white font-medium py-3 rounded-xl hover:bg-main/90 transition cursor-pointer"
                        >
                            Submit Review
                        </button>
                    </>
                )}
            </form>
        </div >
    );
}
