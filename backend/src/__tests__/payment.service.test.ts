import { PaymentService } from '../services/payment.service.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Stripe from 'stripe';
import mongoose from 'mongoose';

// Mock external dependencies
jest.mock('stripe');
jest.mock('../utils/logger.js', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

// Mock database models
jest.mock('../models/Order.js');
jest.mock('../models/Product.js');

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockStripe: jest.Mocked<Stripe>;
  let mockOrder: any;
  let mockProduct: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup Stripe mock - create a properly mocked instance
    mockStripe = {
      paymentIntents: {
        create: jest.fn().mockResolvedValue({}),
      },
      refunds: {
        create: jest.fn().mockResolvedValue({}),
      },
      webhooks: {
        constructEvent: jest.fn().mockReturnValue({}),
      },
    } as any;

    // Mock the Stripe constructor
    (Stripe as jest.MockedClass<typeof Stripe>).mockImplementation(() => mockStripe);

    paymentService = new PaymentService();

    // Setup Order mock
    mockOrder = {
      _id: new mongoose.Types.ObjectId(),
      orderNumber: 'ORD001',
      userId: new mongoose.Types.ObjectId(),
      items: [
        {
          productId: new mongoose.Types.ObjectId(),
          quantity: 2,
          unitPrice: 50,
          totalPrice: 100,
        },
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        zipCode: '12345',
        phone: '+1234567890',
        email: 'test@example.com',
      },
      totals: {
        grandTotal: 100,
        currency: 'USD',
      },
    };

    // Setup Product mock
    mockProduct = {
      _id: new mongoose.Types.ObjectId(),
      title: 'Test Product',
      stock: 10,
    };
  });

  describe('createStripePaymentIntent', () => {
    it('should create a payment intent successfully', async () => {
      // Arrange
      const mockPaymentIntent = {
        id: 'pi_test123',
        client_secret: 'pi_test_secret',
      };

      (mockStripe.paymentIntents.create as jest.Mock).mockResolvedValue(mockPaymentIntent as any);
      (Order.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockOrder);

      // Act
      const result = await paymentService.createStripePaymentIntent(mockOrder);

      // Assert
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 10000, // 100 * 100 (cents)
        currency: 'usd',
        metadata: {
          orderId: mockOrder._id.toString(),
          orderNumber: mockOrder.orderNumber,
          userId: mockOrder.userId.toString(),
        },
        description: `Order #${mockOrder.orderNumber}`,
        shipping: {
          address: {
            line1: mockOrder.shippingAddress.street,
            city: mockOrder.shippingAddress.city,
            state: mockOrder.shippingAddress.state,
            postal_code: mockOrder.shippingAddress.zipCode,
            country: mockOrder.shippingAddress.country,
          },
          name: mockOrder.shippingAddress.email,
          phone: mockOrder.shippingAddress.phone,
        },
      });

      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        mockOrder._id,
        {
          'payment.intentId': mockPaymentIntent.id,
          'payment.provider': 'stripe',
        }
      );

      expect(result).toEqual({
        clientSecret: mockPaymentIntent.client_secret,
        paymentIntentId: mockPaymentIntent.id,
      });
    });

    it('should throw error on Stripe API failure', async () => {
      // Arrange
      const stripeError = new Error('Stripe API error');
      (mockStripe.paymentIntents.create as jest.Mock).mockRejectedValue(stripeError);

      // Act & Assert
      await expect(paymentService.createStripePaymentIntent(mockOrder))
        .rejects.toThrow('Stripe API error');
    });
  });

  describe('handleStripeWebhook', () => {
    it('should handle payment_intent.succeeded event', async () => {
      // Arrange
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            metadata: { orderId: mockOrder._id.toString() },
            latest_charge: 'ch_test123',
          },
        },
      };

      const handlePaymentSuccessSpy = jest.spyOn(paymentService as any, 'handlePaymentSuccess');
      handlePaymentSuccessSpy.mockResolvedValue(undefined);

      // Act
      await paymentService.handleStripeWebhook(mockEvent as any);

      // Assert
      expect(handlePaymentSuccessSpy).toHaveBeenCalledWith(mockEvent.data.object);
    });

    it('should handle payment_intent.payment_failed event', async () => {
      // Arrange
      const mockEvent = {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            metadata: { orderId: mockOrder._id.toString() },
          },
        },
      };

      const handlePaymentFailureSpy = jest.spyOn(paymentService as any, 'handlePaymentFailure');
      handlePaymentFailureSpy.mockResolvedValue(undefined);

      // Act
      await paymentService.handleStripeWebhook(mockEvent as any);

      // Assert
      expect(handlePaymentFailureSpy).toHaveBeenCalledWith(mockEvent.data.object);
    });

    it('should throw error for unknown event type', async () => {
      // Arrange
      const mockEvent = {
        type: 'unknown.event',
        data: { object: {} },
      };

      // Act & Assert
      await expect(paymentService.handleStripeWebhook(mockEvent as any))
        .rejects.toThrow();
    });
  });

  describe('handlePaymentSuccess', () => {
    it('should update order status and send email on payment success', async () => {
      // Arrange
      const mockPaymentIntent = {
        metadata: { orderId: mockOrder._id.toString() },
        latest_charge: 'ch_test123',
      };

      const mockUser = { email: 'user@example.com', name: 'Test User' };

      (Order.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...mockOrder,
        populate: jest.fn().mockResolvedValue(mockOrder),
      });

      // Mock user lookup
      jest.mock('../models/User.js', () => ({
        findById: jest.fn().mockResolvedValue(mockUser),
      }));

      // Mock email service
      const mockEmailService = {
        sendOrderConfirmation: jest.fn().mockResolvedValue(undefined),
      };
      jest.mock('../services/email.service.js', () => ({
        emailService: mockEmailService,
      }));

      // Act
      await (paymentService as any).handlePaymentSuccess(mockPaymentIntent);

      // Assert
      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        mockOrder._id.toString(),
        {
          status: 'processing',
          'payment.status': 'succeeded',
          'payment.chargeId': 'ch_test123',
          updatedAt: expect.any(Date),
        },
        { new: true }
      );
    });
  });

  describe('handlePaymentFailure', () => {
    let sessionMock: any;

    beforeEach(() => {
      sessionMock = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      };

      (mongoose.startSession as jest.Mock).mockResolvedValue(sessionMock);
    });

    it('should handle payment failure with transaction rollback', async () => {
      // Arrange
      const mockPaymentIntent = {
        metadata: { orderId: mockOrder._id.toString() },
      };

      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);
      (Order.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockOrder);
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockProduct);

      // Act
      await (paymentService as any).handlePaymentFailure(mockPaymentIntent);

      // Assert
      expect(sessionMock.startTransaction).toHaveBeenCalled();
      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        mockOrder._id.toString(),
        {
          status: 'pending',
          'payment.status': 'failed',
          updatedAt: expect.any(Date),
        },
        { session: sessionMock }
      );
      expect(sessionMock.commitTransaction).toHaveBeenCalled();
      expect(sessionMock.endSession).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      // Arrange
      const mockPaymentIntent = {
        metadata: { orderId: mockOrder._id.toString() },
      };

      (Order.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act
      await expect((paymentService as any).handlePaymentFailure(mockPaymentIntent))
        .rejects.toThrow('Database error');

      // Assert
      expect(sessionMock.abortTransaction).toHaveBeenCalled();
      expect(sessionMock.endSession).toHaveBeenCalled();
    });
  });

  describe('restoreOrderStock', () => {
    it('should restore stock for all order items', async () => {
      // Arrange
      const sessionMock = {};

      // Act
      await (paymentService as any).restoreOrderStock(mockOrder, sessionMock);

      // Assert
      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        mockOrder.items[0].productId,
        { $inc: { stock: mockOrder.items[0].quantity } },
        { session: sessionMock }
      );
    });

    it('should work without session parameter', async () => {
      // Act
      await (paymentService as any).restoreOrderStock(mockOrder);

      // Assert
      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        mockOrder.items[0].productId,
        { $inc: { stock: mockOrder.items[0].quantity } },
        {}
      );
    });
  });

  describe('createRefund', () => {
    it('should create a refund successfully', async () => {
      // Arrange
      const orderId = mockOrder._id.toString();
      const refundAmount = 50;

      mockOrder.payment = { chargeId: 'ch_test123' };
      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

      const mockRefund = { id: 'ref_test123' };
      (mockStripe.refunds.create as jest.Mock).mockResolvedValue(mockRefund as any);

      (Order.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockOrder);

      // Act
      await paymentService.createRefund(orderId, refundAmount);

      // Assert
      expect(mockStripe.refunds.create).toHaveBeenCalledWith({
        charge: 'ch_test123',
        metadata: {
          orderId: orderId,
          orderNumber: mockOrder.orderNumber,
        },
        amount: 5000, // 50 * 100
      });

      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        orderId,
        {
          status: 'refunded',
          'payment.status': 'refunded',
          updatedAt: expect.any(Date),
        }
      );
    });

    it('should throw error if order or charge ID not found', async () => {
      // Arrange
      const orderId = mockOrder._id.toString();
      (Order.findById as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(paymentService.createRefund(orderId))
        .rejects.toThrow('Order or charge ID not found');
    });
  });

  describe('verifyStripeSignature', () => {
    it('should verify signature successfully', () => {
      // Arrange
      const payload = 'test_payload';
      const signature = 'test_signature';
      const mockEvent = { type: 'test' };

      (mockStripe.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent as any);

      // Act
      const result = paymentService.verifyStripeSignature(payload, signature);

      // Assert
      expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
      expect(result).toEqual(mockEvent);
    });

    it('should throw error for invalid signature', () => {
      // Arrange
      const payload = 'test_payload';
      const signature = 'invalid_signature';

      (mockStripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      // Act & Assert
      expect(() => paymentService.verifyStripeSignature(payload, signature))
        .toThrow('Invalid signature');
    });
  });
});