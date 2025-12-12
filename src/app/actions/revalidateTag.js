// app/actions/revalidate.js
"use server"

import { revalidateTag } from "next/cache";

export async function revalidateProducts() {
    revalidateTag("single-products");
    revalidateTag("products");
    revalidateTag("single-products")
}
