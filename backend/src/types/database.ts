import { Document, Types } from 'mongoose';

export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface MpesaPayment {
  transactionId: string;
  phoneNumber: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  processingDetails?: {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResultCode: number;
    ResultDesc: string;
  };
  completedAt?: Date;
}

export interface FilterQuery {
  search?: string;
  category?: Types.ObjectId;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  limit?: number;
  page?: number;
}