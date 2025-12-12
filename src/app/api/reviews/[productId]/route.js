import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req , {params}) {
    const {productId} = await params;
    console.log( 'product id from api' , productId)
    const reviewsColleciton = await dbConnect(collections.reviews);
    const result = await reviewsColleciton.find({productId}).toArray();
    return NextResponse.json(result)
}