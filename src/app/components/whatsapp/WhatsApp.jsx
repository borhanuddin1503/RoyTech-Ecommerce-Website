"use client";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="https://wa.me/8801641670628?text=Hello%20I%20need%20help"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300"
      >
        <FaWhatsapp className="text-2xl" />
      </Link>
    </div>
  );
}
