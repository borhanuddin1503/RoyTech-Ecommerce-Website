import dbConnect, { collections } from "@/lib/dbConnect";


export async function GET() {
    const productsCollection = await dbConnect(collections.products);
    const products = await productsCollection.find({})
        .sort({ salesCount: -1 })
        .limit(10)
        .toArray();
    return Response.json(products);
}