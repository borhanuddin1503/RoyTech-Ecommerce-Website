import dbConnect, { collections } from "@/lib/dbConnect";

export async function GET() {
    const productsColleciton = await dbConnect(collections.products);
    const newArribalsProduct = await productsColleciton.find({})
    .sort({createdAt: -1})
    .limit(10)
    .toArray();

    return Response.json(newArribalsProduct);
}