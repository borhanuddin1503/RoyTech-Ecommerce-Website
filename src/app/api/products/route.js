

import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "30");
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const min = parseFloat(searchParams.get("min") || "0");
    const max = parseFloat(searchParams.get("max") || "99999999");
    const search = searchParams.get('search');
    const idsParam = searchParams.get('ids');

    const query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Brand filter
    if (brand) {
      query.brand = brand;
    }

    // Search filter (regex on title OR brand)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } }
      ];
    }
    console.log('cart ids params from api' , idsParam)

    if (idsParam) {
      const idsArray = idsParam.split(","); // comma separated
      query._id = { $in: idsArray.map(id => new ObjectId(id))}; 
    }


    // Price Range filter
    query.discountedPrice = { $gte: min, $lte: max };

    // DB Connect
    const productsCollection = await dbConnect(collections.products);

    // Total products count for pagination
    const total = await productsCollection.countDocuments(query);


    // Fetch products
    const products = await productsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      products,
      total,
      page,
      limit,
    });

  } catch (error) {
    console.error("PRODUCT GET API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load products" },
      { status: 500 }
    );
  }
}


// DELETE: /api/admin/products?id=productId
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE product error", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}