import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import dbConnect, { collections } from "@/lib/dbConnect";

// get categories for admin
export async function GET() {
    const categoriesCollection = await dbConnect(collections.categories);
    const result = await categoriesCollection.find({}).toArray();
    return NextResponse.json(result)
}

// creat categories
export async function POST(req) {
    try {
        const data = await req.json();
        const categoriesCollection = await dbConnect(collections.categories);

        // check exists
        const isExists = await categoriesCollection.findOne({name: data.name});
        if(isExists){
            return NextResponse.json({isSuccess: false , message: 'Category already Exists'});
        }

        const result = await categoriesCollection.insertOne(data);
        revalidateTag('categories');
        revalidateTag('admin-categories');
        
        return NextResponse.json({isSuccess: true, message: 'Category Added Successfully'})

    } catch (error) {
        return NextResponse.json(
            { isSuccess: false, message: "Server error" },
            { status: 500 }
        );
    }
}
