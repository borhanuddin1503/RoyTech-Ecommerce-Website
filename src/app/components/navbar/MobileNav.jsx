'use client'
import React from 'react'
import Logo from './Logo'
import { FiX } from 'react-icons/fi'
import Link from 'next/link'
import getNavLinks from '@/app/customHooks/getNavLinks';
import { usePathname } from 'next/navigation'

export default function MobileNav({ isMenuOpen, setIsMenuOpen, session }) {

    const navItems = getNavLinks();
    const pathname = usePathname();

    if (session?.user?.role === 'admin') {
        navItems.push({ label: 'Dashboard', link: '/admin-dashboard' })
    }
    return (
        <div>
            {isMenuOpen && 
            <div className='fixed inset-0 bg-transparent  backdrop-blur-xs z-1000' onClick={() => setIsMenuOpen(false)}>
                
            </div>}
            <div
                className={`absolute top-0 left-0  w-80 h-screen bg-white shadow-lg z-1000 transform transition-transform duration-300 rounded-2xl flex flex-col p-5 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >


                {/* Close button */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-300 w-full mb-5">
                    <Link href="/" className="flex items-center">
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-main to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            <div className="relative bg-white rounded-xl p-2">
                                <Logo />
                            </div>
                        </div>
                    </Link>
                    <button onClick={() => setIsMenuOpen(false)}>
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Mobile nav links */}
                <ul className="font-medium space-y-1">
                    {navItems.map(item =>
                        <li key={item.label} onClick={() => setIsMenuOpen(false)} className={`mb-2 font-medium text-lg py-3 px-4 rounded-lg text-gray-700 ${item.link === pathname && 'bg-main text-white'}`}><Link href={item.link}>{item.label}</Link></li>
                    )}
                </ul>
            </div>
        </div>
    )
}
