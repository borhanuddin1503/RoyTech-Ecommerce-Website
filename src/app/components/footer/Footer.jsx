'use client'
import React from 'react';
import Link from 'next/link';
import { FiFacebook, FiInstagram, FiYoutube, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import getNavLinks from '@/app/customHooks/getNavLinks';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const Footer =  () => {

    const quickLinks = getNavLinks();
    const userInfo = useSession();
    if (userInfo?.user?.role === 'admin') { quickLinks.push({ label: 'Dashboard', link: '/admin-dashboard' }) };

    const pathname = usePathname();
    if(pathname.includes('dashboard')) return;
    

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 text-center">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">
                            <span className="text-main">Tech</span>Store
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            Your one-stop destination for the latest electronics, gadgets, and tech accessories at unbeatable prices.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                className="p-2 rounded-full bg-gray-800 hover:bg-main transition-colors duration-200">
                                <FiFacebook className="w-5 h-5" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                                className="p-2 rounded-full bg-gray-800 hover:bg-main transition-colors duration-200">
                                <FiInstagram className="w-5 h-5" />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                                className="p-2 rounded-full bg-gray-800 hover:bg-main transition-colors duration-200">
                                <FiYoutube className="w-5 h-5" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                className="p-2 rounded-full bg-gray-800 hover:bg-main transition-colors duration-200">
                                <FiTwitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-main">Quick Links</h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.link}
                                        className="text-gray-400 hover:text-main transition-colors duration-200 inline-block py-1"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>


                    {/* Contact & Account */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-main">Contact Us</h4>


                        <div className="space-y-3">
                            <div className="flex items-center justify-center gap-3 text-gray-400">
                                <FiPhone className="w-5 h-5 text-main" />
                                <span>+880 1641670628</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-gray-400">
                                <FiMail className="w-5 h-5 text-main" />
                                <span>roytech50@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 justify-center text-gray-400">
                                <FiMapPin className="w-5 h-5 text-main" />
                                <span>Feni, Bangladesh</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800"></div>

            {/* Bottom Footer */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} TechStore. All rights reserved.
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                        <p className="hover:text-main transition-colors duration-200">
                            Privacy Policy
                        </p>
                        <p href="/terms" className="hover:text-main transition-colors duration-200">
                            Terms of Service
                        </p>
                        <p href="/cookies" className="hover:text-main transition-colors duration-200">
                            Cookie Policy
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Secure payments by: SSL Commerze</span>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;