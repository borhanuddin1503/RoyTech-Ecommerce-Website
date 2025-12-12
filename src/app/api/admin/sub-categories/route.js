import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { ObjectId } from "mongodb";
import dbConnect, { collections } from "@/lib/dbConnect";

export async function POST(req) {
    try {
        const body = await req.json();
        const { parentId, name, slug, image, createdAt } = body;

        const categoriesCollection = await dbConnect(collections.categories);

        // 🔍 Check parent category
        const parent = await categoriesCollection.findOne({
            _id: new ObjectId(parentId),
        });

        if (!parent) {
            return NextResponse.json({
                isSuccess: false,
                message: "Parent category not found",
            });
        }

        // 🔍 Check if subcategory already exists
        const exists = parent.subCategories?.find(
            (sc) => sc.name.toLowerCase() === name.toLowerCase()
        );

        if (exists) {
            return NextResponse.json({
                isSuccess: false,
                message: "Subcategory already exists",
            });
        }

        // 🆕 New subcategory object
        const newSubCategory = {
            _id: new ObjectId(),
            name,
            slug,
            image,
            createdAt,
        };

        // ➕ Push into subCategories array inside parent category
        await categoriesCollection.updateOne(
            { _id: new ObjectId(parentId) },
            { $push: { subCategories: newSubCategory } }
        );

        // ♻ Cache revalidate
        revalidateTag('categories');
        revalidateTag('admin-categories');

        return NextResponse.json({
            isSuccess: true,
            message: "Subcategory added successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { isSuccess: false, message: "Server error" },
            { status: 500 }
        );
    }
}
