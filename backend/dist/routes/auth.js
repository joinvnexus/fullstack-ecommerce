import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../utils/auth.js';
import { validate } from '../utils/validation.js';
import { registerSchema, loginSchema, updateProfileSchema, addressSchema } from '../utils/validation.js';
import AuthUtils from '../utils/auth.js';
import { AppError } from '../middleware/errorHandler.js';
const router = express.Router();
// Register new user
router.post('/register', validate(registerSchema), async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('User already exists with this email', 400);
        }
        // Create new user
        const user = new User({
            name,
            email,
            password,
            phone,
            role: 'customer',
        });
        await user.save();
        // Generate JWT token
        const token = AuthUtils.generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        // Remove password safely using destructuring
        const { password: pwd, ...userResponse } = user.toObject();
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userResponse,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// Login user
router.post('/login', validate(loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }
        // Generate JWT token
        const token = AuthUtils.generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        // Remove password safely
        const { password: pwd, ...userResponse } = user.toObject();
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// Get current user profile
router.get('/me', authenticate, async (req, res, next) => {
    try {
        const user = req.user;
        const userData = await User.findById(user.userId).select('-password');
        if (!userData) {
            throw new AppError('User not found', 404);
        }
        res.json({
            success: true,
            data: userData,
        });
    }
    catch (error) {
        next(error);
    }
});
// Update user profile
router.put('/me', authenticate, validate(updateProfileSchema), async (req, res, next) => {
    try {
        const user = req.user;
        const updates = req.body;
        const userData = await User.findByIdAndUpdate(user.userId, { $set: updates }, { new: true, runValidators: true }).select('-password');
        if (!userData) {
            throw new AppError('User not found', 404);
        }
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: userData,
        });
    }
    catch (error) {
        next(error);
    }
});
// Add address
router.post('/me/address', authenticate, validate(addressSchema), async (req, res, next) => {
    try {
        const user = req.user;
        const address = req.body;
        // If this is the first address or if isDefault is true, update other addresses
        if (address.isDefault) {
            await User.updateOne({ _id: user.userId }, { $set: { 'addresses.$[].isDefault': false } });
        }
        const userData = await User.findByIdAndUpdate(user.userId, { $push: { addresses: address } }, { new: true }).select('-password');
        res.json({
            success: true,
            message: 'Address added successfully',
            data: userData?.addresses,
        });
    }
    catch (error) {
        next(error);
    }
});
// Delete address
router.delete('/me/address/:index', authenticate, async (req, res, next) => {
    try {
        const user = req.user;
        const indexParam = req.params.index;
        if (!indexParam) {
            throw new AppError('Address index is required', 400);
        }
        const index = parseInt(indexParam);
        if (isNaN(index)) {
            throw new AppError('Invalid address index', 400);
        }
        const userData = await User.findById(user.userId);
        if (!userData) {
            throw new AppError('User not found', 404);
        }
        if (index < 0 || index >= userData.addresses.length) {
            throw new AppError('Invalid address index', 400);
        }
        // Remove address at index
        userData.addresses.splice(index, 1);
        await userData.save();
        res.json({
            success: true,
            message: 'Address removed successfully',
            data: userData.addresses,
        });
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=auth.js.map