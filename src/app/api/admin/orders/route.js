import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req, params) {
  const { searchParams } = new URL(req.url);
  console.log(searchParams)
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 20;
  const skip = (page - 1) * limit
  try {
    const ordersCollection = await dbConnect(collections.orders);
    const total = await ordersCollection.countDocuments({
      $or: [
        {
          paymentMethod: "online",
          paymentStatus: "paid",
        },
        {
          paymentMethod: "cod",
        }
      ]
    });
    const result = await ordersCollection.find({
      $or: [
        {
          paymentMethod: "online",
          paymentStatus: "paid",
        },
        {
          paymentMethod: "cod",
        }
      ]
    }).sort({ orderedAt: -1 }).skip(skip).limit(limit).toArray();
    return NextResponse.json({
      orders: result,
      total: total,
      success: true,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    })
  }
}




export async function PATCH(req) {
  try {
    const { _id, status } = await req.json();

    if (!_id || !status) {
      return NextResponse.json(
        { success: false, message: "Missing _id or status" },
        { status: 400 }
      );
    }

    const ordersCollection = await dbConnect(collections.orders);

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          orderStatus: status,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
