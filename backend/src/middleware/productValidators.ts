import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than 0').max(1000000, 'Price too high'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  colors: z.array(z.string()).min(1, 'At least one color is required'),
  features: z.array(z.string()).optional(),
  status: z.enum(['draft', 'active', 'outOfStock', 'discontinued']).default('draft')
});

export const validateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: 'Invalid product data', 
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    } else {
      res.status(400).json({ message: 'Invalid input' });
    }
  }
};

export const validateProductUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateSchema = productSchema.partial();
    await updateSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: 'Invalid product data', 
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    } else {
      res.status(400).json({ message: 'Invalid input' });
    }
  }
};