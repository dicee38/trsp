const Product = require('../models/Product');
const { Op } = require('sequelize');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка создания', details: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения списка' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    product ? res.json(product) : res.status(404).json({ error: 'Не найден' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const product = await Product.findByPk(req.params.id);
      return res.json(product);
    }
    res.status(404).json({ error: 'Не найден' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: 'Удалено' }) : res.status(404).json({ error: 'Не найден' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } }
        ]
      }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка поиска' });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const where = {};
    if (req.query.brand) where.brand = req.query.brand;
    if (req.query.category) where.category = req.query.category;
    const products = await Product.findAll({ where });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка фильтрации' });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { stock } = req.body;

    if (isNaN(id) || typeof stock !== 'number') {
      return res.status(400).json({ error: 'Неверные входные данные' });
    }

    const [updated] = await Product.update({ stock }, { where: { id } });

    if (updated) {
      const updatedProduct = await Product.findByPk(id);
      return res.json(updatedProduct);
    } else {
      return res.status(404).json({ error: 'Продукт не найден' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления стока' });
  }
};


exports.getLowStock = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const products = await Product.findAll({ where: { stock: { [Op.lt]: limit } } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения' });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const total = await Product.count();
    const avgPrice = await Product.findOne({
      attributes: [[require('sequelize').fn('AVG', require('sequelize').col('price')), 'avgPrice']]
    });
    res.json({ total, avgPrice: parseFloat(avgPrice.dataValues.avgPrice).toFixed(2) });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка статистики' });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const products = await Product.findAll();
    const csv = ['name,price,stock'].concat(products.map(p => `${p.name},${p.price},${p.stock}`)).join('\n');
    res.setHeader('Content-disposition', 'attachment; filename=products.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка экспорта' });
  }
};

exports.deleteAllProducts = async (req, res) => {
  try {
    const count = await Product.destroy({ where: {}, truncate: true });
    res.json({ message: `Удалено ${count} товаров` });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления всех' });
  }
};
