import { NextResponse } from "next/server";
import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req) {
    try {
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get("orderId");

        const store_id = process.env.STORE_ID;
        const store_passwd = process.env.STORE_PASSWD;

        //  GET POST RESPONSE FROM SSLCOMMERZ 
        const form = await req.formData();
        const res = Object.fromEntries(form.entries());

        console.log("Payment Response:", res);
        if (!orderId) {
            return NextResponse.json({
                success: false,
                message: "Order ID missing!",
            });
        }

        // ---------- VALIDATION CALL ----------
        const validateRes = await fetch(
            `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${res?.val_id}&store_id=${store_id}&store_passwd=${store_passwd}`
        );

        const validate = await validateRes.json();
        console.log("Validation:", validate);

        if (validate.status !== "VALID") {
            return NextResponse.json({
                success: false,
                message: "Payment is not valid!",
            });
        }

        // Database update example 
        const ordersCollection = await dbConnect(collections.orders);

        await ordersCollection.updateOne(
            { _id: new ObjectId(orderId) },
            {
                $set: {
                    paymentStatus: "paid",
                    transactionId: res.tran_id,
                    validationId: res.val_id,
                    paidAt: validate.tran_date,
                    'paid_amount': validate.amount,
                    card_issuer: validate.card_issuer,
                },
            }
        );

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/my-orders?msg=Payment%20Successfull`)
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                message: "Server error occurred!",
            },
            { status: 500 }
        );
    }
}
