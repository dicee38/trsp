const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

router.post('/', controller.createProduct);
router.get('/', controller.getAllProducts);
router.get('/search', controller.searchProducts);
router.get('/filter', controller.filterProducts);
router.get('/low-stock', controller.getLowStock);
router.get('/statistics', controller.getStatistics);
router.get('/export/csv', controller.exportCSV);
router.delete('/', controller.deleteAllProducts);
router.get('/:id', controller.getProductById);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);
router.patch('/:id/stock', controller.updateStock);

module.exports = router;
