import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export async function GET() {
    const categoriesCollection = await dbConnect(collections.categories);
    const result = await categoriesCollection.find({}).toArray();
    return NextResponse.json(result)
}