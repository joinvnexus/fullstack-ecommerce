export declare const getDashboardStats: () => Promise<{
    success: boolean;
    data: {
        stats: {
            totalRevenue: any;
            totalOrders: number;
            totalCustomers: number;
            totalProducts: number;
        };
        recentOrders: (import("mongoose").Document<unknown, {}, import("../../models/Order.js").IOrder, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/Order.js").IOrder & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        topProducts: any[];
    };
}>;
//# sourceMappingURL=dashboardService.d.ts.map