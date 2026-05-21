const express = require('express');
const router = express.Router();
const controller = require('../controllers/stocksController');

router.get('/', controller.getAllStocks);
router.get('/:id', controller.getStockById);
router.post('/', controller.createStock);
router.patch('/:id', controller.updateStock);
router.delete('/:id', controller.deleteStock);

module.exports = router;