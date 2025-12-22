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
    // Electronics
    {
      name: "Samsung Galaxy S24 Ultra",
      nameBn: "স্যামসাং গ্যালাক্সি এস২৪ আল্ট্রা",
      description: "Latest flagship smartphone with advanced camera and AI features",
      descriptionBn: "সর্বাধুনিক ফ্ল্যাগশিপ স্মার্টফোন উন্নত ক্যামেরা এবং AI ফিচার সহ",
      price: 125000,
      originalPrice: 150000,
      discount: 17,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
      images: [
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
      ],
      category: "Electronics",
      categoryBn: "ইলেকট্রনিক্স",
      inStock: true,
      stock: 50,
      rating: 4.8,
      reviews: 234,
      isFeatured: true,
      isFlashSale: true,
      isTrending: true,
      tags: ["smartphone", "samsung", "flagship"],
    },
    {
      name: "iPhone 15 Pro Max",
      nameBn: "আইফোন ১৫ প্রো ম্যাক্স",
      description: "Apple's latest premium smartphone with titanium design",
      descriptionBn: "অ্যাপলের সর্বাধুনিক প্রিমিয়াম স্মার্টফোন টাইটানিয়াম ডিজাইন সহ",
      price: 145000,
      originalPrice: 160000,
      discount: 9,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
      category: "Electronics",
      categoryBn: "ইলেকট্রনিক্স",
      inStock: true,
      stock: 30,
      rating: 4.9,
      reviews: 189,
      isFeatured: true,
      isFlashSale: false,
      isTrending: true,
      tags: ["smartphone", "apple", "iphone"],
    },
    {
      name: "MacBook Pro 16-inch",
      nameBn: "ম্যাকবুক প্রো ১৬-ইঞ্চি",
      description: "Powerful laptop for professionals with M3 chip",
      descriptionBn: "M3 চিপ সহ পেশাদারদের জন্য শক্তিশালী ল্যাপটপ",
      price: 280000,
      originalPrice: 320000,
      discount: 13,
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
      category: "Electronics",
      categoryBn: "ইলেকট্রনিক্স",
      inStock: true,
      stock: 15,
      rating: 4.7,
      reviews: 95,
      isFeatured: true,
      isFlashSale: true,
      isTrending: false,
      tags: ["laptop", "apple", "macbook"],
    },
    {
      name: "Sony WH-1000XM5 Headphones",
      nameBn: "সনি WH-1000XM5 হেডফোন",
      description: "Premium noise-cancelling wireless headphones",
      descriptionBn: "প্রিমিয়াম নয়েজ-ক্যানসেলিং ওয়্যারলেস হেডফোন",
      price: 35000,
      originalPrice: 40000,
      discount: 13,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      category: "Electronics",
      categoryBn: "ইলেকট্রনিক্স",
      inStock: true,
      stock: 40,
      rating: 4.6,
      reviews: 156,
      isFeatured: false,
      isFlashSale: true,
      isTrending: true,
      tags: ["headphones", "audio", "wireless"],
    },
    // Fashion
    {
      name: "Men's Cotton T-Shirt",
      nameBn: "পুরুষদের সুতি টি-শার্ট",
      description: "Comfortable cotton t-shirt for everyday wear",
      descriptionBn: "দৈনন্দিন পরার জন্য আরামদায়ক সুতি টি-শার্ট",
      price: 899,
      originalPrice: 1299,
      discount: 31,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      category: "Fashion",
      categoryBn: "ফ্যাশন",
      inStock: true,
      stock: 100,
      rating: 4.3,
      reviews: 78,
      isFeatured: false,
      isFlashSale: true,
      isTrending: false,
      tags: ["tshirt", "men", "cotton"],
    },
    {
      name: "Women's Designer Saree",
      nameBn: "মহিলাদের ডিজাইনার শাড়ি",
      description: "Elegant designer saree for special occasions",
      descriptionBn: "বিশেষ অনুষ্ঠানের জন্য মার্জিত ডিজাইনার শাড়ি",
      price: 4500,
      originalPrice: 6500,
      discount: 31,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
      category: "Fashion",
      categoryBn: "ফ্যাশন",
      inStock: true,
      stock: 25,
      rating: 4.5,
      reviews: 42,
      isFeatured: true,
      isFlashSale: false,
      isTrending: true,
      tags: ["saree", "women", "traditional"],
    },
    {
      name: "Leather Jacket",
      nameBn: "লেদার জ্যাকেট",
      description: "Genuine leather jacket for men and women",
      descriptionBn: "পুরুষ ও মহিলাদের জন্য আসল লেদার জ্যাকেট",
      price: 8500,
      originalPrice: 12000,
      discount: 29,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
      category: "Fashion",
      categoryBn: "ফ্যাশন",
      inStock: true,
      stock: 20,
      rating: 4.4,
      reviews: 67,
      isFeatured: false,
      isFlashSale: true,
      isTrending: true,
      tags: ["jacket", "leather", "unisex"],
    },
    {
      name: "Running Shoes",
      nameBn: "রানিং শু",
      description: "Comfortable running shoes for sports and fitness",
      descriptionBn: "খেলাধুলা এবং ফিটনেসের জন্য আরামদায়ক রানিং শু",
      price: 3200,
      originalPrice: 4500,
      discount: 29,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      category: "Fashion",
      categoryBn: "ফ্যাশন",
      inStock: true,
      stock: 60,
      rating: 4.2,
      reviews: 123,
      isFeatured: false,
      isFlashSale: true,
      isTrending: false,
      tags: ["shoes", "sports", "running"],
    },
    // Beauty
    {
      name: "Lakme Face Cream",
      nameBn: "লাকমে ফেস ক্রিম",
      description: "Moisturizing face cream for all skin types",
      descriptionBn: "সব ধরনের ত্বকের জন্য ময়েশ্চারাইজিং ফেস ক্রিম",
      price: 450,
      originalPrice: 600,
      discount: 25,
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500",
      category: "Beauty",
      categoryBn: "বিউটি",
      inStock: true,
      stock: 200,
      rating: 4.1,
      reviews: 89,
      isFeatured: false,
      isFlashSale: true,
      isTrending: false,
      tags: ["skincare", "cream", "lakme"],
    },
    {
      name: "Maybelline Lipstick Set",
      nameBn: "মেবেলিন লিপস্টিক সেট",
      description: "Set of 5 premium lipstick shades",
      descriptionBn: "৫টি প্রিমিয়াম লিপস্টিক শেডের সেট",
      price: 1200,
      originalPrice: 1800,
      discount: 33,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500",
      category: "Beauty",
      categoryBn: "বিউটি",
      inStock: true,
      stock: 80,
      rating: 4.6,
      reviews: 145,
      isFeatured: true,
      isFlashSale: true,
      isTrending: true,
      tags: ["makeup", "lipstick", "maybelline"],
    },
    {
      name: "Garnier Hair Mask",
      nameBn: "গার্নিয়ার হেয়ার মাস্ক",
      description: "Deep conditioning hair mask for damaged hair",
      descriptionBn: "ক্ষতিগ্রস্ত চুলের জন্য গভীর কন্ডিশনিং হেয়ার মাস্ক",
      price: 550,
      originalPrice: 750,
      discount: 27,
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=500",
      category: "Beauty",
      categoryBn: "বিউটি",
      inStock: true,
      stock: 150,
      rating: 4.3,
      reviews: 112,
      isFeatured: false,
      isFlashSale: false,
      isTrending: true,
      tags: ["haircare", "mask", "garnier"],
    },
    {
      name: "Nivea Sunscreen SPF 50",
      nameBn: "নিভিয়া সানস্ক্রিন SPF 50",
      description: "High protection sunscreen for face and body",
      descriptionBn: "মুখ এবং শরীরের জন্য উচ্চ সুরক্ষা সানস্ক্রিন",
      price: 650,
      originalPrice: 850,
      discount: 24,
      image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500",
      category: "Beauty",
      categoryBn: "বিউটি",
      inStock: true,
      stock: 120,
      rating: 4.4,
      reviews: 98,
      isFeatured: true,
      isFlashSale: true,
      isTrending: false,
      tags: ["skincare", "sunscreen", "nivea"],
    },
    // More products for variety
    {
      name: "Canon EOS R6 Camera",
      nameBn: "ক্যানন EOS R6 ক্যামেরা",
      description: "Professional mirrorless camera with 4K video",
      descriptionBn: "4K ভিডিও সহ পেশাদার মিররলেস ক্যামেরা",
      price: 220000,
      originalPrice: 250000,
      discount: 12,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
      category: "Electronics",
      categoryBn: "ইলেকট্রনিক্স",
      inStock: true,
      stock: 10,
      rating: 4.8,
      reviews: 56,
      isFeatured: true,
      isFlashSale: false,
      isTrending: true,
      tags: ["camera", "canon", "photography"],
    },
    {
      name: "PlayStation 5",
      nameBn: "প্লেস্টেশন ৫",
      description: "Latest gaming console with 4K gaming",
      descriptionBn: "4K গেমিং সহ সর্বাধুনিক গেমিং কনসোল",
      price: 65000,
      originalPrice: 75000,
      discount: 13,
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500",
      category: "Electronics",
      categoryBn: "ইলেকট্রনিক্স",
      inStock: true,
      stock: 8,
      rating: 4.9,
      reviews: 234,
      isFeatured: true,
      isFlashSale: true,
      isTrending: true,
      tags: ["gaming", "console", "playstation"],
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