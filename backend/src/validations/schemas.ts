import { z } from 'zod';

export const authSchemas = {
  register: z.object({
    body: z.object({
      name: z.string().min(2).max(50),
      email: z.string().email(),
      password: z.string().min(6).max(50)
    })
  }),
  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })
  })
};

export const productSchemas = {
  create: z.object({
    body: z.object({
      name: z.string().min(2).max(100),
      description: z.string().min(10),
      price: z.number().positive(),
      compareAtPrice: z.number().positive().optional(),
      images: z.array(z.string()).min(1),
      category: z.string(),
      sizes: z.array(z.string()),
      colors: z.array(z.string()),
      stock: z.number().int().min(0),
      features: z.array(z.string()),
      status: z.enum(['draft', 'active', 'outOfStock', 'discontinued'])
    })
  }),
  update: z.object({
    params: z.object({
      id: z.string()
    }),
    body: z.object({
      name: z.string().min(2).max(100).optional(),
      description: z.string().min(10).optional(),
      price: z.number().positive().optional(),
      compareAtPrice: z.number().positive().optional(),
      images: z.array(z.string()).min(1).optional(),
      category: z.string().optional(),
      sizes: z.array(z.string()).optional(),
      colors: z.array(z.string()).optional(),
      stock: z.number().int().min(0).optional(),
      features: z.array(z.string()).optional(),
      status: z.enum(['draft', 'active', 'outOfStock', 'discontinued']).optional()
    })
  })
};

export const orderSchemas = {
  create: z.object({
    body: z.object({
      shipping: z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        email: z.string().email(),
        address: z.string().min(5),
        city: z.string().min(2),
        postalCode: z.string().min(4),
        country: z.string().min(2)
      }),
      payment: z.object({
        method: z.enum(['mpesa', 'card', 'paypal'])
      })
    })
  }),
  updateStatus: z.object({
    params: z.object({
      id: z.string()
    }),
    body: z.object({
      status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    })
  })
};

export const paymentSchemas = {
  mpesaInitiate: z.object({
    body: z.object({
      phoneNumber: z.string().regex(/^(?:254|\+254|0)?([17](0|1|2|4|5|6|7|8|9)[0-9]{6})$/),
      orderId: z.string()
    })
  })
};

export const cartSchemas = {
  addItem: z.object({
    body: z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      size: z.string().optional(),
      color: z.string().optional()
    })
  }),
  updateItem: z.object({
    body: z.object({
      itemId: z.string(),
      quantity: z.number().int().min(0)
    })
  })
};