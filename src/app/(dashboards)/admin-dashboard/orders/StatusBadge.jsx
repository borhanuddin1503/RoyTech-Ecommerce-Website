'use client'
import {FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi'
export default function StatusBadge({ status }) {
    const statusConfig = {
        'pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <FiCalendar className="w-3 h-3" /> },
        'processing': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <FiCalendar className="w-3 h-3" /> },
        'shipped': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <FiCheckCircle className="w-3 h-3" /> },
        'delivered': { color: 'bg-green-100 text-green-800 border-green-200', icon: <FiCheckCircle className="w-3 h-3" /> },
        'cancelled': { color: 'bg-red-100 text-red-800 border-red-200', icon: <FiXCircle className="w-3 h-3" /> }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            {config.icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};