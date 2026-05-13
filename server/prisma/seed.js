const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();

  // 1. Create Tables
  const tables = await Promise.all([
    prisma.table.create({ data: { tableNumber: 'MEJA-01' } }),
    prisma.table.create({ data: { tableNumber: 'MEJA-02' } }),
    prisma.table.create({ data: { tableNumber: 'MEJA-03' } }),
    prisma.table.create({ data: { tableNumber: 'MEJA-04' } }),
    prisma.table.create({ data: { tableNumber: 'MEJA-05' } }),
  ]);

  // 2. Create Categories
  const catMakanan = await prisma.category.create({ data: { name: 'Makanan', slug: 'makanan' } });
  const catMinuman = await prisma.category.create({ data: { name: 'Minuman', slug: 'minuman' } });
  const catDessert = await prisma.category.create({ data: { name: 'Dessert', slug: 'dessert' } });
  const catPromo = await prisma.category.create({ data: { name: 'Promo', slug: 'promo' } });

  // 3. Create Menus
  const menus = [
    { name: 'Nasi Goreng Spesial', price: 35000, categoryId: catMakanan.id, image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff06b3?q=80&w=400' },
    { name: 'Mie Ayam Jamur', price: 28000, categoryId: catMakanan.id, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400' },
    { name: 'Ayam Bakar Madu', price: 42000, categoryId: catMakanan.id, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=400' },
    { name: 'Es Teh Manis', price: 5000, categoryId: catMinuman.id, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=400' },
    { name: 'Es Jeruk Peras', price: 12000, categoryId: catMinuman.id, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=400' },
    { name: 'Kopi Susu Gula Aren', price: 18000, categoryId: catMinuman.id, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400' },
    { name: 'Brownies Ice Cream', price: 25000, categoryId: catDessert.id, image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=400' },
    { name: 'Pisang Goreng Keju', price: 15000, categoryId: catDessert.id, image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?q=80&w=400' },
    { name: 'Promo Hemat A', price: 45000, categoryId: catPromo.id, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400' },
    { name: 'Promo Hemat B', price: 55000, categoryId: catPromo.id, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400' },
    { name: 'Sate Ayam 10 Tusuk', price: 30000, categoryId: catMakanan.id, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=400' },
    { name: 'Juice Alpukat', price: 15000, categoryId: catMinuman.id, image: 'https://images.unsplash.com/photo-1590477922224-d930a9578e07?q=80&w=400' },
  ];

  for (const m of menus) {
    await prisma.menu.create({ data: m });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
