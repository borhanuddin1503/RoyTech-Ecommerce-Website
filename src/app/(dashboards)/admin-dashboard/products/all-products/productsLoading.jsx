import React from 'react'

export default function ProductsLoading() {
    return (
        [...Array(10)].map((_, idx) => (
            <tr key={idx} className="border-t animate-pulse">
                <td className="p-3">
                    <div className="h-4 w-6 bg-gray-200 rounded"></div>
                </td>

                <td className="p-3">
                    <div className="w-[60px] h-[60px] bg-gray-200 rounded-xl"></div>
                </td>

                <td className="p-3">
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                </td>

                <td className="p-3">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </td>

                <td className="p-3">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </td>

                <td className="p-3">
                    <div className="h-4 w-10 bg-gray-200 rounded"></div>
                </td>

                <td className="p-3">
                    <div className="h-4 w-10 bg-gray-200 rounded"></div>
                </td>

                <td className="p-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
                    </div>
                </td>
            </tr>
        ))

    )
}
