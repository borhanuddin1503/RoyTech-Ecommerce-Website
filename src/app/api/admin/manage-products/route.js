import dbConnect, { collections } from "@/lib/dbConnect";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";


export async function POST(req) {
    const productInfo = await req.json();
    const productsCollection = await dbConnect(collections.products);
    const res = await productsCollection.insertOne(productInfo);

    if(res.insertedId){
        revalidateTag('products');
        return NextResponse.json({
            success: true ,
            message: `${productInfo.title} Addeded Successfully`
        })
    }else{
        return NextResponse.json({
            success: false ,
            message: `Something went wrong`
        })
    }
}