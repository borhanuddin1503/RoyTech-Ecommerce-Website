import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

export const collections = {
  users: "users",
  categories: "categories",
  products: "products",
  reviews: "reviews",
  orders: "orders",
};

// Global cache (important for Next.js app router & hot reload)
let cached = global._mongo;

if (!cached) {
  cached = global._mongo = { client: null, promise: null };
}

export default async function dbConnect(collectionName) {

  // If client already connected → reuse the connection
  if (cached.client) {
    return cached.client.db("roy-tech").collection(collectionName);
  }

  // First connection → create & cache it
  if (!cached.promise) {
    cached.promise = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    }).connect();
  }

  cached.client = await cached.promise;
  return cached.client.db("roy-tech").collection(collectionName);
}

