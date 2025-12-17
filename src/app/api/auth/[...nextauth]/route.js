import dbConnect, { collections } from "@/lib/dbConnect";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",

            // authorization
            async authorize(credentials, req) {
                const email = credentials.email;
                const password = credentials.password;
                // check password validation
                const usersCollection = await dbConnect(collections.users);
                const user = await usersCollection.findOne({ email });

                if (!user) {
                    return null
                }

                // password compare
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    return null
                }

                return user
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user, account }) {
            const usersColleciton = await dbConnect(collections.users);
            const existing = await usersColleciton.findOne({ email: user.email });

            if (!existing) {
                await usersColleciton.insertOne({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    role: "user",
                    createdAt: new Date().toISOString(),
                });
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user?.email) {
                const usersCollection = await dbConnect(collections.users);
                const dbUser = await usersCollection.findOne({ email: user.email });
                token.role = dbUser?.role || "CUSTOMER";
                token.name = dbUser?.name;
                token.email = dbUser?.email;
                token.image = dbUser?.image
            }
            return token;
        },

        async session({ session, token }) {
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.role = token.role;
            session.user.image = token.image;
            return session;
        },
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }