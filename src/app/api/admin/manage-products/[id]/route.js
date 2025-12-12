import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";


export async function DELETE(req, { params }) {
    const { id } = await params;
    const productsCollection = await dbConnect(collections.products);
    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });
    revalidateTag('products')
    return NextResponse.json(result)
}


export async function GET(req, { params }) {
    const { id } = await params;
    const productsCollection = await dbConnect(collections.products);
    const result = await productsCollection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json(result)
}


export async function PATCH(req, { params }) {
    try {
        const { id } = await params;
        const productUpdatedInfo = await req.json();
        const productsCollection = await dbConnect(collections.products);
        const result = await productsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: productUpdatedInfo }
        );
        revalidateTag('products')
        return NextResponse.json({
            success: true,
            message: `${productUpdatedInfo.title} updated successfullly`
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Update failed'
        })
    }
}