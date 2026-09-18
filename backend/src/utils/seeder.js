const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Address = require('../models/Address');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();

    if (userCount > 0 && productCount > 0 && categoryCount > 0) {
      console.log('[Seeder] Database already contains data. Skipping initial seeding.');
      return;
    }

    console.log('[Seeder] Initializing fresh grocery dataset...');

    // 1. Seed Categories
    const categoriesData = [
      {
        name: 'Fresh Vegetables',
        description: 'Farm-fresh organic vegetables, greens, and root veggies',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'Fresh Fruits',
        description: 'Juicy, ripe, seasonal and exotic fruits',
        image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'Dairy & Eggs',
        description: 'Pure milk, cheese, butter, yogurt, and farm eggs',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'Bakery & Bread',
        description: 'Artisan sourdough, whole wheat bread, cookies, and pastries',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'Beverages & Juices',
        description: 'Cold pressed juices, organic teas, artisanal coffee, and sodas',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'Snacks & Munchies',
        description: 'Crisps, roasted nuts, dried fruits, energy bars, and chocolates',
        image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'Pantry & Staples',
        description: 'Basmati rice, whole grains, pulses, cold pressed oils, and spices',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
    ];

    if (categoryCount === 0) {
      await Category.deleteMany();
      await Category.insertMany(categoriesData);
      console.log('[Seeder] Categories seeded successfully.');
    }

    // 2. Seed Default Accounts
    let adminUser, customerUser;
    if (userCount === 0) {
      adminUser = await User.create({
        name: 'FreshCart Admin',
        email: 'admin@grocery.com',
        password: 'Admin@123',
        phone: '+91 9876543210',
        role: 'admin',
      });

      customerUser = await User.create({
        name: 'Prem Kumar',
        email: 'user@grocery.com',
        password: 'User@123',
        phone: '+91 9876543211',
        role: 'customer',
      });

      // Default Address for customer
      const defaultAddress = await Address.create({
        user: customerUser._id,
        fullName: 'Prem Kumar',
        phone: '+91 9876543211',
        addressLine: 'Flat 402, Green Meadows Residency, Outer Ring Road',
        city: 'Hyderabad',
        state: 'Telangana',
        postalCode: '500081',
        country: 'India',
        isDefault: true,
      });

      customerUser.addresses.push(defaultAddress._id);
      await customerUser.save();

      console.log('[Seeder] Default Admin & Customer users seeded.');
    }

    // 3. Seed Products
    if (productCount === 0) {
      const productsData = [
        // Vegetables
        {
          name: 'Fresh Organic Spinach (Palak)',
          description: 'Tender, nutrient-rich green spinach leaves sourced directly from local organic farms.',
          price: 45,
          discountPrice: 35,
          category: 'Fresh Vegetables',
          brand: 'GreenValley Organics',
          image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
          stock: 50,
          unit: '250 g bunch',
          rating: 4.8,
          isActive: true,
        },
        {
          name: 'Fresh Red Vine Tomatoes',
          description: 'Firm, juicy, sun-ripened red tomatoes perfect for rich curries, salads, and pasta sauces.',
          price: 40,
          discountPrice: 32,
          category: 'Fresh Vegetables',
          brand: 'FarmDirect',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
          stock: 80,
          unit: '1 kg',
          rating: 4.6,
          isActive: true,
        },
        {
          name: 'Farm Fresh Broccoli',
          description: 'Crisp, bright green nutrient-packed broccoli florets packed with antioxidants and vitamins.',
          price: 90,
          discountPrice: 75,
          category: 'Fresh Vegetables',
          brand: 'NatureHarvest',
          image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80',
          stock: 40,
          unit: '500 g',
          rating: 4.7,
          isActive: true,
        },
        {
          name: 'Red Bell Peppers (Capsicum)',
          description: 'Sweet, vibrant red bell peppers loaded with vitamin C. Ideal for stir-fries and fajitas.',
          price: 120,
          discountPrice: 99,
          category: 'Fresh Vegetables',
          brand: 'FarmDirect',
          image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
          stock: 35,
          unit: '500 g (2 pcs)',
          rating: 4.5,
          isActive: true,
        },
        // Fruits
        {
          name: 'Kashmiri Royal Gala Apples',
          description: 'Crisp, sweet, and aromatic premium apples handpicked from Himalayan orchards.',
          price: 180,
          discountPrice: 150,
          category: 'Fresh Fruits',
          brand: 'Himalayan Orchard',
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
          stock: 60,
          unit: '1 kg (approx 4-5 pcs)',
          rating: 4.9,
          isActive: true,
        },
        {
          name: 'Robusta Golden Bananas',
          description: 'Naturally ripened, sweet bananas rich in potassium and energy.',
          price: 55,
          discountPrice: 45,
          category: 'Fresh Fruits',
          brand: 'FarmDirect',
          image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
          stock: 90,
          unit: '1 kg (approx 6-7 pcs)',
          rating: 4.7,
          isActive: true,
        },
        {
          name: 'Alphonso Mangoes (Ratnagiri)',
          description: 'The King of Mangoes! Distinctively sweet, fragrant, and rich golden pulp.',
          price: 499,
          discountPrice: 399,
          category: 'Fresh Fruits',
          brand: 'Ratnagiri Gold',
          image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
          stock: 25,
          unit: '1 Dozen (12 pcs)',
          rating: 5.0,
          isActive: true,
        },
        {
          name: 'Sweet Seedless Green Grapes',
          description: 'Plump, crisp, and refreshing green grapes packed in protective punnets.',
          price: 110,
          discountPrice: 89,
          category: 'Fresh Fruits',
          brand: 'FreshValley',
          image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
          stock: 45,
          unit: '500 g box',
          rating: 4.6,
          isActive: true,
        },
        // Dairy & Eggs
        {
          name: 'Farm Fresh Organic Whole Milk',
          description: 'Pasteurized, unadulterated pure full-cream cow milk with rich taste and essential nutrients.',
          price: 70,
          discountPrice: 64,
          category: 'Dairy & Eggs',
          brand: 'PureFarm Dairy',
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
          stock: 70,
          unit: '1 Litre Pouch',
          rating: 4.8,
          isActive: true,
        },
        {
          name: 'Fresh Malai Paneer (Cottage Cheese)',
          description: 'Soft, melt-in-the-mouth artisanal paneer prepared with full-cream milk.',
          price: 130,
          discountPrice: 115,
          category: 'Dairy & Eggs',
          brand: 'PureFarm Dairy',
          image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
          stock: 35,
          unit: '200 g block',
          rating: 4.9,
          isActive: true,
        },
        {
          name: 'Free Range Brown Farm Eggs',
          description: 'High-protein farm fresh brown eggs with rich golden yolks from free-range grain-fed hens.',
          price: 95,
          discountPrice: 85,
          category: 'Dairy & Eggs',
          brand: 'GoldenYolk Farms',
          image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
          stock: 60,
          unit: 'Pack of 6',
          rating: 4.8,
          isActive: true,
        },
        {
          name: 'Greek Style Plain Yogurt',
          description: 'Thick, creamy, naturally strained probiotic yogurt with zero added preservatives.',
          price: 85,
          discountPrice: 75,
          category: 'Dairy & Eggs',
          brand: 'Epigamia Nature',
          image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
          stock: 40,
          unit: '400 g tub',
          rating: 4.7,
          isActive: true,
        },
        // Bakery
        {
          name: 'Artisan Whole Wheat Sourdough Bread',
          description: 'Slow-fermented artisan sourdough with a crisp crust and airy, soft crumb.',
          price: 120,
          discountPrice: 105,
          category: 'Bakery & Bread',
          brand: 'The Daily Bakery',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
          stock: 30,
          unit: '400 g loaf',
          rating: 4.9,
          isActive: true,
        },
        {
          name: 'French Butter Croissants',
          description: 'Flaky, buttery, golden crescent pastries baked using European recipe.',
          price: 150,
          discountPrice: 130,
          category: 'Bakery & Bread',
          brand: 'The Daily Bakery',
          image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
          stock: 25,
          unit: 'Pack of 2',
          rating: 4.8,
          isActive: true,
        },
        // Beverages
        {
          name: 'Cold Pressed Valencia Orange Juice',
          description: '100% pure raw orange juice with natural pulp and no added sugars or preservatives.',
          price: 140,
          discountPrice: 120,
          category: 'Beverages & Juices',
          brand: 'RawPressed',
          image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
          stock: 40,
          unit: '500 ml bottle',
          rating: 4.7,
          isActive: true,
        },
        {
          name: 'Organic Green Tea (Darjeeling Whole Leaf)',
          description: 'Delicate, fragrant green tea leaves rich in polyphenols and antioxidants.',
          price: 240,
          discountPrice: 199,
          category: 'Beverages & Juices',
          brand: 'Darjeeling Estates',
          image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
          stock: 50,
          unit: '100 g tin',
          rating: 4.8,
          isActive: true,
        },
        // Snacks
        {
          name: 'Roasted & Salted California Almonds',
          description: 'Crunchy premium California almonds gently roasted and seasoned with pink Himalayan salt.',
          price: 290,
          discountPrice: 249,
          category: 'Snacks & Munchies',
          brand: 'NutriBites',
          image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
          stock: 50,
          unit: '200 g pouch',
          rating: 4.9,
          isActive: true,
        },
        {
          name: 'Handcrafted Dark Chocolate 70%',
          description: 'Single-origin craft dark chocolate made with organic cacao beans and coconut sugar.',
          price: 195,
          discountPrice: 165,
          category: 'Snacks & Munchies',
          brand: 'Artisan Cacao',
          image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
          stock: 45,
          unit: '80 g bar',
          rating: 4.9,
          isActive: true,
        },
        // Pantry & Staples
        {
          name: 'Royal Aged Basmati Rice',
          description: 'Extra long grain aromatic aged basmati rice with exquisite aroma and fluffiness.',
          price: 220,
          discountPrice: 185,
          category: 'Pantry & Staples',
          brand: 'Royal Heritage',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
          stock: 80,
          unit: '1 kg pack',
          rating: 4.8,
          isActive: true,
        },
        {
          name: 'Wood Pressed Mustard Oil (Kachi Ghani)',
          description: 'Pure cold pressed unrefined mustard oil with robust aroma and authentic pungency.',
          price: 260,
          discountPrice: 219,
          category: 'Pantry & Staples',
          brand: 'VedicOils',
          image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
          stock: 55,
          unit: '1 Litre Bottle',
          rating: 4.7,
          isActive: true,
        },
      ];

      await Product.insertMany(productsData);
      console.log(`[Seeder] Seeded ${productsData.length} grocery products successfully.`);
    }

    console.log('[Seeder] Seeding process finished successfully.');
  } catch (err) {
    console.error('[Seeder] Error seeding data:', err.message);
  }
};

module.exports = seedData;
