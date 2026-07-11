const prisma = require('../lib/prisma');
const { calculateCartTotal } = require('../utils/cart');

async function getCart(req, res, next) {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    });
    return res.json({ items, total: calculateCartTotal(items) });
  } catch (err) {
    next(err);
  }
}

async function addToCart(req, res, next) {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    let item;
    if (existing) {
      item = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + parseInt(quantity, 10) },
        include: { product: true },
      });
    } else {
      item = await prisma.cartItem.create({
        data: { userId: req.user.id, productId, quantity: parseInt(quantity, 10) },
        include: { product: true },
      });
    }
    return res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'quantity must be at least 1' });
    }

    const item = await prisma.cartItem.findUnique({ where: { id: req.params.itemId } });
    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const updated = await prisma.cartItem.update({
      where: { id: req.params.itemId },
      data: { quantity: parseInt(quantity, 10) },
      include: { product: true },
    });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function removeFromCart(req, res, next) {
  try {
    const item = await prisma.cartItem.findUnique({ where: { id: req.params.itemId } });
    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await prisma.cartItem.delete({ where: { id: req.params.itemId } });
    return res.json({ message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
