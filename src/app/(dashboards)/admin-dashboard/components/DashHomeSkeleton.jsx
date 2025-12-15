import React from 'react';

const DashHomeSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Welcome Header */}
            <div className="mb-6">
                <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-64"></div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-12"></div>
                    </div>
                ))}
            </div>

            {/* Main Chart */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <div className="h-5 bg-gray-300 rounded w-32 mb-4"></div>
                <div className="h-40 bg-gray-300 rounded"></div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="h-5 bg-gray-300 rounded w-40 mb-4"></div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-2">
                            <div>
                                <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                                <div className="h-3 bg-gray-300 rounded w-20"></div>
                            </div>
                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashHomeSkeleton;