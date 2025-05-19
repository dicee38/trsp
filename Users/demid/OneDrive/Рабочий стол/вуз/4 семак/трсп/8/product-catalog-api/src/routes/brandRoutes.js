const express = require('express');
const router = express.Router();
const controller = require('../controllers/brandController');

router.post('/', controller.createBrand);
router.get('/', controller.getAllBrands);
router.put('/:id', controller.updateBrand);
router.delete('/:id', controller.deleteBrand);

module.exports = router;
