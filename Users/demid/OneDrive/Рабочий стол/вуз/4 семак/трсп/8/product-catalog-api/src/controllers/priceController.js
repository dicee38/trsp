const Price = require('../models/Price');

exports.addPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    const newPrice = await Price.create({ productId: id, price });
    res.status(201).json(newPrice);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка добавления цены' });
  }
};

exports.getPriceHistory = async (req, res) => {
  try {
    const prices = await Price.findAll({ where: { productId: req.params.id } });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения истории цен' });
  }
};

exports.getAllPrices = async (req, res) => {
  try {
    const prices = await Price.findAll();
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения всех цен' });
  }
};

exports.getLatestPrices = async (req, res) => {
  try {
    const prices = await Price.findAll({
      group: ['productId'],
      attributes: ['productId', [require('sequelize').fn('MAX', require('sequelize').col('price')), 'latestPrice']]
    });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения последних цен' });
  }
};

exports.deletePrice = async (req, res) => {
  try {
    const deleted = await Price.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: 'Удалено' }) : res.status(404).json({ error: 'Цена не найдена' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
};
