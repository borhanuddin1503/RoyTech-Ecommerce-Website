import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req , params) {
    const {searchParams} = new URL(req.url);
    console.log(searchParams)
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit
    try {
        const ordersCollection = await dbConnect(collections.orders);
        const total = await ordersCollection.countDocuments();
        const result = await ordersCollection.find().sort({orderedAt: -1}).skip(skip).limit(limit).toArray();
        return NextResponse.json({
            orders: result,
            total: total,
            success: true,
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
        })
    }
}