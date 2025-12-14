'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiTrendingUp,
  FiPackage,
  FiCalendar,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import { BiCategory } from "react-icons/bi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatusBadge from './orders/StatusBadge';
import { PaymentBadge } from './orders/page';
import Link from 'next/link';



const DashboardHome = () => {

  const { data, isLoading } = useQuery({
    queryKey: ['dash-home'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/dashboard`);
      return res.json()
    },
  })


  const statsCards = [
    {
      title: "Today's Revenue",
      value: data?.todaysTotalRevenue,
      isPositive: true,
      icon: FiDollarSign,
      color: "bg-blue-500",
      paymentStatus: 'paid',
      method: 'online'
    },
    {
      title: "Todays COD amount",
      value: data?.todayCodRevenue,
      isPositive: false,
      icon: FiTrendingUp,
      color: "bg-orange-500",
      paymentStatus: true,
      method: 'COD'
    },
    {
      title: "Today's Orders",
      value: data?.recentOrders?.length,
      change: "+8.3%",
      isPositive: true,
      icon: FiShoppingCart,
      color: "bg-green-500"
    },
    {
      title: "Total Categories",
      value: data?.totalCategories,
      change: "+15.8%",
      isPositive: true,
      icon: BiCategory,
      color: "bg-purple-500"
    }
  ];

  const chartData = data?.recentOrders?.map(order => ({
    ...order,
    time: new Date(order.orderedAt).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));


  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // const monthlyData = data?.yearlyMonthlyStats.map((order) => ({
  //   ...order,
  //   month : months[order.month-1]
  // }))

  const monthlyData = months.map((m, i) => {
    const ordderInTheMonth = data?.yearlyMonthlyStats.find((o) => o.month - 1 === i);
    return ({
      revenue: ordderInTheMonth?.revenue || 0,
      orders: ordderInTheMonth?.orders || 0,
      month: m
    })
  })

  console.log(monthlyData)

  if (isLoading) {
    return <p>Loading....</p>
  }

  console.log(data)


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.paymentStatus && <PaymentBadge status={stat.paymentStatus} method={stat.method}></PaymentBadge>}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Daily Revenue & Orders Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Today's Performance</h3>
                <p className="text-gray-600 text-sm">Revenue vs Orders throughout the day</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar className="w-4 h-4" />
                <span>Today</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time"
                  stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem'
                  }}
                />
                <Legend />
                <Bar
                  dataKey="amount"
                  name="Revenue (৳)"
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Todays Orders</h3>
              <FiPackage className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {data.recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-main transition-colors duration-200">
                  <div>
                    <p className="font-semibold text-gray-900">{order?._id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">{order?.customer?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{order.amount}</p>
                    <StatusBadge status={order.orderStatus}></StatusBadge>
                  </div>
                </div>
              ))}
            </div>
            <Link href={'/admin-dashboard/orders'}><button className="cursor-pointer w-full mt-6 py-3 border-2 border-main text-main rounded-xl font-semibold hover:bg-main hover:text-white transition-all duration-300">
              View All Orders
            </button></Link>
          </div>
        </div>

        {/* Monthly Performance & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Monthly Performance</h3>
                <p className="text-gray-600 text-sm">Revenue and orders over the year</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (৳)"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>


        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-main to-cyan-500 rounded-2xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Total Revenue</h4>
            <p className="text-3xl font-bold">৳824,500</p>
            <p className="text-sm opacity-90 mt-2">+24% from last month</p>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Total Orders</h4>
            <p className="text-3xl font-bold">5,280</p>
            <p className="text-sm opacity-90 mt-2">+18% from last month</p>
          </div>
          <div className="bg-gradient-to-r col-span-2 md:col-span-1 from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Average Order Value</h4>
            <p className="text-3xl font-bold">৳1,560</p>
            <p className="text-sm opacity-90 mt-2">+5% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;