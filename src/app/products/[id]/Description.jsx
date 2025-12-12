import React from 'react'

export default function Description({ description }) {
    return (
        <>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>Description</h2>
            <p className='text-sm text-gray-500 leading-6'>
                {description}
            </p>
        </>
    )
}
