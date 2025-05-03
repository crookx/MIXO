import * as nodemailer from 'nodemailer';
import { config } from '../config/config';
import { IOrder } from '../models/Order';
import { logger } from './logger';
import { AppError } from './errors';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (!config.email) {
      throw new AppError('Email configuration is not set', 500);
    }

    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });
  }

  private async send(options: EmailOptions): Promise<void> {
    try {
      if (!config.email) {
        throw new AppError('Email configuration is not set', 500);
      }

      await this.transporter.sendMail({
        from: `"${config.email.fromName}" <${config.email.fromAddress}>`,
        ...options
      });
    } catch (error) {
      logger.error('Email sending error:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(order: IOrder): Promise<void> {
    // Populate order items with product details
    await order.populate('items.product user');

    const items = order.items.map(item => `
      <tr>
        <td>${(item.product as any)?.name || 'Product'}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('');

    const html = `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
      <h2>Order Details</h2>
      <p>Order ID: ${order._id}</p>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${items}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">Subtotal:</td>
            <td>$${order.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="3">Shipping:</td>
            <td>$${order.shippingCost.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="3">Total:</td>
            <td>$${order.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    `;

    await this.send({
      to: order.shipping.email, // Use shipping email instead of user email
      subject: `Order Confirmation #${order._id}`,
      html
    });
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<void> {
    if (!config.cors?.origin) {
      throw new AppError('Frontend URL is not configured', 500);
    }

    const resetUrl = `${config.cors.origin}/reset-password?token=${resetToken}`;
    const html = `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await this.send({
      to: email,
      subject: 'Password Reset Request',
      html
    });
  }
}

export const emailService = new EmailService();