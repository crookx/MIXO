import mongoose, { Document, Types } from 'mongoose';

export interface ICartItem extends Document {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: Types.DocumentArray<ICartItem>;
  updatedAt: Date;
  calculateTotals(): { subtotal: number; shipping: number; total: number };
}

const cartItemSchema = new mongoose.Schema<ICartItem>({
  product: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  size: String,
  color: String
});

const cartSchema = new mongoose.Schema<ICart>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

cartSchema.methods.calculateTotals = function(): { subtotal: number; shipping: number; total: number } {
  const subtotal = this.items.reduce((sum: number, item: ICartItem) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 300; // Free shipping over KES 5000
  return {
    subtotal,
    shipping,
    total: subtotal + shipping
  };
};

export const Cart = mongoose.model<ICart>('Cart', cartSchema);