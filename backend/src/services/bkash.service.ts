import axios from 'axios';
import crypto from 'crypto';
import { AppError } from '../middleware/errorHandler.js';
import Order from '../models/Order.js';

interface BkashConfig {
  appKey: string;
  appSecret: string;
  username: string;
  password: string;
  baseURL: string;
  
}

export class BkashService {
  private config: BkashConfig;
  private token: string | null = null;
  private tokenExpires: Date | null = null;

  constructor() {
    this.config = {
      appKey: process.env.BKASH_APP_KEY!,
      appSecret: process.env.BKASH_APP_SECRET!,
      username: process.env.BKASH_USERNAME!,
      password: process.env.BKASH_PASSWORD!,
      baseURL: process.env.NODE_ENV === 'production'
        ? 'https://checkout.pay.bka.sh/v1.2.0-beta'
        : 'https://checkout.sandbox.bka.sh/v1.2.0-beta',
    };
  }

  private async getToken(): Promise<string> {
    // Check if token is still valid
    if (this.token && this.tokenExpires && new Date() < this.tokenExpires) {
      return this.token;
    }

    try {
      const response = await axios.post(
        `${this.config.baseURL}/checkout/token/grant`,
        {
          app_key: this.config.appKey,
          app_secret: this.config.appSecret,
        },
        {
          headers: {
            username: this.config.username,
            password: this.config.password,
            'Content-Type': 'application/json',
          },
        }
      );

      this.token = response.data.id_token;
      this.tokenExpires = new Date(Date.now() + 3599 * 1000); // 1 hour

      return this.token || ''; // Return the token or an empty string if null
    } catch (error: any) {
      console.error('Error getting bKash token:', error);
      throw new AppError('Failed to get bKash token', 500);
    }
  }

  async createPayment(orderId: string, amount: number) {
    try {
      const token = await this.getToken();
      const order = await Order.findById(orderId);

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      const paymentData = {
        mode: '0011', // Tokenized checkout
        payerReference: order.userId.toString(),
        callbackURL: `${process.env.APP_URL}/api/payments/bkash/callback`,
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: order.orderNumber,
      };

      const response = await axios.post(
        `${this.config.baseURL}/checkout/payment/create`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-APP-Key': this.config.appKey,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update order with payment ID
      await Order.findByIdAndUpdate(orderId, {
        'payment.intentId': response.data.paymentID,
        'payment.provider': 'bkash',
      });

      return {
        paymentID: response.data.paymentID,
        bkashURL: response.data.bkashURL,
        success: response.data.statusCode === '0000',
      };
    } catch (error: any) {
      console.error('Error creating bKash payment:', error);
      throw new AppError('Failed to create bKash payment', 500);
    }
  }

  async executePayment(paymentID: string) {
    try {
      const token = await this.getToken();

      const response = await axios.post(
        `${this.config.baseURL}/checkout/payment/execute/${paymentID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-APP-Key': this.config.appKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.statusCode === '0000') {
        // Update order status
        const order = await Order.findOne({ 'payment.intentId': paymentID });
        if (order) {
          await Order.findByIdAndUpdate(order._id, {
            status: 'processing',
            'payment.status': 'succeeded',
            'payment.transactionId': response.data.trxID,
            updatedAt: new Date(),
          });
        }
      }

      return response.data;
    } catch (error: any) {
      console.error('Error executing bKash payment:', error);
      throw new AppError('Failed to execute bKash payment', 500);
    }
  }

  async queryPayment(paymentID: string) {
    try {
      const token = await this.getToken();

      const response = await axios.get(
        `${this.config.baseURL}/checkout/payment/query/${paymentID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-APP-Key': this.config.appKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error querying bKash payment:', error);
      throw new AppError('Failed to query bKash payment', 500);
    }
  }

  verifyCallback(data: any): boolean {
    try {
      // Verify callback signature
      const signature = crypto
        .createHmac('sha256', this.config.appSecret)
        .update(JSON.stringify(data))
        .digest('hex');

      return signature === data.signature;
    } catch (error) {
      return false;
    }
  }
}

export const bkashService = new BkashService();