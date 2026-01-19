export interface AuditData {
    adminId: string;
    action: string;
    resource: string;
    resourceId: string;
    oldValues?: any;
    newValues?: any;
    ip: string;
    userAgent: string;
}
export declare const logAdminAction: (data: AuditData) => Promise<void>;
export declare const getAuditLogs: (filters: {
    adminId?: string;
    resource?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}) => Promise<{
    success: boolean;
    data: (import("mongoose").Document<unknown, {}, import("../../models/AuditLog.js").IAuditLog, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/AuditLog.js").IAuditLog & Required<{
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
export declare const getAuditStats: () => Promise<{
    success: boolean;
    data: {
        totalLogs: number;
        todayLogs: number;
        recentActions: any[];
    };
}>;
export declare const cleanOldAuditLogs: (daysOld?: number) => Promise<void>;
//# sourceMappingURL=auditService.d.ts.map