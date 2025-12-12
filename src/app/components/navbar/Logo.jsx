import Image from 'next/image'
import React from 'react'
import logo from '@/app/assets/icons/logo.png'

export default function Logo() {
  return (
    <div className='flex items-center'>
        <Image src={logo} alt='logo' width={86} height={86}></Image>
    </div>
  )
}
