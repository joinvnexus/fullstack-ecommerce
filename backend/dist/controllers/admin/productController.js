import * as productService from '../../services/admin/productService.js';
// Helper to get admin info from request
const getAdminInfo = (req) => ({
    userId: req.user?.userId,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
});
// Get all products
export const getProducts = async (req, res, next) => {
    try {
        const { page, limit, status, category, search, sort, order } = req.query;
        const result = await productService.getProducts({
            page: Number(page) || 1,
            limit: Number(limit) || 20,
            status: status,
            category: category,
            search: search,
            sort: sort,
            order: order,
        });
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
// Create product
export const createProduct = async (req, res, next) => {
    try {
        const adminInfo = getAdminInfo(req);
        const result = await productService.createProduct(req.body, adminInfo);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
// Update product
export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const adminInfo = getAdminInfo(req);
        const result = await productService.updateProduct(id, req.body, adminInfo);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
// Delete product
export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const adminInfo = getAdminInfo(req);
        const result = await productService.deleteProduct(id, adminInfo);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
// Bulk operations
export const bulkUpdateProducts = async (req, res, next) => {
    try {
        const { action, productIds, data } = req.body;
        const adminInfo = getAdminInfo(req);
        const result = await productService.bulkUpdateProducts(action, productIds, data, adminInfo);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=productController.js.map