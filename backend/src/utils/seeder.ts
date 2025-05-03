import mongoose from 'mongoose';
import { config } from '../config/config';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { logger } from './logger';
import slugify from 'slugify';

// Categories definitions
const categories = [
  { name: 'Men', slug: 'men' },
  { name: 'Women', slug: 'women' },
  { name: 'Kids', slug: 'kids' },
  { name: 'Footwear', slug: 'footwear' },
  { name: 'Outerwear', slug: 'outerwear' },
  { name: 'Tops', slug: 'tops' },
  { name: 'Bottoms', slug: 'bottoms' }
];

// Product Data (50 products per category)
const products = [
  // Men's Products
  ...Array(50).fill(null).map((_, index) => ({
    name: `Men's Product ${index + 1}`,
    description: `Discover the perfect blend of style and comfort with this Men's Product. Perfect for everyday wear or special occasions, this item will elevate your wardrobe effortlessly.`,
    price: Math.floor(Math.random() * 1000) + 999,
    compareAtPrice: Math.floor(Math.random() * 1000) + 1499,
    images: [`/images/products/men-product${index + 1}.jpg`],
    category: 'men',
    subcategory: 'T-Shirts', // Example, adjust for variety
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Blue', 'Grey'],
    stock: Math.floor(Math.random() * 50) + 50,
    features: ['Durable', 'Comfortable', 'Breathable'],
    status: 'active'
  })),

  // Women's Products
  ...Array(50).fill(null).map((_, index) => ({
    name: `Women's Product ${index + 1}`,
    description: `Elevate your style with this beautiful Women's Product. Designed to offer maximum comfort while keeping you looking chic, this item is perfect for every occasion.`,
    price: Math.floor(Math.random() * 1000) + 999,
    compareAtPrice: Math.floor(Math.random() * 1000) + 1499,
    images: [`/images/products/women-product${index + 1}.jpg`],
    category: 'women',
    subcategory: 'Dresses', // Example, adjust for variety
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Red', 'Black', 'White'],
    stock: Math.floor(Math.random() * 50) + 30,
    features: ['Elegant', 'Comfortable', 'Stylish'],
    status: 'active'
  })),

  // Kids' Products
  ...Array(50).fill(null).map((_, index) => ({
    name: `Kids' Product ${index + 1}`,
    description: `Make your child stand out with this fun and functional Kids' Product. Comfortable and durable, it’s designed for both playtime and special moments.`,
    price: Math.floor(Math.random() * 800) + 499,
    compareAtPrice: Math.floor(Math.random() * 1000) + 999,
    images: [`/images/products/kids-product${index + 1}.jpg`],
    category: 'kids',
    subcategory: 'Toys', // Example, adjust for variety
    sizes: ['2-3Y', '4-5Y', '6-7Y'],
    colors: ['Blue', 'Pink', 'Green'],
    stock: Math.floor(Math.random() * 100) + 50,
    features: ['Fun', 'Durable', 'Safe'],
    status: 'active'
  })),

  // Footwear Products
  ...Array(50).fill(null).map((_, index) => ({
    name: `Footwear Product ${index + 1}`,
    description: `Step up your footwear game with these stylish and comfortable shoes. Perfect for casual outings or active adventures, these shoes will take you anywhere.`,
    price: Math.floor(Math.random() * 1000) + 999,
    compareAtPrice: Math.floor(Math.random() * 1000) + 1499,
    images: [`/images/products/footwear-product${index + 1}.jpg`],
    category: 'footwear',
    subcategory: 'Sneakers', // Example, adjust for variety
    sizes: ['7', '8', '9', '10'],
    colors: ['Black', 'White', 'Grey'],
    stock: Math.floor(Math.random() * 50) + 30,
    features: ['Comfortable', 'Breathable', 'Durable'],
    status: 'active'
  })),

  // Outerwear Products
  ...Array(50).fill(null).map((_, index) => ({
    name: `Outerwear Product ${index + 1}`,
    description: `Stay warm and stylish with this cozy outerwear product. Perfect for the colder seasons, this piece combines comfort and modern fashion.`,
    price: Math.floor(Math.random() * 1200) + 999,
    compareAtPrice: Math.floor(Math.random() * 1000) + 1799,
    images: [`/images/products/outerwear-product${index + 1}.jpg`],
    category: 'outerwear',
    subcategory: 'Jackets', // Example, adjust for variety
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Black', 'Grey'],
    stock: Math.floor(Math.random() * 40) + 20,
    features: ['Warm', 'Stylish', 'Water-resistant'],
    status: 'active'
  })),

  // Tops Products
  ...Array(50).fill(null).map((_, index) => ({
    name: `Top Product ${index + 1}`,
    description: `This stylish top is perfect for both casual and formal occasions. Soft fabric and a flattering fit make it a must-have addition to your wardrobe.`,
    price: Math.floor(Math.random() * 1000) + 799,
    compareAtPrice: Math.floor(Math.random() * 1000) + 1299,
    images: [`/images/products/top-product${index + 1}.jpg`],
    category: 'tops',
    subcategory: 'Blouses', // Example, adjust for variety
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Blue'],
    stock: Math.floor(Math.random() * 50) + 50,
    features: ['Elegant', 'Soft', 'Breathable'],
    status: 'active'
  })),

  // Bottoms Products
  ...Array(50).fill(null).map((_, index) => ({
    name: `Bottoms Product ${index + 1}`,
    description: `These stylish bottoms are perfect for any occasion. Whether it's for casual outings or a night out, they offer a comfortable fit and trendy look.`,
    price: Math.floor(Math.random() * 1000) + 899,
    compareAtPrice: Math.floor(Math.random() * 1000) + 1399,
    images: [`/images/products/bottoms-product${index + 1}.jpg`],
    category: 'bottoms',
    subcategory: 'Jeans', // Example, adjust for variety
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Black', 'Grey'],
    stock: Math.floor(Math.random() * 50) + 40,
    features: ['Comfortable', 'Stylish', 'Durable'],
    status: 'active'
  }))
];

