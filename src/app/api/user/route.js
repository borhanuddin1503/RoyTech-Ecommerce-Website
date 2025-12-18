import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dbConnect, { collections } from "@/lib/dbConnect";

export async function GET(req) {
    try {
        const {searchParams} = new URL(req.url);
        const reqEmail = searchParams.get('email');


        const userInfo = await getServerSession(authOptions);
        const serverEmail = userInfo.user.email;
       

        if(serverEmail !== reqEmail) return NextResponse.json({success: false , messsage: 'Something Went Wrong' });

        const userCollection = await dbConnect(collections.users);
        const result = await userCollection.findOne({email : serverEmail});


        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({success: false , message: 'Something went wrong'})
    }

}