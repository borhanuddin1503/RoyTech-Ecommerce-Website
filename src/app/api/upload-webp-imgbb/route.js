import { NextResponse } from "next/server";
import sharp from "sharp";

const IMGBB_KEY = '4333f4ac023df73b1c7ff23dfa7f2b03'; 

export async function POST(req) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get("image");

        if (!imageFile) {
            return NextResponse.json({ success: false, message: "No image found" });
        }

        // Convert to buffer
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Convert to WebP using sharp
        const webpBuffer = await sharp(buffer)
            .webp({ quality: 80 })
            .toBuffer();

        // Convert binary → Base64 (ImgBB required)
        const base64Image = webpBuffer.toString("base64");

        // Upload to ImgBB
        const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
            method: "POST",
            body: new URLSearchParams({
                image: base64Image
            })
        });

        const uploadData = await uploadRes.json();

        if (!uploadData.success) {
            return NextResponse.json({ success: false, message: "ImgBB upload failed" });
        }

        return NextResponse.json({
            success: true,
            url: uploadData.data.url
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
