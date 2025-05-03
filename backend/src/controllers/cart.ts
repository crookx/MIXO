import { Request, Response } from 'express';
import { Cart, ICart, ICartItem } from '../models/Cart';
import { Product } from '../models/Product';
import mongoose, { Types } from 'mongoose';

export const getCart = async (req: Request, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product') as ICart | null;

    if (!cart) {
      cart = await Cart.create({ 
        user: req.user._id, 
        items: [] 
      });
    }

    const totals = cart.calculateTotals();
    res.json({ cart, totals });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, size, color } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id }) as ICart | null;
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => 
        item.product.toString() === productId && 
        item.size === size && 
        item.color === color
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      const newItem = cart.items.create({
        product: new Types.ObjectId(productId),
        quantity,
        size,
        color,
        price: product.price
      });
      cart.items.push(newItem);
    }

    cart.updatedAt = new Date();
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product');
    const totals = updatedCart!.calculateTotals();

    res.json({ cart: updatedCart, totals });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { itemId, quantity } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id }) as ICart | null;
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.pull({ _id: itemId });
    } else {
      const item = cart.items.id(itemId);
      if (!item) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
      item.quantity = quantity;
    }

    cart.updatedAt = new Date();
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product');
    const totals = updatedCart!.calculateTotals();

    res.json({ cart: updatedCart, totals });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Error updating cart' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user._id }) as ICart | null;
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items.pull({ _id: itemId });
    cart.updatedAt = new Date();
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product');
    const totals = updatedCart!.calculateTotals();

    res.json({ cart: updatedCart, totals });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }) as ICart | null;
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear the items array using splice
    cart.items.splice(0, cart.items.length);
    cart.updatedAt = new Date();
    await cart.save();
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};