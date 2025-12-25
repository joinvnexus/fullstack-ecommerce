import express from 'express';
import Wishlist, { type IWishlist } from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { authenticate } from '../utils/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import mongoose from 'mongoose';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user's wishlists
router.get('/', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;

    const wishlists = await Wishlist.find({ userId })
      .populate({
        path: 'items.productId',
        select: 'title slug price images stock status',
      })
      .sort({ isDefault: -1, updatedAt: -1 });

    res.json({
      success: true,
      data: wishlists,
    });
  } catch (error) {
    next(error);
  }
});

// Get default wishlist
router.get('/default', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;

    let wishlist = await Wishlist.findOne({ userId, isDefault: true })
      .populate({
        path: 'items.productId',
        select: 'title slug price images stock status',
      });

    if (!wishlist) {
      // Create default wishlist if it doesn't exist
      wishlist = new Wishlist({
        userId,
        name: 'My Wishlist',
        items: [],
        isDefault: true,
      });
      await wishlist.save();
    }

    res.json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
});

// Create new wishlist
router.post('/', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const { name } = req.body;

    // Check if wishlist with same name exists
    const existingWishlist = await Wishlist.findOne({ userId, name });
    if (existingWishlist) {
      throw new AppError('Wishlist with this name already exists', 400);
    }

    // If this is the first wishlist, mark it as default
    const wishlistCount = await Wishlist.countDocuments({ userId });
    const isDefault = wishlistCount === 0;

    const wishlist = new Wishlist({
      userId,
      name: name || 'New Wishlist',
      items: [],
      isDefault,
    });

    await wishlist.save();

    res.status(201).json({
      success: true,
      message: 'Wishlist created successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
});

// Add product to wishlist
router.post('/:wishlistId/items', async (req, res, next) => {
  try {
    const { wishlistId } = req.params;
    const { productId, notes } = req.body;
    const userId = (req as any).user.userId;

    // Find wishlist
    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      userId,
    }) as IWishlist;

    if (!wishlist) {
      throw new AppError('Wishlist not found', 404);
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if product is already in wishlist
    if (wishlist.hasProduct(productId)) {
      throw new AppError('Product already in wishlist', 400);
    }

    // Add product to wishlist
    wishlist.addProduct(productId, notes);
    await wishlist.save();

    // Populate product details
    await wishlist.populate({
      path: 'items.productId',
      select: 'title slug price images stock status',
    });

    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
});

// Remove product from wishlist
router.delete('/:wishlistId/items/:productId', async (req, res, next) => {
  try {
    const { wishlistId, productId } = req.params;
    const userId = (req as any).user.userId;

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      userId,
    });

    if (!wishlist) {
      throw new AppError('Wishlist not found', 404);
    }

    // Remove product from wishlist
    wishlist.removeProduct(productId);
    await wishlist.save();

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
});

// Move product between wishlists
router.post('/move-item', async (req, res, next) => {
  try {
    const { fromWishlistId, toWishlistId, productId, notes } = req.body;
    const userId = (req as any).user.userId;

    // Find source wishlist
    const fromWishlist = await Wishlist.findOne({
      _id: fromWishlistId,
      userId,
    }) as IWishlist;

    if (!fromWishlist) {
      throw new AppError('Source wishlist not found', 404);
    }

    // Find destination wishlist
    const toWishlist = await Wishlist.findOne({
      _id: toWishlistId,
      userId,
    });

    if (!toWishlist) {
      throw new AppError('Destination wishlist not found', 404);
    }

    // Check if product exists in source wishlist
    if (!fromWishlist.hasProduct(productId)) {
      throw new AppError('Product not found in source wishlist', 404);
    }

    // Check if product already exists in destination wishlist
    if (toWishlist.hasProduct(productId)) {
      throw new AppError('Product already in destination wishlist', 400);
    }

    // Get product details from source wishlist
    const productItem = fromWishlist.items.find(
      item => item.productId.toString() === productId
    );

    // Remove from source
    fromWishlist.removeProduct(productId);
    await fromWishlist.save();

    // Add to destination
    toWishlist.addProduct(productId, notes || productItem?.notes);
    await toWishlist.save();

    res.json({
      success: true,
      message: 'Product moved successfully',
      data: {
        fromWishlist,
        toWishlist,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update wishlist
router.put('/:wishlistId', async (req, res, next) => {
  try {
    const { wishlistId } = req.params;
    const { name, isDefault } = req.body;
    const userId = (req as any).user.userId;

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      userId,
    });

    if (!wishlist) {
      throw new AppError('Wishlist not found', 404);
    }

    // If changing name, check for duplicates
    if (name && name !== wishlist.name) {
      const existingWishlist = await Wishlist.findOne({
        userId,
        name,
        _id: { $ne: wishlistId },
      });
      if (existingWishlist) {
        throw new AppError('Another wishlist with this name exists', 400);
      }
      wishlist.name = name;
    }

    // If setting as default, update other wishlists
    if (isDefault === true && !wishlist.isDefault) {
      await Wishlist.updateMany(
        { userId, _id: { $ne: wishlistId } },
        { $set: { isDefault: false } }
      );
      wishlist.isDefault = true;
    }

    await wishlist.save();

    res.json({
      success: true,
      message: 'Wishlist updated successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
});

// Delete wishlist
router.delete('/:wishlistId', async (req, res, next) => {
  try {
    const { wishlistId } = req.params;
    const userId = (req as any).user.userId;

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      userId,
    });

    if (!wishlist) {
      throw new AppError('Wishlist not found', 404);
    }

    // Don't allow deleting default wishlist if it's the only one
    if (wishlist.isDefault) {
      const otherWishlists = await Wishlist.countDocuments({
        userId,
        _id: { $ne: wishlistId },
      });
      if (otherWishlists === 0) {
        throw new AppError('Cannot delete the only wishlist', 400);
      }
    }

    await wishlist.deleteOne();

    // If default wishlist was deleted, set another as default
    if (wishlist.isDefault) {
      const newDefault = await Wishlist.findOne({ userId });
      if (newDefault) {
        newDefault.isDefault = true;
        await newDefault.save();
      }
    }

    res.json({
      success: true,
      message: 'Wishlist deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Get wishlist by ID
router.get('/:wishlistId', async (req, res, next) => {
  try {
    const { wishlistId } = req.params;
    const userId = (req as any).user.userId;

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      userId,
    }).populate({
      path: 'items.productId',
      select: 'title slug description price images stock status variants',
    });

    if (!wishlist) {
      throw new AppError('Wishlist not found', 404);
    }

    res.json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
});

// Check if product is in any wishlist
router.get('/check/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = (req as any).user.userId;

    const wishlist = await Wishlist.findOne({
      userId,
      'items.productId': new mongoose.Types.ObjectId(productId),
    });

    const isInWishlist = wishlist ? {
      isInWishlist: true,
      wishlistId: wishlist._id,
      wishlistName: wishlist.name,
    } : {
      isInWishlist: false,
    };

    res.json({
      success: true,
      data: isInWishlist,
    });
  } catch (error) {
    next(error);
  }
});

export default router;