'use client'
import { useEffect, useRef, useState } from "react";
import { IoLogInOutline } from "react-icons/io5";
import { FiMenu, FiX, FiShoppingCart, FiSearch } from "react-icons/fi";
import Link from "next/link";
import Logo from "./Logo";
import SearchBox from "./Searchbar";
import MobileNav from "./MobileNav";
import { useSession } from "next-auth/react";
import Popup from "./Popup";
import getNavLinks from "@/app/customHooks/getNavLinks";
import { usePathname } from "next/navigation";
import CartPannel from "./CartPannel";


const Navbar = ({ serverSession }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navItems = getNavLinks();
    const { data: clientSession } = useSession();
    const navRef = useRef();

    const pathname = usePathname();


    const session = clientSession || serverSession;

    // Primary color - Vibrant gradient from teal to purple
    const primaryGradient = "bg-gradient-to-r from-main to-purple-600";

    if (session?.user?.role === 'admin') {
        navItems.push({ label: 'Dashboard', link: '/admin-dashboard' })
    }
    if (session?.user?.role === 'user') {
        navItems.push({ label: 'Dashboard', link: '/user-dashboard' })
    }

    // detect outside click of navbar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])

    if (pathname.includes('dashboard')) {
        return;
    }


    return (
        <nav className="sticky top-0 z-999" ref={navRef}>
            <div className="relative">
                {/* Main Navbar */}
                <div className={`flex justify-between items-center p-4 sticky top-0 z-50 bg-white shadow-lg border-b border-gray-100 font-semibold transition-all duration-300`}>

                    {/* LEFT SECTION - Logo & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <FiMenu className="w-6 h-6 text-gray-700" />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <div className="relative group">
                                <div className={`absolute inset-0 ${primaryGradient} rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                <div className="relative bg-white rounded-xl p-2">
                                    <Logo />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* CENTER SECTION - Desktop Navigation */}
                    <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-8">
                        <ul className="flex items-center gap-8 px-1 font-medium">
                            {navItems.map(item => (
                                <li key={item.label} className="relative group">
                                    <Link
                                        href={item.link}
                                        className={`text-gray-700 hover:text-main transition-colors duration-200 font-semibold py-2 px-1 relative`}
                                    >
                                        {item.label}
                                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${primaryGradient} transition-all duration-300 group-hover:w-full`}></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* RIGHT SECTION - Search, Cart, Auth */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <FiSearch className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Desktop Search */}
                        <div className="hidden lg:flex">
                            <SearchBox />
                        </div>
                        <CartPannel></CartPannel>

                        {/* Auth & Cart Section */}
                        <div className="flex items-center gap-3">
                            {session ? (
                                <div className="flex items-center gap-4">
                                    {/* User Popup */}
                                    <Popup user={session.user} />
                                </div>
                            ) : (
                                <Link href="/login">
                                    <button className={`relative overflow-hidden group py-3 px-6 rounded-xl font-bold text-white bg-main transition-all duration-300 shadow-lg hover:shadow-xl transform cursor-pointer  flex items-center gap-2`}>
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                        <IoLogInOutline className="w-5 h-5" />
                                        <span>Sign In</span>
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isSearchOpen && (
                    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 shadow-md mx-auto">
                        <SearchBox />
                    </div>
                )}

                {/* Mobile Navigation */}
                <MobileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} session={session} />
            </div>
        </nav>
    );
};

export default Navbar;