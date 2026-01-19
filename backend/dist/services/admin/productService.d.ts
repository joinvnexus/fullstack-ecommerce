export interface ProductFilters {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}
export declare const getProducts: (filters: ProductFilters) => Promise<{
    success: boolean;
    data: (import("mongoose").Document<unknown, {}, import("../../models/Product.js").IProduct, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/Product.js").IProduct & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const createProduct: (productData: any, adminInfo: any) => Promise<{
    success: boolean;
    message: string;
    data: import("mongoose").Document<unknown, {}, import("../../models/Product.js").IProduct, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/Product.js").IProduct & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
}>;
export declare const updateProduct: (id: string, updates: any, adminInfo: any) => Promise<{
    success: boolean;
    message: string;
    data: import("mongoose").Document<unknown, {}, import("../../models/Product.js").IProduct, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/Product.js").IProduct & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
}>;
export declare const deleteProduct: (id: string, adminInfo: any) => Promise<{
    success: boolean;
    message: string;
}>;
export declare const bulkUpdateProducts: (action: string, productIds: string[], data: any, adminInfo: any) => Promise<{
    success: boolean;
    message: string;
    data: import("mongoose").UpdateWriteOpResult;
}>;
//# sourceMappingURL=productService.d.ts.map