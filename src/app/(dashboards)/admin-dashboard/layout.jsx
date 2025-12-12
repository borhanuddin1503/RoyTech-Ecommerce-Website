
import { Suspense } from "react";
import SidebarClient from "./components/SidebarClient";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Sidebar (handles both mobile + desktop) */}
      <SidebarClient />

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6">
        <Suspense fallback={<div className="h-screen flex justify-center items-center "><span className="loading loading-spinner text-warning"></span></div>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
