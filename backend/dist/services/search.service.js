import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';
export class SearchService {
    // Search products using MongoDB Atlas Search
    async searchProducts(options) {
        try {
            const { query, page = 1, limit = 20, filters = {}, sort = { field: '_score', order: 'desc' }, } = options;
            const skip = (page - 1) * limit;
            // Build search pipeline
            const pipeline = [];
            // Search stage
            if (query && query.trim()) {
                pipeline.push({
                    $search: {
                        index: 'default', // Your search index name
                        compound: {
                            should: [
                                {
                                    text: {
                                        query: query,
                                        path: 'title',
                                        score: { boost: { value: 3 } }, // Title matches are more important
                                        fuzzy: {
                                            maxEdits: 2,
                                            prefixLength: 3,
                                        },
                                    },
                                },
                                {
                                    text: {
                                        query: query,
                                        path: 'description',
                                        score: { boost: { value: 1 } },
                                        fuzzy: {
                                            maxEdits: 2,
                                            prefixLength: 3,
                                        },
                                    },
                                },
                                {
                                    text: {
                                        query: query,
                                        path: 'tags',
                                        score: { boost: { value: 2 } },
                                        fuzzy: {
                                            maxEdits: 1,
                                        },
                                    },
                                },
                                {
                                    text: {
                                        query: query,
                                        path: 'sku',
                                        score: { boost: { value: 2 } },
                                    },
                                },
                            ],
                            minimumShouldMatch: 1,
                        },
                        highlight: {
                            path: ['title', 'description'],
                        },
                    },
                });
            }
            else {
                // If no query, just match all (but sort by relevance doesn't apply)
                pipeline.push({ $match: {} });
            }
            // Filter stage
            const matchStage = { $match: {} };
            if (filters.category) {
                matchStage.$match.category = new mongoose.Types.ObjectId(filters.category);
            }
            if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
                matchStage.$match['price.amount'] = {};
                if (filters.minPrice !== undefined) {
                    matchStage.$match['price.amount'].$gte = filters.minPrice;
                }
                if (filters.maxPrice !== undefined) {
                    matchStage.$match['price.amount'].$lte = filters.maxPrice;
                }
            }
            if (filters.inStock !== undefined) {
                matchStage.$match.stock = filters.inStock ? { $gt: 0 } : { $lte: 0 };
            }
            if (filters.status) {
                matchStage.$match.status = filters.status;
            }
            else {
                // Default filter for active products
                matchStage.$match.status = 'active';
            }
            // Only add match stage if there are filters
            if (Object.keys(matchStage.$match).length > 0) {
                pipeline.push(matchStage);
            }
            // Count total results
            const countPipeline = [...pipeline, { $count: 'total' }];
            const countResult = await Product.aggregate(countPipeline);
            const total = countResult[0]?.total || 0;
            // Add sorting
            if (query && query.trim()) {
                // For search results, sort by score first
                pipeline.push({ $sort: { score: { $meta: 'searchScore' } } });
            }
            else if (sort.field === 'relevance' || sort.field === '_score') {
                // If no query but relevance sort requested, sort by createdAt
                pipeline.push({ $sort: { createdAt: -1 } });
            }
            else {
                // Custom sorting
                const sortStage = { $sort: {} };
                sortStage.$sort[sort.field] = sort.order === 'asc' ? 1 : -1;
                pipeline.push(sortStage);
            }
            // Add pagination and population
            pipeline.push({ $skip: skip }, { $limit: limit }, {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            }, { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } }, {
                $project: {
                    title: 1,
                    slug: 1,
                    description: 1,
                    images: 1,
                    price: 1,
                    sku: 1,
                    stock: 1,
                    status: 1,
                    tags: 1,
                    category: { name: 1, slug: 1 },
                    score: { $meta: 'searchScore' },
                    highlights: { $meta: 'searchHighlights' },
                    createdAt: 1,
                    updatedAt: 1,
                },
            });
            // Execute search
            const products = await Product.aggregate(pipeline);
            // Calculate facets/categories for search results
            const facetPipeline = [
                ...pipeline.slice(0, -4), // Remove pagination and projection stages
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 },
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'categoryDetails',
                    },
                },
                { $unwind: '$categoryDetails' },
                {
                    $project: {
                        category: '$categoryDetails',
                        count: 1,
                    },
                },
            ];
            let facets = {};
            try {
                const facetResults = await Product.aggregate(facetPipeline);
                facets = {
                    categories: facetResults.map(f => ({
                        category: f.category,
                        count: f.count,
                    })),
                };
            }
            catch (error) {
                console.error('Error calculating facets:', error);
            }
            return {
                products,
                total,
                page,
                totalPages: Math.ceil(total / limit),
                facets,
            };
        }
        catch (error) {
            console.error('Search error:', error);
            // Fallback to simple text search if Atlas Search fails
            return this.fallbackSearch(options);
        }
    }
    // Fallback search using MongoDB text index
    async fallbackSearch(options) {
        const { query, page = 1, limit = 20, filters = {}, sort = { field: 'createdAt', order: 'desc' }, } = options;
        const skip = (page - 1) * limit;
        // Build query
        const searchQuery = { status: 'active' };
        // Text search using regex for fallback
        if (query && query.trim()) {
            searchQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } },
                { sku: { $regex: query, $options: 'i' } },
            ];
        }
        // Apply filters
        if (filters.category) {
            searchQuery.category = new mongoose.Types.ObjectId(filters.category);
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            searchQuery['price.amount'] = {};
            if (filters.minPrice !== undefined) {
                searchQuery['price.amount'].$gte = filters.minPrice;
            }
            if (filters.maxPrice !== undefined) {
                searchQuery['price.amount'].$lte = filters.maxPrice;
            }
        }
        if (filters.inStock !== undefined) {
            searchQuery.stock = filters.inStock ? { $gt: 0 } : { $lte: 0 };
        }
        // Build sort
        let sortOptions = {};
        if (query && query.trim()) {
            // For text search, sort by relevance (title match first, then description)
            sortOptions = { title: 1 }; // Simple sort for now
        }
        else {
            sortOptions[sort.field] = sort.order === 'asc' ? 1 : -1;
        }
        // Execute query
        const [products, total] = await Promise.all([
            Product.find(searchQuery)
                .populate('category', 'name slug')
                .select('title slug description images price sku stock status tags createdAt')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit),
            Product.countDocuments(searchQuery),
        ]);
        return {
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    // Autocomplete suggestions
    async autocomplete(query, limit = 5) {
        try {
            const pipeline = [
                {
                    $search: {
                        index: 'autocomplete',
                        autocomplete: {
                            query: query,
                            path: 'title',
                            fuzzy: {
                                maxEdits: 1,
                            },
                            tokenOrder: 'sequential',
                        },
                    },
                },
                { $match: { status: 'active' } },
                { $limit: limit },
                {
                    $project: {
                        title: 1,
                        slug: 1,
                        images: 1,
                        price: 1,
                        score: { $meta: 'searchScore' },
                    },
                },
            ];
            return await Product.aggregate(pipeline);
        }
        catch (error) {
            console.error('Autocomplete error:', error);
            // Fallback
            const products = await Product.find({
                title: { $regex: query, $options: 'i' },
                status: 'active',
            })
                .select('title slug images price')
                .limit(limit);
            return products;
        }
    }
    // Get search suggestions (categories, brands, etc.)
    async getSearchSuggestions(query) {
        const [products, categories, tags] = await Promise.all([
            this.autocomplete(query, 5),
            this.suggestCategories(query),
            this.suggestTags(query),
        ]);
        return {
            products,
            categories,
            tags,
        };
    }
    async suggestCategories(query) {
        const Category = mongoose.model('Category');
        try {
            return await Category.find({
                name: { $regex: query, $options: 'i' },
            })
                .select('name slug')
                .limit(3);
        }
        catch (error) {
            return [];
        }
    }
    async suggestTags(query) {
        try {
            const products = await Product.find({
                tags: { $regex: query, $options: 'i' },
                status: 'active',
            })
                .select('tags')
                .limit(5);
            const allTags = products.flatMap(p => p.tags);
            const matchingTags = allTags.filter(tag => tag.toLowerCase().includes(query.toLowerCase()));
            // Remove duplicates and limit
            return [...new Set(matchingTags)].slice(0, 5);
        }
        catch (error) {
            return [];
        }
    }
    // Get popular searches
    async getPopularSearches(limit = 10) {
        // In a real app, you'd track search queries
        // For now, return some default popular searches
        return [
            'smartphone',
            'laptop',
            'headphones',
            'watch',
            'shoes',
            'tshirt',
            'book',
            'camera',
            'tablet',
            'gaming',
        ].slice(0, limit);
    }
    // Get trending products (based on views/purchases)
    async getTrendingProducts(limit = 8) {
        // In a real app, you'd track product views/purchases
        // For now, return recently added products
        return Product.find({ status: 'active' })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('title slug images price')
            .populate('category', 'name slug');
    }
}
export const searchService = new SearchService();
//# sourceMappingURL=search.service.js.map