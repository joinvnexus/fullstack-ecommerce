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
    title: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    description: "Experience the pinnacle of smartphone innovation with the Samsung Galaxy S24 Ultra. Featuring a stunning 6.8-inch Dynamic AMOLED display, professional-grade camera system with 200MP main sensor, and powered by the latest Snapdragon processor. Built for productivity and creativity with S Pen support, all-day battery life, and premium titanium build quality.",
    price: { amount: 125000, currency: 'BDT' },
    sku: "SG-S24U-001",
    stock: 50,
    variants: [
      {
        name: "Storage",
        options: [
          { name: "256GB", priceAdjustment: 0, skuSuffix: "256" },
          { name: "512GB", priceAdjustment: 15000, skuSuffix: "512" },
          { name: "1TB", priceAdjustment: 35000, skuSuffix: "1TB" },
        ]
      },
      {
        name: "Color",
        options: [
          { name: "Titanium Black", priceAdjustment: 0, skuSuffix: "BLK" },
          { name: "Titanium Gray", priceAdjustment: 0, skuSuffix: "GRY" },
          { name: "Titanium Violet", priceAdjustment: 0, skuSuffix: "VLT" },
          { name: "Titanium Yellow", priceAdjustment: 0, skuSuffix: "YLW" },
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800",
        alt: "Samsung Galaxy S24 Ultra front view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
        alt: "Samsung Galaxy S24 Ultra side view",
        isPrimary: false,
      },
      {
        url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
        alt: "Samsung Galaxy S24 Ultra with S Pen",
        isPrimary: false,
      },
      {
        url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
        alt: "Samsung Galaxy S24 Ultra camera",
        isPrimary: false,
      },
    ],
    category: "Electronics",
    tags: ["smartphone", "samsung", "flagship", "android", "camera"],
    status: "active",
  },
  {
    title: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    description: "Experience the future of smartphone technology with the iPhone 15 Pro Max. Featuring the powerful A17 Pro chip, titanium design that's lighter yet more durable, and the most advanced camera system ever in an iPhone. Capture stunning Pro video in 4K at 120 fps, enjoy all-day battery life, and take advantage of the new Action Button for quick access to your favorite features.",
    price: { amount: 145000, currency: 'BDT' },
    sku: "IP-15PM-002",
    stock: 30,
    variants: [
      {
        name: "Storage",
        options: [
          { name: "256GB", priceAdjustment: 0, skuSuffix: "256" },
          { name: "512GB", priceAdjustment: 20000, skuSuffix: "512" },
          { name: "1TB", priceAdjustment: 40000, skuSuffix: "1TB" },
        ]
      },
      {
        name: "Color",
        options: [
          { name: "Natural Titanium", priceAdjustment: 0, skuSuffix: "NAT" },
          { name: "Blue Titanium", priceAdjustment: 0, skuSuffix: "BLU" },
          { name: "White Titanium", priceAdjustment: 0, skuSuffix: "WHT" },
          { name: "Black Titanium", priceAdjustment: 0, skuSuffix: "BLK" },
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
        alt: "iPhone 15 Pro Max front view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800",
        alt: "iPhone 15 Pro Max side profile",
        isPrimary: false,
      },
      {
        url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
        alt: "iPhone 15 Pro Max camera system",
        isPrimary: false,
      },
      {
        url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
        alt: "iPhone 15 Pro Max titanium design",
        isPrimary: false,
      },
    ],
    category: "Electronics",
    tags: ["smartphone", "apple", "iphone", "ios", "premium"],
    status: "active",
  },
  {
    title: "MacBook Pro 16-inch",
    slug: "macbook-pro-16-inch",
    description: "Powerful laptop for professionals with M3 chip",
    price: { amount: 280000, currency: 'BDT' },
    sku: "MBP-16-003",
    stock: 15,
    images: [
      {
        url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
        alt: "MacBook Pro 16-inch",
        isPrimary: true,
      },
    ],
    category: "Electronics",
    tags: ["laptop", "apple", "macbook"],
    status: "active",
  },
  {
    title: "Sony WH-1000XM5 Headphones",
    slug: "sony-wh-1000xm5-headphones",
    description: "Premium noise-cancelling wireless headphones",
    price: { amount: 35000, currency: 'BDT' },
    sku: "SWH-1000XM5-004",
    stock: 40,
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        alt: "Sony WH-1000XM5 Headphones",
        isPrimary: true,
      },
    ],
    category: "Electronics",
    tags: ["headphones", "audio", "wireless"],
    status: "active",
  },
  {
    title: "Men's Premium Cotton T-Shirt",
    slug: "mens-cotton-t-shirt",
    description: "Elevate your everyday wardrobe with our premium cotton t-shirt. Made from 100% organic cotton that's incredibly soft, breathable, and sustainable. Features a comfortable regular fit, reinforced stitching for durability, and a tagless design for all-day comfort. Perfect for casual wear, layering, or as a base for your favorite outfit.",
    price: { amount: 899, currency: 'BDT' },
    sku: "MCT-005",
    stock: 100,
    variants: [
      {
        name: "Size",
        options: [
          { name: "S", priceAdjustment: 0, skuSuffix: "S" },
          { name: "M", priceAdjustment: 0, skuSuffix: "M" },
          { name: "L", priceAdjustment: 0, skuSuffix: "L" },
          { name: "XL", priceAdjustment: 100, skuSuffix: "XL" },
          { name: "XXL", priceAdjustment: 200, skuSuffix: "XXL" },
        ]
      },
      {
        name: "Color",
        options: [
          { name: "White", priceAdjustment: 0, skuSuffix: "WHT" },
          { name: "Black", priceAdjustment: 0, skuSuffix: "BLK" },
          { name: "Navy Blue", priceAdjustment: 0, skuSuffix: "NVY" },
          { name: "Gray", priceAdjustment: 0, skuSuffix: "GRY" },
          { name: "Red", priceAdjustment: 0, skuSuffix: "RED" },
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        alt: "Men's Premium Cotton T-Shirt front view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
        alt: "Men's Premium Cotton T-Shirt back view",
        isPrimary: false,
      },
      {
        url: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800",
        alt: "Men's Premium Cotton T-Shirt detail view",
        isPrimary: false,
      },
      {
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
        alt: "Men's Premium Cotton T-Shirt texture closeup",
        isPrimary: false,
      },
    ],
    category: "Clothing",
    tags: ["tshirt", "men", "cotton", "organic", "casual"],
    status: "active",
  },
  {
    title: "Professional Non-Stick Frying Pan",
    slug: "non-stick-frying-pan",
    description: "Elevate your cooking experience with our professional-grade non-stick frying pan. Crafted from high-quality aluminum with a revolutionary ceramic non-stick coating that's PFOA-free and safe for healthy cooking. Features an ergonomic stay-cool handle, even heat distribution, and is compatible with all cooktops including induction. Perfect for sautéing, frying, and stir-frying with minimal oil.",
    price: { amount: 1800, currency: 'BDT' },
    sku: "HK-FRYPAN-001",
    stock: 60,
    variants: [
      {
        name: "Size",
        options: [
          { name: "8 inch", priceAdjustment: 0, skuSuffix: "8IN" },
          { name: "10 inch", priceAdjustment: 500, skuSuffix: "10IN" },
          { name: "12 inch", priceAdjustment: 800, skuSuffix: "12IN" },
        ]
      },
      {
        name: "Color",
        options: [
          { name: "Black", priceAdjustment: 0, skuSuffix: "BLK" },
          { name: "Red", priceAdjustment: 0, skuSuffix: "RED" },
          { name: "Blue", priceAdjustment: 0, skuSuffix: "BLU" },
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
        alt: "Professional Non-Stick Frying Pan main view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1566843971842-237cdbeaa75f?w=800",
        alt: "Non-Stick Frying Pan cooking demonstration",
        isPrimary: false,
      },
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        alt: "Non-Stick Frying Pan handle detail",
        isPrimary: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556909020-f6e7ad7d3136?w=800",
        alt: "Non-Stick Frying Pan size comparison",
        isPrimary: false,
      },
    ],
    category: "Home & Kitchen",
    tags: ["cookware", "kitchen", "frying pan", "non-stick", "ceramic"],
    status: "active",
  },
  {
    title: "Electric Kettle",
    slug: "electric-kettle",
    description: "Fast boiling electric kettle with auto shut-off.",
    price: { amount: 2200, currency: 'BDT' },
    sku: "HK-KETTLE-002",
    stock: 40,
    images: [
      {
        url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500",
        alt: "Electric Kettle",
        isPrimary: true,
      },
    ],
    category: "Home & Kitchen",
    tags: ["kettle", "appliance", "kitchen"],
    status: "active",
  },
  {
    title: "The Alchemist",
    slug: "the-alchemist",
    description: "Inspirational novel by Paulo Coelho.",
    price: { amount: 550, currency: 'BDT' },
    sku: "BK-ALCHEMIST-001",
    stock: 80,
    images: [
      {
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
        alt: "The Alchemist Book",
        isPrimary: true,
      },
    ],
    category: "Books",
    tags: ["novel", "inspirational", "book"],
    status: "active",
  },
  {
    title: "Atomic Habits",
    slug: "atomic-habits",
    description: "Best-selling self-help book by James Clear.",
    price: { amount: 650, currency: 'BDT' },
    sku: "BK-ATOMICHABITS-002",
    stock: 70,
    images: [
      {
        url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=500",
        alt: "Atomic Habits Book",
        isPrimary: true,
      },
    ],
    category: "Books",
    tags: ["self-help", "book", "habits"],
    status: "active",
  },
  {
    title: "Football (Size 5)",
    slug: "football-size-5",
    description: "High quality football for outdoor sports.",
    price: { amount: 1200, currency: 'BDT' },
    sku: "SP-FOOTBALL-001",
    stock: 90,
    images: [
      {
        url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500",
        alt: "Football Size 5",
        isPrimary: true,
      },
    ],
    category: "Sports",
    tags: ["football", "sports", "outdoor"],
    status: "active",
  },
  {
    title: "Badminton Racket",
    slug: "badminton-racket",
    description: "Lightweight badminton racket for fast play.",
    price: { amount: 950, currency: 'BDT' },
    sku: "SP-BADMINTON-002",
    stock: 55,
    images: [
      {
        url: "https://images.unsplash.com/photo-1708312604109-16c0be9326cd?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
        alt: "Badminton Racket",
        isPrimary: true,
      },
    ],
    category: "Sports",
    tags: ["badminton", "sports", "racket"],
    status: "active",
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
    const buildMongoURI = () => {
      const user = process.env.MONGODB_USER;
      const pass = process.env.MONGODB_PASS;
      const host = process.env.MONGODB_HOST;
      const db = process.env.MONGODB_DB;
      return `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`;
    };
    await mongoose.connect(buildMongoURI());
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
    const productsWithCategories = products.map((product) => ({
      ...product,
      category: createdCategories.find(cat => cat.name === product.category)!._id,
    }));

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create admin user
    const admin = new User(adminUser);
    await admin.save();
    console.log('✅ Created admin user');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', adminUser.password);

    // Create text index for search
    // await Product.collection.createIndex({
    //   title: 'text',
    //   description: 'text',
    //   tags: 'text',
    //   sku: 'text'
    // });
    console.log('✅ Created text index for search');

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