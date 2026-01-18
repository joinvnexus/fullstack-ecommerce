import express from 'express';
import { searchService } from '../services/search.service.js';
import { AppError } from '../middleware/errorHandler.js';
import Category from '../models/Category.js';
const router = express.Router();
// Search products
router.get('/products', async (req, res, next) => {
    try {
        const { q: query = '', page = 1, limit = 20, category, minPrice, maxPrice, inStock, status, sortBy = 'relevance', sortOrder = 'desc', } = req.query;
        const filters = {};
        if (category) {
            // Find category by slug and use _id
            const cat = await Category.findOne({ slug: category });
            if (cat) {
                filters.category = cat._id.toString();
            }
        }
        if (minPrice)
            filters.minPrice = parseFloat(minPrice);
        if (maxPrice)
            filters.maxPrice = parseFloat(maxPrice);
        if (inStock)
            filters.inStock = inStock === 'true';
        if (status)
            filters.status = status;
        const result = await searchService.searchProducts({
            query: query,
            page: parseInt(page),
            limit: parseInt(limit),
            filters,
            sort: {
                field: sortBy,
                order: sortOrder,
            },
        });
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
// Autocomplete suggestions
router.get('/autocomplete', async (req, res, next) => {
    try {
        const { q: query, limit = 5 } = req.query;
        if (!query || query.trim().length < 2) {
            return res.json({
                success: true,
                data: [],
            });
        }
        const suggestions = await searchService.autocomplete(query, parseInt(limit));
        res.json({
            success: true,
            data: suggestions,
        });
    }
    catch (error) {
        next(error);
    }
});
// Search suggestions (products, categories, tags)
router.get('/suggestions', async (req, res, next) => {
    try {
        const { q: query } = req.query;
        if (!query || query.trim().length < 2) {
            return res.json({
                success: true,
                data: {
                    products: [],
                    categories: [],
                    tags: [],
                },
            });
        }
        const suggestions = await searchService.getSearchSuggestions(query);
        res.json({
            success: true,
            data: suggestions,
        });
    }
    catch (error) {
        next(error);
    }
});
// Popular searches
router.get('/popular', async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;
        const popularSearches = await searchService.getPopularSearches(parseInt(limit));
        res.json({
            success: true,
            data: popularSearches,
        });
    }
    catch (error) {
        next(error);
    }
});
// Trending products
router.get('/trending', async (req, res, next) => {
    try {
        const { limit = 8 } = req.query;
        const trendingProducts = await searchService.getTrendingProducts(parseInt(limit));
        res.json({
            success: true,
            data: trendingProducts,
        });
    }
    catch (error) {
        next(error);
    }
});
// Search within category
router.get('/category/:categorySlug', async (req, res, next) => {
    try {
        const { categorySlug } = req.params;
        const { q: query = '', page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', } = req.query;
        // First get category ID
        const category = await Category.findOne({ slug: categorySlug });
        if (!category) {
            throw new AppError('Category not found', 404);
        }
        const result = await searchService.searchProducts({
            query: query,
            page: parseInt(page),
            limit: parseInt(limit),
            filters: {
                category: category._id.toString(),
            },
            sort: {
                field: sortBy,
                order: sortOrder,
            },
        });
        res.json({
            success: true,
            data: {
                ...result,
                category,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// Advanced search with multiple filters
router.post('/advanced', async (req, res, next) => {
    try {
        const { query = '', page = 1, limit = 20, filters = {}, sort = { field: 'relevance', order: 'desc' }, } = req.body;
        const result = await searchService.searchProducts({
            query,
            page,
            limit,
            filters,
            sort,
        });
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=search.js.map