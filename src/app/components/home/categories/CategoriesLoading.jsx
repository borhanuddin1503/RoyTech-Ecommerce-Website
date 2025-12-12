import React from 'react'

export default function CategoriesLoading() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-300 h-24 rounded-xl mb-3"></div>
                        <div className="bg-gray-300 h-4 rounded w-3/4 mx-auto"></div>
                    </div>
                ))}
            </div>
        </section>
    );
}
