import dbConnect, { collections } from "@/lib/dbConnect";


export async function GET() {
    const productsCollectin = await dbConnect(collections.products);
    const featuredProducts = await productsCollectin.find({isFeatured:true}).limit(10).sort({createdAt: -1}).toArray();
    return Response.json(featuredProducts);
}