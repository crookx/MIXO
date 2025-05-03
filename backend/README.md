# MIXO E-commerce Backend

A robust e-commerce backend built with Express, TypeScript, and MongoDB, featuring M-Pesa integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the root directory and add your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=your_shortcode
MPESA_CALLBACK_URL=your_callback_url
```

3. Run development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Run production server
- `npm run seed`: Seed database with sample data
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## API Endpoints

### Authentication
- POST `/api/auth/register`: Register new user
- POST `/api/auth/login`: Login user
- GET `/api/auth/me`: Get current user

### Products
- GET `/api/products`: Get all products
- GET `/api/products/:id`: Get single product
- POST `/api/products`: Create product (admin)
- PUT `/api/products/:id`: Update product (admin)
- DELETE `/api/products/:id`: Delete product (admin)

### Cart
- GET `/api/cart`: Get user's cart
- POST `/api/cart/add`: Add item to cart
- PUT `/api/cart/update`: Update cart item
- DELETE `/api/cart/item/:id`: Remove item from cart

### Orders
- POST `/api/orders`: Create order
- GET `/api/orders`: Get user's orders
- GET `/api/orders/:id`: Get single order
- PATCH `/api/orders/:id/status`: Update order status (admin)

### Payments
- POST `/api/payments/mpesa/initiate`: Initiate M-Pesa payment
- GET `/api/payments/mpesa/status/:orderId`: Check payment status
- POST `/api/payments/mpesa/callback`: M-Pesa callback endpoint

## Testing

Run the test suite:
```bash
npm test
```

## License

MIT