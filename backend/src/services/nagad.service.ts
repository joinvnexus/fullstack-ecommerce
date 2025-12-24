import axios from 'axios';
import crypto from 'crypto';
import { AppError } from '../middleware/errorHandler.js';
import Order from '../models/Order.js';

interface NagadConfig {
  merchantId: string;
  merchantNumber: string;
  baseURL: string;
  callbackURL: string;
}

export class NagadService {
  private config: NagadConfig;

  constructor() {
    this.config = {
      merchantId: process.env.NAGAD_MERCHANT_ID!,
      merchantNumber: process.env.NAGAD_MERCHANT_NUMBER!,
      baseURL: process.env.NODE_ENV === 'production'
        ? 'https://api.mynagad.com'
        : 'https://sandbox.mynagad.com',
      callbackURL: `${process.env.APP_URL}/api/payments/nagad/callback`,
    };
  }

  private generateSignature(data: string): string {
    const privateKey = process.env.NAGAD_PRIVATE_KEY!;
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(privateKey, 'base64');
  }

  async initializePayment(orderId: string, amount: number) {
    try {
      const order = await Order.findById(orderId);

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      const datetime = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
      const merchantID = this.config.merchantId;
      const invoiceNo = order.orderNumber;
      const amountStr = amount.toFixed(2);

      // Generate challenge
      const challenge = crypto.randomBytes(32).toString('hex');

      // Create sensitive data
      const sensitiveData = {
        merchantId: merchantID,
        datetime,
        orderId: invoiceNo,
        challenge,
      };

      const sensitiveDataString = JSON.stringify(sensitiveData);
      const publicKey = process.env.NAGAD_PUBLIC_KEY!;

      // Encrypt sensitive data
      const encryptedSensitiveData = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(sensitiveDataString)
      ).toString('base64');

      // Generate signature
      const signatureData = `${merchantID}${datetime}${invoiceNo}`;
      const signature = this.generateSignature(signatureData);

      const requestData = {
        merchantId: merchantID,
        datetime,
        orderId: invoiceNo,
        challenge,
        sensitiveData: encryptedSensitiveData,
        signature,
        amount: amountStr,
        currencyCode: '050', // BDT
        additionalMerchantInfo: {
          merchantNumber: this.config.merchantNumber,
          service: 'Order Payment',
        },
      };

      const response = await axios.post(
        `${this.config.baseURL}/api/dfs/check-out/initialize/${merchantID}/${invoiceNo}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-KM-IP-V4': '127.0.0.1',
            'X-KM-Client-Type': 'PC_WEB',
          },
        }
      );

      if (response.data.status === 'Success') {
        // Update order with payment ID
        await Order.findByIdAndUpdate(orderId, {
          'payment.intentId': response.data.paymentReferenceId,
          'payment.provider': 'nagad',
        });

        return {
          paymentReferenceId: response.data.paymentReferenceId,
          checkoutURL: response.data.callBackUrl,
          success: true,
        };
      } else {
        throw new AppError(response.data.reason || 'Payment initialization failed', 400);
      }
    } catch (error: any) {
      console.error('Error initializing Nagad payment:', error);
      throw new AppError('Failed to initialize Nagad payment', 500);
    }
  }

  async verifyPayment(paymentRefId: string) {
    try {
      const datetime = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
      const merchantID = this.config.merchantId;

      // Generate signature
      const signatureData = `${merchantID}${datetime}${paymentRefId}`;
      const signature = this.generateSignature(signatureData);

      const response = await axios.post(
        `${this.config.baseURL}/api/dfs/verify/payment/${merchantID}/${paymentRefId}`,
        {
          merchantId: merchantID,
          orderId: paymentRefId,
          datetime,
          signature,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-KM-IP-V4': '127.0.0.1',
            'X-KM-Client-Type': 'PC_WEB',
          },
        }
      );

      if (response.data.status === 'Success') {
        // Update order status
        const order = await Order.findOne({ 'payment.intentId': paymentRefId });
        if (order) {
          await Order.findByIdAndUpdate(order._id, {
            status: 'processing',
            'payment.status': 'succeeded',
            'payment.transactionId': response.data.additionalMerchantInfo?.trxId,
            updatedAt: new Date(),
          });
        }

        return {
          success: true,
          status: response.data.status,
          transactionId: response.data.additionalMerchantInfo?.trxId,
        };
      } else {
        return {
          success: false,
          status: response.data.status,
          message: response.data.reason,
        };
      }
    } catch (error: any) {
      console.error('Error verifying Nagad payment:', error);
      throw new AppError('Failed to verify Nagad payment', 500);
    }
  }
}

export const nagadService = new NagadService();