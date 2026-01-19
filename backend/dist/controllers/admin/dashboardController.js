import * as dashboardService from '../../services/admin/dashboardService.js';
// Get dashboard stats
export const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await dashboardService.getDashboardStats();
        res.json(stats);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=dashboardController.js.map