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
        description: "Latest flagship smartphone with advanced camera and AI features",
        price: { amount: 125000, currency: 'BDT' },
        sku: "SG-S24U-001",
        stock: 50,
        images: [
            {
                url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
                alt: "Samsung Galaxy S24 Ultra",
                isPrimary: true,
            },
        ],
        category: "Electronics",
        tags: ["smartphone", "samsung", "flagship"],
        status: "active",
    },
    {
        title: "iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        description: "Apple's latest premium smartphone with titanium design",
        price: { amount: 145000, currency: 'BDT' },
        sku: "IP-15PM-002",
        stock: 30,
        images: [
            {
                url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
                alt: "iPhone 15 Pro Max",
                isPrimary: true,
            },
        ],
        category: "Electronics",
        tags: ["smartphone", "apple", "iphone"],
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
        title: "Men's Cotton T-Shirt",
        slug: "mens-cotton-t-shirt",
        description: "Comfortable cotton t-shirt for everyday wear",
        price: { amount: 899, currency: 'BDT' },
        sku: "MCT-005",
        stock: 100,
        images: [
            {
                url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
                alt: "Men's Cotton T-Shirt",
                isPrimary: true,
            },
        ],
        category: "Clothing",
        tags: ["tshirt", "men", "cotton"],
        status: "active",
    },
    {
        title: "Non-Stick Frying Pan",
        slug: "non-stick-frying-pan",
        description: "Durable non-stick frying pan for healthy cooking.",
        price: { amount: 1800, currency: 'BDT' },
        sku: "HK-FRYPAN-001",
        stock: 60,
        images: [
            {
                url: "https://images.unsplash.com/photo-1566843971842-237cdbeaa75f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
                alt: "Non-Stick Frying Pan",
                isPrimary: true,
            },
        ],
        category: "Home & Kitchen",
        tags: ["cookware", "kitchen", "frying pan"],
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
        await mongoose.connect(process.env.MONGODB_URI);
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
            category: createdCategories.find(cat => cat.name === product.category)._id,
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
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};
// Run seed script
seedDatabase();
//# sourceMappingURL=seed.js.map