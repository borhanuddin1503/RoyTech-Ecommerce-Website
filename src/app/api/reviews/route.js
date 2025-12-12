import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const data = await req.json();
        const { productId, userEmail , comment } = data;

        if (!productId || !userEmail || !comment) {
            return Response.json(
                { success: false, message: "Missing required fields." },
                { status: 400 }
            );
        }

        const reviewsCollection = await dbConnect(collections.reviews);
        // Create new review
        await reviewsCollection.insertOne({
            ...data,
            createdAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            message: "Review added successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}


