export const productsSeed =  [
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
    categorySlug: "electronics",
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
    categorySlug: "electronics",
    tags: ["smartphone", "apple", "iphone", "ios", "premium"],
    status: "active",
  },
  {
    title: "MacBook Pro 16-inch",
    slug: "macbook-pro-16-inch",
    description: "Powerful laptop for professionals with M3 chip, featuring stunning Liquid Retina XDR display, up to 22 hours of battery life, and advanced thermal system for sustained performance. Perfect for video editing, 3D rendering, and software development.",
    price: { amount: 280000, currency: 'BDT' },
    sku: "MBP-16-003",
    stock: 15,
    variants: [
      {
        name: "Storage",
        options: [
          { name: "512GB", priceAdjustment: 0, skuSuffix: "512" },
          { name: "1TB", priceAdjustment: 40000, skuSuffix: "1TB" },
          { name: "2TB", priceAdjustment: 80000, skuSuffix: "2TB" },
        ]
      },
      {
        name: "Color",
        options: [
          { name: "Space Gray", priceAdjustment: 0, skuSuffix: "SGRY" },
          { name: "Silver", priceAdjustment: 0, skuSuffix: "SLVR" },
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w-800",
        alt: "MacBook Pro 16-inch front view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w-800",
        alt: "MacBook Pro 16-inch keyboard",
        isPrimary: false,
      },
      {
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w-800",
        alt: "MacBook Pro 16-inch display",
        isPrimary: false,
      },
    ],
    categorySlug: "electronics",
    tags: ["laptop", "apple", "macbook", "pro", "premium"],
    status: "active",
  },
  {
    title: "Sony WH-1000XM5 Headphones",
    slug: "sony-wh-1000xm5-headphones",
    description: "Premium noise-cancelling wireless headphones with industry-leading noise cancellation, 30-hour battery life, and exceptional sound quality. Features crystal clear hands-free calling and multipoint connection for seamless switching between devices.",
    price: { amount: 35000, currency: 'BDT' },
    sku: "SWH-1000XM5-004",
    stock: 40,
    variants: [
      {
        name: "Color",
        options: [
          { name: "Black", priceAdjustment: 0, skuSuffix: "BLK" },
          { name: "Silver", priceAdjustment: 0, skuSuffix: "SLVR" },
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        alt: "Sony WH-1000XM5 Headphones front view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
        alt: "Sony WH-1000XM5 Headphones side view",
        isPrimary: false,
      },
      {
        url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
        alt: "Sony WH-1000XM5 Headphones in use",
        isPrimary: false,
      },
    ],
    categorySlug: "electronics",
    tags: ["headphones", "audio", "wireless", "noise-cancelling", "sony"],
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
    categorySlug: "clothing",
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
    categorySlug: "home-kitchen",
    tags: ["cookware", "kitchen", "frying pan", "non-stick", "ceramic"],
    status: "active",
  },
  // Home & Kitchen
  {
    title: "Electric Kettle",
    slug: "electric-kettle",
    description: "Fast boiling electric kettle with auto shut-off and boil-dry protection. Features 1.7L capacity, 360° swivel base, cordless serving, and concealed heating element for easy cleaning. Perfect for making tea, coffee, or instant noodles.",
    price: { amount: 2200, currency: 'BDT' },
    sku: "HK-KETTLE-002",
    stock: 40,
    variants: [
      {
        name: "Capacity",
        options: [
          { name: "1.5L", priceAdjustment: 0, skuSuffix: "15L" },
          { name: "1.7L", priceAdjustment: 200, skuSuffix: "17L" },
        ]
      },
      {
        name: "Color",
        options: [
          { name: "Stainless Steel", priceAdjustment: 0, skuSuffix: "SS" },
          { name: "White", priceAdjustment: 0, skuSuffix: "WHT" },
          { name: "Black", priceAdjustment: 0, skuSuffix: "BLK" },
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
        alt: "Electric Kettle main view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1582167371270-68a4c033c5e6?w=800",
        alt: "Electric Kettle pouring water",
        isPrimary: false,
      },
      {
        url: "https://images.unsplash.com/photo-1603471567917-66e19b2e2b89?w=800",
        alt: "Electric Kettle different colors",
        isPrimary: false,
      },
    ],
    categorySlug: "home-kitchen",
    tags: ["kettle", "appliance", "kitchen", "electric", "boiling"],
    status: "active",
  },
  // Books
  {
    title: "The Alchemist",
    slug: "the-alchemist",
    description: "Inspirational novel by Paulo Coelho that tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined.",
    price: { amount: 550, currency: 'BDT' },
    sku: "BK-ALCHEMIST-001",
    stock: 80,
    variants: [
      {
        name: "Format",
        options: [
          { name: "Paperback", priceAdjustment: 0, skuSuffix: "PB" },
          { name: "Hardcover", priceAdjustment: 200, skuSuffix: "HC" },
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
        alt: "The Alchemist Book cover",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
        alt: "The Alchemist reading view",
        isPrimary: false,
      },
    ],
    categorySlug: "books",
    tags: ["novel", "inspirational", "book", "fiction", "paulo coelho"],
    status: "active",
  },
  // Books
  {
    title: "Atomic Habits",
    slug: "atomic-habits",
    description: "Best-selling self-help book by James Clear that reveals practical strategies to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results. Learn how to make time for new habits, overcome lack of motivation, and design your environment for success.",
    price: { amount: 650, currency: 'BDT' },
    sku: "BK-ATOMICHABITS-002",
    stock: 70,
    variants: [
      {
        name: "Format",
        options: [
          { name: "Paperback", priceAdjustment: 0, skuSuffix: "PB" },
          { name: "Hardcover", priceAdjustment: 250, skuSuffix: "HC" },
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800",
        alt: "Atomic Habits Book cover",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800",
        alt: "Atomic Habits open book",
        isPrimary: false,
      },
    ],
    categorySlug: "books",
    tags: ["self-help", "book", "habits", "productivity", "james clear"],
    status: "active",
  },
  // Sports
  {
    title: "Football (Size 5)",
    slug: "football-size-5",
    description: "High quality football for outdoor sports with FIFA approved quality, durable synthetic leather, and butyl bladder for better air retention. Perfect for matches, training, or casual play. Suitable for all weather conditions.",
    price: { amount: 1200, currency: 'BDT' },
    sku: "SP-FOOTBALL-001",
    stock: 90,
    variants: [
      {
        name: "Type",
        options: [
          { name: "Training", priceAdjustment: 0, skuSuffix: "TRN" },
          { name: "Match", priceAdjustment: 500, skuSuffix: "MAT" },
        ]
      },
      {
        name: "Design",
        options: [
          { name: "Classic White/Black", priceAdjustment: 0, skuSuffix: "CB" },
          { name: "Colorful", priceAdjustment: 100, skuSuffix: "COL" },
          { name: "Team Pattern", priceAdjustment: 200, skuSuffix: "TP" },
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
        alt: "Football Size 5 main view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
        alt: "Football in action",
        isPrimary: false,
      },
    ],
    categorySlug: "sports",
    tags: ["football", "sports", "outdoor", "soccer", "ball"],
    status: "active",
  },
  // Sports
  {
    title: "Badminton Racket",
    slug: "badminton-racket",
    description: "Lightweight badminton racket for fast play with carbon fiber frame, isometric head shape for larger sweet spot, and flexible shaft for better control. Suitable for both beginners and intermediate players.",
    price: { amount: 950, currency: 'BDT' },
    sku: "SP-BADMINTON-002",
    stock: 55,
    variants: [
      {
        name: "Weight",
        options: [
          { name: "Light (80-84g)", priceAdjustment: 0, skuSuffix: "L" },
          { name: "Medium (85-89g)", priceAdjustment: 50, skuSuffix: "M" },
          { name: "Heavy (90-94g)", priceAdjustment: 100, skuSuffix: "H" },
        ]
      },
      {
        name: "Grip Size",
        options: [
          { name: "G2", priceAdjustment: 0, skuSuffix: "G2" },
          { name: "G3", priceAdjustment: 0, skuSuffix: "G3" },
          { name: "G4", priceAdjustment: 0, skuSuffix: "G4" },
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1708312604109-16c0be9326cd?w=800",
        alt: "Badminton Racket main view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1621844407865-bdc426b43b5b?w=800",
        alt: "Badminton Racket in action",
        isPrimary: false,
      },
    ],
    categorySlug: "sports",
    tags: ["badminton", "sports", "racket", "outdoor", "indoor"],
    status: "active",
  },
  // Electronics
  {
    title: "HP Pavilion 15 Laptop",
    slug: "hp-pavilion-15-laptop",
    description: "Powerful everyday laptop with Intel Core i5 processor, 8GB RAM, 512GB SSD, and 15.6-inch Full HD display. Perfect for work, study, and entertainment with long battery life and lightweight design.",
    price: { amount: 65000, currency: 'BDT' },
    sku: "LAP-HP-PAV-013",
    stock: 25,
    variants: [
      {
        name: "RAM",
        options: [
          { name: "8GB", priceAdjustment: 0, skuSuffix: "8G" },
          { name: "16GB", priceAdjustment: 8000, skuSuffix: "16G" }
        ]
      },
      {
        name: "Color",
        options: [
          { name: "Silver", priceAdjustment: 0, skuSuffix: "SIL" },
          { name: "Dark Ash", priceAdjustment: 0, skuSuffix: "ASH" }
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
        alt: "HP Pavilion Laptop front view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
        alt: "HP Pavilion Laptop keyboard",
        isPrimary: false,
      }
    ],
    categorySlug: "electronics",
    tags: ["laptop", "hp", "windows", "student", "work"],
    status: "active",
  },
  // Clothing
  {
    title: "Cotton Saree",
    slug: "cotton-saree",
    description: "Traditional handloom cotton saree with beautiful border design. Made from 100% pure cotton, comfortable for all-day wear, perfect for casual and semi-formal occasions.",
    price: { amount: 2500, currency: 'BDT' },
    sku: "CL-SAREE-014",
    stock: 45,
    variants: [
      {
        name: "Color",
        options: [
          { name: "Red", priceAdjustment: 0, skuSuffix: "RED" },
          { name: "Blue", priceAdjustment: 0, skuSuffix: "BLU" },
          { name: "Green", priceAdjustment: 0, skuSuffix: "GRN" },
          { name: "Yellow", priceAdjustment: 0, skuSuffix: "YEL" }
        ]
      },
      {
        name: "Border",
        options: [
          { name: "Simple", priceAdjustment: 0, skuSuffix: "SMP" },
          { name: "Zari", priceAdjustment: 500, skuSuffix: "ZRI" },
          { name: "Embroidered", priceAdjustment: 800, skuSuffix: "EMB" }
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
        alt: "Cotton Saree display",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
        alt: "Cotton Saree detail",
        isPrimary: false,
      }
    ],
    categorySlug: "clothing",
    tags: ["saree", "traditional", "cotton", "women", "ethnic"],
    status: "active",
  },
  // Home & Kitchen
  {
    title: "Ceramic Dinner Set",
    slug: "ceramic-dinner-set",
    description: "Elegant 24-piece ceramic dinner set for 6 persons. Microwave and dishwasher safe, lead-free glaze, beautiful contemporary design perfect for daily use and special occasions.",
    price: { amount: 4500, currency: 'BDT' },
    sku: "HK-DINNER-015",
    stock: 30,
    variants: [
      {
        name: "Set Type",
        options: [
          { name: "24 Pieces", priceAdjustment: 0, skuSuffix: "24P" },
          { name: "32 Pieces", priceAdjustment: 2000, skuSuffix: "32P" }
        ]
      },
      {
        name: "Color",
        options: [
          { name: "White", priceAdjustment: 0, skuSuffix: "WHT" },
          { name: "Cream", priceAdjustment: 0, skuSuffix: "CRM" },
          { name: "Blue Pattern", priceAdjustment: 500, skuSuffix: "BLP" }
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
        alt: "Ceramic Dinner Set full view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1566843971842-237cdbeaa75f?w=800",
        alt: "Dinner Set individual pieces",
        isPrimary: false,
      }
    ],
    categorySlug: "home-kitchen",
    tags: ["dinner set", "ceramic", "kitchen", "tableware", "home"],
    status: "active",
  },
  // Books
  {
    title: "Harry Potter Complete Collection",
    slug: "harry-potter-complete-collection",
    description: "Complete 7-book Harry Potter series by J.K. Rowling in a beautiful box set. Follow Harry's journey from the cupboard under the stairs to the final battle with Lord Voldemort.",
    price: { amount: 3500, currency: 'BDT' },
    sku: "BK-HP-016",
    stock: 20,
    variants: [
      {
        name: "Edition",
        options: [
          { name: "Paperback", priceAdjustment: 0, skuSuffix: "PB" },
          { name: "Hardcover", priceAdjustment: 1500, skuSuffix: "HC" }
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800",
        alt: "Harry Potter book collection",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
        alt: "Harry Potter books open",
        isPrimary: false,
      }
    ],
    categorySlug: "books",
    tags: ["fiction", "fantasy", "harry potter", "collection", "novel"],
    status: "active",
  },
  // Sports
  {
    title: "Cricket Bat",
    slug: "cricket-bat",
    description: "Professional grade English willow cricket bat, perfect for club level players. Features premium willow, perfect balance, and ready-to-play finish with rubber grip.",
    price: { amount: 3500, currency: 'BDT' },
    sku: "SP-CRICKET-017",
    stock: 35,
    variants: [
      {
        name: "Size",
        options: [
          { name: "Short Handle", priceAdjustment: 0, skuSuffix: "SH" },
          { name: "Long Handle", priceAdjustment: 500, skuSuffix: "LH" }
        ]
      },
      {
        name: "Grade",
        options: [
          { name: "Grade 2", priceAdjustment: 0, skuSuffix: "G2" },
          { name: "Grade 1", priceAdjustment: 2000, skuSuffix: "G1" }
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800",
        alt: "Cricket Bat front view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
        alt: "Cricket Bat in action",
        isPrimary: false,
      }
    ],
    categorySlug: "sports",
    tags: ["cricket", "sports", "bat", "outdoor", "cricket gear"],
    status: "active",
  },
  // Electronics
  {
    title: "Wireless Gaming Mouse",
    slug: "wireless-gaming-mouse",
    description: "High-precision wireless gaming mouse with RGB lighting, 16000 DPI, 6 programmable buttons, and 50-hour battery life. Perfect for gaming and productivity.",
    price: { amount: 2200, currency: 'BDT' },
    sku: "EL-GMOUSE-018",
    stock: 60,
    variants: [
      {
        name: "DPI",
        options: [
          { name: "12000 DPI", priceAdjustment: 0, skuSuffix: "12K" },
          { name: "16000 DPI", priceAdjustment: 300, skuSuffix: "16K" }
        ]
      },
      {
        name: "Color",
        options: [
          { name: "Black", priceAdjustment: 0, skuSuffix: "BLK" },
          { name: "White", priceAdjustment: 0, skuSuffix: "WHT" },
          { name: "RGB", priceAdjustment: 200, skuSuffix: "RGB" }
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
        alt: "Gaming Mouse top view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800",
        alt: "Gaming Mouse in use",
        isPrimary: false,
      }
    ],
    categorySlug: "electronics",
    tags: ["mouse", "gaming", "wireless", "computer", "accessories"],
    status: "active",
  },
  // Clothing
  {
    title: "Denim Jacket",
    slug: "denim-jacket",
    description: "Classic denim jacket for men, made from premium cotton denim. Features front button closure, chest pockets, and comfortable fit. Perfect for casual outings and layering.",
    price: { amount: 2800, currency: 'BDT' },
    sku: "CL-DJACKET-019",
    stock: 40,
    variants: [
      {
        name: "Size",
        options: [
          { name: "S", priceAdjustment: 0, skuSuffix: "S" },
          { name: "M", priceAdjustment: 0, skuSuffix: "M" },
          { name: "L", priceAdjustment: 0, skuSuffix: "L" },
          { name: "XL", priceAdjustment: 100, skuSuffix: "XL" }
        ]
      },
      {
        name: "Wash",
        options: [
          { name: "Light Blue", priceAdjustment: 0, skuSuffix: "LB" },
          { name: "Dark Blue", priceAdjustment: 0, skuSuffix: "DB" },
          { name: "Black", priceAdjustment: 200, skuSuffix: "BLK" }
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
        alt: "Denim Jacket front view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1502163140606-888448ae8cfe?w=800",
        alt: "Denim Jacket back view",
        isPrimary: false,
      }
    ],
    categorySlug: "clothing",
    tags: ["jacket", "denim", "men", "casual", "outerwear"],
    status: "active",
  },
  // Home & Kitchen
  {
    title: "Blender with Grinder",
    slug: "blender-with-grinder",
    description: "Multi-function blender with 2L glass jar and dry grinder attachment. 500W motor, 3-speed control, pulse function, and stainless steel blades. Perfect for making juices, smoothies, and grinding spices.",
    price: { amount: 3200, currency: 'BDT' },
    sku: "HK-BLENDER-020",
    stock: 25,
    variants: [
      {
        name: "Jar Material",
        options: [
          { name: "Glass", priceAdjustment: 0, skuSuffix: "GL" },
          { name: "Plastic", priceAdjustment: -300, skuSuffix: "PL" }
        ]
      },
      {
        name: "Color",
        options: [
          { name: "Black", priceAdjustment: 0, skuSuffix: "BLK" },
          { name: "Silver", priceAdjustment: 0, skuSuffix: "SIL" },
          { name: "Red", priceAdjustment: 0, skuSuffix: "RED" }
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
        alt: "Blender main view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1566843971842-237cdbeaa75f?w=800",
        alt: "Blender in use",
        isPrimary: false,
      }
    ],
    categorySlug: "home-kitchen",
    tags: ["blender", "grinder", "kitchen", "appliance", "juicer"],
    status: "active",
  },
  // Sports
  {
    title: "Basketball",
    slug: "basketball",
    description: "Official size 7 basketball with durable rubber construction, deep channel design for better grip, and ideal bounce for indoor and outdoor courts.",
    price: { amount: 1500, currency: 'BDT' },
    sku: "SP-BASKET-021",
    stock: 50,
    variants: [
      {
        name: "Size",
        options: [
          { name: "Size 6 (Women)", priceAdjustment: 0, skuSuffix: "S6" },
          { name: "Size 7 (Men)", priceAdjustment: 200, skuSuffix: "S7" }
        ]
      },
      {
        name: "Type",
        options: [
          { name: "Outdoor", priceAdjustment: 0, skuSuffix: "OUT" },
          { name: "Indoor/Outdoor", priceAdjustment: 300, skuSuffix: "INOUT" }
        ]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
        alt: "Basketball main view",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1519861531473-920034658307?w=800",
        alt: "Basketball in action",
        isPrimary: false,
      }
    ],
    categorySlug: "sports",
    tags: ["basketball", "sports", "ball", "outdoor", "indoor"],
    status: "active",
  }
];