"use client";
import { useState, useEffect, Children } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiMenu,
    FiX,
    FiHome,
    FiShoppingBag,
    FiPlus,
    FiBox,
    FiTag,
} from "react-icons/fi";
import Logo from "@/app/components/navbar/Logo";
import { MdOutlineDelete } from "react-icons/md";

export default function SidebarClient() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
    }, [mobileOpen]);

    const navItems = [
        {
            href: "/admin-dashboard",
            label: "Dashboard",
            icon: FiHome,
            color: "text-blue-500"
        },

        {
            href: "/admin-dashboard/products/all-products",
            label: "All Products",
            icon: FiBox,
            color: "text-blue-500"
        },
        {
            href: "/admin-dashboard/products/add",
            label: "Add Product",
            icon: FiPlus,
            color: "text-green-500"
        },

        {
            href: "/admin-dashboard/categories/add",
            label: "Add Categories",
            icon: FiPlus,
            color: "text-blue-500"
        },
        {
            href: "/admin-dashboard/categories/delete",
            label: "Delete Categories",
            icon: MdOutlineDelete,
            color: "text-blue-500"
        },
        {
            href: "/admin-dashboard/orders",
            label: "Orders",
            icon: FiShoppingBag,
            color: "text-orange-500"
        },
     
    ];

    const renderNav = (isMobile = false) => (
        <nav className="space-y-1 p-4">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        {...(isMobile && {
                            onClick: () => setMobileOpen(false),
                        })}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active
                            ? "bg-gradient-to-r from-main to-cyan-500 text-white shadow-lg "
                            : "text-gray-700 hover:bg-gray-50 hover:shadow-md "
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${active ? "bg-white/20" : "bg-gray-100 group-hover:bg-main/10"}`}>
                            <Icon className={`w-4 h-4 ${active ? "text-white" : item.color}`} />
                        </div>
                        <span className="font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* MOBILE TOP BAR - Enhanced */}
            <div className="lg:hidden flex bg-white items-center justify-between p-4 shadow-lg sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative group">
                        <div className={`absolute inset-0 bg-gradient-to-r from-main to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        <div className="relative bg-white rounded-xl p-2">
                            <Logo />
                        </div>
                    </div>
                </Link>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                >
                    <FiMenu className="w-6 h-6" />
                </button>
            </div>

            {/* DESKTOP SIDEBAR - Enhanced */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r shadow-xl h-screen sticky top-0">
                {/* Header */}
                <div className="p-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-main to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            <div className="relative bg-white rounded-xl p-2">
                                <Logo />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4">
                    {renderNav()}
                </div>
            </aside>

            {/* MOBILE SLIDE SIDEBAR - Enhanced */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-1080 transform transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Mobile Header */}
                <div className="p-3 bg-gradient-to-r from-main to-cyan-500 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl">
                            <Logo />
                        </div>
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div className="h-full overflow-y-auto pb-20">
                    {renderNav(true)}
                </div>
            </div>

            {/* Backdrop for mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 top-0  backdrop-blur-xs bg-transparent z-1070 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
}