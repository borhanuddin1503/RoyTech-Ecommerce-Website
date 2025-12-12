'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import SocialLogin from './SocialLogin';
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation';

export default function Page() {
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const email = e.target.email.value;
        const password = e.target.password.value;
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result.ok) {
            router.push('/');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-gray-50 p-4">
            {/* Main Card */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                
                {/* Header */}
                <div className='bg-main py-8 text-white text-center'>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">
                            Welcome Back!
                        </h2>
                        <p className='text-white/90'>Sign in to your account</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="px-6 py-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className='space-y-2'>
                            <label className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="h-5 w-5 text-main" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full border border-gray-300 py-3 px-10 rounded-lg focus:ring-2 focus:ring-main focus:border-main transition-all duration-200 outline-none"
                                    placeholder='your@email.com'
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className='space-y-2'>
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="h-5 w-5 text-main" />
                                </div>
                                <input
                                    type={`${showPass ? 'text' : 'password'}`}
                                    name="password"
                                    placeholder='Enter your password'
                                    required
                                    className="w-full border border-gray-300 py-3 px-10 pr-10 rounded-lg focus:ring-2 focus:ring-main focus:border-main transition-all duration-200 outline-none"
                                />
                                <div 
                                    onClick={() => setShowPass(!showPass)} 
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-all duration-200'
                                >
                                    {showPass ? 
                                        <LuEye className="h-5 w-5 text-gray-500" /> : 
                                        <LuEyeClosed className="h-5 w-5 text-gray-500" />
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <Link 
                                href={''} 
                                className='font-medium text-main hover:text-opacity-80 transition-colors duration-200 text-sm'
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-main text-white py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="flex items-center justify-center">
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Sign In 
                                        <FiArrowRight className="ml-2" />
                                    </>
                                )}
                            </span>
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center py-4">
                            <div className="grow border-t border-gray-300"></div>
                            <span className="shrink mx-4 text-gray-500 text-sm">or continue with</span>
                            <div className="grow border-t border-gray-300"></div>
                        </div>

                        {/* Social Login */}
                        <SocialLogin />
                    </form>
                </div>

                {/* Footer */}
                <div className='bg-gray-50 py-5 text-center border-t border-gray-200'>
                    <span className='text-gray-600 text-sm'>
                        Don't have an account? {' '}
                        <Link 
                            href={'/sign-up'} 
                            className='font-semibold text-main hover:text-opacity-80 transition-colors duration-200'
                        >
                            Sign Up
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
}