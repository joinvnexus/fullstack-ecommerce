import express from "express";
import { authenticate, authorizeAdmin } from "../utils/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { paymentService } from "../services/payment.service.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import { bkashService } from "../services/bkash.service.js";
import { nagadService } from "../services/nagad.service.js";

const router = express.Router();

// Create Stripe payment intent
router.post("/stripe/intent", authenticate, async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const userId = (req as any).user.userId;

    // Get order
    const order = await Order.findOne({
      _id: new mongoose.Types.ObjectId(orderId),
      userId,
      status: "pending",
    });

    if (!order) {
      throw new AppError("Order not found or not pending", 404);
    }

    // Create payment intent
    const result = await paymentService.createStripePaymentIntent(order);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Stripe webhook endpoint
router.post("/stripe/webhook", async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      throw new AppError("Missing Stripe signature", 400);
    }

    // Verify webhook signature
    const event = paymentService.verifyStripeSignature(
      JSON.stringify(req.body),
      signature
    );

    // Handle webhook event
    await paymentService.handleStripeWebhook(event);

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});

// Get payment status
router.get("/:orderId/status", authenticate, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = (req as any).user.userId;

    const order = await Order.findOne({
      _id: new mongoose.Types.ObjectId(orderId),
      userId,
    }).select("status payment");

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    res.json({
      success: true,
      data: {
        status: order.status,
        payment: order.payment,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Process refund
router.post(
  "/:orderId/refund",
  authenticate,
  authorizeAdmin,
  async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { amount, reason } = req.body;

      if (!orderId) {
        throw new AppError("Order ID is required", 400);
      }

      const order = await Order.findById(orderId);

      if (!order) {
        throw new AppError("Order not found", 404);
      }

      if (order.payment.provider !== "stripe") {
        throw new AppError("Refund only available for Stripe payments", 400);
      }

      if (!order.payment.chargeId) {
        throw new AppError("Charge ID not found", 400);
      }

      // Process refund with proper type handling
      const refundAmount = amount ? Number(amount) : undefined;
      const refund = await paymentService.createRefund(
        orderId as string,
        refundAmount
      );

      // Update order notes
      order.notes = `${order.notes || ""}\nRefund: ${reason} - Amount: $${
        amount || order.totals.grandTotal
      }`;
      await order.save();

      res.json({
        success: true,
        message: "Refund processed successfully",
        data: refund,
      });
    } catch (error) {
      next(error);
    }
  }
);

// List payment methods
router.get("/methods", (req, res) => {
  const methods = [
    {
      id: "stripe",
      name: "Credit/Debit Card",
      description: "Pay with Visa, Mastercard, American Express",
      icon: "💳",
      supportedCountries: ["US", "CA", "GB", "AU", "EU"],
    },
    {
      id: "bkash",
      name: "bKash",
      description: "Mobile banking payment for Bangladesh",
      icon: "📱",
      supportedCountries: ["BD"],
    },
    {
      id: "nagad",
      name: "Nagad",
      description: "Mobile financial service for Bangladesh",
      icon: "📲",
      supportedCountries: ["BD"],
    },
    {
      id: "sslcommerz",
      name: "SSLCommerz",
      description: "Payment gateway for Bangladesh",
      icon: "🌐",
      supportedCountries: ["BD"],
    },
  ];

  res.json({
    success: true,
    data: methods,
  });
});

// bKash payment routes
router.post("/bkash/create", authenticate, async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;
    const userId = (req as any).user.userId;

    // Verify order belongs to user
    const order = await Order.findOne({
      _id: orderId,
      userId,
      status: "pending",
    });

    if (!order) {
      throw new AppError("Order not found or not pending", 404);
    }

    // Create bKash payment
    const result = await bkashService.createPayment(orderId, amount);

    res.json({
      success: result.success,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/bkash/execute", async (req, res, next) => {
  try {
    const { paymentID } = req.body;

    if (!paymentID) {
      throw new AppError("Payment ID required", 400);
    }

    // Execute payment
    const result = await bkashService.executePayment(paymentID);

    res.json({
      success: result.statusCode === "0000",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/bkash/callback", async (req, res, next) => {
  try {
    const callbackData = req.body;

    // Verify callback
    if (!bkashService.verifyCallback(callbackData)) {
      throw new AppError("Invalid callback signature", 400);
    }

    // Process callback
    if (callbackData.status === "success") {
      // Update order status
      await Order.findOneAndUpdate(
        { "payment.intentId": callbackData.paymentID },
        {
          status: "processing",
          "payment.status": "succeeded",
          "payment.transactionId": callbackData.trxID,
          updatedAt: new Date(),
        }
      );
    }

    // Redirect to success/failure page
    if (callbackData.status === "success") {
      res.redirect(`${process.env.FRONTEND_URL}/checkout/success`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/checkout/failed`);
    }
  } catch (error) {
    next(error);
  }
});

// Nagad payment routes
router.post("/nagad/initialize", authenticate, async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;
    const userId = (req as any).user.userId;

    // Verify order belongs to user
    const order = await Order.findOne({
      _id: orderId,
      userId,
      status: "pending",
    });

    if (!order) {
      throw new AppError("Order not found or not pending", 404);
    }

    // Initialize Nagad payment
    const result = await nagadService.initializePayment(orderId, amount);

    res.json({
      success: result.success,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/nagad/verify", async (req, res, next) => {
  try {
    const { paymentRefId } = req.body;

    if (!paymentRefId) {
      throw new AppError("Payment Reference ID required", 400);
    }

    // Verify payment
    const result = await nagadService.verifyPayment(paymentRefId);

    res.json({
      success: result.success,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/nagad/callback", async (req, res, next) => {
  try {
    const callbackData = req.body;

    // Update order based on callback
    if (callbackData.status === "Success") {
      await Order.findOneAndUpdate(
        { "payment.intentId": callbackData.paymentReferenceId },
        {
          status: "processing",
          "payment.status": "succeeded",
          "payment.transactionId": callbackData.trxId,
          updatedAt: new Date(),
        }
      );

      res.redirect(`${process.env.FRONTEND_URL}/checkout/success`);
    } else {
      res.redirect(
        `${process.env.FRONTEND_URL}/checkout/failed?reason=${callbackData.reason}`
      );
    }
  } catch (error) {
    next(error);
  }
});

export default router;
