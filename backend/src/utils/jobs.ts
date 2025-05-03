import Queue from 'bull';
import { config } from '../config/config';
import { logger } from './logger';
import { Order, IOrder } from '../models/Order';
import { emailService } from './email';
import { Product } from '../models/Product';
import { Job } from 'bull';

interface OrderJobData {
  orderId: string;
}

interface StockJobData {
  productId: string;
  quantity: number;
}

const orderQueue = new Queue('order-processing', {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
});

const stockQueue = new Queue('stock-management', {
  defaultJobOptions: {
    removeOnComplete: true
  }
});

orderQueue.process(async (job: Job<OrderJobData>) => {
  try {
    const order = await Order.findById(job.data.orderId)
      .populate('user')
      .populate('items.product') as IOrder | null;

    if (!order) {
      throw new Error(`Order ${job.data.orderId} not found`);
    }

    await emailService.sendOrderConfirmation(order);
    logger.info(`Order confirmation sent for order ${job.data.orderId}`);
  } catch (error) {
    logger.error('Order processing error:', error);
    throw error;
  }
});

stockQueue.process(async (job: Job<StockJobData>) => {
  try {
    const { productId, quantity } = job.data;
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    if (product.stock < quantity) {
      logger.warn(`Low stock alert for product ${productId}`);
      // Implement notification logic for low stock
    }
  } catch (error) {
    logger.error('Stock management error:', error);
    throw error;
  }
});

export const queueOrderProcessing = (orderId: string) => {
  return orderQueue.add({ orderId });
};

export const queueStockCheck = (productId: string, quantity: number) => {
  return stockQueue.add({ productId, quantity });
};

export const gracefulShutdown = async () => {
  await Promise.all([
    orderQueue.close(),
    stockQueue.close()
  ]);
};