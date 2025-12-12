import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect, { collections } from "@/lib/dbConnect";
import { revalidateTag } from "next/cache";

export async function DELETE(req, { params }) {
    try {
        const categoriesCollection = await dbConnect(collections.categories);

        const paramss = await params; 
        const subId = paramss.id;
        const categoryId = req.nextUrl.searchParams.get("categoryId");


        // MongoDB native update
        const result = await categoriesCollection.updateOne(
            { _id: new ObjectId(categoryId) },
            { $pull: { subCategories: { _id: new ObjectId(subId) } } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Category or Subcategory not found" },
                { status: 404 }
            );
        }
        revalidateTag('admin-categories');
        revalidateTag('categories');
        return NextResponse.json(
            { success: true, message: "Subcategory deleted successfully" },
            { status: 200 }
        );
    } catch (err) {
        console.error("DELETE ERROR:", err);
        return NextResponse.json(
            { success: false, message: "Database error" },
            { status: 500 }
        );
    }
}
