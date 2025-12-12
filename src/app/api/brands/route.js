import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const productsCollection = await dbConnect(collections.products);
    const products = await productsCollection.find().toArray();


    const brands =[...new Set(products.map((product) => product.brand))];

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Brands API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load brands" },
      { status: 500 }
    );
  }
}

