import 'dotenv/config';
import mongoose from 'mongoose';

import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

import { categoriesSeed } from './data/categories.seed.js';
import { productsSeed } from './data/products.seed.js';
import { seedConfig } from './seed.config.js';

// ------------------ helpers ------------------

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('✅ MongoDB connected');
};

// ------------------ seeders ------------------

const seedCategories = async (mode: 'reset' | 'update') => {
  if (mode === 'reset') {
    await Category.deleteMany({});
  }

  for (const cat of categoriesSeed) {
    await Category.updateOne(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true }
    );
  }
  const categories = await Category.find();
  const map = new Map(categories.map(c => [c.slug, c._id]));

  console.log(`✅ Categories ${mode}ed`);
  return map;
};

const seedProducts = async (
  categoryMap: Map<string, any>,
  mode: 'reset' | 'update'
) => {
  if (mode === 'reset') {
    await Product.deleteMany({});
  }

  for (const product of productsSeed) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(`Category not found: ${product.categorySlug}`);
    }

    await Product.updateOne(
      { slug: product.slug },
      {
        $set: {
          ...product,
          category: categoryId,
        },
      },
      { upsert: true }
    );
  }

  console.log(`✅ Products ${mode}ed`);
};

// ------------------ runner ------------------

const runSeed = async () => {
  try {
    await connectDB();

    const { mode, target } = seedConfig;

    console.log(`🌱 Seed mode: ${mode}`);
    console.log(`🎯 Seed target: ${target}`);

    let categoryMap: Map<string, any> | undefined;

    if (target === 'all' || target === 'categories') {
      categoryMap = await seedCategories(mode);
    }

    if (target === 'all' || target === 'products') {
      if (!categoryMap) {
        categoryMap = await seedCategories('update');
      }
      await seedProducts(categoryMap, mode);
    }

    console.log('🎉 Seeding completed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed', err);
    process.exit(1);
  }
};



runSeed();
