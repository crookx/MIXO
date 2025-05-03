import axios, { AxiosInstance } from 'axios';
import { config } from '../config/config';
import { STKPushResponse } from '../types/mpesa';

interface MpesaAuthResponse {
  access_token: string;
  expires_in: string;
}

interface STKCallback {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  CallbackMetadata?: {
    Item: Array<{
      Name: string;
      Value: string | number;
    }>;
  };
}

class MpesaService {
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000
    });
  }

  private async getAccessToken(): Promise<string> {
    try {
      if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
        return this.accessToken;
      }

      const auth = Buffer.from(
        `${config.mpesa.consumerKey}:${config.mpesa.consumerSecret}`
      ).toString('base64');
      
      const response = await this.axiosInstance.get<MpesaAuthResponse>(
        '/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + (parseInt(response.data.expires_in) * 1000));
      
      return this.accessToken;
    } catch (error) {
      console.error('M-Pesa auth error:', error);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  async initiateSTKPush(
    phoneNumber: string,
    amount: number,
    orderId: string
  ): Promise<STKPushResponse> {
    try {
      const token = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = Buffer.from(
        config.mpesa.shortcode +
        config.mpesa.passkey +
        timestamp
      ).toString('base64');

      const response = await this.axiosInstance.post<STKPushResponse>(
        '/mpesa/stkpush/v1/processrequest',
        {
          BusinessShortCode: config.mpesa.shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.round(amount),
          PartyA: phoneNumber,
          PartyB: config.mpesa.shortcode,
          PhoneNumber: phoneNumber,
          CallBackURL: `${config.mpesa.callbackUrl}/api/payments/mpesa/callback`,
          AccountReference: orderId,
          TransactionDesc: `Payment for order ${orderId}`
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('M-Pesa STK push error:', error);
      throw new Error('Failed to initiate M-Pesa payment');
    }
  }

  async validateTransaction(transactionId: string): Promise<boolean> {
    try {
      const token = await this.getAccessToken();

      const response = await this.axiosInstance.post(
        '/mpesa/transactionstatus/v1/query',
        {
          Initiator: config.mpesa.shortcode,
          SecurityCredential: config.mpesa.passkey,
          CommandID: 'TransactionStatusQuery',
          TransactionID: transactionId,
          PartyA: config.mpesa.shortcode,
          IdentifierType: '4',
          ResultURL: `${config.mpesa.callbackUrl}/api/payments/mpesa/status`,
          QueueTimeOutURL: `${config.mpesa.callbackUrl}/api/payments/mpesa/timeout`,
          Remarks: 'Transaction status query',
          Occasion: 'Payment validation'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return response.data.ResponseCode === '0';
    } catch (error) {
      console.error('M-Pesa validation error:', error);
      throw new Error('Failed to validate M-Pesa transaction');
    }
  }
}

export const mpesaService = new MpesaService();
export type { STKPushResponse, STKCallback };