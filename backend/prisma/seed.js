require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const customerPassword = await bcrypt.hash('Customer123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@shop.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@shop.com', password: adminPassword, role: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { email: 'customer@shop.com' },
    update: {},
    create: { name: 'Test Customer', email: 'customer@shop.com', password: customerPassword, role: 'CUSTOMER' },
  });

  const categories = ['Electronics', 'Books', 'Clothing', 'Home & Kitchen'];
  const categoryRecords = {};
  for (const name of categories) {
    categoryRecords[name] = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const products = [
    { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with USB receiver.', price: 19.99, stock: 50, category: 'Electronics' },
    { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard.', price: 59.99, stock: 30, category: 'Electronics' },
    { name: 'Noise Cancelling Headphones', description: 'Over-ear headphones with active noise cancellation.', price: 89.99, stock: 20, category: 'Electronics' },
    { name: 'Clean Code', description: 'A handbook of agile software craftsmanship.', price: 34.99, stock: 40, category: 'Books' },
    { name: 'Atomic Habits', description: 'An easy and proven way to build good habits.', price: 24.99, stock: 60, category: 'Books' },
    { name: "Men's Denim Jacket", description: 'Classic fit denim jacket.', price: 45.0, stock: 25, category: 'Clothing' },
    { name: 'Running Shoes', description: 'Lightweight breathable running shoes.', price: 65.0, stock: 35, category: 'Clothing' },
    { name: 'Non-Stick Frying Pan', description: '10-inch non-stick frying pan.', price: 29.99, stock: 45, category: 'Home & Kitchen' },
    { name: 'Coffee Maker', description: '12-cup programmable coffee maker.', price: 49.99, stock: 15, category: 'Home & Kitchen' },
    { name: 'Blender', description: 'High-speed blender for smoothies.', price: 39.99, stock: 22, category: 'Home & Kitchen' },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          imageUrl: null,
          categoryId: categoryRecords[p.category].id,
        },
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
