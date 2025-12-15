import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const body = await req.json();
    const { products, customer, paymentMethod } = body;
    const visitorsId = req.cookies.get('visitorId');
    const userInfo = await getServerSession(authOptions);

    if (!products?.length) {
      return NextResponse.json(
        { success: false, message: "No items found" },
        { status: 400 }
      );
    }

    if (!customer?.name || !customer?.phone || !customer?.address) {
      return NextResponse.json(
        { success: false, message: "Customer data missing" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Payment method missing" },
        { status: 400 }
      );
    }

    const productsCollection = await dbConnect(collections.products);
    // Convert all IDs
    const productIds = products.map((p) => new ObjectId(p._id));

    // Fetch fresh products from DB
    const fetchedProducts = await productsCollection
      .find({ _id: { $in: productIds } })
      .toArray();

    // Merge client-selected fields into DB products
    const finalProducts = fetchedProducts.map((product) => {
      const selected = products.find((p) => p._id === product._id.toString());

      return {
        ...product,
        quantity: selected.quantity,
        selectedColor: selected.selectedColor,
        selectedSize: selected.selectedSize,
      };
    });

    const amount = finalProducts.reduce((acc, p) => acc += p.discountedPrice * p.quantity, 120);

    const finalOrderDatas = {
      products: finalProducts,
      orderedAt: new Date().toISOString(),
      paymentStatus: 'un-paid',
      paymentMethod,
      orderStatus: 'pending',
      customer,
      visitorsId: visitorsId.value,
      email: userInfo ? userInfo?.user.email : '',
      amount,
    }

    const ordersCollection = await dbConnect(collections.orders);
    const orderRes = await ordersCollection.insertOne(finalOrderDatas);

    // cash on delivery payments
    if (paymentMethod === "cod") {
      return NextResponse.json({
        success: true,
        message: "Order placed successfully via Cash on Delivery!",
        orderId: orderRes.insertedId.toString(),
      });
    }


    // online payments
    if (paymentMethod === "online") {
      const store_id = process.env.STORE_ID
      const store_passwd = process.env.STORE_PASSWD
      const orderId = orderRes.insertedId.toString();


      const data = new URLSearchParams({
        store_id: store_id,
        store_passwd: store_passwd,
        total_amount: amount,
        currency: "BDT",
        tran_id: orderId,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success?orderId=${orderId}`,
        fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
        cus_name: customer.name,
        cus_email: userInfo?.user?.email || "no-email@example.com",
        cus_add1: customer.address,
        cus_phone: customer.phone,
        cus_city: customer.district,
        cus_country: 'bangladesh',
        product_name: "Order Payment",
        product_category: "Ecommerce",
        product_profile: "general",
        shipping_method: "Courier",
        ship_name: 'Customer Name',
        ship_add1: 'Feni',
        ship_add2: customer.district,
        ship_city: 'Feni',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
      });


      try {
        const initRes = await fetch('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          body: data.toString(),
        })

        const initResult = await initRes.json();
        const GatewayPageURL = initResult.GatewayPageURL;

        return NextResponse.json({
          success: true,
          orderId,
          redirect_url: GatewayPageURL,
        });
      } catch (err) {
        return NextResponse.json(
          { success: false, message: err.message },
          { status: 500 }
        );
      }
    }
  }
  catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}




export async function GET(req) {
  try {
    const cookie = req.cookies.get("visitorId");
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!cookie) {
      return NextResponse.json({
        success: false,
        message: "Visitor ID missing",
      });
    };


    const session = await getServerSession(authOptions);
    const visitorsId = cookie.value;
    console.log('visitorId', visitorsId)

    const query = {
      $or: [
        {
          paymentMethod: "online",
          paymentStatus: "paid",
        },
        {
          paymentMethod: "cod",
        }
      ]
    };
    if (email && session?.user?.email === email) {
      query.email = email
    } else {
      query.visitorsId = visitorsId
    }

    const ordersCollection = await dbConnect(collections.orders);

    const result = await ordersCollection
      .find(query)
      .sort({ orderedAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}
