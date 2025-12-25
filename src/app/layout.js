import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import SessionProvider from "@/providers/NextAuthProvider";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import Footer from "./components/footer/Footer";
import WhatsAppButton from "./components/whatsapp/WhatsApp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ['latin'],
  weight: ['400', '600', '700', '900']
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Roy Tech World",
  description: "Best E-commerce website in Bangladesh",
};




export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className="" >
      <body
        className={`${poppins.className} min-h-screen flex flex-col`}
      >
        <ReactQueryProvider>
          <NextAuthProvider>
            <Navbar serverSession={session}></Navbar>
            <div className="shrink grow">{children}</div>
            <WhatsAppButton/>
            <Footer></Footer>
          </NextAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