const seedAdmin = {
  name: 'Admin User',
  email: 'admin@mixo.com',
  password: 'Admin123!',
  role: 'admin'
};

async function seedDatabase() {
  let connection: typeof mongoose | undefined;
  
  try {
    // Log MongoDB URI without sensitive info
    const maskedUri = config.mongoUri.replace(/\/\/[^@]+@/, '//***:***@');
    logger.info(`Connecting to MongoDB: ${maskedUri}`);
    
    connection = await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB');

    // Clear existing data
    logger.info('Clearing existing data...');
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({ role: 'admin' })
    ]);
    logger.info('Cleared existing data');

    // Create categories first
    logger.info('Creating categories...');
    const categoryDocs = await Category.insertMany(categories);
    logger.info(`Created ${categoryDocs.length} categories`);

    // Map category slugs to ObjectIds
    const categoryMap = categoryDocs.reduce((acc, cat) => {
      acc[cat.slug] = cat._id;
      return acc;
    }, {} as Record<string, mongoose.Types.ObjectId>);
    logger.info('Category mapping created');

    // Add ObjectId references and slugs to products
    const productsWithRefs = products.map(product => ({
      ...product,
      category: categoryMap[product.category],
      slug: slugify(product.name, { lower: true })
    }));

    // Seed products
    logger.info('Creating products...');
    const createdProducts = await Product.insertMany(productsWithRefs);
    logger.info(`Created ${createdProducts.length} products`);

    // Create admin user
    logger.info('Creating admin user...');
    const admin = await User.create(seedAdmin);
    logger.info(`Created admin user: ${admin.email}`);

    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    // Ensure database connection is closed
    if (connection) {
      await connection.disconnect();
      logger.info('Database connection closed');
    }
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  logger.info('Seeding interrupted');
  await mongoose.disconnect();
  process.exit(0);
});

// Run seeder
seedDatabase().catch(error => {
  logger.error('Fatal error during seeding:', error);
  process.exit(1);
});
