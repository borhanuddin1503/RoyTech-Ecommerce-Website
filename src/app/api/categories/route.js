import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const limit = Number(searchParams.get('limit'));

    const categoriesCollection = await dbConnect(collections.categories);
    const result = await categoriesCollection.find({}).limit(limit).toArray();
    return NextResponse.json(result)
}