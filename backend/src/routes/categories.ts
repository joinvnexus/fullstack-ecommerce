import express from 'express';
import Category from '../models/Category.js';
import { authenticate, authorizeAdmin } from '../utils/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all categories (public)
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find()
      .sort({ sortOrder: 1, name: 1 })
      .populate('children', 'name slug');

    // Convert to hierarchical structure
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    // First pass: create map
    categories.forEach(category => {
      categoryMap.set(category._id.toString(), {
        ...category.toObject(),
        children: [],
      });
    });

    // Second pass: build hierarchy
    categories.forEach(category => {
      const categoryObj = categoryMap.get(category._id.toString());
      
      if (category.parent) {
        const parent = categoryMap.get(category.parent.toString());
        if (parent) {
          parent.children.push(categoryObj);
        }
      } else {
        rootCategories.push(categoryObj);
      }
    });

    res.json({
      success: true,
      data: rootCategories,
    });
  } catch (error) {
    next(error);
  }
});

// Get single category by slug (public)
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parent', 'name slug')
      .populate('children', 'name slug sortOrder');

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Get products count in this category
    const Product = require('../models/Product').default;
    const productCount = await Product.countDocuments({
      category: category._id,
      status: 'active',
    });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        productCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create category (admin only)
router.post('/', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    const { name, slug, parent, sortOrder = 0 } = req.body;

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      throw new AppError('Category with this slug already exists', 400);
    }

    // Check if parent exists
    let parentCategory = null;
    let treePath: string[] = [];
    
    if (parent) {
      parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        throw new AppError('Parent category not found', 404);
      }
      treePath = [...parentCategory.treePath, parentCategory.slug];
    }

    const category = new Category({
      name,
      slug,
      parent: parent || null,
      treePath,
      sortOrder,
    });

    await category.save();

    // Update parent's children array
    if (parentCategory) {
      await Category.findByIdAndUpdate(parent, {
        $push: { children: category._id },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

// Update category (admin only)
router.put('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Convert id to ObjectId
    const categoryId = new mongoose.Types.ObjectId(id);

    // Check if slug is being updated and is unique
    if (updates.slug) {
      const existingCategory = await Category.findOne({
        slug: updates.slug,
        _id: { $ne: categoryId },
      });
      if (existingCategory) {
        throw new AppError('Another category with this slug exists', 400);
      }
    }

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

// Delete category (admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Convert id to ObjectId
    const categoryId = new mongoose.Types.ObjectId(id);

    // Check if category has children
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (category.children && category.children.length > 0) {
      throw new AppError(
        'Cannot delete category with subcategories. Delete subcategories first.',
        400
      );
    }

    // Check if category has products
    const Product = require('../models/Product').default;
    const productCount = await Product.countDocuments({ category: categoryId });
    if (productCount > 0) {
      throw new AppError(
        'Cannot delete category with products. Remove products first.',
        400
      );
    }

    // Remove from parent's children array
    if (category.parent) {
      await Category.findByIdAndUpdate(category.parent, {
        $pull: { children: categoryId },
      });
    }

    await Category.findByIdAndDelete(categoryId);

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;