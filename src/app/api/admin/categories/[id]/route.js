import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect, { collections } from "@/lib/dbConnect";
import { revalidateTag } from "next/cache";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params; 
        const categoriesCollection = await dbConnect(collections.categories);

        const result = await categoriesCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }
        revalidateTag('admin-categories');
        revalidateTag('categories');
        return NextResponse.json({
            success: true,
            message: "Category deleted successfully",
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
