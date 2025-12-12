import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = await params;
    const productsCollection = await dbConnect(collections.products);
    const result = await productsCollection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json(result)
}