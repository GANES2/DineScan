const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderStatusLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data...');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await prisma.user.createMany({
    data: [
      { name: 'Admin User', email: 'admin@dinescan.com', password: hashedPassword, role: 'ADMIN' },
      { name: 'Cashier User', email: 'cashier@dinescan.com', password: hashedPassword, role: 'CASHIER' },
      { name: 'Kitchen Staff', email: 'kitchen@dinescan.com', password: hashedPassword, role: 'KITCHEN' },
    ],
  });

  console.log('Users created...');

  // Create Tables
  const tablesData = [
    { tableNumber: 'TBL-001', qrCode: 'http://172.20.10.2:5173/table/TBL-001', status: 'AVAILABLE' },
    { tableNumber: 'TBL-002', qrCode: 'http://172.20.10.2:5173/table/TBL-002', status: 'AVAILABLE' },
    { tableNumber: 'TBL-003', qrCode: 'http://172.20.10.2:5173/table/TBL-003', status: 'AVAILABLE' },
    { tableNumber: 'TBL-004', qrCode: 'http://172.20.10.2:5173/table/TBL-004', status: 'AVAILABLE' },
    { tableNumber: 'TBL-005', qrCode: 'http://172.20.10.2:5173/table/TBL-005', status: 'AVAILABLE' },
  ];

  for (const table of tablesData) {
    await prisma.table.create({
      data: table,
    });
  }

  console.log('Tables created...');

  // Create Categories
  const categories = [
    { name: 'Food', slug: 'food' },
    { name: 'Drink', slug: 'drink' },
    { name: 'Dessert', slug: 'dessert' },
    { name: 'Promo', slug: 'promo' },
  ];

  for (const cat of categories) {
    await prisma.category.create({
      data: cat,
    });
  }

  console.log('Categories created...');

  const foodCat = await prisma.category.findUnique({ where: { slug: 'food' } });
  const drinkCat = await prisma.category.findUnique({ where: { slug: 'drink' } });
  const dessertCat = await prisma.category.findUnique({ where: { slug: 'dessert' } });

  // Create Menus
  const menus = [
    { name: 'Nasi Goreng Special', description: 'Traditional Indonesian fried rice with egg and chicken.', price: 35000, categoryId: foodCat.id, image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff6675?w=500&auto=format' },
    { name: 'Mie Ayam Jamur', description: 'Chicken noodles with savory mushrooms.', price: 28000, categoryId: foodCat.id, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format' },
    { name: 'Sate Ayam', description: '10 sticks of grilled chicken skewers with peanut sauce.', price: 30000, categoryId: foodCat.id, image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=500&auto=format' },
    { name: 'Ayam Bakar Madu', description: 'Honey glazed grilled chicken.', price: 42000, categoryId: foodCat.id, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format' },
    
    { name: 'Ice Lychee Tea', description: 'Refreshing tea with real lychee fruit.', price: 18000, categoryId: drinkCat.id, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format' },
    { name: 'Es Kopi Susu', description: 'Palm sugar iced coffee with milk.', price: 22000, categoryId: drinkCat.id, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format' },
    { name: 'Orange Juice', description: 'Freshly squeezed orange juice.', price: 15000, categoryId: drinkCat.id, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format' },
    { name: 'Matcha Latte', description: 'Premium Japanese matcha with milk.', price: 25000, categoryId: drinkCat.id, image: 'https://images.unsplash.com/photo-1536496047847-663887414571?w=500&auto=format' },

    { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with melting center.', price: 28000, categoryId: dessertCat.id, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&auto=format' },
    { name: 'Banana Split', description: 'Classic banana split with 3 scoops of ice cream.', price: 32000, categoryId: dessertCat.id, image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=500&auto=format' },
    { name: 'Mango Sticky Rice', description: 'Thai style sticky rice with sweet mango.', price: 25000, categoryId: dessertCat.id, image: 'https://images.unsplash.com/photo-1618258284687-ec14e5f76264?w=500&auto=format' },
    { name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert.', price: 35000, categoryId: dessertCat.id, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format' },
  ];

  for (const menu of menus) {
    await prisma.menu.create({
      data: menu,
    });
  }

  console.log('Menus created...');
  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
