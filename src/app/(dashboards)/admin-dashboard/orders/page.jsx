'use client'
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FiEye, FiCheckCircle, FiXCircle, FiCreditCard, FiPackage } from 'react-icons/fi';
import { MdEventNote } from 'react-icons/md';
import StatusBadge from './StatusBadge';
import OrderDetailsModal from './OrderDetailsModal';

const OrdersTable = () => {

    const [page, setPage] = useState(1);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedOrder , setSelectedOrder] = useState(null);
    const limit = 7;

    const { data, isLoading } = useQuery({
        queryKey: ['orders', page],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/orders?page=${page}&limit=${limit}`);
            const data = await res.json();
            return data;
        },
    })

    console.log(data)

    const orders = data?.orders;
    const totalOrder = data?.total;
    const totalPage = Math.ceil(totalOrder / limit);

    console.log('total page = ', totalPage)


    // Format date to readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    // Payment status badge component
    const PaymentBadge = ({ status, method }) => {
        const isPaid = status === 'paid';
        const methodIcon = method === 'online' ? <FiCreditCard className="w-3 h-3" /> : <FiPackage className="w-3 h-3" />;

        return (
            <div className="flex flex-col gap-1">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${isPaid ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                    {isPaid ? <FiCheckCircle className="w-3 h-3" /> : <FiXCircle className="w-3 h-3" />}
                    {isPaid ? 'Paid' : 'Unpaid'}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                    {methodIcon}
                    {method === 'online' ? 'Online' : 'COD'}
                </span>
            </div>
        );
    };

    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex  items-center gap-5">
                <div>
                    <MdEventNote className='text-4xl text-main' />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-main ">Recent Orders</h2>
                    <p className="text-gray-600 text-sm">Manage and track customer orders</p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Payment
                            </th>
                            <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
                                {/* Order ID */}
                                <td className="py-4 px-6">
                                    <div className="text-sm font-medium text-gray-900">
                                        #{order._id.slice(-8).toUpperCase()}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {order.products.length} item{order.products.length > 1 ? 's' : ''}
                                    </div>
                                </td>

                                {/* Customer */}
                                <td className="py-4 px-6">
                                    <div className="text-sm font-medium text-gray-900">
                                        {order.customer.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {order.customer.phone}
                                    </div>
                                    <div className="text-xs text-gray-400 truncate max-w-[150px]">
                                        {order.customer.district}
                                    </div>
                                </td>

                                {/* Amount */}
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-gray-900">
                                            ৳{order.amount}
                                        </span>
                                    </div>
                                    {order.paid_amount && order.paymentStatus === 'paid' && (
                                        <div className="text-xs text-green-600 font-medium">
                                            Paid: ৳{order.paid_amount}
                                            <p className='text-gray-500'>Paid by: <span className='text-orange-800'>{order.card_issuer}</span></p>
                                        </div>
                                    )}
                                </td>

                                {/* Payment */}
                                <td className="py-4 px-6">
                                    <PaymentBadge status={order.paymentStatus} method={order.paymentMethod} />
                                    {order.paymentMethod === 'online' && order.transactionId && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            ID: {order.transactionId.slice(-6)}
                                        </div>
                                    )}
                                </td>

                                {/* Status */}
                                <td className="py-4 px-6">
                                    <StatusBadge status={order.orderStatus} />
                                </td>

                                {/* Date */}
                                <td className="py-4 px-6">
                                    <div className="text-sm text-gray-900">
                                        {formatDate(order.orderedAt)}
                                    </div>
                                    {order.updatedAt && (
                                        <div className="text-xs text-gray-500">
                                            Updated: {formatDate(order.updatedAt).split(' ')[0]}
                                        </div>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 border border-gray-300 rounded-lg hover:border-main hover:text-main transition-colors duration-200" onClick={() => {
                                            setSelectedOrder(order) ;
                                            setShowDetails(!showDetails)}}>
                                            <FiEye className="w-4 h-4" />
                                        </button>
                                        <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:border-main focus:border-main outline-none transition-colors duration-200">
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Showing {orders.length} of {orders.length} orders
                </div>
                <div className="flex items-center gap-2">
                    <button className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors duration-200 text-sm ${page === 1 ? 'bg-gray-200 cursor-not-allowed ' : 'hover:border-main hover:text-main cursor-pointer'}`}
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <button className={`px-4 py-2 border border-gray-300 rounded-lg  transition-colors duration-200 text-sm ${page === totalPage ? 'bg-gray-200 cursor-not-allowed ' : 'hover:border-main hover:text-main cursor-pointer'}`}
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPage}
                    >
                        Next
                    </button>
                </div>
            </div>
            <OrderDetailsModal order={selectedOrder} onClose={setShowDetails} isOpen={showDetails}></OrderDetailsModal>
        </div>
    );
};

export default OrdersTable;