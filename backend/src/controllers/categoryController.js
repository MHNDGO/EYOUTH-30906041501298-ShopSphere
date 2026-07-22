const prisma = require('../lib/prisma');

async function listCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return res.json(categories);
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });

    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) return res.status(409).json({ message: 'Category already exists' });

    const category = await prisma.category.create({ data: { name } });
    return res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, createCategory };
