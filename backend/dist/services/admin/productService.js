import Product from '../../models/Product.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logAdminAction } from './auditService.js';
export const getProducts = async (filters) => {
    const { page = 1, limit = 20, status, category, search, sort = 'createdAt', order = 'desc' } = filters;
    const query = {};
    if (status)
        query.status = status;
    if (category)
        query.category = category;
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { sku: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;
    const [products, total] = await Promise.all([
        Product.find(query)
            .populate('category', 'name')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit),
        Product.countDocuments(query),
    ]);
    return {
        success: true,
        data: products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
export const createProduct = async (productData, adminInfo) => {
    // Check for duplicate SKU
    const existingSku = await Product.findOne({ sku: productData.sku });
    if (existingSku) {
        throw new AppError('Product with this SKU already exists', 400);
    }
    // Check for duplicate slug
    const existingSlug = await Product.findOne({ slug: productData.slug });
    if (existingSlug) {
        throw new AppError('Product with this slug already exists', 400);
    }
    const product = new Product(productData);
    await product.save();
    // Log audit
    await logAdminAction({
        adminId: adminInfo.userId,
        action: 'create',
        resource: 'product',
        resourceId: product._id.toString(),
        newValues: productData,
        ip: adminInfo.ip || 'unknown',
        userAgent: adminInfo.userAgent || 'unknown',
    });
    return {
        success: true,
        message: 'Product created successfully',
        data: product,
    };
};
export const updateProduct = async (id, updates, adminInfo) => {
    // Get old values for audit
    const oldProduct = await Product.findById(id);
    if (!oldProduct) {
        throw new AppError('Product not found', 404);
    }
    // Check for duplicate SKU
    if (updates.sku) {
        const existingSku = await Product.findOne({
            sku: updates.sku,
            _id: { $ne: id },
        });
        if (existingSku) {
            throw new AppError('Another product with this SKU exists', 400);
        }
    }
    // Check for duplicate slug
    if (updates.slug) {
        const existingSlug = await Product.findOne({
            slug: updates.slug,
            _id: { $ne: id },
        });
        if (existingSlug) {
            throw new AppError('Another product with this slug exists', 400);
        }
    }
    const product = await Product.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).populate('category', 'name');
    if (!product) {
        throw new AppError('Product not found', 404);
    }
    // Log audit
    await logAdminAction({
        adminId: adminInfo.userId,
        action: 'update',
        resource: 'product',
        resourceId: id,
        oldValues: oldProduct.toObject(),
        newValues: updates,
        ip: adminInfo.ip || 'unknown',
        userAgent: adminInfo.userAgent || 'unknown',
    });
    return {
        success: true,
        message: 'Product updated successfully',
        data: product,
    };
};
export const deleteProduct = async (id, adminInfo) => {
    // Soft delete by setting status to archived
    const product = await Product.findByIdAndUpdate(id, { status: 'archived' }, { new: true });
    if (!product) {
        throw new AppError('Product not found', 404);
    }
    // Log audit
    await logAdminAction({
        adminId: adminInfo.userId,
        action: 'delete',
        resource: 'product',
        resourceId: id,
        ip: adminInfo.ip || 'unknown',
        userAgent: adminInfo.userAgent || 'unknown',
    });
    return {
        success: true,
        message: 'Product archived successfully',
    };
};
export const bulkUpdateProducts = async (action, productIds, data, adminInfo) => {
    let result;
    switch (action) {
        case 'delete':
            result = await Product.updateMany({ _id: { $in: productIds } }, { status: 'archived' });
            break;
        case 'update_status':
            if (!data.status) {
                throw new AppError('Status is required', 400);
            }
            result = await Product.updateMany({ _id: { $in: productIds } }, { status: data.status });
            break;
        case 'update_price':
            if (!data.price) {
                throw new AppError('Price is required', 400);
            }
            result = await Product.updateMany({ _id: { $in: productIds } }, { 'price.amount': data.price });
            break;
        default:
            throw new AppError('Invalid action', 400);
    }
    // Log bulk action
    await logAdminAction({
        adminId: adminInfo.userId,
        action: `bulk_${action}`,
        resource: 'product',
        resourceId: productIds.join(','),
        newValues: { action, productIds, data },
        ip: adminInfo.ip || 'unknown',
        userAgent: adminInfo.userAgent || 'unknown',
    });
    return {
        success: true,
        message: `Bulk ${action} completed`,
        data: result,
    };
};
//# sourceMappingURL=productService.js.map