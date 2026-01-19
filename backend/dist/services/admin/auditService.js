import AuditLog from '../../models/AuditLog.js';
// Log admin action
export const logAdminAction = async (data) => {
    try {
        const auditLog = new AuditLog({
            adminId: data.adminId,
            action: data.action,
            resource: data.resource,
            resourceId: data.resourceId,
            oldValues: data.oldValues,
            newValues: data.newValues,
            ip: data.ip,
            userAgent: data.userAgent,
        });
        await auditLog.save();
    }
    catch (error) {
        // Log error but don't throw - audit logging shouldn't break main functionality
        console.error('Audit logging failed:', error);
    }
};
// Get audit logs with filtering
export const getAuditLogs = async (filters) => {
    const { adminId, resource, action, startDate, endDate, page = 1, limit = 20 } = filters;
    const query = {};
    if (adminId)
        query.adminId = adminId;
    if (resource)
        query.resource = resource;
    if (action)
        query.action = action;
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate)
            query.createdAt.$gte = startDate;
        if (endDate)
            query.createdAt.$lte = endDate;
    }
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
        AuditLog.find(query)
            .populate('adminId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        AuditLog.countDocuments(query)
    ]);
    return {
        success: true,
        data: logs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};
// Get audit stats
export const getAuditStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [totalLogs, todayLogs, recentActions] = await Promise.all([
        AuditLog.countDocuments(),
        AuditLog.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
        AuditLog.aggregate([
            { $group: { _id: '$action', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ])
    ]);
    return {
        success: true,
        data: {
            totalLogs,
            todayLogs,
            recentActions
        }
    };
};
// Clean old audit logs (for maintenance)
export const cleanOldAuditLogs = async (daysOld = 90) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    await AuditLog.deleteMany({ createdAt: { $lt: cutoffDate } });
    console.log(`Cleaned audit logs older than ${daysOld} days`);
};
//# sourceMappingURL=auditService.js.map