const express = require('express');
const router = express.Router();
const controller = require('../controllers/priceController');

router.get('/', controller.getAllPrices);
router.get('/latest', controller.getLatestPrices);
router.delete('/:id', controller.deletePrice);
router.post('/:id/price', controller.addPrice);
router.get('/:id/history', controller.getPriceHistory);

module.exports = router;
