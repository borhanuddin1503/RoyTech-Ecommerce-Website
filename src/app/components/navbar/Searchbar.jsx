'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IoIosSearch } from "react-icons/io";

export default function SearchBox() {
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const handleSearch = (e) => {
        e.preventDefault();
        const searchValue = e.target.search.value;
        router.push(`/products?search=${searchValue}`)
    }

    return (
        <form 
            className={`flex items-center gap-3 py-2.5 px-4 border transition-all duration-300 rounded-full  lg:max-w-80 bg-white group border-gray-300 hover:border-gray-400
            `} 
            onSubmit={handleSearch}
        >
            <IoIosSearch className={`w-5 h-5 transition-colors duration-300 ${
                isFocused ? 'text-main' : 'text-gray-400 group-hover:text-gray-600'
            }`}/>

            <input 
                type="text" 
                className='outline-none w-full bg-transparent text-gray-700 placeholder-gray-400 text-sm'
                placeholder='Search products...'
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                name='search'
            />


            <button 
                type="submit" 
                className="text-sm font-medium text-main hover:text-opacity-80 transition-colors duration-200 sm:block cursor-pointer"
            >
                Search
            </button>
        </form>
    )
}