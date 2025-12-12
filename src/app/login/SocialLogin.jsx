'use client'
import React from 'react'
import google from '@/app/assets/icons/google.png';
import facebook from '@/app/assets/icons/facebook.png';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SocialLogin() {
    const router = useRouter();
    const handleSocialLogin = async (provider) => {
        const result = await signIn(provider, {
            redirect: false,
            callbackUrl: "/",  
        });

        console.log("Social login:", result);

        if (result?.ok) {
            router.push("/");
        }
    }
    return (
        <div className='flex gap-5 justify-center max-w-110 mx-auto'>
            <div className='flex-1 flex justify-center items-center gap-2 border border-gray-400 rounded-lg py-3 cursor-pointer' onClick={() => handleSocialLogin('google')}>
                <Image src={google} width={30} height={30} alt='google'></Image>
                <p className='font-semibold'>Continue with Google</p>
            </div>
        </div>
    )
}
