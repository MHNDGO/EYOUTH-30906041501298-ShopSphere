const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', requireAuth, requireRole('ADMIN'), upload.single('image'), createProduct);
router.put('/:id', requireAuth, requireRole('ADMIN'), upload.single('image'), updateProduct);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteProduct);

module.exports = router;
