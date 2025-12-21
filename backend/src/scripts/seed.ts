import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    sortOrder: 1,
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    sortOrder: 2,
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    sortOrder: 3,
  },
  {
    name: 'Books',
    slug: 'books',
    sortOrder: 4,
  },
  {
    name: 'Sports',
    slug: 'sports',
    sortOrder: 5,
  },
];

const products = [
  {
    title: 'Smartphone X Pro',
    slug: 'smartphone-x-pro',
    description: 'Latest flagship smartphone with amazing camera and performance.',
    price: { amount: 999, currency: 'USD' },
    sku: 'SPX-PRO-001',
    stock: 50,
    tags: ['smartphone', 'electronics', 'mobile'],
    status: 'active',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
        alt: 'Smartphone X Pro',
        isPrimary: true,
      },
    ],
  },
  {
    title: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description: 'Noise cancelling wireless headphones with 30-hour battery life.',
    price: { amount: 199, currency: 'USD' },
    sku: 'WH-001',
    stock: 100,
    tags: ['headphones', 'audio', 'wireless'],
    status: 'active',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        alt: 'Wireless Headphones',
        isPrimary: true,
      },
    ],
  },
  {
    title: 'Cotton T-Shirt',
    slug: 'cotton-t-shirt',
    description: '100% cotton t-shirt available in multiple colors.',
    price: { amount: 25, currency: 'USD' },
    sku: 'CT-001',
    stock: 200,
    tags: ['clothing', 't-shirt', 'casual'],
    status: 'active',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        alt: 'Cotton T-Shirt',
        isPrimary: true,
      },
    ],
  },
  {
    title: 'Coffee Maker',
    slug: 'coffee-maker',
    description: 'Automatic coffee maker with programmable settings.',
    price: { amount: 89, currency: 'USD' },
    sku: 'CM-001',
    stock: 75,
    tags: ['home', 'kitchen', 'coffee'],
    status: 'active',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
        alt: 'Coffee Maker',
        isPrimary: true,
      },
    ],
  },
  {
    title: 'JavaScript Book',
    slug: 'javascript-book',
    description: 'Complete guide to modern JavaScript programming.',
    price: { amount: 35, currency: 'USD' },
    sku: 'JS-BOOK-001',
    stock: 150,
    tags: ['books', 'programming', 'javascript'],
    status: 'active',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
        alt: 'JavaScript Book',
        isPrimary: true,
      },
    ],
  },
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin',
  phone: '1234567890',
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({ email: adminUser.email });
    
    console.log('🗑️  Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create products with categories
    const productsWithCategories = products.map((product, index) => ({
      ...product,
      category: createdCategories[index % createdCategories.length]!._id,
    }));

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create admin user
    const admin = new User(adminUser);
    await admin.save();
    console.log('✅ Created admin user');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', adminUser.password);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n🌐 API Endpoints:');
    console.log('   GET    /api/products');
    console.log('   GET    /api/categories');
    console.log('   POST   /api/auth/register');
    console.log('   POST   /api/auth/login');
    console.log('\n🔑 Admin Credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seed script
seedDatabase();