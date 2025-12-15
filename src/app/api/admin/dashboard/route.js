import { NextResponse } from "next/server";
import dbConnect, { collections } from "@/lib/dbConnect";

export async function GET() {
    try {
        const ordersCollection = await dbConnect(collections.orders);
        const categoriesCollection = await dbConnect(collections.categories);

        /* ======================
            STATS CALCULATION
        ====================== */

        // Total Orders
        const totalOrders = await ordersCollection.countDocuments();

        // Pending Orders
        const pendingOrders = await ordersCollection.countDocuments({
            orderStatus: "pending",
        });

        // Total Revenue (only completed / delivered)
        const revenueAgg = await ordersCollection.aggregate([
            {
                $match: {
                    paymentStatus: { $in: ["paid"] },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ]).toArray();

        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        console.log('time from api', start, end)

        // Total Revenue (only paid)
        const todaysRevenue = await ordersCollection.aggregate([
            {
                $match: {
                    paymentStatus: "paid",
                    orderedAt: {
                        $gte: start.toISOString(),
                        $lte: end.toISOString(),
                    }
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ]).toArray();

        const codRevenue = await ordersCollection.aggregate([
            {
                $match: {
                    paymentMethod: 'cod',
                    orderedAt: {
                        $gte: start.toISOString(),
                        $lte: end.toISOString(),
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]).toArray();

        const todaysTotalRevenue = todaysRevenue[0]?.total || 0;
        const totalRevenue = revenueAgg[0]?.total || 0;
        const todayCodRevenue = codRevenue[0]?.total || 0;


        // total categories
        const totalCategories = await categoriesCollection.countDocuments();


        //  RECENT ORDERS

        const recentOrders = await ordersCollection.aggregate([
            {
                $match: {
                    orderedAt: {
                        $gte: start.toISOString(),
                        $lte: end.toISOString(),
                    },
                    $or: [
                        {
                            paymentMethod: "online",
                            paymentStatus: "paid",
                        },
                        {
                            paymentMethod: "cod",
                        }
                    ],

                }
            }
        ]).toArray()







        // .find({
        //     orderedAt: {
        //         $gte: start.toISOString(),
        //         $lte: end.toISOString(),
        //     },
        // })
        // .sort({ orderedAt: -1 })
        // .project({
        //     amount: 1,
        //     orderedAt: 1,
        //     orderStatus: 1,
        //     paymentMethod: 1,
        //     customer: 1,
        // })
        // .toArray();



        // last years orders
        const startOfYear = new Date();
        startOfYear.setMonth(0, 1);
        startOfYear.setHours(0, 0, 0, 0);


        const endOfYear = new Date();
        endOfYear.setMonth(11, 31);
        endOfYear.setHours(23, 59, 59, 999)


        // get last year orders
        const yearlyMonthlyStats = await ordersCollection.aggregate([
            {
                $match: {
                    orderedAt: {
                        $gte: startOfYear.toISOString(),
                        $lte: endOfYear.toISOString(),
                    },
                    orderStatus: 'delivered'
                },
            },
            {
                $group: {
                    _id: {
                        month: {
                            $month: {
                                $dateFromString: { dateString: "$orderedAt" }
                            }
                        }
                    },
                    revenue: { $sum: "$amount" },
                    orders: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    revenue: 1,
                    orders: 1,
                },
            },
            {
                $sort: { month: 1 },
            },
        ]).toArray();



        return NextResponse.json({
            success: true,
            totalRevenue,
            totalOrders,
            pendingOrders,
            todaysTotalRevenue,
            recentOrders,
            totalCategories,
            yearlyMonthlyStats,
            todayCodRevenue
        });
    } catch (error) {
        console.error("Admin dashboard error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to load dashboard data",
            },
            { status: 500 }
        );
    }
}
