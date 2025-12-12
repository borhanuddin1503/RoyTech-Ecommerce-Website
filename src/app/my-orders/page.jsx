'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Link from 'next/link';
import { FiPackage, } from 'react-icons/fi';
import { MdOutlineEventNote } from 'react-icons/md';
import StatusBadge from '../(dashboards)/admin-dashboard/orders/StatusBadge';
import ProductsLoading from '../(dashboards)/admin-dashboard/products/all-products/productsLoading';
import { useSession } from 'next-auth/react';

export default function MyOrders() {

    const searchParams = useSearchParams();
    const msg = searchParams.get('msg');
    const [ordersData, setOrders] = useState([]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    
    useEffect(() => {
        console.log(session)
        if (session === undefined) return;
        console.log(session)


        if (msg) {
            Swal.fire("Success", msg, "success");
            router.replace('/my-orders')
        };

        const fetchOrders = async () => {
            try {
                setLoading(true)
                const promise = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders?email=${session?.user?.email}`);
                const res = await promise.json();
                if (res.success === true) {
                    setOrders(res.data);
                }
            } finally {
                setLoading(false)
            }
        };

        fetchOrders();
    }, [msg, session]);


    if (loading) {
        return <table className='max-w-7xl mx-auto px-4 py-4'><tbody><ProductsLoading></ProductsLoading></tbody></table>
    }



    return (
        <div className="max-w-7xl mx-auto px-4 py-4 overflow-auto">
            {ordersData.length > 0 ? <div>
                {/* Header */}
                <div className="mb-4 flex gap-2 items-center">
                    <div>
                        <MdOutlineEventNote className='text-4xl text-main' />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-main">My <span className='text-main'>Orders</span></h1>
                        <p className="text-gray-500 ">Track and manage your recent orders</p>
                    </div>
                </div>

                <table className="bg-white rounded-2xl shadow-lg   w-full">

                    {/* Table Header */}
                    <thead className=" border-b border-b-gray-300">
                        <tr className="text-center text-gray-700 text-sm font-semibold ">
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Total</th>
                            <th className="p-3">Payment Method</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Customer</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-gray-200 text-center">
                        {ordersData.map((order) => (
                            <tr
                                key={order._id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                {/* Order ID */}
                                <td className="p-4 text-sm font-medium text-gray-900">
                                    {order._id.slice(-8)}
                                </td>

                                {/* Date */}
                                <td className="p-4 text-sm text-gray-600">
                                    {new Date(order.orderedAt).toLocaleDateString(
                                        'en-US',
                                        {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }
                                    )}
                                </td>

                                {/* Total */}
                                <td className="p-4 text-lg font-bold text-gray-900">
                                    ৳{order.amount}
                                </td>

                                {/* Payment Method */}
                                <td className="p-4 text-sm text-gray-700">
                                    {order.paymentMethod === 'online'
                                        ? order.card_issuer
                                        : "Cash On Delivery"}
                                </td>

                                {/* Status */}
                                <td className="p-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                                        <StatusBadge status={order?.orderStatus} />
                                    </span>
                                </td>

                                {/* Customer */}
                                <td className="p-4">
                                    <div>
                                        <h2 className="text-green-500 font-medium">
                                            {order?.customer?.name}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {order?.customer?.phone}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div> :
                <div className="text-center flex  h-[calc(100vh-112px)] items-center justify-center">
                    <div>
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FiPackage className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                        <Link href="/products">
                            <button className="bg-main text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-200 cursor-pointer">
                                Start Shopping
                            </button>
                        </Link>
                    </div>
                </div>
            }
        </div>
    )
}
